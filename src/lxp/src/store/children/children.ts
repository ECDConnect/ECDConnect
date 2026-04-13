import { ChildDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  findCreatedChild,
  getChildren,
  openAccessAddChild,
  openAccessAddChildDetail,
  updateChild,
  upsertChildren,
  getChildrenForClassroom,
  getChildById,
} from './children.actions';
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
      const payloadUpdated = { ...action.payload, synced: false };
      state.childData.children.push(payloadUpdated);
    },
    updateChild: (state, action: PayloadAction<ChildDto>) => {
      const payloadUpdated = { ...action.payload, synced: false };

      const childIndex = state.childData.children.findIndex(
        (child) => child.id === action.payload.id
      );

      if (childIndex < 0) return;

      if (payloadUpdated?.isActive === false) {
        state.childData.children = state.childData.children.filter(
          (child) => child.id !== action.payload.id
        );
        return;
      }

      state.childData.children[childIndex] = payloadUpdated;
    },
    deactivateChild: (state, action: PayloadAction<ChildDto>) => {
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
    setThunkActionStatus(builder, findCreatedChild);
    setThunkActionStatus(builder, openAccessAddChildDetail);
    setThunkActionStatus(builder, openAccessAddChild);
    builder.addCase(openAccessAddChild.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(openAccessAddChildDetail.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(findCreatedChild.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getChildById.fulfilled, (state, action) => {
      if (!action.payload) return;

      const childIndex = state.childData.children.findIndex(
        (child) => child.id === action.payload.child.id
      );

      if (childIndex === -1) {
        state.childData.children.push(action.payload.child);
      } else {
        state.childData.children[childIndex] = action.payload.child;
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getChildren.fulfilled, (state, action) => {
      if (!action.payload.retrievedFromCache) {
        const newChildren = action.payload.children
          .filter(
            (newChild) =>
              !state.childData.children.some(
                (existingChild) => existingChild.id === newChild.id
              )
          )
          .map((x) => ({
            ...x,
            synced: true,
          }));

        state.childData = {
          children: [...state.childData.children, ...newChildren],
          dateRefreshed: new Date().toDateString(),
        };
      }
    });

    builder.addCase(getChildrenForClassroom.fulfilled, (state, action) => {
      if (!action.payload.retrievedFromCache) {
        // Filter out new children that already exist in the state based on id
        const newChildren = action.payload.children
          .filter(
            (newChild) =>
              !state.childData.children.some(
                (existingChild) => existingChild.id === newChild.id
              )
          )
          .map((x) => ({
            ...x,
            synced: true,
          }));

        state.childData = {
          children: [...state.childData.children, ...newChildren],
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
