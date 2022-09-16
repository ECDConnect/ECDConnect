import { MotherDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getMothers = (state: RootState): MotherDto[] =>
  state.mothers.mothers || [];

// export const getCaregiverById = (id?: string) =>
//   createSelector(
//     (state: RootState) => state.caregivers.caregivers,
//     (caregivers: CaregiverDto[] | undefined) => {
//       if (!caregivers || !id) return;

//       return caregivers.find((caregiver) => caregiver.id === id);
//     }
//   );
