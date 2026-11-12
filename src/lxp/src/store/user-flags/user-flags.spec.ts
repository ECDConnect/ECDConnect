import { UserFlagKeys } from '@ecdlink/core';
import { userFlagsActions, userFlagsReducer } from './user-flags';
import { getUserFlags, syncUserFlags } from './user-flags.actions';
import { UserFlagsState } from './user-flags.types';

const empty: UserFlagsState = { flags: [] };

const set = (state: UserFlagsState, flagKey: string) =>
  userFlagsReducer(state, userFlagsActions.setFlag({ flagKey }));

const fetched = (state: UserFlagsState, flagKeys: string[]) =>
  userFlagsReducer(state, {
    type: getUserFlags.fulfilled.type,
    payload: flagKeys.map((flagKey) => ({ flagKey })),
  });

const pushed = (state: UserFlagsState, flagKeys: string[]) =>
  userFlagsReducer(state, {
    type: syncUserFlags.fulfilled.type,
    payload: flagKeys,
  });

const isSet = (state: UserFlagsState, key: string) =>
  state.flags.some((flag) => flag.flagKey === key);

const pending = (state: UserFlagsState) =>
  state.flags.filter((flag) => flag.synced === false).map((f) => f.flagKey);

describe('user-flags slice', () => {
  test('a flag reads as set before it reaches the server', () => {
    const state = set(empty, UserFlagKeys.attendanceTutorialComplete);

    expect(isSet(state, UserFlagKeys.attendanceTutorialComplete)).toEqual(true);
    expect(pending(state)).toEqual([UserFlagKeys.attendanceTutorialComplete]);
  });

  test('setting the same flag twice does not duplicate it', () => {
    let state = set(empty, UserFlagKeys.attendanceTutorialComplete);
    state = set(state, UserFlagKeys.attendanceTutorialComplete);

    expect(state.flags).toHaveLength(1);
  });

  test('a fetch does not lose a flag set while offline', () => {
    let state = set(empty, UserFlagKeys.programmeWalkthroughComplete);
    state = fetched(state, [UserFlagKeys.attendanceTutorialComplete]);

    expect(isSet(state, UserFlagKeys.attendanceTutorialComplete)).toEqual(true);
    expect(isSet(state, UserFlagKeys.programmeWalkthroughComplete)).toEqual(
      true
    );
    expect(pending(state)).toEqual([UserFlagKeys.programmeWalkthroughComplete]);
  });

  test('a fetch containing the pending flag does not duplicate it', () => {
    let state = set(empty, UserFlagKeys.attendanceTutorialComplete);
    state = fetched(state, [UserFlagKeys.attendanceTutorialComplete]);

    expect(state.flags).toHaveLength(1);
    expect(pending(state)).toEqual([UserFlagKeys.attendanceTutorialComplete]);
  });

  test('flags fetched from the server are not queued for pushing', () => {
    const state = fetched(empty, [UserFlagKeys.attendanceTutorialComplete]);

    expect(pending(state)).toEqual([]);
  });

  test('a confirmed push clears the queue but keeps the flag', () => {
    let state = set(empty, UserFlagKeys.attendanceTutorialComplete);
    state = pushed(state, [UserFlagKeys.attendanceTutorialComplete]);

    expect(pending(state)).toEqual([]);
    expect(isSet(state, UserFlagKeys.attendanceTutorialComplete)).toEqual(true);
  });

  test('a failed push leaves the flag queued for the next sync', () => {
    let state = set(empty, UserFlagKeys.communityWalkthroughComplete);
    state = pushed(state, []);

    expect(pending(state)).toEqual([UserFlagKeys.communityWalkthroughComplete]);
  });

  test('period-scoped keys are independent of each other', () => {
    let state = set(empty, 'programmePlanningPrompt:period-1');
    state = fetched(state, ['programmePlanningPrompt:period-2']);

    expect(isSet(state, 'programmePlanningPrompt:period-1')).toEqual(true);
    expect(isSet(state, 'programmePlanningPrompt:period-2')).toEqual(true);
    expect(isSet(state, 'programmePlanningPrompt:period-3')).toEqual(false);
  });

  test('flags are cleared when the signed-in user changes', () => {
    const state = userFlagsReducer(
      set(empty, UserFlagKeys.attendanceTutorialComplete),
      userFlagsActions.resetUserFlagsState()
    );

    expect(state.flags).toEqual([]);
  });
});
