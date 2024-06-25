import { ProgrammeTypeDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ClassroomDto } from '@/models/classroom/classroom.dto';

export const getClassroomForCoach = (
  state: RootState
): ClassroomDto[] | undefined => state.classroomForCoachData.classroomForCoach;

export const getClassroomGroups = (state: RootState): ClassroomGroupDto[] =>
  state.classroomData.classroomGroupData.classroomGroups;

export const getClassroomGroupById = (id?: string) =>
  createSelector(
    (state: RootState) =>
      state.classroomData.classroomGroupData.classroomGroups,
    (classroomGroups: ClassroomGroupDto[] | undefined) => {
      if (!classroomGroups || !id) return;

      return classroomGroups.find((group) => group.id === id);
    }
  );
