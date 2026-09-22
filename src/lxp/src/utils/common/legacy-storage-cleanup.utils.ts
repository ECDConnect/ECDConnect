/**
 * Keys that used to be written to localStorage and have since moved to
 * sessionStorage or redux.
 *
 * localStorage is never cleared on logout, so these values are still sitting on
 * every device that ran the old build — including an ID number captured during
 * the principal invite flow. They are listed as literals on purpose: the
 * matching enum members are gone, and this list must keep working after they
 * are forgotten.
 */
const MIGRATED_LOCAL_STORAGE_KEYS = [
  'practitionerInvitedPrincipal',
  'practitionerInvitedPrincipalUserId',
  'firstTimeOnCommunityDashboard',
  'classroomForInvitedUser',
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
