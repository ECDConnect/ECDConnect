import { DocumentDto, getBase64FromBaseString } from '@ecdlink/core';
import { DocumentInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentService } from '@services/DocumentService';
import { RootState, ThunkApiType } from '../types';

export const DocumentActions = {
  CREATE_DOCUMENT: 'createDocument',
};

export const getDocumentsForHCW = createAsyncThunk<
  DocumentDto[],
  undefined,
  ThunkApiType<RootState>
>('getDocumentsForHCW', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      return await new DocumentService(userAuth?.auth_token).getDocumentsForHCW(
        userAuth.id
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createDocument = createAsyncThunk<
  boolean[],
  DocumentDto,
  ThunkApiType<RootState>
>(
  DocumentActions.CREATE_DOCUMENT,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      documents: { documentsForHCW },
    } = getState();

    const documents = documentsForHCW;
    try {
      if (!input.file) return [false];

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
