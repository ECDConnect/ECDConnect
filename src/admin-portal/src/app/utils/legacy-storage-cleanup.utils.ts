/**
 * Keys that used to be written to localStorage and have since moved to
 * sessionStorage. localStorage is not cleared on logout, so a shared admin
 * machine keeps the last operator's selections — and their email address —
 * until the browser cache is cleared by hand.
 *
 * Listed as literals on purpose: the values must keep working after the old
 * key names are forgotten.
 */
const MIGRATED_LOCAL_STORAGE_KEYS = [
  'selectedUser',
  'selectedMessage',
  'email',
];

/** Deletes storage left behind by earlier builds. Safe to run on every start. */
export const clearMigratedLocalStorageKeys = (): void => {
  MIGRATED_LOCAL_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Storage unavailable; nothing to clean up.
    }
  });
};
