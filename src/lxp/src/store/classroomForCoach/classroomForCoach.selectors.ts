import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';

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
      state.classroomData.classroomGroupData.classroomGroups,
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
