import {
  ChildDto,
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
  LearnerDto,
} from '@ecdlink/core';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getClassroom = (state: RootState): ClassroomDto | undefined =>
  state.classroomData.classroom;

export const getClassroomGroups = (state: RootState): ClassroomGroupDto[] =>
  state.classroomData.classroomGroups?.filter((x) => x.isActive) || [];

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

export const getClassProgrammes = (state: RootState): ClassProgrammeDto[] =>
  state.classroomData.classroomProgrammes?.filter((x) => x.isActive) || [];

export const getLearnerClassgroupId = (userId?: string) =>
  createSelector(
    (state: RootState) => state.classroomData.classroomGroupLearners,
    (classroomGroupLearners: LearnerDto[] | undefined) => {
      if (!classroomGroupLearners || !userId) return;

      const currentLearner = classroomGroupLearners.find(
        (learner) => learner.userId === userId && !learner.stoppedAttendance
      );
      return currentLearner?.classroomGroupId;
    }
  );

export const getClassroomProgrameType = () =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState) return;
      const groups =
        rootState.classroomData.classroomGroups?.filter((x) => x.isActive) ||
        [];

      if (groups?.length > 0) {
        return rootState.staticData.programmeTypes?.find(
          (x) => x.id === groups[0].programmeTypeId
        );
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
