#!/usr/bin/env bash
#
# Captures the real GraphQL schema from a running environment into
# src/api/schema.deployed.graphql.
#
# The code-derived snapshot (schema.graphql) cannot include the CMS content types or the
# Setting_* types, because those are built from rows in the database - see Tools/README.md.
# This fetches the complete schema from a deployed API instead, so the persisted-operation
# validator can check the operations that query them.
#
# Only the schema is transferred, never any data, so there is nothing here that needs
# anonymising. Tenancy is resolved from the Host header, and system settings are
# tenant-scoped, so the Setting_* types you capture are the ones for that tenant.
#
#   ./Tools/capture-deployed-schema.sh https://dev-api.example.com
#   ./Tools/capture-deployed-schema.sh http://localhost:5000 my-tenant.localhost:5001
#
set -euo pipefail

BASE_URL="${1:-}"
HOST_HEADER="${2:-}"

if [ -z "$BASE_URL" ]; then
  echo "usage: $0 <base-url> [host-header]" >&2
  echo "  e.g. $0 https://dev-api.example.com" >&2
  exit 2
fi

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$API_DIR/schema.deployed.graphql"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

URL="${BASE_URL%/}/graphql?sdl"
echo "Fetching $URL"

CURL_ARGS=(--silent --show-error --fail --location --max-time 60)
if [ -n "$HOST_HEADER" ]; then
  CURL_ARGS+=(--header "Host: $HOST_HEADER")
fi

if ! curl "${CURL_ARGS[@]}" "$URL" -o "$TMP"; then
  echo "" >&2
  echo "Could not fetch the schema. Things worth checking:" >&2
  echo "  - the environment serves ?sdl - introspection is disabled outside development" >&2
  echo "    (AllowIntrospection(isDevelopment) in ECDLink.GraphQL/Startup.cs), so a" >&2
  echo "    production instance may refuse it" >&2
  echo "  - the URL is the API root, not the UI" >&2
  echo "  - you are on a network that can reach it" >&2
  exit 1
fi

# Reject an HTML error page or a redirect to a login form masquerading as success.
if ! grep -q "^type Query" "$TMP"; then
  echo "" >&2
  echo "What came back does not look like SDL - no 'type Query' in it. First lines:" >&2
  head -5 "$TMP" >&2
  exit 1
fi

{
  echo "# Captured from $BASE_URL${HOST_HEADER:+ (Host: $HOST_HEADER)} on $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "# Do not hand-edit: re-run Tools/capture-deployed-schema.sh instead."
  echo "#"
  echo "# This is the real schema, including the CMS content types and Setting_* types that are"
  echo "# built from database rows. It therefore reflects one environment and one tenant at one"
  echo "# point in time, and goes stale when CMS content changes."
  echo ""
  cat "$TMP"
} > "$OUT"

TYPES=$(grep -cE "^(type|input|enum|interface|union|scalar) " "$OUT" || true)
echo "Wrote $OUT ($(wc -l < "$OUT") lines, $TYPES types)"
echo ""
echo "Now validate the client contract against it:"
echo "  node Tools/validate-persisted-operations.mjs --deployed"
