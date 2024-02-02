import { Document } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { createDocument, getDocuments } from './document.actions';
import { DocumentState } from './document.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: DocumentState = {
  documents: undefined,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    resetDocumentsState: (state) => {
      state.documents = initialState.documents;
    },
    createDocument: (state, action: PayloadAction<Document>) => {
      if (!state.documents) state.documents = [];
      state.documents?.push(action.payload);
    },
    deleteDocument: (state, action: PayloadAction<Document>) => {
      if (!state.documents) return;

      const index = state.documents.findIndex(
        (c) => c.id === action.payload.id
      );

      if (index > -1) state.documents?.splice(index, 1);
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      if (!state.documents) return;

      const index = state.documents.findIndex(
        (c) => c.id === action.payload.id
      );

      if (index < 0) return;

      state.documents[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, createDocument);
    builder.addCase(createDocument.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getDocuments.fulfilled, (state, action) => {
      if (!state.documents) {
        const documents = Object.assign([], action.payload) as Document[];
        state.documents = documents;
      }
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
