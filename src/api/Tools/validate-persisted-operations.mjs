#!/usr/bin/env node
/**
 * Validates every persisted operation against a GraphQL schema.
 *
 * Deliberately out of process and independent of Hot Chocolate: it reads the SDL as text and
 * validates with graphql-js, so it needs no rebuild and behaves identically on every Hot
 * Chocolate major.
 *
 * There are two schemas to validate against, because the schema is not a pure function of the
 * code - ContentTypeModule and SettingsModule build types from CMS content and system settings
 * held in the database:
 *
 *   node Tools/validate-persisted-operations.mjs
 *       The code-derived snapshot (schema.graphql). Offline, deterministic, safe in CI - but
 *       its CMS and settings types are placeholders, so operations querying them cannot pass.
 *       17 of the baselined entries are that limitation rather than real breakage.
 *
 *   node Tools/validate-persisted-operations.mjs --deployed
 *       The real schema captured from a running environment (schema.deployed.graphql), which
 *       includes the dynamic types. This is the true client contract, so the baseline shrinks
 *       to only the operations that are genuinely broken. Capture it with
 *       Tools/capture-deployed-schema.sh - see Tools/README.md.
 *
 * Other options:
 *   --schema <path>    validate against a specific SDL file
 *   --baseline <path>  use a specific baseline
 *   --ops <dir>        operations directory
 *   --no-baseline      report every failure, ignoring the baseline
 *
 * Exit codes: 0 no new failures, 1 new failures, 2 could not run.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSchema, parse, validate } from 'graphql';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const deployed = process.argv.includes('--deployed');

const schemaPath = resolve(
  apiRoot,
  arg('--schema', deployed ? 'schema.deployed.graphql' : 'schema.graphql'),
);
const opsDir = resolve(apiRoot, arg('--ops', 'core-api/PersistedQueries'));
const baselinePath = resolve(
  apiRoot,
  arg(
    '--baseline',
    deployed
      ? 'Tools/persisted-operations-baseline.deployed.txt'
      : 'Tools/persisted-operations-baseline.txt',
  ),
);
const useBaseline = !process.argv.includes('--no-baseline');

let schema;
try {
  // assumeValidSDL: the SDL comes from Hot Chocolate, which has already validated it, and it
  // declares scalars (UUID, Upload) that graphql-js does not know natively.
  schema = buildSchema(readFileSync(schemaPath, 'utf8'), { assumeValidSDL: true });
} catch (err) {
  console.error(`Could not read the schema at ${schemaPath}: ${err.message}`);
  if (deployed) {
    console.error('');
    console.error('The deployed schema is captured from a running environment, not generated:');
    console.error('  ./Tools/capture-deployed-schema.sh <base-url> [host-header]');
    console.error('');
    console.error('Without it, validate against the code-derived snapshot instead by dropping');
    console.error('--deployed - but note that excludes the dynamic CMS and settings types.');
  } else {
    console.error('Generate it with:');
    console.error('  dotnet run --project Tools/ECDLink.SchemaSnapshot -- --out schema.graphql');
  }
  process.exit(2);
}

let files;
try {
  files = readdirSync(opsDir).filter((f) => f.endsWith('.graphql')).sort();
} catch (err) {
  console.error(`Could not read operations from ${opsDir}: ${err.message}`);
  process.exit(2);
}

if (files.length === 0) {
  console.error(`No .graphql operations found in ${opsDir}.`);
  process.exit(2);
}

const baseline = new Set();
if (useBaseline && existsSync(baselinePath)) {
  for (const line of readFileSync(baselinePath, 'utf8').split('\n')) {
    const entry = line.split('#')[0].trim();
    if (entry) baseline.add(entry);
  }
}

const failures = new Map();

for (const file of files) {
  const source = readFileSync(join(opsDir, file), 'utf8');
  let document;

  try {
    document = parse(source);
  } catch (err) {
    failures.set(file, [`syntax error: ${err.message}`]);
    continue;
  }

  const errors = validate(schema, document);
  if (errors.length > 0) failures.set(file, errors.map((e) => e.message));
}

const unexpected = [...failures.keys()].filter((f) => !baseline.has(f));
const knownStillFailing = [...failures.keys()].filter((f) => baseline.has(f));
const nowPassing = [...baseline].filter((f) => !failures.has(f) && files.includes(f));

console.log(`${files.length - failures.size}/${files.length} persisted operations valid against ${schemaPath}`);
if (useBaseline && baseline.size > 0) {
  console.log(`${knownStillFailing.length} known failure(s) from the baseline, ${unexpected.length} new.`);
}

if (unexpected.length > 0) {
  console.log('');
  console.log('New failures:');
  for (const file of unexpected) {
    console.log(`  ${file}`);
    const errors = failures.get(file);
    for (const message of errors.slice(0, 5)) console.log(`      ${message}`);
    if (errors.length > 5) console.log(`      ... and ${errors.length - 5} more`);
  }
}

if (nowPassing.length > 0) {
  console.log('');
  console.log('These are in the baseline but now pass - remove them from it:');
  for (const file of nowPassing) console.log(`  ${file}`);
}

if (unexpected.length > 0) {
  console.log('');
  console.log(`${unexpected.length} operation(s) newly failing validation.`);
  process.exit(1);
}

process.exit(0);
