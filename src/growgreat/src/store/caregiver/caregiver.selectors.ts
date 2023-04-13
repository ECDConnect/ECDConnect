import { CaregiverDto } from '@ecdlink/core';
import { createSelector } from 'reselect';
import { RootState } from '../types';

export const getCaregivers = (state: RootState): CaregiverDto[] | undefined =>
  state.caregivers.caregivers?.filter(
    (caregiver: CaregiverDto) => caregiver.isActive
  );

export const getCaregiverById = (id?: string) =>
  createSelector(
    (state: RootState) => state.caregivers.caregivers,
    (caregivers: CaregiverDto[] | undefined) => {
      if (!caregivers || !id) return;

      return caregivers.find((caregiver) => caregiver.id === id);
    }
  );

export const getCaregiverClientsByIdSelector = (
  state: RootState,
  caregiverId: string
) =>
  state.caregivers.caregiverClientsList?.find(
    (item) => item.caregiverId === caregiverId
  );
