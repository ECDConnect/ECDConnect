import { ChildDto, UserDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getChildren, updateChild, upsertChildren } from './children.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { CaregiverContactHistory, ChildrenState } from './children.types';

const initialState: ChildrenState = {
  childData: {
    children: [],
    dateRefreshed: undefined,
  },
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    resetChildrenState: (state) => {
      state.childData = initialState.childData;
    },
    createChild: (state, action: PayloadAction<ChildDto>) => {
      //const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, synced: false };
      state.childData.children.push(payloadUpdated);
    },
    updateChild: (state, action: PayloadAction<ChildDto>) => {
      //const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, synced: false };

      const childIndex = state.childData.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.childData.children[childIndex] = payloadUpdated;
    },
    // This might need to merge with create child, or update the child
    // Will be part of registration though
    // createChildUser: (state, action: PayloadAction<UserDto>) => {
    //   const isOnline = navigator.onLine;
    //   const payloadUpdated = { ...action.payload, isOnline };

    //   if (!state.childUser) state.childUser = [];
    //   state.childUser?.push(payloadUpdated);
    // // },
    // // TODO - just remove this
    // updateChildUser: (state, action: PayloadAction<UserDto>) => {
    //   //const isOnline = navigator.onLine;
    //   const payloadUpdated = { ...action.payload, synced: false };
    //   for (let i = 0; i < state.childData.children.length; i++) {
    //     if (state.childData.children[i].userId === action.payload.id)
    //       state.childData.children[i].user = payloadUpdated;
    //   }
    // },
    // TODO - refactor so it doesn't require the full DTO, otherwise might as well just use udpate child
    deactivateChild: (state, action: PayloadAction<ChildDto>) => {
      //const isOnline = navigator.onLine;
      const payloadUpdated = { ...action.payload, synced: false };

      const childIndex = state.childData.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.childData.children[childIndex] = payloadUpdated;
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
    setThunkActionStatus(builder, updateChild);
    builder.addCase(getChildren.fulfilled, (state, action) => {
      if (!action.payload.retrievedFromCache) {
        const unsyncedChildren = state.childData.children.filter(
          (child) => !child.synced
        );
        const newChildren = action.payload.children.map((x) => ({
          ...x,
          synced: true,
        }));

        state.childData = {
          children: unsyncedChildren.concat(newChildren),
          dateRefreshed: new Date().toDateString(),
        };
      }
    });
    builder.addCase(updateChild.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const childIndex = state.childData.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      state.childData.children[childIndex] = {
        ...action.payload,
        synced: true,
      };
    });
    builder.addCase(upsertChildren.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      state.childData = {
        ...state.childData,
        children: state.childData.children.map((child) => ({
          ...child,
          synced: true,
        })),
      };
    });
    // Refactor when we work on coach stuff
    // builder.addCase(getChildrenForCoach.fulfilled, (state, action) => {
    //   state.childData.children = action.payload;
    // });
  },
});
const { reducer: childrenReducer, actions: childrenActions } = childrenSlice;

const childrenPersistConfig = {
  key: 'children',
  storage: localForage,
  blacklist: [],
};

export { childrenPersistConfig, childrenReducer, childrenActions };
