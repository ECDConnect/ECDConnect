import { Document } from '@ecdlink/core';
import { createSelector } from 'reselect';
import { RootState } from '../types';
import { Document as DocumentsForHCW } from '@ecdlink/graphql';

export const getDocuments = (state: RootState): Document[] | undefined =>
  state.documents.documents?.filter((document: Document) => document.isActive);

export const getDocumentByTypeId = (userId?: string, typeId?: string) =>
  createSelector(
    (state: RootState) => state.documents.documents,
    (documents: Document[] | undefined) => {
      if (!documents || !userId || !typeId) return;

      return documents.find(
        (document) =>
          document.userId === userId && document.documentTypeId === typeId
      );
    }
  );

export const getDocumentsByUserId = (userId: string) =>
  createSelector(
    (state: RootState) => state.documents.documentsForHCW,
    (documents: DocumentsForHCW[] | undefined) => {
      if (!documents || !userId) return;

      return documents.filter((document) => document.userId === userId);
    }
  );
