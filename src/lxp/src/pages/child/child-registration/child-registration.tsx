import {
  CaregiverDto,
  ChildDto,
  ContentConsentTypeEnum,
  SmartStartPointsLibrary,
  useDialog,
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
import { caregiverActions, caregiverThunkActions } from '@store/caregiver';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
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
import { practitionerSelectors } from '@/store/practitioner';
import { CaregiverMultipleChildrenModal } from '../components/caregiver-multiple-children-modal';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { pointsSelectors } from '@/store/points';
import { ClassDashboardRouteState } from '@/pages/business/business.types';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { PointsService } from '@/services/PointsService';
import { classroomsSelectors } from '@/store/classroom';
import { ChildEmergencyContactFormModel } from '@/schemas/child/child-registration/child-emergency-contact-form';

export const ChildRegistration: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const location = useLocation<ChildRegistrationRouteState>();
  const routeStep = location?.state?.step;
  const childId = location?.state?.childId;
  const childDetails = location?.state?.childDetails;
  const practitionerId = location?.state?.practitionerId;
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const consentList = useSelector(contentConsentSelectors.getConsent);
  const existingChild = useSelector(childrenSelectors.getChildById(childId));
  const authUser = useSelector(authSelectors.getAuthUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitionerUserId = practitioner?.userId;
  const isPrincipal = practitioner?.isPrincipal === true;
  const isTrainee = practitioner?.isTrainee;
  const isFromPqa = !!practitionerId;
  const isPractitioner = !!practitioner;
  const dialog = useDialog();

  const pointsLibraryRegisterChild = useSelector(
    pointsSelectors.getPointsLibraryById(SmartStartPointsLibrary.REGISTER_CHILD)
  );
  const existingClassroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(existingChild?.userId!)
  );
  const existingCaregiver = existingChild?.caregiver;

  const existingPhotoConsent = useSelector(
    userSelectors.getUserConsentByType(
      existingChild?.userId,
      ContentConsentTypeEnum.PhotoPermissions
    )
  );

  const existingInformation = useSelector(
    userSelectors.getUserConsentByType(
      existingChild?.userId,
      ContentConsentTypeEnum.PersonalInformationAgreement
    )
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
  const [isLoading, setIsLoading] = useState(false);

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

  // TODO: Remove this when onSaveChildAndCaregiver is done
  const saveChild = async (
    healthInformationForm: ChildHealthInformationFormModel
  ) => {
    if (!formState.childInformationFormModel) return;

    const userInputModel = childRegisterUtils.mapChildUserDto(
      formState.childInformationFormModel,
      formState.childExtraInformationFormModel,
      existingChild?.user
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

    // CONSENT
    if (formState.childRegistrationFormModel?.childPhotoConsentAccepted) {
      const photoPermissionConsent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.PhotoPermissions
      );

      if (photoPermissionConsent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          photoPermissionConsent,
          existingPhotoConsent?.id
        );
        appDispatch(userActions.createUserConsent(childPhotoConsent));
        if (isOnline) {
          appDispatch(userThunkActions.upsertUserConsents(childPhotoConsent));
        }
      }
    }

    if (
      formState.childRegistrationFormModel?.personalInformationAgreementAccepted
    ) {
      const personalConsent = consentList?.find(
        (x) => x.type === ContentConsentTypeEnum.PersonalInformationAgreement
      );
      if (personalConsent) {
        const childPersonalConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          personalConsent,
          existingInformation?.id
        );
        appDispatch(userActions.createUserConsent(childPersonalConsent));
        if (isOnline) {
          appDispatch(
            userThunkActions.upsertUserConsents(childPersonalConsent)
          );
        }
      }
    }
    // END CONSENT

    // TODO - refactor, this should just update the child in state directly
    // if (existingChild?.user) {
    //   appDispatch(childrenActions.updateChildUser(userInputModel));
    //   await appDispatch(
    //     childrenThunkActions.updateChildUser({
    //       id: userInputModel.id as string,
    //       childUser: userInputModel,
    //     })
    //   ).unwrap();
    // } else {
    //   // TODO check when we work on registration. I don't think we need the separate user state on the child store
    //   //appDispatch(childrenActions.createChildUser(userInputModel));
    //   await appDispatch(
    //     userThunkActions.addUser({ user: userInputModel })
    //   ).unwrap();
    // }

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

    // TODO - Learner should be created on initial child creation
    // if (existingLearner) {
    //   appDispatch(
    //     classroomsActions.updateClassroomGroupLearner(learnerInputModel)
    //   );
    //   await appDispatch(
    //     classroomsThunkActions.updateLearner({
    //       id: learnerInputModel.id as string,
    //       learner: learnerInputModel,
    //     })
    //   );
    // } else {
    //   appDispatch(
    //     classroomsActions.createClassroomGroupLearner(learnerInputModel)
    //   );
    //   await appDispatch(
    //     classroomsThunkActions.createLearner({ learner: learnerInputModel })
    //   ).unwrap();
    // }

    setCurrentChildInputModel(childInputModel);
  };

  const onFinished = () => {
    if (isFromPqa) {
      return dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onClose) => {
          return (
            <CaregiverMultipleChildrenModal
              title="Child registered!"
              onSubmit={() => {
                history.push(ROUTES.CHILD_REGISTRATION_LANDING);
                onClose();
              }}
              onCancel={() => {
                isPractitioner
                  ? history.push(ROUTES.CLASSROOM.ROOT, {
                      activeTabIndex: TabsItems.CLASSES,
                    } as ClassDashboardRouteState)
                  : history.push(ROUTES.COACH.PRACTITIONERS);
                onClose();
              }}
            />
          );
        },
      });
    } else {
      return dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onClose) => {
          return (
            <ActionModal
              customIcon={<Emoji3 className="mb-2" />}
              title={
                existingChild?.user
                  ? `${existingChild?.user.firstName}'s registration is complete, great job!`
                  : `This child's registration is complete, great job!`
              }
              detailText={`You earned ${pointsLibraryRegisterChild?.points} points`}
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Close',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'XCircleIcon',
                  onClick: () => {
                    if (isTrainee) {
                      history.push(ROUTES.CLASSROOM.ROOT, {
                        activeTabIndex: TabsItems.ATTENDANCE,
                      });
                    } else {
                      history.push(ROUTES.CLASSROOM.ROOT, {
                        activeTabIndex: TabsItemForPrincipal.ATTENDANCE,
                      });
                    }
                    onClose();
                  },
                },
              ]}
            />
          );
        },
      });
    }
  };

  // TODO: Remove this when onSaveChildAndCaregiver is done
  const saveCaregiver = async (
    caregiverReferencePanelForm: CareGiverReferencePanelFormModel
  ) => {
    if (!formState.childInformationFormModel) return;
    setIsLoading(true);
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

    // TODO - should just update with child
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
    childInputModel.workflowStatusId = childStatusId || undefined;
    childInputModel.insertedBy = user?.fullName;

    await updateChild(childInputModel);

    // Call BE to add points for registering child
    if (!!userAuth && !!user) {
      await new PointsService(userAuth.auth_token).addChildRegistrationPoints(
        user.id!
      );
    }

    setIsLoading(false);
    onFinished();
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
          await appDispatch(childrenThunkActions.getChildren({})).unwrap();
        };
        updatePrincipalChildren();
      }
      updateGrants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendGrants]);

  const updateChild = async (child: ChildDto) => {
    if (!child) return;

    appDispatch(childrenActions.updateChild(child));
    await appDispatch(
      childrenThunkActions.updateChild({ child: child, id: String(child.id) })
    ).unwrap();
    setSendGrants(true);
  };

  const onSaveChildAndCaregiver = async (
    childEmergencyContactFormModel: ChildEmergencyContactFormModel
  ) => {
    const userInputModel = childRegisterUtils.mapChildUserDto(
      formState.childInformationFormModel!,
      formState.childExtraInformationFormModel,
      existingChild?.user
    );

    const userId = userInputModel.id || '';

    const childStatusId = getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildActive
    );

    const childInputModel = childRegisterUtils.mapChildDto(
      userId,
      childStatusId!,
      formState.childHealthInformationFormModel,
      formState.childExtraInformationFormModel,
      existingChild
    );

    const caregiverSiteAddressDto = childRegisterUtils.mapSiteAddressDto(
      formState.careGiverChildInformationFormModel,
      existingCaregiver?.siteAddress
    );

    const caregiverDto = childRegisterUtils.mapCaregiverDto(
      formState.careGiverInformationFormModel,
      caregiverSiteAddressDto,
      formState.careGiverExtraInformationFormModel,
      childEmergencyContactFormModel,
      {} as CareGiverReferencePanelFormModel,
      formState.careGiverContributionFormModel,
      existingCaregiver
    );

    const child: ChildDto = {
      ...childInputModel,
      isActive: true,
      user: {
        ...userInputModel,
        isActive: true,
      },
      caregiverId: caregiverDto.id,
      caregiver: caregiverDto,
      insertedBy: user?.fullName,
    };

    updateChild(child);

    if (formState.childRegistrationFormModel?.childPhotoConsentAccepted) {
      const photoPermissionConsent = consentList?.find(
        (x) => x.name === ContentConsentTypeEnum.PhotoPermissions
      );

      if (photoPermissionConsent) {
        const childPhotoConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          photoPermissionConsent,
          existingPhotoConsent?.id
        );
        // TODO: check if the sync is correct
        appDispatch(userActions.createUserConsent(childPhotoConsent));
        if (isOnline) {
          appDispatch(userThunkActions.upsertUserConsents(childPhotoConsent));
        }
      }
    }

    if (
      formState.childRegistrationFormModel?.personalInformationAgreementAccepted
    ) {
      const personalConsent = consentList?.find(
        (x) => x.name === ContentConsentTypeEnum.PersonalInformationAgreement
      );
      if (personalConsent) {
        const childPersonalConsent = mapUserConsentDto(
          user?.id ?? '',
          userId,
          personalConsent,
          existingInformation?.id
        );

        // TODO: check if the sync is correct
        appDispatch(userActions.createUserConsent(childPersonalConsent));
        if (isOnline) {
          appDispatch(
            userThunkActions.upsertUserConsents(childPersonalConsent)
          );
        }
      }
    }

    onFinished();
  };

  // INFO: Not included in WL
  // const saveChildBirthCertificate = async (
  //   birthCertificateForm: ChildBirthCertificateFormModel
  // ) => {
  //   if (!birthCertificateForm?.birthCertificateImage) return;

  //   const fileName = `${birthCertificateForm.birthCertificateType}.png`;

  //   const documentStatusId = await getWorkflowStatusIdByEnum(
  //     WorkflowStatusEnum.DocumentPendingVerification
  //   );

  //   const fileType =
  //     birthCertificateForm?.birthCertificateType === 'clinicCard'
  //       ? FileTypeEnum.ChildClinicCard
  //       : FileTypeEnum.ChildBirthCertificate;

  //   const typeId = await getDocumentTypeIdByEnum(fileType);

  //   const documentInputModel = childRegisterUtils.mapDocumentDto(
  //     existingChild?.user?.id || '',
  //     fileName,
  //     documentStatusId || '',
  //     typeId || '',
  //     fileType,
  //     birthCertificateForm.birthCertificateImage,
  //     user
  //   );

  //   appDispatch(documentActions.createDocument(documentInputModel));
  //   await appDispatch(
  //     documentThunkActions.createDocument(documentInputModel)
  //   ).unwrap();
  // };

  const exitRegistrationPrompt = () => {
    setExitRegistrationPromptVisible(true);
  };

  const exitRegistration = () => {
    history.goBack();
  };

  useEffect(() => {
    let updatedFormState = { ...formState };
    if (existingChild && routeStep && existingChild?.user) {
      const userDob = existingChild?.user?.dateOfBirth
        ? new Date(existingChild?.user?.dateOfBirth)
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
          firstname: existingChild?.user?.firstName || '',
          surname: existingChild?.user?.surname || '',
          childIdField: existingChild?.user?.idNumber || '',
          playgroupId: existingClassroomGroup?.id || '',
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
          playgroupId: existingClassroomGroup?.id || '',
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
                onStepChange(
                  ChildRegistrationSteps.childCareGiverInformationForm,
                  {
                    formProp: 'childHealthInformationFormModel',
                    value: form,
                  }
                );
                // saveChild(form);
              }}
            />
          </Step>
          {/* Not included in WL */}
          {/* <Step
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
          </Step> */}

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
              caregiverFirstName={
                formState.careGiverInformationFormModel?.firstname
              }
              careGiverExtraInformation={
                formState.careGiverExtraInformationFormModel
              }
              onSubmit={(form) => {
                onStepChange(ChildRegistrationSteps.childEmergencyContactForm, {
                  formProp: 'careGiverExtraInformationFormModel',
                  value: form,
                });
              }}
            />
          </Step>

          {/* <Step
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
          </Step> */}

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
                onSaveChildAndCaregiver(form);
              }}
            />
          </Step>
          {/* 
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
              isLoading={isLoading}
            />
          </Step> */}
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
