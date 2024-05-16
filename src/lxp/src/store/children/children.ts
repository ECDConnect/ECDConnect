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
import { CaregiverContactHistory, ChildrenState } from './children.types';

const initialState: ChildrenState = {
  children: undefined,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    resetChildrenState: (state) => {
      state.children = initialState.children;
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
    // This might need to merge with create child, or update the child
    // Will be part of registration though
    // createChildUser: (state, action: PayloadAction<UserDto>) => {
    //   const isOnline = navigator.onLine;
    //   const payloadUpdated = { ...action.payload, isOnline };

    //   if (!state.childUser) state.childUser = [];
    //   state.childUser?.push(payloadUpdated);
    // },
    updateChildUser: (state, action: PayloadAction<UserDto>) => {
      if (state.children) {
        const isOnline = navigator.onLine;
        const payloadUpdated = { ...action.payload, isOnline };
        for (let i = 0; i < state.children.length; i++) {
          if (state.children[i].userId === action.payload.id)
            state.children[i].user = payloadUpdated;
        }
      }
    },
    deactivateChild: (state, action: PayloadAction<ChildDto>) => {
      if (!state.children) {
        return;
      }

      const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, isOnline };

      const childIndex = state.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.children[childIndex] = payloadUpdated;
    },
    addContactHistory: (
      state,
      action: PayloadAction<CaregiverContactHistory>
    ) => {
      if (!state.contactHistory) state.contactHistory = [];

      state.contactHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChildren.fulfilled, (state, action) => {
      state.children = action.payload;
    });
    builder.addCase(updateChild.fulfilled, (state, action) => {
      if (!state.children) return;

      const childIndex = state.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.children[childIndex] = action.payload;
    });
    builder.addCase(getChildrenForCoach.fulfilled, (state, action) => {
      state.children = action.payload;
    });
  },
});
const { reducer: childrenReducer, actions: childrenActions } = childrenSlice;

const childrenPersistConfig = {
  key: 'children',
  storage: localForage,
  blacklist: [],
};

export { childrenPersistConfig, childrenReducer, childrenActions };
