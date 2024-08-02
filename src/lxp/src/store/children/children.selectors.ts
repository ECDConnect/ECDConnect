import { ChildDto, ProgressTrackingAgeGroupDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import getWeek from 'date-fns/getWeek';
import { Weekdays } from '@utils/practitioner/playgroups-utils';
import {
  CaregiverContactHistory,
  CaregiverContactReason,
} from './children.types';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { differenceInMonths } from 'date-fns';
import { getCurrentProgressReportPeriod } from '../classroom/classroom.selectors';

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

export const getProgressAgeGroupForChild = (childId: string) =>
  createSelector(
    getCurrentProgressReportPeriod(),
    (state: RootState) => state.children.childData.children,
    (state: RootState) => state.classroomData.classroom,
    (state: RootState) => state.progressTracking.progressTrackingAgeGroups.data,
    (
      currentProgressReportingPeriod,
      children: ChildDto[],
      classroom: ClassroomDto | undefined,
      ageGroups: ProgressTrackingAgeGroupDto[]
    ) => {
      const child = children.find((child) => child.id === childId);

      if (
        !currentProgressReportingPeriod ||
        !classroom ||
        !child ||
        !child.user?.dateOfBirth
      ) {
        return;
      }

      const ageInMonths = differenceInMonths(
        new Date(currentProgressReportingPeriod.endDate),
        new Date(child.user.dateOfBirth)
      );

      // Now get age group that matches
      const ageGroup = ageGroups.find(
        (x) =>
          x.startAgeInMonths <= ageInMonths && x.endAgeInMonths >= ageInMonths
      );

      return ageGroup;
    }
  );
