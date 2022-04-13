import { ChildDto, UserDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getChildren = (state: RootState): ChildDto[] | undefined =>
  state.children.children?.filter(
    (child: ChildDto) => child.isActive !== false
  );

export const getChildUsers = (state: RootState): UserDto[] =>
  state.children.childUser || [];

export const getChildById = (id?: string) =>
  createSelector(
    (state: RootState) => state.children.children,
    (children: ChildDto[] | undefined) => {
      if (!children || !id) return;

      return children.find((child) => child.id === id);
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
