import { DocumentDto, getBase64FromBaseString } from '@ecdlink/core';
import { DocumentInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentService } from '@services/DocumentService';
import { RootState, ThunkApiType } from '../types';

export const DocumentsActions = {
  CREATE_DOCUMENT: 'createDocument',
};

export const getDocuments = createAsyncThunk<
  DocumentDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getDocuments',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      documents: { documents: documentCache },
    } = getState();

    if (!documentCache) {
      try {
        let documents: DocumentDto[] | undefined;

        if (userAuth?.auth_token) {
          documents = await new DocumentService(
            userAuth?.auth_token
          ).getdocuments(userAuth.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!documents) {
          return rejectWithValue('Error getting Documents');
        }

        return documents;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return documentCache;
    }
  }
);

export const createDocument = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  DocumentsActions.CREATE_DOCUMENT,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      documents: { documents },
    } = getState();

    try {
      if (userAuth?.auth_token && documents) {
        for (const document of documents) {
          if (document.file) {
            const splitString = getBase64FromBaseString(document.file);

            const _documentService = new DocumentService(userAuth?.auth_token);

            const fileReturnModel = await _documentService.fileUpload(
              splitString,
              document.name,
              document.fileType ?? ''
            );

            if (fileReturnModel) {
              const documentInputModel: DocumentInput = {
                Id: document.id,
                UserId: document.userId,
                WorkflowStatusId: document.workflowStatusId,
                DocumentTypeId: document.documentTypeId,
                Name: fileReturnModel.name,
                Reference: fileReturnModel.url,
                CreatedUserId: document.createdUserId,
                IsActive: true,
              };

              await _documentService.updateDocument(
                document.id ?? '',
                documentInputModel
              );
            }
          }
        }
      }
      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
