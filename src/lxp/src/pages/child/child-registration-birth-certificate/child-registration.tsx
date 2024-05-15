import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Step } from '../../../components/step-viewer/components/step';
import { StepViewer } from '../../../components/step-viewer/step-viewer';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStaticData } from '@hooks/useStaticData';
import { ChildRegistrationFormState } from '@models/child/child';
import { ChildBirthCertificateFormModel } from '@schemas/child/child-registration/child-birth-certificate-form';
import { useAppDispatch } from '@store';
import { childrenSelectors } from '@store/children';
import { documentActions, documentThunkActions } from '@store/document';
import { userSelectors } from '@store/user';
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { ChildBirthCertificateForm } from '../child-registration/child-birth-certificate-form/child-birth-certificate-form';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from '../child-registration/child-registration.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { DocumentsActions } from '@/store/document/document.actions';

export const ChildRegistrationBirthCertificate: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const location = useLocation<ChildRegistrationRouteState>();
  const childId = location.state.childId;
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const existingChild = useSelector(childrenSelectors.getChildById(childId));

  const [formState, setFormState] = useState<ChildRegistrationFormState>({});

  const { isLoading } = useThunkFetchCall(
    'documents',
    DocumentsActions.CREATE_DOCUMENT
  );

  const saveChildBirthCertificate = async (
    birthCertificateForm: ChildBirthCertificateFormModel
  ) => {
    if (!birthCertificateForm?.birthCertificateImage) {
      exitRegistration();
      return;
    }

    const fileName = `${birthCertificateForm.birthCertificateType}.png`;

    const documentStatusId = getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.DocumentPendingVerification
    );
    const fileType =
      birthCertificateForm?.birthCertificateType === 'clinicCard'
        ? FileTypeEnum.ChildClinicCard
        : FileTypeEnum.ChildBirthCertificate;

    const typeId = getDocumentTypeIdByEnum(fileType);

    const documentInputModel = childRegisterUtils.mapDocumentDto(
      existingChild?.userId || '',
      fileName,
      documentStatusId || '',
      typeId || '',
      fileType,
      birthCertificateForm.birthCertificateImage,
      user
    );

    appDispatch(documentActions.createDocument(documentInputModel));

    if (isOnline) {
      await appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();
    }

    exitRegistration();
  };

  const exitRegistration = () => {
    history.goBack();
  };

  useEffect(() => {
    let updatedFormState = { ...formState };
    if (!!existingChild) {
      updatedFormState = {
        ...updatedFormState,
      };

      setFormState(updatedFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IonContent scrollY={true}>
        <StepViewer
          activeStep={ChildRegistrationSteps.childBirthCertificateForm}
          showStepCount={false}
          title="Child registration"
          onBack={() => exitRegistration()}
          isOnline={isOnline}
          showOfflineCard={false}
        >
          <Step
            stepKey={ChildRegistrationSteps.childBirthCertificateForm}
            viewBannerWapper
          >
            <ChildBirthCertificateForm
              isLoading={isLoading}
              isSingleForm={true}
              childBirthCertificateForm={
                formState.childBirthCertificateFormModel
              }
              childInformation={formState.childInformationFormModel}
              onSubmit={(form) => {
                saveChildBirthCertificate(form);
              }}
            />
          </Step>
        </StepViewer>
      </IonContent>
    </>
  );
};
