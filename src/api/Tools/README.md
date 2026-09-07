# API schema tooling

Two tools that make GraphQL schema drift visible. They exist for the Hot Chocolate 12 → 16
upgrade, where the risk is not compile errors but silent changes to the public schema.

## Why

Hot Chocolate 13 changed how runs of consecutive capitals are camel-cased. `IPAddress` produced
`iPAddress` under v12 and produces `ipAddress` from v13 onwards. That is a fix in general and a
breaking API change here: **31 fields in this schema are spelled the v12 way**, among them
`cTAText`, `pQARatings`, `prePQASiteVisits`, `pointsYTD`, `statementsIncomeExpensesPDFData` and
`createPQARating`. Renaming them would break the 223 persisted operations, the admin portal's
ad-hoc queries, and the generated types in `@ecdlink/graphql` — all of which would have to ship
in lockstep with the API.

`LegacyNamingConventions` (in `ECDLink.GraphQL/Registration`) pins the v12 spelling so the
upgrade does not touch the public schema. These tools are how we know it works.

Only 12 of the 31 affected fields appear in any persisted operation, which is why the convention
is applied globally rather than with per-property `[GraphQLName]` attributes.

## ECDLink.SchemaSnapshot

Prints the schema as SDL, **without needing a database**, and compares it against the committed
`../schema.graphql`.

```bash
# check the schema still matches the snapshot (exit 1 if not)
dotnet run --project Tools/ECDLink.SchemaSnapshot -- --check schema.graphql

# accept an intended change
dotnet run --project Tools/ECDLink.SchemaSnapshot -- --out schema.graphql
```

`schema.graphql` was captured on Hot Chocolate 12 *before* `LegacyNamingConventions` existed, so
`--check` passing with the convention in place is the proof that it is faithful. It should keep
passing across every Hot Chocolate major. **If it fails during an upgrade, read the diff before
regenerating** — that diff is the upgrade silently changing your API.

### Refreshing the snapshot

The schema changes for ordinary reasons — someone adds a field — and the snapshot has to be
regenerated when it does. **How you regenerate depends on which Hot Chocolate version you are
on, and getting it wrong quietly destroys the guarantee.**

**While still on v12**, regenerate with the convention switched off, then verify with it back on:

```bash
# 1. comment out .AddConvention<INamingConventions, LegacyNamingConventions>() in
#    ECDLink.GraphQL/Startup.cs
# 2. capture the baseline from Hot Chocolate's own naming
dotnet run --project Tools/ECDLink.SchemaSnapshot -- --out schema.graphql
# 3. restore the line
# 4. this must pass - it is the proof the convention is still a no-op
dotnet run --project Tools/ECDLink.SchemaSnapshot -- --check schema.graphql
```

The snapshot is only evidence because it was captured independently of the convention. Regenerate
it with the convention active and it becomes a recording of whatever the convention happens to
do, which would still pass `--check` while proving nothing.

**On v13 and later, never regenerate to make `--check` pass.** At that point the snapshot is the
API contract and the whole point of having it. A failure means one of two things:

- the upgrade changed the schema — fix the code, or extend `LegacyNamingConventions`
- someone made a deliberate breaking API change — regenerate, and ship the clients alongside it,
  remembering that already-deployed app versions keep sending the old operations

`saveHealthCertificateDetails` is the worked example: it was removed and replaced by
`saveCertificateDetails`, and the persisted operation now aliases the old name onto the new field
so deployed clients keep working. That alias only covers persisted operations — the admin portal
sends ad-hoc queries and gets no such protection.
### What the snapshot does not cover

The schema is not a pure function of the code: `ContentTypeModule` and `SettingsModule` add types
built from CMS content and system settings held in the database, and settings are tenant-scoped,
so the live schema differs per environment and per tenant. To stay reproducible without a
database, both are stubbed with placeholders (see `StaticSchemaStubs.cs`). The ~600 code-derived
types are faithful; the handful of dynamic ones are stand-ins. Naming conventions never applied
to those anyway — dynamic field names come from CMS data, not CLR members.

## capture-deployed-schema.sh

There are two schemas, and the difference matters.

`schema.graphql` is generated from the code and has placeholder CMS and settings types, because
the real ones are built from database rows. That makes it reproducible offline and safe in CI,
but it is not the full client contract — 18 persisted operations query dynamic types it does not
have, so they can never pass against it.

`schema.deployed.graphql` is the real thing, fetched from a running API:

