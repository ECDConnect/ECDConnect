import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { DocumentDto } from '@ecdlink/core';
import { CreateDocumentRequest } from '@models/common/Document';
import { documentActions, documentSelectors } from '@store/document';
import { newGuid } from '@utils/common/uuid.utils';
import { useStaticData } from './useStaticData';
import { useAppDispatch } from '@store';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';

export const useDocuments = () => {
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const user = useSelector(userSelectors.getUser);
  const profilePictureTypeId = getDocumentTypeIdByEnum(
    FileTypeEnum.ProfileImage
  );
  const classroomImageTypeId = getDocumentTypeIdByEnum(
    FileTypeEnum.ClassroomProfile
  );
  const userProfilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(user?.id, profilePictureTypeId)
  );
  const classroomImage = useSelector(
    documentSelectors.getDocumentByTypeId(user?.id, classroomImageTypeId)
  );

  const createNewDocument = async (
    document: CreateDocumentRequest,
    reference?: string
  ): Promise<DocumentDto | undefined> => {
    const statusId = await getWorkflowStatusIdByEnum(
      document.status || WorkflowStatusEnum.DocumentVerified
    );
    const documentTypeId = getDocumentTypeIdByEnum(document.fileType);
    const documentInputModel: DocumentDto = {
      id: newGuid(),
      userId: document.userId,
      createdUserId: document.userId ?? '',
      workflowStatusId: statusId ?? '',
      documentTypeId: documentTypeId ?? '',
      name: document.fileName,
      reference: reference,
      fileName: document.fileName,
      file: document.data,
      fileType: document.fileType,
    };

    appDispatch(documentActions.createDocument(documentInputModel));
    return documentInputModel;
  };

  const updateDocument = async (
    existingDocument: DocumentDto,
    imageBaseString: string
  ) => {
    const statusId = await getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.DocumentVerified
    );

    const documentInputModel: DocumentDto = {
      ...existingDocument,
      workflowStatusId: statusId ?? '',
      file: imageBaseString,
    };

    appDispatch(documentActions.updateDocument(documentInputModel));
  };

  const deleteDocument = (document?: DocumentDto) => {
    if (!document) return;

    appDispatch(documentActions.deleteDocument(document));
  };

  return {
    createNewDocument,
    updateDocument,
    deleteDocument,
    userProfilePicture,
    classroomImage,
  };
};
