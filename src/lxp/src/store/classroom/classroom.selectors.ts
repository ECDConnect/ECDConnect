import {
  ChildDto,
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
  PrincipalDto,
  ProgrammeTypeDto,
} from '@ecdlink/core';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getClassroom = (state: RootState): ClassroomDto | undefined =>
  state.classroomData.classroom;

export const getProgrammeType = () =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState): ProgrammeTypeDto | undefined => {
      if (!!rootState.classroomData.programmeType) {
        return rootState.staticData.programmeTypes?.find(
          (x) => x.id === rootState.classroomData.programmeType
        );
      } else {
        const groups =
          rootState.classroomData.classroomGroups?.filter((x) => x.isActive) ||
          [];

        if (groups?.length > 0) {
          return groups[0].programmeType;
        }

        return;
      }
    }
  );

export const getAllClassroomGroups = (state: RootState): ClassroomGroupDto[] =>
  state.classroomData.classroomGroups || [];

export const getClassroomGroups = (state: RootState): ClassroomGroupDto[] =>
  state.classroomData.classroomGroups?.filter((x) => x.isActive) || [];

export const getPrincipal = (state: RootState): PrincipalDto =>
  state.classroomData.principal || ({} as PrincipalDto);

export const getClassroomGroupById = (id?: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroups,
    (classroomGroups: ClassroomGroupDto[] | undefined) => {
      if (!classroomGroups || !id) return;

      return classroomGroups.find((group) => group.id === id);
    }
  );

export const getClassroomGroupLearners = (state: RootState): LearnerDto[] =>
  state.classroomData.classroomGroupLearners?.filter((x) => x.isActive) || [];

export const getChildLearner = (child?: ChildDto) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroupLearners || [],
    (learners: LearnerDto[]) =>
      learners.find((learner) => learner.userId === child?.userId)
  );

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

export const getClassProgrammesByClassGroupId = (classGroupId?: string) =>
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
    (state: RootState) => state.classroomData.classroomGroupLearners,
    (classroomGroupLearners: LearnerDto[] | undefined) => {
      if (!classroomGroupLearners || !userId) return;
      // TODO: this method filters out learners using stoppedAttendance date.
      const currentLearner = classroomGroupLearners.find(
        (learner) =>
          learner.userId === userId && learner.stoppedAttendance == null
      );
      return currentLearner?.classroomGroupId;
    }
  );

export const getClassroomProgrammeType = () =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState) return;
      const groups =
        rootState.classroomData.classroomGroups?.filter((x) => x.isActive) ||
        [];

      if (groups?.length > 0) {
        return groups[0].programmeType;
      }

      return;
    }
  );

export const isPlaygroup = () =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState) return;
      const groups =
        rootState.classroomData.classroomGroups?.filter((x) => x.isActive) ||
        [];

      if (groups.length > 0) {
        const programmeType = rootState.staticData.programmeTypes?.find(
          (x) => x.id === groups[0].programmeTypeId
        );
        return (
          programmeType && programmeType.enumId === ProgrammeTypeEnum.Playgroup
        );
      }

      return;
    }
  );
