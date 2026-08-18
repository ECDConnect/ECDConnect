#!/usr/bin/env node
/**
 * Validates every persisted operation against the SDL snapshot.
 *
 * Deliberately out of process and independent of Hot Chocolate: it reads the SDL as text and
 * validates with graphql-js, so it needs no rebuild and behaves identically on every Hot
 * Chocolate major. Regenerate schema.graphql after an upgrade, run this, and it names exactly
 * which of the 222 operations the upgrade broke.
 *
 *   node Tools/validate-persisted-operations.mjs
 *   node Tools/validate-persisted-operations.mjs --schema schema.graphql --ops core-api/PersistedQueries
 *   node Tools/validate-persisted-operations.mjs --no-baseline    # show every failure
 *
 * Some operations already fail against the current schema - see the baseline file for why - so
 * they are listed there and excluded. Only failures outside the baseline are treated as errors.
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

const schemaPath = resolve(apiRoot, arg('--schema', 'schema.graphql'));
const opsDir = resolve(apiRoot, arg('--ops', 'core-api/PersistedQueries'));
const baselinePath = resolve(apiRoot, arg('--baseline', 'Tools/persisted-operations-baseline.txt'));
const useBaseline = !process.argv.includes('--no-baseline');

let schema;
try {
  // assumeValidSDL: the snapshot comes from Hot Chocolate, which has already validated it, and
  // it declares scalars (UUID, Upload) that graphql-js does not know natively.
  schema = buildSchema(readFileSync(schemaPath, 'utf8'), { assumeValidSDL: true });
} catch (err) {
  console.error(`Could not read the schema at ${schemaPath}: ${err.message}`);
  console.error('Generate it with: dotnet run --project Tools/ECDLink.SchemaSnapshot -- --out schema.graphql');
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
