const STORAGE_KEY = 'ecdlink.pinLock.v1';
const LAST_ACTIVE_KEY = 'ecdlink.pinLock.lastActive';

export const PIN_MIN_LENGTH = 4;
export const PIN_MAX_LENGTH = 6;
export const PIN_ITERATIONS = 100_000;
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
export const PIN_ATTEMPT_LIMIT = 5;

type PinRecord = {
  salt: string;
  hash: string;
  iterations: number;
  length: number;
};

type PinStore = Record<string, PinRecord>;

export function isPinShape(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_MIN_LENGTH},${PIN_MAX_LENGTH}}$`).test(pin);
}

function readStore(): PinStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PinStore;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStore(store: PinStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

async function derivePin(
  pin: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

export function hasPin(userId: string): boolean {
  const record = readStore()[userId];
  return Boolean(record?.hash && record?.salt && record?.length);
}

export function getPinLength(userId: string): number | null {
  const record = readStore()[userId];
  return record?.length ?? null;
}

export async function savePin(
  userId: string,
  pin: string,
  options?: { iterations?: number }
): Promise<void> {
  if (!userId) throw new Error('A user is required to save a PIN');
  if (!isPinShape(pin)) {
    throw new Error(
      `PIN must be ${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits`
    );
  }
  if (!crypto.subtle) {
    throw new Error('This browser cannot store a PIN');
  }

  const iterations = options?.iterations ?? PIN_ITERATIONS;
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await derivePin(pin, salt, iterations);
  const store = readStore();
  store[userId] = {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    iterations,
    length: pin.length,
  };
  writeStore(store);
  touchActivity();
}

export async function verifyPin(userId: string, pin: string): Promise<boolean> {
  const record = readStore()[userId];
  if (!record || !isPinShape(pin) || pin.length !== record.length) {
    return false;
  }

  try {
    const actual = await derivePin(
      pin,
      base64ToBytes(record.salt),
      record.iterations
    );
    return timingSafeEqual(actual, base64ToBytes(record.hash));
  } catch {
    return false;
  }
}

export function clearPin(userId: string): void {
  const store = readStore();
  if (!store[userId]) return;
  delete store[userId];
  writeStore(store);
}

export function touchActivity(now = Date.now()): void {
  localStorage.setItem(LAST_ACTIVE_KEY, String(now));
}

export function getLastActive(): number | null {
  const raw = localStorage.getItem(LAST_ACTIVE_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isInactive(
  timeoutMs = INACTIVITY_TIMEOUT_MS,
  now = Date.now()
): boolean {
  const lastActive = getLastActive();
  if (lastActive == null) return true;
  return now - lastActive >= timeoutMs;
}
