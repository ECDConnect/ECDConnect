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
import { documentActions } from '@store/document';
import { userSelectors } from '@store/user';
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { ChildBirthCertificateForm } from '../child-registration/child-birth-certificate-form/child-birth-certificate-form';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from '../child-registration/child-registration.types';

export const ChildRegistrationBirthCertificate: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } = useStaticData();
  const location = useLocation<ChildRegistrationRouteState>();
  const childId = location.state.childId;
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const existingChild = useSelector(childrenSelectors.getChildById(childId));
  const existingChildUser = useSelector(childrenSelectors.getChildUserById(existingChild?.userId));

  const [formState, setFormState] = useState<ChildRegistrationFormState>({});

  const saveChildBirthCertificate = async (
    birthCertificateForm: ChildBirthCertificateFormModel
  ) => {
    if (!birthCertificateForm?.birthCertificateImage) {
      exitRegistration();
      return;
    }

    const fileName = `${birthCertificateForm.birthCertificateType}.png`;

    const documentStatusId = await getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.DocumentPendingVerification
    );
    const typeId = await getDocumentTypeIdByEnum(FileTypeEnum.Child);

    const documentInputModel = childRegisterUtils.mapDocumentDto(
      existingChildUser?.id || '',
      fileName,
      documentStatusId || '',
      typeId || '',
      birthCertificateForm.birthCertificateImage,
      user
    );

    await appDispatch(documentActions.createDocument(documentInputModel));
    exitRegistration();
  };

  const exitRegistration = () => {
    history.goBack();
  };

  useEffect(() => {
    let updatedFormState = { ...formState };
    if (existingChild && existingChildUser) {
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
        >
          <Step stepKey={ChildRegistrationSteps.childBirthCertificateForm} viewBannerWapper>
            <ChildBirthCertificateForm
              isSingleForm={true}
              childBirthCertificateForm={formState.childBirthCertificateFormModel}
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
