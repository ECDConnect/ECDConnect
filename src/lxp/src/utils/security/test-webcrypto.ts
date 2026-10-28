// jsdom's crypto can generate random bytes but cannot run PBKDF2.
// @ts-ignore Node's Web Crypto is only used by the PIN tests.
import { webcrypto } from 'node:crypto';

const current = globalThis.crypto as Crypto | undefined;
if (!current?.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}
