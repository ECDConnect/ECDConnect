import { EventRecordType } from '@ecdlink/graphql';
import { MotherDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getMothers = (state: RootState): MotherDto[] =>
  state.mothers.mothers || [];

export const getMotherById = (
  state: RootState,
  id: string
): MotherDto | undefined =>
  state.mothers.mothers?.find((mother) => mother?.user?.id === id);

export const getAllMotherEventRecordTypes = (
  state: RootState
): EventRecordType[] => state.mothers.eventRecordTypes || [];

export const getMotherCountForMonth = (state: RootState): number =>
  state.mothers.motherCountForMonth || 0;
// export const getCaregiverById = (id?: string) =>
//   createSelector(
//     (state: RootState) => state.caregivers.caregivers,
//     (caregivers: CaregiverDto[] | undefined) => {
//       if (!caregivers || !id) return;

//       return caregivers.find((caregiver) => caregiver.id === id);
//     }
//   );
