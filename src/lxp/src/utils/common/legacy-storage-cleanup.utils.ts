/**
 * Keys that used to be written to localStorage and have since moved to
 * sessionStorage, redux, or server-side UserFlag rows.
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
  // Walkthrough milestones, now UserFlag rows. Deliberately dropped rather
  // than carried over: a device's flags belong to whoever used it last, so
  // adopting them would let one practitioner's completions suppress another's
  // tutorials. Everyone is offered each walkthrough once more, and from then
  // on it is recorded against their own account.
  'AttendanceTutorialComplete',
  'programmeWalkthroughComplete',
  'incomeStatementsWalkthroughComplete',
  'hasClickedOnCommunityWalkThrough',
  'hasClikedOnProgrammePlanningAfterEndOfProgressReportPeriod1',
  'hasClikedOnProgrammePlanningAfterEndOfProgressReportPeriod2',
  'hasClikedOnProgrammePlanningAfterEndOfProgressReportPeriod3',
  'hasClikedOnProgrammePlanningAfterEndOfProgressReportPeriod4',
  'hasClikedOnProgrammePlanningAfterEndOfProgressReportYear',
  // A base64 copy of a bundled placeholder image, re-encoded through a canvas
  // on every dashboard visit. The asset ships in the bundle and is precached,
  // so this only ever consumed quota.
  'offlineStatments',
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
