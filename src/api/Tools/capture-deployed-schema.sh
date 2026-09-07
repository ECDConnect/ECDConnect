#!/usr/bin/env bash
#
# Captures the real GraphQL schema from a running API into src/api/schema.deployed.graphql.
#
# The code-derived snapshot (schema.graphql) cannot include the CMS content types or the
# Setting_* types, because those are built from rows in the database - see Tools/README.md.
# This fetches the complete schema from a running instance instead, so the persisted-operation
# validator can check the operations that query them.
#
# Only the schema is transferred, never any data, so there is nothing here that needs
# anonymising.
#
# TENANCY
# Settings are tenant-scoped, so which tenant the request resolves to decides which Setting_*
# types you get. TenancyMiddleware resolves it in this order, first match winning:
#
#   1. the tenantId claim on the JWT   (not used here - these requests are unauthenticated)
#   2. the Referer header
#   3. the Origin header
#   4. the Host header
#
# Whichever it finds is turned into "host:port" (or just "host" on a default port) and looked
# up as a tenant site address. An address with no matching tenant yields an empty tenant and a
# schema with no settings types, which is the usual reason a capture comes back looking thin.
#
# For a local run, http://localhost:5000 will not resolve - no tenant has that site address.
# Use the HTTPS endpoint, or point Origin at the local PWA:
#
#   ./Tools/capture-deployed-schema.sh https://localhost:5001 --insecure
#   ./Tools/capture-deployed-schema.sh http://localhost:5000 --header 'Origin: http://localhost:3000'
#   ./Tools/capture-deployed-schema.sh https://dev-api.example.com
#
# Comparing two captures (before and after an upgrade, say) is only meaningful if both resolve
# the SAME tenant, otherwise a tenant difference shows up in the diff as well.
#
#   --out <path>        where to write (default: src/api/schema.deployed.graphql)
#   --header 'K: V'     extra request header, repeatable
#   --insecure          skip TLS verification, for local development certificates
#
set -euo pipefail

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BASE_URL=""
OUT="$API_DIR/schema.deployed.graphql"
INSECURE=""
HEADERS=()

usage() {
  echo "usage: $0 <base-url> [--out <path>] [--header 'K: V'] [--insecure]" >&2
  echo "  e.g. $0 https://localhost:5001 --insecure" >&2
  echo "       $0 http://localhost:5000 --header 'Origin: http://localhost:3000'" >&2
  echo "       $0 https://dev-api.example.com --out /tmp/schema-v13.graphql" >&2
}

while [ $# -gt 0 ]; do
  case "$1" in
    --out)      OUT="$2"; shift 2 ;;
    --header)   HEADERS+=(--header "$2"); shift 2 ;;
    --insecure) INSECURE="--insecure"; shift ;;
    -h|--help)  usage; exit 0 ;;
    --*)        echo "unknown option: $1" >&2; usage; exit 2 ;;
    *)
      if [ -z "$BASE_URL" ]; then
        BASE_URL="$1"
      else
        # Backwards compatible: a bare second argument is a Host header.
        HEADERS+=(--header "Host: $1")
      fi
      shift
      ;;
  esac
done

if [ -z "$BASE_URL" ]; then
  usage
  exit 2
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

URL="${BASE_URL%/}/graphql?sdl"
echo "Fetching $URL"
[ ${#HEADERS[@]} -gt 0 ] && printf '  with %s\n' "${HEADERS[@]}" | grep -v -- '--header' || true

CURL_ARGS=(--silent --show-error --fail --location --max-time 60)
[ -n "$INSECURE" ] && CURL_ARGS+=("$INSECURE")
[ ${#HEADERS[@]} -gt 0 ] && CURL_ARGS+=("${HEADERS[@]}")

if ! curl "${CURL_ARGS[@]}" "$URL" -o "$TMP"; then
  echo "" >&2
  echo "Could not fetch the schema. Things worth checking:" >&2
  echo "  - a local HTTPS endpoint needs --insecure for the development certificate" >&2
  echo "  - the tenant did not resolve: see the TENANCY notes at the top of this script." >&2
  echo "    http://localhost:5000 has no matching tenant - use https://localhost:5001" >&2
  echo "    --insecure, or --header 'Origin: http://localhost:3000'" >&2
  echo "  - ?sdl is refused where introspection is off, since Startup.cs passes" >&2
  echo "    AllowIntrospection(isDevelopment)" >&2
  echo "  - the URL is the API root, not the UI" >&2
  exit 1
fi

# Reject an HTML error page or a login redirect masquerading as success.
if ! grep -q "^type Query" "$TMP"; then
  echo "" >&2
  echo "What came back does not look like SDL - no 'type Query' in it. First lines:" >&2
  head -5 "$TMP" >&2
  exit 1
fi

SETTINGS=$(grep -cE "^type Setting_" "$TMP" || true)

{
  echo "# Captured from $BASE_URL on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  [ ${#HEADERS[@]} -gt 0 ] && printf '# %s\n' "${HEADERS[@]}" | grep -v '^# --header$' || true
  echo "# Do not hand-edit: re-run Tools/capture-deployed-schema.sh instead."
  echo "#"
  echo "# This is the real schema, including the CMS content types and Setting_* types that are"
  echo "# built from database rows. It therefore reflects one environment and one tenant at one"
  echo "# point in time, and goes stale when CMS content changes."
  echo ""
  cat "$TMP"
} > "$OUT"

TYPES=$(grep -cE "^(type|input|enum|interface|union|scalar) " "$OUT" || true)
echo "Wrote $OUT ($(wc -l < "$OUT") lines, $TYPES types, $SETTINGS Setting_* types)"

if [ "$SETTINGS" -eq 0 ]; then
  echo "" >&2
  echo "WARNING: no Setting_* types, which means the tenant did not resolve. The capture is" >&2
  echo "incomplete - see the TENANCY notes at the top of this script." >&2
  exit 1
fi

echo ""
echo "Now validate the client contract against it:"
if [ "$OUT" = "$API_DIR/schema.deployed.graphql" ]; then
  echo "  node Tools/validate-persisted-operations.mjs --deployed"
else
  echo "  node Tools/validate-persisted-operations.mjs --schema '$OUT' \\"
  echo "    --baseline Tools/persisted-operations-baseline.deployed.txt"
fi
