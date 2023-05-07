import { DocumentDto } from '@ecdlink/core';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { createDocument, getDocumentsForHCW } from './document.actions';
import { DocumentState } from './document.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: DocumentState = {
  documentsForHCW: undefined,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    resetDocumentsState: (state) => {
      state.documentsForHCW = initialState.documentsForHCW;
    },
    createDocument: (state, action: PayloadAction<DocumentDto>) => {
      if (!state.documentsForHCW) state.documentsForHCW = [];
      state.documentsForHCW?.push(action.payload);
    },
    deleteDocument: (state, action: PayloadAction<DocumentDto>) => {
      if (!state.documentsForHCW) return;

      const index = state.documentsForHCW.findIndex(
        (c) => c.id === action.payload.id
      );

      if (index > -1) state.documentsForHCW?.splice(index, 1);
    },
    updateDocument: (state, action: PayloadAction<DocumentDto>) => {
      if (!state.documentsForHCW) return;

      const index = state.documentsForHCW.findIndex(
        (c) => c.id === action.payload.id
      );

      if (index < 0) return;

      state.documentsForHCW[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, createDocument);
    builder.addCase(getDocumentsForHCW.fulfilled, (state, action) => {
      state.documentsForHCW = action.payload;
    });
    builder.addCase(createDocument.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: documentReducer, actions: documentActions } = documentSlice;

const documentPersistConfig = {
  key: 'documents',
  storage: localForage,
  blacklist: [],
};

export { documentPersistConfig, documentReducer, documentActions };
