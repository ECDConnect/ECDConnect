import { useDialog, useStepNavigation } from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { Step } from '../../../components/step-viewer/components/step';
import { StepViewer } from '../../../components/step-viewer/step-viewer';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { CareGiverChildInformationForm } from '../child-registration/care-giver-child-information-form/care-giver-child-information-form';
import { CareGiverExtraInformationForm } from '../child-registration/care-giver-extra-information/care-giver-extra-information';
import { CareGiverInformationForm } from '../child-registration/care-giver-information-form/care-giver-information-form';
import { ChildEmergencyContactForm } from '../child-registration/child-emergency-contact-form/child-emergency-contact-form';
import { ChildExtraInformationForm } from '../child-registration/child-extra-information-form/child-extra-information-form';
import { ChildHealthInformationForm } from '../child-registration/child-health-information-form/child-health-information-form';
import { ChildInformationForm } from '../child-registration/child-information-form/child-information-form';
import { ChildRegistrationForm } from '../child-registration/child-registration-form/child-registration-form';
import { WelcomeChildRegistration } from './welcome-child-registration/welcome-child-registration';
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { useAppDispatch } from '@store';
import {
  CaregiverChildRegistrationProps,
  CaregiverChildRegistrationSteps,
} from './caregiver-child-registration.types';
import { CompletedCaregiverChildRegistration } from './completed-caregiver-child-registration/completed-caregiver-child-registration';
import { childrenThunkActions } from '@store/children';
import { ChildRegistrationFormState, StateAction } from '@models/child/child';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { staticDataThunkActions } from '@store/static-data';
import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useStaticData } from '@hooks/useStaticData';
import { WorkflowStatusEnum, FileTypeEnum } from '@ecdlink/graphql';
import { contentConsentThunkActions } from '@store/content/consent';
import { ChildEmergencyContactFormModel } from '@/schemas/child/child-registration/child-emergency-contact-form';
import { CareGiverContributionFormModel } from '@/schemas/child/child-registration/care-giver-contribution-form';
import Loader from '@/components/loader/loader';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const CaregiverChildRegistration: React.FC<
  CaregiverChildRegistrationProps
