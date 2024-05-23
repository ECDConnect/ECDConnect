import { ClassProgrammeDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import {
  ClassroomGroupDto,
  LearnerDto,
  ClassroomGroupDto as SimpleClassroomGroupDto,
} from '@/models/classroom/classroom-group.dto';
import { BasePractitionerDto } from '@/models/classroom/practitioner.dto';

export const getClassroom = (
  state: RootState
): SimpleClassroomDto | undefined => state.classroomData.classroom;

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

export const getClassroomGroupByChildUserId = (childUserId: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (classroomGroups: SimpleClassroomGroupDto[] | undefined) => {
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

export const getChildLearnerByClassroom = (
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
