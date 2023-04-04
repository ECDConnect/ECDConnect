import { InfantDto, VisitDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getInfants = (state: RootState): InfantDto[] =>
  state.infants.infants || [];

export const getInfantById = (
  state: RootState,
  id: string
): InfantDto | undefined =>
  state.infants.infants?.find((infant) => infant?.user?.id === id);

export const getInfantsWeeklyVisitsSelector = (state: RootState): InfantDto[] =>
  state.infants.infantsWeeklyVisits || [];

export const getInfantCountForMonth = (state: RootState): number =>
  state.infants.infantCountForMonth || 0;

export const getInfantVisitsSelector = (state: RootState): VisitDto[] =>
  state.infants.visits || [];

export const getInfantVisitByVisitIdSelector = (
  state: RootState,
  visitId: string
): VisitDto | undefined =>
  state.infants.visits?.find((item) => item.id === visitId);

export const getInfantCurrentVisitSelector = (
  state: RootState
): VisitDto | undefined => {
  const visits = state.infants.visits || [];
  const noAttended =
    visits?.filter(
      (item) => !item.attended && new Date(item.plannedVisitDate) >= new Date()
    ) || [];

  return noAttended.length
    ? noAttended.reduce((prev, curr) =>
        (prev.visitType?.order || 0) < (curr.visitType?.order || 0)
          ? prev
          : curr
      )
    : undefined;
};
// export const getCaregiverById = (id?: string) =>
//   createSelector(
//     (state: RootState) => state.caregivers.caregivers,
//     (caregivers: CaregiverDto[] | undefined) => {
//       if (!caregivers || !id) return;

//       return caregivers.find((caregiver) => caregiver.id === id);
//     }
//   );
