import { RootState, ThunkActionStatuses } from '@/store/types';
import { useSelector } from 'react-redux';

type RootStateKeys = keyof RootState;

export const useThunkFetchCall = (slice: RootStateKeys) => {
  const isFulfilled = useSelector(
    (state: RootState | any) =>
      state[slice]?.status === ThunkActionStatuses.Fulfilled
  );
  const isUnset = useSelector(
    (state: RootState | any) =>
      state[slice]?.status === ThunkActionStatuses.Unset
  );
  const isLoading = useSelector(
    (state: RootState | any) =>
      state[slice]?.status === ThunkActionStatuses.Pending
  );
  const isRejected = useSelector(
    (state: RootState | any) =>
      state[slice]?.status === ThunkActionStatuses.Rejected
  );

  return { isFulfilled, isUnset, isLoading, isRejected };
};