```bash
# a deployed environment
./Tools/capture-deployed-schema.sh https://ecd-connect-develop-api.azurewebsites.net

# running locally - the HTTPS endpoint needs --insecure for the dev certificate
./Tools/capture-deployed-schema.sh https://localhost:5001 --insecure

# or over plain HTTP, pointing Origin at the local PWA to resolve the tenant
./Tools/capture-deployed-schema.sh http://localhost:5000 --header 'Origin: http://localhost:3000'
```

Options: `--out <path>` to write elsewhere, `--header 'K: V'` (repeatable), `--insecure`.

Only the schema crosses the wire, never any data, so there is nothing to anonymise.

### Tenancy decides what you get

Settings are tenant-scoped, so the tenant a request resolves to decides which `Setting_*` types
appear. `TenancyMiddleware` resolves it in this order, first match winning:

1. the `tenantId` claim on the JWT — not used here, these requests are unauthenticated
2. the `Referer` header
3. the `Origin` header
4. the `Host` header

Whatever it finds becomes `host:port` (or just `host` on a default port) and is looked up as a
tenant site address. **An address with no matching tenant yields an empty tenant and a schema
with no settings types at all** — which is the usual reason a capture comes back looking thin.
The script fails rather than writing one, so this cannot pass unnoticed.

This is why `http://localhost:5000` alone does not work: no tenant has that site address.
`https://localhost:5001` matches the host tenant, and `Origin: http://localhost:3000` matches
the local PWA's.

Two captures are only comparable if both resolved the **same tenant** — otherwise a tenant
difference lands in the diff alongside whatever you were actually looking for.

`?sdl` also needs introspection, which `Startup.cs` enables only in development via
`AllowIntrospection(isDevelopment)`, so a deployed instance may refuse it. A local run always
works, since `launchSettings.json` sets `ASPNETCORE_ENVIRONMENT=Development`.

Commit the result so CI and everyone else share one contract, and re-capture when CMS content
changes — it goes stale.

### Comparing before and after an upgrade

Local runs use the shared `ECDConnectDev` database, so a local capture has the real dynamic
types. Nothing is written on startup — no migration, no seeding — so this is read-only against
that shared database.

```bash
# before: on develop
./Tools/capture-deployed-schema.sh https://localhost:5001 --insecure --out ~/schema-before.graphql

# after: on the upgrade branch, same URL so the same tenant resolves
./Tools/capture-deployed-schema.sh https://localhost:5001 --insecure --out ~/schema-after.graphql

diff ~/schema-before.graphql ~/schema-after.graphql
```

`--out` keeps both out of the working tree, so neither clobbers the committed capture.

## validate-persisted-operations.mjs

Validates all 223 persisted operations against a schema. Out of process and Hot Chocolate
agnostic, so it works unchanged on every version.

```bash
# against the code-derived snapshot: offline, deterministic, CI-safe
node Tools/validate-persisted-operations.mjs

# against the real captured schema: the true client contract
node Tools/validate-persisted-operations.mjs --deployed

node Tools/validate-persisted-operations.mjs --no-baseline   # include known failures

# against a capture kept outside the working tree
node Tools/validate-persisted-operations.mjs --schema ~/schema-after.graphql \
  --baseline Tools/persisted-operations-baseline.deployed.txt
```

Each mode has its own baseline, and the difference between them is the point:

| mode | baseline | entries |
| --- | --- | --- |
| default | `persisted-operations-baseline.txt` | 35 |
| `--deployed` | `persisted-operations-baseline.deployed.txt` | 17 |

The 18-entry gap is exactly the operations that query dynamic CMS and settings types. They are
excluded from the offline run as a limitation of how that snapshot is taken, not because anything
is wrong with them — so **`--deployed` is the run that actually gates the client contract.**

The 17 in both lists are genuinely broken: 2 will not parse at all, 15 reference fields the
schema does not have. Those cannot be served today. Unrelated to the upgrade, and each is either
dead and should be deleted, or a bug and should be fixed.

## Upgrade workflow

At each Hot Chocolate major:

1. `dotnet run --project Tools/ECDLink.SchemaSnapshot -- --check schema.graphql`
2. `node Tools/validate-persisted-operations.mjs`

Both clean means the upgrade left the code-derived schema alone. Either failing tells you what
moved, and which client operations it takes with it.

Then check the part the offline snapshot cannot reach. This needs a running API, but not a
deployment — running locally against the shared `ECDConnectDev` database works and is quicker:

3. `./Tools/capture-deployed-schema.sh https://localhost:5001 --insecure`
4. `node Tools/validate-persisted-operations.mjs --deployed`

Steps 1 and 2 run anywhere and are the fast gate. Steps 3 and 4 need the API up, and are what
actually confirm the client contract survived, dynamic CMS and settings types included. Capture
before and after the upgrade against the same URL and diff the two — see above.
