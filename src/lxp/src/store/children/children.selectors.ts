import { ChildDto, UserDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { UserTypeEnum } from '@/models/auth/user/UserContext';

export const getChildren = (state: RootState): ChildDto[] | undefined =>
  state.children.children?.filter(
    (child: ChildDto) => child.isActive !== false
  );

export const getChildUsers = (state: RootState): UserDto[] =>
  state.children.childUser || [];

export const getChildById = (id?: string) =>
  createSelector(
    (state: RootState) => {
      if (!id) return;

      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        const coachChildren = state?.children?.children;
        const practitionerChildren =
          state?.childrenForPractitioner?.childrenForPractitioner;

        let child = practitionerChildren?.find((child) => child.id === id);

        if (!child) {
          child = coachChildren?.find((child) => child.id === id);
        }

        return child;
      }

      return state?.children?.children?.find((child) => child.id === id);
    },
    (child: ChildDto | undefined) => {
      if (!child) return;

      return child;
    }
  );

export const getChildUserById = (userId?: string) =>
  createSelector(
    (state: RootState) => state.children.childUser,
    (childUsers: UserDto[] | undefined) => {
      if (!childUsers || !userId) return;

      return childUsers.find((user) => user.id === userId);
    }
  );
