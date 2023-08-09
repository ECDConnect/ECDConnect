import {
  CaregiverDto,
  ChildDto,
  ContentConsentTypeEnum,
  useStepNavigation,
} from '@ecdlink/core';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { IonContent } from '@ionic/react';
import { getDate, getMonth, getYear } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Step } from '../../../components/step-viewer/components/step';
import { StepViewer } from '../../../components/step-viewer/step-viewer';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStaticData } from '@hooks/useStaticData';
import { ChildRegistrationFormState, StateAction } from '@models/child/child';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { ChildBirthCertificateFormModel } from '@schemas/child/child-registration/child-birth-certificate-form';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  caregiverActions,
  caregiverSelectors,
  caregiverThunkActions,
} from '@store/caregiver';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@store/classroom';
import { contentConsentSelectors } from '@store/content/consent';
import { documentActions, documentThunkActions } from '@store/document';
import { userActions, userSelectors, userThunkActions } from '@store/user';
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { mapUserConsentDto } from '@utils/user/user-consent.utils';
import { CareGiverChildInformationForm } from './care-giver-child-information-form/care-giver-child-information-form';
import { CareGiverContributionForm } from './care-giver-contribution-form/care-giver-contribution-form';
import { CareGiverExtraInformationForm } from './care-giver-extra-information/care-giver-extra-information';
import { CareGiverInformationForm } from './care-giver-information-form/care-giver-information-form';
import { CareGiverReferencePanelForm } from './care-giver-reference-panel-form/care-giver-reference-panel-form';
import { ChildBirthCertificateForm } from './child-birth-certificate-form/child-birth-certificate-form';
import { ChildEmergencyContactForm } from './child-emergency-contact-form/child-emergency-contact-form';
import { ChildExtraInformationForm } from './child-extra-information-form/child-extra-information-form';
import { ChildHealthInformationForm } from './child-health-information-form/child-health-information-form';
import { ChildInformationForm } from './child-information-form/child-information-form';
import { ChildRegistrationForm } from './child-registration-form/child-registration-form';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from './child-registration.types';
import ROUTES from '@routes/routes';
import { CaregiverService } from '@/services/CaregiverService';
import { authSelectors } from '@store/auth';
import { childrenForPractitionerThunkActions } from '@/store/childrenForPractitioner';
import { practitionerSelectors } from '@/store/practitioner';