> = ({ childDetails, caregiverAuthToken }) => {
  const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
    useStepNavigation(CaregiverChildRegistrationSteps.welcome);
  const [staticDataLoading, setStaticDataLoading] = useState(false);
  const appDispatch = useAppDispatch();
  const [formState, setFormState] = useState<ChildRegistrationFormState>({});
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const { getWorkflowStatusIdByEnum } = useStaticData();

  const initAppData = async () => {
    setStaticDataLoading(true);
    await appDispatch(
      contentConsentThunkActions.getConsent({ locale: 'en-za' })
    ).unwrap();
    await appDispatch(staticDataThunkActions.getRelations({})).unwrap();
    await appDispatch(staticDataThunkActions.getProgrammeTypes({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getProgrammeAttendanceReasons({})
    ).unwrap();
    await appDispatch(staticDataThunkActions.getGenders({})).unwrap();
    await appDispatch(staticDataThunkActions.getRaces({})).unwrap();
    await appDispatch(staticDataThunkActions.getLanguages({})).unwrap();
    await appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getHolidays({ year: new Date().getFullYear() })
    ).unwrap();
    await appDispatch(staticDataThunkActions.getProvinces({})).unwrap();
    await appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap();
    await appDispatch(staticDataThunkActions.getGrants({})).unwrap();
    await appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap();
    setStaticDataLoading(false);
  };
  const { getDocumentTypeIdByEnum } = useStaticData();

  const { isLoading, wasLoading, isFulfilled } = useThunkFetchCall(
    'children',
    ChildrenActions.OPEN_ACCESS_ADD_CHILD
  );

  useEffect(() => {
    const initStore = async () => {
      await initAppData();
    };

    initFormData();
    initStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initFormData = () => {
    setFormState({
      ...formState,
      childInformationFormModel: {
        firstname: childDetails.child.firstname,
        surname: childDetails.child.surname,
        dobDay: 0,
        dobMonth: 0,
        dobYear: 0,
        playgroupId: '',
      },
    });
  };

  const exitRegistrationPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
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
              onClick: () => {
                onSubmit();
                goToStep(CaregiverChildRegistrationSteps.welcome);
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  const onStepChange = (step: number, action?: StateAction) => {
    goToStep(step);
    if (action) {
      setFormState({ ...formState, [action.formProp]: action.value });
    }
  };

  const saveChild = async (
    childEmergencyContactFormModel: ChildEmergencyContactFormModel
  ) => {
    if (!formState.childInformationFormModel) return;

    let userInputModel = childRegisterUtils.mapChildUserDto(
      formState.childInformationFormModel
    );

    if (childDetails.child.userId) {
      userInputModel = {
        ...userInputModel,
        id: childDetails.child.userId,
      };
    }
    const userId = userInputModel.id || '';

    const userConsentInputModel =
      childRegisterUtils.mapAddChildUserConsentTokenModelInput(
        userId,
        formState.childRegistrationFormModel
      );

    let registrationInputModel;

    if (formState.childBirthCertificateFormModel?.birthCertificateImage) {
      const fileType =
        formState.childBirthCertificateFormModel?.birthCertificateType ===
        'clinicCard'
          ? FileTypeEnum.ChildClinicCard
          : FileTypeEnum.ChildBirthCertificate;

      const typeId = getDocumentTypeIdByEnum(fileType);

      registrationInputModel =
        childRegisterUtils.mapAddChildRegistrationTokenModelInput(
          userId,
          typeId || '',
          formState.childBirthCertificateFormModel
        );
    }

    const siteAddress =
      childRegisterUtils.mapAddChildSiteAddressTokenModelInput(
        formState.careGiverChildInformationFormModel
      );

    const caregiverInput =
      childRegisterUtils.mapAddChildCaregiverTokenModelInput(
        formState.careGiverInformationFormModel,
        formState.careGiverExtraInformationFormModel,
        childEmergencyContactFormModel,
        {} as CareGiverReferencePanelFormModel,
        {} as CareGiverContributionFormModel
      );

    const childExternalWorflowStatusId = getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildActive
    );

    const childInputModel = childRegisterUtils.mapAddChildTokenModelInput(
      userId,
      formState.childInformationFormModel,
      formState.childHealthInformationFormModel,
      formState.childExtraInformationFormModel,
      childExternalWorflowStatusId
    );

    await appDispatch(
      childrenThunkActions.openAccessAddChild({
        token: caregiverAuthToken,
        caregiver: caregiverInput,
        child: childInputModel,
        siteAddress: siteAddress,
        registration: registrationInputModel,
        userConsent: userConsentInputModel,
      })
    );
  };

  if (staticDataLoading) return <Loader />;

  if (!isLoading && wasLoading && isFulfilled) {
    return <CompletedCaregiverChildRegistration childDetails={childDetails} />;
  }

  return (
    <StepViewer
      title="Child registration"
      onBack={() => {
        if (canGoBack()) goBackOneStep();
      }}
      activeStep={activeStepKey}
      onClose={exitRegistrationPrompt}
      isOnline={isOnline}
    >
      <Step
        stepKey={CaregiverChildRegistrationSteps.welcome}
        viewBannerWapper={false}
        isIntermission={true}
      >
        <WelcomeChildRegistration
          childDetails={childDetails}
          onSubmit={() =>
            onStepChange(CaregiverChildRegistrationSteps.registrationForm)
          }
        />
      </Step>

      <Step
        stepKey={CaregiverChildRegistrationSteps.registrationForm}
        viewBannerWapper={true}
      >
        <ChildRegistrationForm
          variation="caregiver"
          onSubmit={(value) =>
            onStepChange(CaregiverChildRegistrationSteps.childInformationForm, {
              formProp: 'childRegistrationFormModel',
              value,
            })
          }
          childRegisterForm={formState.childRegistrationFormModel}
        />
      </Step>

      <Step
        stepKey={CaregiverChildRegistrationSteps.childInformationForm}
        viewBannerWapper={true}
      >
        <ChildInformationForm
          variation="caregiver"
          onSubmit={(value) =>
            onStepChange(
              CaregiverChildRegistrationSteps.childExtraInformationForm,
              {
                formProp: 'childInformationFormModel',
                value,
              }
            )
          }
          childInformation={formState.childInformationFormModel}
        />
      </Step>

      <Step
        stepKey={CaregiverChildRegistrationSteps.childExtraInformationForm}
        viewBannerWapper={true}
      >
        <ChildExtraInformationForm
          childName={formState.childInformationFormModel?.firstname ?? ''}
          childExtraInformation={formState.childExtraInformationFormModel}
          onSubmit={(value) =>
            onStepChange(
              CaregiverChildRegistrationSteps.childHealthInformationForm,
              {
                formProp: 'childExtraInformationFormModel',
                value,
              }
            )
          }
        />
      </Step>

      <Step
        stepKey={CaregiverChildRegistrationSteps.childHealthInformationForm}
        viewBannerWapper={true}
      >
        <ChildHealthInformationForm
          childName={formState.childInformationFormModel?.firstname ?? ''}
          childHealthInformation={formState.childHealthInformationFormModel}
          onSubmit={(value) => {
            onStepChange(
              CaregiverChildRegistrationSteps.childCareGiverInformationForm,
              {
                formProp: 'childHealthInformationFormModel',
                value,
              }
            );
          }}
        />
      </Step>
      <Step
        stepKey={CaregiverChildRegistrationSteps.childCareGiverInformationForm}
        viewBannerWapper={true}
      >
        <CareGiverInformationForm
          careGiverInformation={formState.careGiverInformationFormModel}
          onSubmit={(value) =>
            onStepChange(
              CaregiverChildRegistrationSteps.childCareGiverChildInformationForm,
              {
                formProp: 'careGiverInformationFormModel',
                value,
              }
            )
          }
          childName={formState.childInformationFormModel?.firstname ?? ''}
        />
      </Step>

      <Step
        stepKey={
          CaregiverChildRegistrationSteps.childCareGiverChildInformationForm
        }
        viewBannerWapper={true}
      >
        <CareGiverChildInformationForm
          careGiverInformation={formState.careGiverChildInformationFormModel}
          onSubmit={(value) =>
            onStepChange(
              CaregiverChildRegistrationSteps.childCareGiverExtraInformationForm,
              {
                formProp: 'careGiverChildInformationFormModel',
                value,
              }
            )
          }
        />
      </Step>

      <Step
        stepKey={
          CaregiverChildRegistrationSteps.childCareGiverExtraInformationForm
        }
        viewBannerWapper={true}
      >
        <CareGiverExtraInformationForm
          careGiverExtraInformation={
            formState.careGiverExtraInformationFormModel
          }
          onSubmit={(value) =>
            onStepChange(
              CaregiverChildRegistrationSteps.childEmergencyContactForm,
              {
                formProp: 'careGiverExtraInformationFormModel',
                value,
              }
            )
          }
        />
      </Step>

      <Step
        stepKey={CaregiverChildRegistrationSteps.childEmergencyContactForm}
        viewBannerWapper={true}
      >
        <ChildEmergencyContactForm
          childEmergencyContactForm={formState.childEmergencyContactFormModel}
          childName={formState.childInformationFormModel?.firstname ?? ''}
          variation="caregiver"
          onSubmit={(value) => {
            saveChild(value);
          }}
        />
      </Step>
      <Step
        stepKey={CaregiverChildRegistrationSteps.outro}
        viewBannerWapper={false}
        isIntermission={true}
      >
        <CompletedCaregiverChildRegistration childDetails={childDetails} />
      </Step>
    </StepViewer>
  );
};
