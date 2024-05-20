import { ChildDto, ClassProgrammeDto, LearnerDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { BasePractitionerDto } from '@/models/classroom/practitioner.dto';

export const getClassroom = (
  state: RootState
): SimpleClassroomDto | undefined => state.classroomData.classroom;

export const getClassroomGroups = (
  state: RootState
): SimpleClassroomGroupDto[] => state.classroomData.classroomGroups || [];

export const getClassroomGroupsForUser = (userId: string) =>
  createSelector(
    (state: RootState) => state.classroomData?.classroomGroups,
    (classroomGroups) => {
      return (
        classroomGroups?.filter(
          (classroomGroup) => classroomGroup.userId === userId
        ) || []
      );
    }
  );

export const getClassroomGroupByChildUserId = (childUserId: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroups,
    (classroomGroups: SimpleClassroomGroupDto[] | undefined) => {
      if (!classroomGroups || !childUserId) return;

      return classroomGroups.find((group) =>
        group.learners?.some((learner) => learner.childUserId === childUserId)
      );
    }
  );

export const getPrincipal = (state: RootState): BasePractitionerDto =>
  state.classroomData.classroom?.principal || ({} as BasePractitionerDto);

export const getClassroomGroupById = (id: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroups,
    (classroomGroups: SimpleClassroomGroupDto[] | undefined) => {
      if (!classroomGroups) return;

      return classroomGroups.find((group) => group.id === id);
    }
  );

// TODO - THIS PROBABLY NEEDS AN UPDATE
export const getClassroomGroupLearners = (state: RootState): LearnerDto[] =>
  state.classroomData.classroomGroupLearners?.filter((x) => x.isActive) || [];

// TODO - THIS PROBABLY NEEDS AN UPDATE
export const getChildLearner = (child?: ChildDto) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroupLearners || [],
    (learners: LearnerDto[]) =>
      learners.find((learner) => learner.userId === child?.userId)
  );

// TODO - THIS PROBABLY NEEDS AN UPDATE
export const getChildLearnerByClassroom = (
  classroomGroupId: string,
  childUserId?: string
) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroupLearners || [],
    (learners: LearnerDto[]) =>
      learners.find(
        (learner) =>
          learner.userId === childUserId &&
          learner.classroomGroupId === classroomGroupId
      )
  );

export const getClassProgrammes = (state: RootState): ClassProgrammeDto[] =>
  state.classroomData.classroomProgrammes?.filter((x) => x.isActive) || [];

export const getClassProgrammesByClassroomGroupId = (classGroupId?: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomProgrammes,
    (classroomProgrammes: ClassProgrammeDto[] | undefined) => {
      return (
        classroomProgrammes?.filter(
          (x) => x.isActive && x.classroomGroupId === classGroupId
        ) || []
      );
    }
  );

export const getLearnerClassGroupId = (userId?: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroups,
    (classroomGroups: SimpleClassroomGroupDto[] | undefined) => {
      if (!classroomGroups?.length || !userId) return;

      return classroomGroups.find((classroomGroup) =>
        classroomGroup.learners?.some(
          (learner) => learner.childUserId === userId
        )
      )?.id;
    }
  );
