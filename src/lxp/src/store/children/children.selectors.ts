import { ChildDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import getWeek from 'date-fns/getWeek';
import { Weekdays } from '@utils/practitioner/playgroups-utils';
import {
  CaregiverContactHistory,
  CaregiverContactReason,
} from './children.types';

export const getChildren = (state: RootState): ChildDto[] | undefined =>
  state.children.childData.children;

// This might need updates for a coach
export const getChildById = (id?: string) =>
  createSelector(
    (state: RootState) => state.children.childData.children,
    (children: ChildDto[] | undefined) => {
      return (children || []).find((child) => child.id === id);
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
      if (
        !contactHistory ||
        !caregiverId ||
        !childId ||
        !contactHistory ||
        !weekOfYear
      )
        return;

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

export const getChildrenByStatus = (workflowStatusId?: string) =>
  createSelector(
    (state: RootState) => state.children.childData.children,
    (children: ChildDto[] | undefined) => {
      return (children || []).filter(
        (child) => child.workflowStatusId === workflowStatusId
      );
    }
  );
