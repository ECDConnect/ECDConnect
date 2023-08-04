import { ChildDto, UserDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  generateCaregiverChildToken,
  refreshCaregiverChildToken,
  openAccessAddChildDetail,
  getChildrenForCoach,
  openAccessAddChild,
  getChildren,
  updateChild,
} from './children.actions';
import { ChildrenState } from './children.types';

const initialState: ChildrenState = {
  children: undefined,
  childUser: undefined,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    resetChildrenState: (state) => {
      state.children = initialState.children;
      state.childUser = initialState.childUser;
    },
    createChild: (state, action: PayloadAction<ChildDto>) => {
      if (!state.children) state.children = [];
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };
      state.children?.push(payloadUpdated);
    },
    updateChild: (state, action: PayloadAction<ChildDto>) => {
      if (!state.children) return;

      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };

      const childIndex = state.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.children[childIndex] = payloadUpdated;
    },
    createChildUser: (state, action: PayloadAction<UserDto>) => {
      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };

      if (!state.childUser) state.childUser = [];
      state.childUser?.push(payloadUpdated);
    },
    updateChildUser: (state, action: PayloadAction<UserDto>) => {
      if (state.childUser) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };
        for (let i = 0; i < state.childUser.length; i++) {
          if (state.childUser[i].id === action.payload.id)
            state.childUser[i] = payloadUpdated;
        }
      }
    },
    deactivateChild: (state, action: PayloadAction<ChildDto>) => {
      if (!state.children || !state.childUser) return;

      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };

      const childIndex = state.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      const childUserIndex = state.childUser.findIndex(
        (child) => child.id === action.payload.userId
      );

      if (childUserIndex < 0) return;

      state.children[childIndex] = payloadUpdated;
      state.childUser[childUserIndex].isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChildren.fulfilled, (state, action) => {
      if (!state.children) {
        const childUsers: UserDto[] = [];

        for (let i = 0; i < action.payload.length; i++) {
          if (action.payload[i].user) {
            childUsers.push(action.payload[i].user as UserDto);
          }
        }

        state.childUser = childUsers;
        state.children = action.payload;
      }
    });
    builder.addCase(updateChild.fulfilled, (state, action) => {
      if (!state.children) return;

      const childIndex = state.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.children[childIndex] = action.payload;
    });
    builder.addCase(
      generateCaregiverChildToken.fulfilled,
      (state, action) => {}
    );
    builder.addCase(
      refreshCaregiverChildToken.fulfilled,
      (state, action) => {}
    );
    builder.addCase(getChildrenForCoach.fulfilled, (state, action) => {
      state.children = action.payload;
    });
    builder.addCase(openAccessAddChildDetail.fulfilled, (state, action) => {});
    builder.addCase(openAccessAddChild.fulfilled, (state, action) => {});
  },
});
const { reducer: childrenReducer, actions: childrenActions } = childrenSlice;

const childrenPersistConfig = {
  key: 'children',
  storage: localForage,
  blacklist: [],
};

export { childrenPersistConfig, childrenReducer, childrenActions };
