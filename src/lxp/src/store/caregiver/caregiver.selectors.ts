import { CaregiverDto } from '@ecdlink/core';
import getWeek from 'date-fns/getWeek';
import { createSelector } from 'reselect';
import { Weekdays } from '@utils/practitioner/playgroups-utils';
import { RootState } from '../types';
import { CaregiverContactHistory, CaregiverContactReason } from './caregiver.types';

export const getCaregivers = (state: RootState): CaregiverDto[] | undefined =>
  state.caregivers.caregivers?.filter((caregiver: CaregiverDto) => caregiver.isActive);

export const getCaregiverById = (id?: string) =>
  createSelector(
    (state: RootState) => state.caregivers.caregivers,
    (caregivers: CaregiverDto[] | undefined) => {
      if (!caregivers || !id) return;

      return caregivers.find((caregiver) => caregiver.id === id);
    }
  );

export const findCaregiverContactHistoryLog = (
  caregiverId?: string,
  childId?: string,
  contactReason?: CaregiverContactReason,
  weekOfYear?: number
) =>
  createSelector(
    (state: RootState) => state.caregivers.contactHistory,
    (contactHistory: CaregiverContactHistory[] | undefined) => {
      if (!contactHistory || !caregiverId || !childId || !contactHistory || !weekOfYear) return;

      const contactHistoryLog = contactHistory.find(
        (log) =>
          log.caregiverId === caregiverId &&
          log.childId === childId &&
          log.contactReason === contactReason &&
          getWeek(new Date(log.dateContacted), {
            weekStartsOn: Weekdays.mon,
          }) === weekOfYear
      );

      return contactHistoryLog;
    }
  );
