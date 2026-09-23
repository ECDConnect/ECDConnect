/**
 * Keys for one-off, per-user milestones stored server-side as UserFlag rows.
 *
 * Use these instead of `LocalStorageKeys` for anything that should follow a
 * user across devices and survive a cleared cache — which is every "have they
 * seen this yet" flag.
 */
export enum UserFlagKeys {
  attendanceTutorialComplete = 'attendanceTutorialComplete',
  programmeWalkthroughComplete = 'programmeWalkthroughComplete',
  incomeStatementsWalkthroughComplete = 'incomeStatementsWalkthroughComplete',
  communityWalkthroughComplete = 'communityWalkthroughComplete',
}

/**
 * Prompt shown once per progress-reporting period, after the period closes.
 *
 * The period is part of the key, so each period gets its own flag and there is
 * nothing to reset when the year rolls over.
 */
export const programmePlanningPromptKey = (reportPeriodId: string): string =>
  `programmePlanningPrompt:${reportPeriodId}`;
