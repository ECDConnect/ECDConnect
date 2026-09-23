import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getFlags = (state: RootState) => state.userFlags.flags;

/** Whether a one-off milestone has been recorded for the signed-in user. */
export const getIsFlagSet = (key: string) =>
  createSelector(getFlags, (flags) =>
    flags.some((flag) => flag.flagKey === key)
  );

export const getFlagValue = (key: string) =>
  createSelector(
    getFlags,
    (flags) => flags.find((flag) => flag.flagKey === key)?.flagValue
  );
