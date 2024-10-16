import {
  ChildDto,
  ContentConsentTypeEnum,
  SmartStartPointsLibrary,
  useDialog,
  useStepNavigation,
} from '@ecdlink/core';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
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
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
import { contentConsentSelectors } from '@store/content/consent';
import { userActions, userSelectors, userThunkActions } from '@store/user';
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { mapUserConsentDto } from '@utils/user/user-consent.utils';
import { CareGiverChildInformationForm } from './care-giver-child-information-form/care-giver-child-information-form';
import { CareGiverExtraInformationForm } from './care-giver-extra-information/care-giver-extra-information';
import { CareGiverInformationForm } from './care-giver-information-form/care-giver-information-form';
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
import { authSelectors } from '@store/auth';
import { practitionerSelectors } from '@/store/practitioner';
import { CaregiverMultipleChildrenModal } from '../components/caregiver-multiple-children-modal';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { pointsSelectors } from '@/store/points';
import { ClassDashboardRouteState } from '@/pages/business/business.types';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { PointsService } from '@/services/PointsService';
import { classroomsSelectors } from '@/store/classroom';
import { ChildEmergencyContactFormModel } from '@/schemas/child/child-registration/child-emergency-contact-form';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';

export const ChildRegistration: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { getWorkflowStatusIdByEnum } = useStaticData();
  const location = useLocation<ChildRegistrationRouteState>();
  const routeStep = location?.state?.step;
  const childId = location?.state?.childId;
  const notificationReference = location?.state?.notificationReference;
  const childDetails = location?.state?.childDetails;
  const practitionerId = location?.state?.practitionerId;
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const consentList = useSelector(contentConsentSelectors.getConsent);
  const existingChild = useSelector(childrenSelectors.getChildById(childId));
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isFromPqa = !!practitionerId;
  const isPractitioner = !!practitioner;
  const dialog = useDialog();
  const notifications = useSelector(notificationsSelectors.getAllNotifications);

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

  const [formState, setFormState] = useState<ChildRegistrationFormState>({});

  const onStepChange = (step: number, action?: StateAction) => {
    goToStep(step);
    if (action) {
      setFormState({ ...formState, [action.formProp]: action.value });
    }
  };

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
              actionButtons={[
                {
                  colour: 'quatenary',
                  text: 'Close',
                  textColour: 'quatenary',
                  type: 'outlined',
                  leadingIcon: 'XCircleIcon',
                  onClick: () => {
                    history.push(ROUTES.CLASSROOM.ROOT, {
                      activeTabIndex: TabsItems.CLASSES,
                    });

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

  const updateChild = async (child: ChildDto) => {
    if (!child) return;

    appDispatch(childrenActions.updateChild(child));
    await appDispatch(
      childrenThunkActions.updateChild({ child: child, id: String(child.id) })
    ).unwrap();
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
      userId: userId,
      isActive: true,
      user: {
        ...userInputModel,
        isActive: true,
      },
      caregiver: caregiverDto,
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

        appDispatch(userActions.createUserConsent(childPersonalConsent));
        if (isOnline) {
          appDispatch(
            userThunkActions.upsertUserConsents(childPersonalConsent)
          );
        }
      }
    }

    const hasNotification = notifications?.find(
      (item) => item?.message?.reference === notificationReference
    );

    if (hasNotification) {
      appDispatch(notificationActions.removeNotification(hasNotification!));
    }

    onFinished();
  };

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
              colour: 'quatenary',
              type: 'filled',
              onClick: () => exitRegistration(),
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'quatenary',
              colour: 'quatenary',
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