export const ChildRegistration: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const location = useLocation<ChildRegistrationRouteState>();
  const routeStep = location.state.step;
  const childId = location.state.childId;
  const childDetails = location.state.childDetails;
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const consentList = useSelector(contentConsentSelectors.getConsent);
  const existingChild = useSelector(childrenSelectors.getChildById(childId));
  const authUser = useSelector(authSelectors.getAuthUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitionerUserId = practitioner?.userId;
  const isPrincipal = practitioner?.isPrincipal === true;
  const isTrainee = practitioner?.isTrainee;

  const existingLearner = useSelector(
    classroomsSelectors.getChildLearner(existingChild)
  );
  const existingCaregiver = useSelector(
    caregiverSelectors.getCaregiverById(existingChild?.caregiverId)
  );
  const existingChildUser = useSelector(
    childrenSelectors.getChildUserById(existingChild?.userId)
  );

  const { goToStep, canGoBack, goBackOneStep, activeStepKey } =
    useStepNavigation(routeStep || ChildRegistrationSteps.registrationForm);

  const [exitRegistrationPromptVisible, setExitRegistrationPromptVisible] =
    useState<boolean>(false);

  const [currentChildInputModel, setCurrentChildInputModel] =
    useState<ChildDto>();

  const [formState, setFormState] = useState<ChildRegistrationFormState>({});

  const onStepChange = (step: number, action?: StateAction) => {
    goToStep(step);
    if (action) {
      setFormState({ ...formState, [action.formProp]: action.value });
    }
  };
  const [caregiverData, setCaregiverData] = useState<CaregiverDto>();
  const [sendGrants, setSendGrants] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Child Registration',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const saveChild = async (
    healthInformationForm: ChildHealthInformationFormModel
  ) => {
    if (!formState.childInformationFormModel) return;

    const userInputModel = childRegisterUtils.mapChildUserDto(
      formState.childInformationFormModel,
      formState.childExtraInformationFormModel,
      existingChildUser
    );

    const userId = userInputModel.id || '';
    userInputModel.isActive = true;

    // marked external to clear out local learner on sync
    const childStatusId = await getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildExternalLink
    );

    const childInputModel = childRegisterUtils.mapChildDto(
      userId,
      childStatusId ?? '',
      healthInformationForm,
      formState.childExtraInformationFormModel,
      existingChild
    );

    childInputModel.isActive = true;

    const learnerInputModel = childRegisterUtils.mapLearnerDto(
      userId,
      formState.childInformationFormModel,
      existingLearner
    );

    learnerInputModel.isActive = true;

    // CONSENT
    if (formState.childRegistrationFormModel?.childPhotoConsentAccepted) {
      const consent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.PhotoPermissions
      );

      if (consent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          consent
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
      }
    }
    if (formState.childRegistrationFormModel?.commitmentAgreementAccepted) {
      const consent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.CommitmentAgreement
      );

      if (consent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          consent
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
      }
    }
    if (formState.childRegistrationFormModel?.consentAgreementAccepted) {
      const consent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.ConsentAgreement
      );

      if (consent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          consent
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
      }
    }
    if (formState.childRegistrationFormModel?.indemnityAgreementAccepted) {
      const consent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.IndemnityAgreement
      );

      if (consent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          consent
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
      }
    }
    if (
      formState.childRegistrationFormModel?.personalInformationAgreementAccepted
    ) {
      const consent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.PersonalInformationAgreement
      );

      if (consent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          consent
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
      }
    }
    // END CONSENT

    if (existingChildUser) {
      appDispatch(childrenActions.updateChildUser(userInputModel));
      await appDispatch(
        childrenThunkActions.updateChildUser({
          id: userInputModel.id as string,
          childUser: userInputModel,
        })
      ).unwrap();
    } else {
      appDispatch(childrenActions.createChildUser(userInputModel));
      await appDispatch(
        userThunkActions.addUser({ user: userInputModel })
      ).unwrap();
    }

    if (existingChild) {
      appDispatch(childrenActions.updateChild(childInputModel));
      await appDispatch(
        childrenThunkActions.updateChild({
          id: childInputModel.id as string,
          child: childInputModel,
        })
      );
    } else {
      appDispatch(childrenActions.createChild(childInputModel));
      await appDispatch(
        childrenThunkActions.createChild({ child: childInputModel })
      ).unwrap();
    }

    if (existingLearner) {
      appDispatch(
        classroomsActions.updateClassroomGroupLearner(learnerInputModel)
      );
      await appDispatch(
        classroomsThunkActions.updateLearner({
          id: learnerInputModel.id as string,
          learner: learnerInputModel,
        })
      );
    } else {
      appDispatch(
        classroomsActions.createClassroomGroupLearner(learnerInputModel)
      );
      await appDispatch(
        classroomsThunkActions.createLearner({ learner: learnerInputModel })
      ).unwrap();
    }

    if (formState.childRegistrationFormModel?.registrationForm) {
      const fileName = 'F4-registrationform.png';
      const documentStatusId = await getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentPendingVerification
      );
      const typeId = await getDocumentTypeIdByEnum(
        FileTypeEnum.ChildRegistrationForm
      );

      const documentInputModel = childRegisterUtils.mapDocumentDto(
        userId,
        fileName,
        documentStatusId ?? '',
        typeId ?? '',
        FileTypeEnum.ChildRegistrationForm,
        formState.childRegistrationFormModel?.registrationForm,
        user
      );
      appDispatch(documentActions.createDocument(documentInputModel));
      await appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();
    }

    setCurrentChildInputModel(childInputModel);
  };

  const saveCaregiver = async (
    caregiverReferencePanelForm: CareGiverReferencePanelFormModel
  ) => {
    if (!formState.childInformationFormModel) return;

    const siteAddressDto = childRegisterUtils.mapSiteAddressDto(
      formState.careGiverChildInformationFormModel,
      existingCaregiver?.siteAddress
    );

    const caregiverDto = childRegisterUtils.mapCaregiverDto(
      formState.careGiverInformationFormModel,
      siteAddressDto,
      formState.careGiverExtraInformationFormModel,
      formState.childEmergencyContactFormModel,
      caregiverReferencePanelForm,
      formState.careGiverContributionFormModel,
      existingCaregiver
    );
    setCaregiverData(caregiverDto);

    if (existingCaregiver) {
      appDispatch(caregiverActions.updateCaregiver(caregiverDto));
      await appDispatch(
        caregiverThunkActions.updateCaregiver({
          id: caregiverDto.id as string,
          caregiver: caregiverDto,
        })
      ).unwrap();
    } else {
      appDispatch(caregiverActions.createCaregiver(caregiverDto));
      await appDispatch(
        caregiverThunkActions.createCaregiver({ caregiver: caregiverDto })
      ).unwrap();
    }

    const childInputModel = existingChild
      ? { ...existingChild }
      : { ...currentChildInputModel };

    const childStatusId = await getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildActive
    );
    childInputModel.caregiverId = caregiverDto.id;
    childInputModel.workflowStatusId = childStatusId;
    childInputModel.insertedBy = user?.fullName;

    await updateChild(childInputModel);

    if (isTrainee) {
      history.push(ROUTES.CLASSROOM, { activeTabIndex: 0 });
      return;
    }

    history.push(ROUTES.CLASSROOM);
  };

  useEffect(() => {
    if (sendGrants) {
      const updateGrants = async () => {
        await new CaregiverService(
          authUser?.auth_token ?? ''
        ).updateCareGiverGrants(
          existingChild?.userId!,
          caregiverData?.grants || []
        );
      };

      if (isPrincipal && practitionerUserId) {
        const updatePrincipalChildren = async () => {
          await appDispatch(
            childrenForPractitionerThunkActions.getChildrenForPractitioner({
              id: practitionerUserId,
            })
          ).unwrap();
        };
        updatePrincipalChildren();
      }
      updateGrants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendGrants]);

  const updateChild = async (child: ChildDto) => {
    if (!child && caregiverData) return;
    await appDispatch(
      childrenThunkActions.updateChild({ child: child, id: String(child.id) })
    ).unwrap();
    appDispatch(childrenActions.updateChild(child));
    setSendGrants(true);
  };

  const saveChildBirthCertificate = async (
    birthCertificateForm: ChildBirthCertificateFormModel
  ) => {
    if (!birthCertificateForm?.birthCertificateImage) return;

    const fileName = `${birthCertificateForm.birthCertificateType}.png`;

    const documentStatusId = await getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.DocumentPendingVerification
    );

    const fileType =
      birthCertificateForm?.birthCertificateType === 'clinicCard'
        ? FileTypeEnum.ChildClinicCard
        : FileTypeEnum.ChildBirthCertificate;

    const typeId = await getDocumentTypeIdByEnum(fileType);

    const documentInputModel = childRegisterUtils.mapDocumentDto(
      existingChildUser?.id || '',
      fileName,
      documentStatusId || '',
      typeId || '',
      fileType,
      birthCertificateForm.birthCertificateImage,
      user
    );

    appDispatch(documentActions.createDocument(documentInputModel));
    await appDispatch(
      documentThunkActions.createDocument(documentInputModel)
    ).unwrap();
  };

  const exitRegistrationPrompt = () => {
    setExitRegistrationPromptVisible(true);
  };

  const exitRegistration = () => {
    history.goBack();
  };

  useEffect(() => {
    let updatedFormState = { ...formState };
    if (existingChild && routeStep && existingChildUser) {
      const userDob = existingChildUser?.dateOfBirth
        ? new Date(existingChildUser?.dateOfBirth)
        : new Date();

      const dobDay = getDate(userDob);
      const dobMonth = getMonth(userDob);
      const dobYear = getYear(userDob);

      updatedFormState = {
        ...updatedFormState,
        childInformationFormModel: {
          dobDay: dobDay,
          dobMonth: dobMonth,
          dobYear: dobYear,
          dob: userDob,
          firstname: existingChildUser?.firstName || '',
          surname: existingChildUser?.surname || '',
          childIdField: existingChildUser?.idNumber || '',
          otherReason: '',
          playgroupId: existingLearner?.classroomGroupId || '',
        },
      };

      setFormState(updatedFormState);
    }

    if (childDetails) {
      setFormState({
        ...updatedFormState,
        childInformationFormModel: {
          dobDay: 0,
          dobMonth: 0,
          dobYear: 0,
          firstname: childDetails?.firstName || '',
          surname: childDetails?.surname || '',
          otherReason: '',
          playgroupId: childDetails?.playgroupId || '',
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IonContent scrollY={true}>
        <StepViewer
          title="Child registration"
          activeStep={activeStepKey}
          onBack={() => {
            if (canGoBack()) goBackOneStep();
            else {
              exitRegistrationPrompt();
            }
          }}
          onClose={exitRegistrationPrompt}
          isOnline={isOnline}
        >
          <Step
            stepKey={ChildRegistrationSteps.registrationForm}
            viewBannerWapper
          >
            <ChildRegistrationForm
              childRegisterForm={formState.childRegistrationFormModel}
              variation="practitioner"
              onSubmit={(form) => {
                onStepChange(ChildRegistrationSteps.childInformationForm, {
                  formProp: 'childRegistrationFormModel',
                  value: form,
                });
              }}
            />
          </Step>
          <Step
            stepKey={ChildRegistrationSteps.childInformationForm}
            viewBannerWapper
          >
            <ChildInformationForm
              childInformation={formState.childInformationFormModel}
              variation="practitioner"
              onSubmit={(form) => {
                onStepChange(ChildRegistrationSteps.childExtraInformationForm, {
                  formProp: 'childInformationFormModel',
                  value: form,
                });
              }}
            />
          </Step>
          <Step
            stepKey={ChildRegistrationSteps.childExtraInformationForm}
            viewBannerWapper
          >
            <ChildExtraInformationForm
              childName={formState.childInformationFormModel?.firstname ?? ''}
              childExtraInformation={formState.childExtraInformationFormModel}
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.childHealthInformationForm,
                  {
                    formProp: 'childExtraInformationFormModel',
                    value: form,
                  }
                );
              }}
            />
          </Step>
          <Step
            stepKey={ChildRegistrationSteps.childHealthInformationForm}
            viewBannerWapper
          >
            <ChildHealthInformationForm
              childName={formState.childInformationFormModel?.firstname ?? ''}
              childHealthInformation={formState.childHealthInformationFormModel}
              onSubmit={(form) => {
                onStepChange(ChildRegistrationSteps.childBirthCertificateForm, {
                  formProp: 'childHealthInformationFormModel',
                  value: form,
                });
                saveChild(form);
              }}
            />
          </Step>
          <Step
            stepKey={ChildRegistrationSteps.childBirthCertificateForm}
            viewBannerWapper
          >
            <ChildBirthCertificateForm
              childBirthCertificateForm={
                formState.childBirthCertificateFormModel
              }
              childInformation={formState.childInformationFormModel}
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.childCareGiverInformationForm,
                  {
                    formProp: 'childBirthCertificateFormModel',
                    value: form,
                  }
                );
                saveChildBirthCertificate(form);
              }}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.childCareGiverInformationForm}
            viewBannerWapper
          >
            <CareGiverInformationForm
              careGiverInformation={formState.careGiverInformationFormModel}
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.childCareGiverChildInformationForm,
                  {
                    formProp: 'careGiverInformationFormModel',
                    value: form,
                  }
                );
              }}
              childName={formState.childInformationFormModel?.firstname ?? ''}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.childCareGiverChildInformationForm}
            viewBannerWapper
          >
            <CareGiverChildInformationForm
              careGiverInformation={
                formState.careGiverChildInformationFormModel
              }
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.childCareGiverExtraInformationForm,
                  {
                    formProp: 'careGiverChildInformationFormModel',
                    value: form,
                  }
                );
              }}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.childCareGiverExtraInformationForm}
            viewBannerWapper
          >
            <CareGiverExtraInformationForm
              careGiverExtraInformation={
                formState.careGiverExtraInformationFormModel
              }
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.childCareGiverContributionForm,
                  {
                    formProp: 'careGiverExtraInformationFormModel',
                    value: form,
                  }
                );
              }}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.childCareGiverContributionForm}
            viewBannerWapper
          >
            <CareGiverContributionForm
              careGiverContributionForm={
                formState.careGiverContributionFormModel
              }
              variation="practitioner"
              onSubmit={(form) => {
                onStepChange(ChildRegistrationSteps.childEmergencyContactForm, {
                  formProp: 'careGiverContributionFormModel',
                  value: form,
                });
              }}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.childEmergencyContactForm}
            viewBannerWapper
          >
            <ChildEmergencyContactForm
              childEmergencyContactForm={
                formState.childEmergencyContactFormModel
              }
              childName={formState.childInformationFormModel?.firstname ?? ''}
              variation="practitioner"
              onSubmit={(form) => {
                onStepChange(
                  ChildRegistrationSteps.careGiverReferencePanelForm,
                  {
                    formProp: 'childEmergencyContactFormModel',
                    value: form,
                  }
                );
              }}
            />
          </Step>

          <Step
            stepKey={ChildRegistrationSteps.careGiverReferencePanelForm}
            viewBannerWapper
          >
            <CareGiverReferencePanelForm
              variation="practitioner"
              careGiverReferencePanelForm={
                formState.careGiverReferencePanelFormModel
              }
              onSubmit={(form) => {
                saveCaregiver(form);
              }}
            />
          </Step>
        </StepViewer>
      </IonContent>
      <Dialog
        className={'mb-16 px-4'}
        stretch
        visible={exitRegistrationPromptVisible}
        position={DialogPosition.Bottom}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to exit now?`}
          detailText={'If you exit now you will lose your progress.'}
          actionButtons={[
            {
              text: 'Exit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => exitRegistration(),
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => setExitRegistrationPromptVisible(false),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
};
