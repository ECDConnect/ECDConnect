import { InfantDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getInfants = (state: RootState): InfantDto[] =>
  state.infants.infants || [];

export const getInfantCountForMonth = (state: RootState): number =>
  state.infants.infantCountForMonth || 0;
// export const getCaregiverById = (id?: string) =>
//   createSelector(
//     (state: RootState) => state.caregivers.caregivers,
//     (caregivers: CaregiverDto[] | undefined) => {
//       if (!caregivers || !id) return;

//       return caregivers.find((caregiver) => caregiver.id === id);
//     }
//   );
