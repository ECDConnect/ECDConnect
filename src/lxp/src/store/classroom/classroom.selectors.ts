import { ChildDto, PractitionerDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import {
  ChildProgressReportPeriodDto,
  ClassroomDto,
  ClassroomDto as SimpleClassroomDto,
} from '@/models/classroom/classroom.dto';
import {
  ClassroomGroupDto,
  LearnerDto,
  ClassroomGroupDto as SimpleClassroomGroupDto,
} from '@/models/classroom/classroom-group.dto';
import { BasePractitionerDto } from '@/models/classroom/practitioner.dto';
import { isBefore } from 'date-fns';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { CompleteReportPeriods } from '@/models/progress/completed-report-periods';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';

export const getClassroom = (
  state: RootState
): SimpleClassroomDto | undefined => state.classroomData.classroom;

export const getIsReportingPeriodsSet = () =>
  createSelector(
    (state: RootState) => state.classroomData.classroom,
    (classroom: ClassroomDto | undefined): boolean => {
      const currentYear = new Date().getFullYear();
      return (
        !!classroom?.childProgressReportPeriods &&
        !!classroom?.childProgressReportPeriods.some(
          (x) => new Date(x.startDate).getFullYear() === currentYear
        )
      );
    }
  );

export const getPreviousYearsReportingPeriods = () =>
  createSelector(
    (state: RootState) => state.classroomData.classroom,
    (classroom: ClassroomDto | undefined): ChildProgressReportPeriodDto[] => {
      const lastYear = new Date().getFullYear() - 1;
      return (
        classroom?.childProgressReportPeriods
          ?.filter((x) => new Date(x.startDate).getFullYear() === lastYear)
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ) || []
      );
    }
  );

export const getClassroomGroups = (
  state: RootState
): SimpleClassroomGroupDto[] =>
  state.classroomData.classroomGroupData.classroomGroups;

export const getClassroomGroupsForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (classroomGroups) => {
      return (
        classroomGroups?.filter(
          (classroomGroup) => classroomGroup.userId === userId
        ) || []
      );
    }
  );

export const getClassroomGroupsWithPractitioner = () =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (state: RootState) => state.practitioner.practitioner,
    (state: RootState) => state.practitioner.practitioners,
    (
      classroomGroups: ClassroomGroupDto[] | undefined,
      practitioner: PractitionerDto | undefined,
      practitioners: PractitionerDto[] | undefined
    ): (ClassroomGroupDto & {
      practitioner: PractitionerDto | undefined;
    })[] => {
      return (classroomGroups || []).map((cls) => {
        let linkedPractitioner = undefined;

        if (cls.userId === practitioner?.userId) {
          linkedPractitioner = practitioner;
        }

        if (!linkedPractitioner && practitioners) {
          linkedPractitioner = practitioners.find(
            (practitioner) => practitioner.userId === cls.userId
          );
        }

        return {
          ...cls,
          practitioner: linkedPractitioner,
        };
      });
    }
  );

export const getClassroomGroupByChildUserId = (childUserId: string) =>
  createSelector(
    getClassroomGroupsWithPractitioner(),
    (
      classroomGroups: (ClassroomGroupDto & {
        practitioner: PractitionerDto | undefined;
      })[]
    ) => {
      if (!classroomGroups || !childUserId) return;

      return classroomGroups.find((group) =>
        group.learners?.some(
          (learner) => learner.childUserId === childUserId && learner.isActive
        )
      );
    }
  );

export const getPrincipal = (state: RootState): BasePractitionerDto =>
  state.classroomData.classroom?.principal || ({} as BasePractitionerDto);

export const getClassroomGroupById = (id: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (classroomGroups: SimpleClassroomGroupDto[] | undefined) => {
      if (!classroomGroups) return;

      return classroomGroups.find((group) => group.id === id);
    }
  );

// Outdated, this should not be used anymore
export const getClassroomGroupLearners = (state: RootState): LearnerDto[] =>
  state.classroomData.classroomGroupData.classroomGroups
    .flatMap((x) => x.learners)
    ?.filter((x) => x.isActive);

export const getChildLearnerByClassroomGroup = (
  classroomGroupId: string,
  childUserId?: string
) =>
  createSelector(
    getClassroomGroupById(classroomGroupId),
    (classroomGroup: ClassroomGroupDto | undefined) =>
      classroomGroup?.learners.find(
        (learner) => learner.childUserId === childUserId
      )
  );

export const getLearnersForClassroomGroups = (
  classroomGroupIds: string[],
  startDate: Date,
  endDate: Date
) =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (state: RootState) => state.children.childData.children,
    (classroomGroups: ClassroomGroupDto[], children: ChildDto[]) => {
      return classroomGroups
        .filter((classroomGroup) =>
          classroomGroupIds.includes(classroomGroup.id)
        )
        .map((classroomGroup) => ({
          classroomGroupId: classroomGroup.id,
          classroomGroupName: classroomGroup.name,
          learners: classroomGroup.learners
            .filter(
              (learner) =>
                new Date(learner.startedAttendance) <= endDate &&
                (!learner.stoppedAttendance ||
                  new Date(learner.stoppedAttendance) >= startDate)
            )
            .filter((learner) =>
              children.find(
                (child) =>
                  child.userId === learner.childUserId &&
                  child.caregiverId != null
              )
            )
            .map((learner) => ({
              ...learner,
              child: children.find(
                (child) => child.userId === learner.childUserId
              ),
            })),
        }));
    }
  );

export const getCurrentProgressReportPeriod = () =>
  createSelector(
    (state: RootState) => state.classroomData.classroom,
    (classroom: ClassroomDto | undefined) => {
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

export const getExpiredProgressReportPeriod = () =>
  createSelector(
    (state: RootState) => state.classroomData.classroom,
    (classroom: ClassroomDto | undefined) => {
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
      return {
        reportNumber: index + 1,
        id: expiredPeriod?.id,
        endDate: expiredPeriod?.endDate.toString(),
      } as unknown as CompleteReportPeriods;
    }
  );

export const getAllProgressReportPeriods = () =>
  createSelector(
    (state: RootState) => state.classroomData.classroom,
    (classroom: ClassroomDto | undefined) => {
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

export const getSetupClassroomPractitioners = (
  state: RootState
): UpdateUserPermissionInputModelInput[] =>
  state.classroomData.classroomPractitioners;
