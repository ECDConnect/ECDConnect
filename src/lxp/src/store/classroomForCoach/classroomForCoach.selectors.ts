import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { CompleteReportPeriods } from '@/models/progress/completed-report-periods';
import { isBefore } from 'date-fns';

export const getClassroomForCoach = (
  state: RootState
): ClassroomDto[] | undefined => state.classroomForCoachData.classroomForCoach;

export const getClassroomGroups = (
  state: RootState
): ClassroomGroupDto[] | undefined =>
  state.classroomForCoachData.classroomGroupData.classroomGroups;

export const getClassroomGroupById = (id?: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomForCoachData.classroomGroupData.classroomGroups,
    (classroomGroups: ClassroomGroupDto[] | undefined) => {
      if (!classroomGroups || !id) return;

      return classroomGroups.find((group) => group.id === id);
    }
  );

export const getClassroomForPractitioner = (userId: string) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !userId) return;

      return classrooms.find((classroom) => classroom.userId === userId);
    }
  );

export const getClassroomGroupsForClassroom = (classroomId: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomForCoachData.classroomGroupData.classroomGroups,
    (classroomGroups) => {
      return (
        classroomGroups?.filter(
          (classroomGroup) => classroomGroup.classroomId === classroomId
        ) || []
      );
    }
  );

export const getClassroomGroupsForPractitioner = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomForCoachData.classroomGroupData.classroomGroups,
    (classroomGroups) => {
      return (
        classroomGroups?.filter(
          (classroomGroup) => classroomGroup.userId === userId
        ) || []
      );
    }
  );

export const getNextProgressReportPeriod = (classroomId: string | undefined) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !classroomId) return;

      const classroom = classrooms.find(
        (classroom) => classroom.id === classroomId
      );
      const currentYear = new Date().getFullYear();

      if (!classroom) return;

      const currentYearsReportingPeriods =
        classroom?.childProgressReportPeriods
          ?.filter((x) => new Date(x.startDate).getFullYear() === currentYear)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ) || [];

      // Get first in order where start date is after the current date
      const index = currentYearsReportingPeriods.findIndex((x) =>
        isBefore(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
          new Date(x.startDate)
        )
      );

      if (index < 0) {
        return undefined;
      }

      const startDate = new Date(currentYearsReportingPeriods[index].startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentYearsReportingPeriods[index].endDate);
      endDate.setHours(23, 59, 59, 0);

      return {
        reportNumber: index + 1,
        id: currentYearsReportingPeriods[index].id,
        startDate: startDate,
        endDate: endDate,
      } as ProgressReportPeriod;
    }
  );

export const getIsReportingPeriodsSet = (classroomId: string | undefined) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !classroomId) return;

      const classroom = classrooms.find(
        (classroom) => classroom.id === classroomId
      );
      const currentYear = new Date().getFullYear();
      return (
        !!classroom?.childProgressReportPeriods &&
        !!classroom?.childProgressReportPeriods.some(
          (x) => new Date(x.startDate).getFullYear() === currentYear
        )
      );
    }
  );

export const getAllProgressReportPeriods = (classroomId: string | undefined) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !classroomId) return;

      const classroom = classrooms.find(
        (classroom) => classroom.id === classroomId
      );
      const allReportingPeriods = classroom?.childProgressReportPeriods || [];

      const years = allReportingPeriods
        .map((x) => new Date(x.startDate).getFullYear())
        .filter((value, index, array) => array.indexOf(value) === index);

      let sortedReportingPeriods: ProgressReportPeriod[] = [];

      years.forEach((year) => {
        const reportingPeriodsForYear = allReportingPeriods
          .filter((x) => new Date(x.startDate).getFullYear() === year)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        reportingPeriodsForYear?.forEach((value, index) => {
          const startDate = new Date(value.startDate);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(value.endDate);
          endDate.setHours(23, 59, 59, 0);

          sortedReportingPeriods.push({
            id: value.id,
            startDate: startDate,
            endDate: endDate,
            reportNumber: index + 1,
          });
        });
      });

      return sortedReportingPeriods;
    }
  );

export const getCurrentProgressReportPeriod = (
  classroomId: string | undefined
) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !classroomId) return;

      const classroom = classrooms.find(
        (classroom) => classroom.id === classroomId
      );
      const currentYear = new Date().getFullYear();

      const currentYearsReportingPeriods =
        classroom?.childProgressReportPeriods
          ?.filter((x) => new Date(x.startDate).getFullYear() === currentYear)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ) || [];

      // Get first in order where end date is after the current date
      const index = currentYearsReportingPeriods.findIndex((x) =>
        isBefore(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
          new Date(x.endDate)
        )
      );

      if (index < 0) {
        return undefined;
      }

      const startDate = new Date(currentYearsReportingPeriods[index].startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentYearsReportingPeriods[index].endDate);
      endDate.setHours(23, 59, 59, 0);

      return {
        reportNumber: index + 1,
        id: currentYearsReportingPeriods[index].id,
        startDate: startDate,
        endDate: endDate,
      } as ProgressReportPeriod;
    }
  );

export const getExpiredProgressReportPeriod = (
  classroomId: string | undefined
) =>
  createSelector(
    (state: RootState) => state.classroomForCoachData.classroomForCoach,
    (classrooms) => {
      if (!classrooms || !classroomId) return;

      const classroom = classrooms.find(
        (classroom) => classroom.id === classroomId
      );
      const currentYear = new Date().getFullYear();

      // descended periods
      const currentYearsReportingPeriodsDesc =
        classroom?.childProgressReportPeriods
          ?.filter((x) => new Date(x.startDate).getFullYear() === currentYear)
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          ) || [];

      if (currentYearsReportingPeriodsDesc.length === 0) {
        return undefined;
      }

      // select first expired period
      const expiredPeriod = currentYearsReportingPeriodsDesc.find(
        (report) =>
          new Date(report.endDate) <
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          )
      );

      if (!expiredPeriod) {
        return undefined;
      }

      // ascending periods
      const currentYearsReportingPeriodsAsc =
        classroom?.childProgressReportPeriods
          ?.filter((x) => new Date(x.startDate).getFullYear() === currentYear)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ) || [];

      const index = currentYearsReportingPeriodsAsc.findIndex(
        (report) => report.id === expiredPeriod.id
      );

      const startDate = new Date(expiredPeriod?.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(expiredPeriod?.endDate);
      endDate.setHours(23, 59, 59, 0);

      return {
        reportNumber: index + 1,
        id: expiredPeriod?.id,
        endDate: endDate,
        startDate: startDate,
      } as unknown as CompleteReportPeriods;
    }
  );
