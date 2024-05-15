import { ChildDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getChildren = (state: RootState): ChildDto[] | undefined =>
  state.children.children?.filter(
    (child: ChildDto) => child.isActive !== false
  );

// This might need updates for a coach
export const getChildById = (id?: string) =>
  createSelector(
    (state: RootState) => state.children.children,
    (children: ChildDto[] | undefined) => {
      return (children || []).find((child) => child.id === id);
    }
  );
