import { RootState, Status, ThunkActionStatuses } from '@/store/types';
import { usePrevious } from '@ecdlink/core';
import { useSelector } from 'react-redux';

type RootStateKeys = keyof RootState;

export const useThunkFetchCall = (slice: RootStateKeys, actionName: string) => {
  const status: Status | undefined = useSelector((state: RootState | any) =>
    state[slice]?.status?.find(
      (currentStatus: Status) => currentStatus.actionName === actionName
    )
  );

  const error = useSelector((state: RootState | any) => state[slice]?.error);

  const isFulfilled = status?.value === ThunkActionStatuses.Fulfilled;
  const isUnset = status?.value === ThunkActionStatuses.Unset || !status?.value;
  const isLoading = status?.value === ThunkActionStatuses.Pending;
  const isRejected = status?.value === ThunkActionStatuses.Rejected;

  const wasLoading = usePrevious(isLoading);

  return { isFulfilled, isUnset, isLoading, wasLoading, isRejected, error };
};
