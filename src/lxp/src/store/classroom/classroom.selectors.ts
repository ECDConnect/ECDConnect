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
        isBefore(new Date(), new Date(x.endDate))
      );

      if (index < 0) {
        return undefined;
      }

      return {
        reportNumber: index + 1,
        ...currentYearsReportingPeriods[index],
      } as ProgressReportPeriod;
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

        reportingPeriodsForYear?.forEach((value, index) =>
          sortedReportingPeriods.push({
            ...value,
            reportNumber: index + 1,
          })
        );
      });

      return sortedReportingPeriods;
    }
  );
