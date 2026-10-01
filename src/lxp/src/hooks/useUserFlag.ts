import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import {
  userFlagsActions,
  userFlagsSelectors,
  userFlagsThunkActions,
} from '@store/user-flags';

/**
 * Reads and sets a one-off, per-user milestone — "has this practitioner
 * finished the attendance tutorial", and the like.
 *
 * Replaces the localStorage flags these used to be: the value lives on the
 * server, so it follows the user to a new phone and survives a cleared cache,
 * and it is not shared with whoever else uses the device.
 *
 * Setting a flag applies locally first, so the walkthrough it guards closes
 * immediately, then pushes. If the push fails — offline, usually — the offline
 * sync queue retries it on the next sync.
 */
export const useUserFlag = (
  key: string
): [boolean, (value?: string | null) => void] => {
  const appDispatch = useAppDispatch();
  const isSetSelector = useMemo(
    () => userFlagsSelectors.getIsFlagSet(key),
    [key]
  );
  const isSet = useSelector(isSetSelector);

  const setFlag = useCallback(
    (value?: string | null) => {
      appDispatch(
        userFlagsActions.setFlag({ flagKey: key, flagValue: value ?? null })
      );
      appDispatch(userFlagsThunkActions.syncUserFlags());
    },
    [appDispatch, key]
  );

  return [isSet, setFlag];
};
