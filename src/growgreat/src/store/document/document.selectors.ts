import { DocumentDto } from '@ecdlink/core';
import { createSelector } from 'reselect';
import { RootState } from '../types';

export const getDocumentByTypeId = (userId?: string, typeId?: string) =>
  createSelector(
    (state: RootState) => state.documents.documentsForHCW,
    (documents: DocumentDto[] | undefined) => {
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
    (documents: DocumentDto[] | undefined) => {
      if (!documents || !userId) return;

      return documents.filter((document) => document.userId === userId);
    }
  );
