import { useDialog, useStepNavigation } from '@ecdlink/core';
import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';
import { ChildBasicInfo } from './child-basic-info/child-basic-info';
import { CaregiverLink } from './caregiver-link/caregiver-link';
import { StepViewer } from '../../../components/step-viewer/step-viewer';
import { Step } from '../../../components/step-viewer/components/step';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
enum PractitionerChildRegistrationSteps {
  childBasicDetails = 1,
  caregiverLink = 2,
}

export const PractitionerChildRegistration: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [childDetails, setChildDetails] = useState<ChildBasicInfoModel>();

  const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
    useStepNavigation(PractitionerChildRegistrationSteps.childBasicDetails);

  const onBasicChildInfoSubmitted = async (
    basicDetails: ChildBasicInfoModel
  ) => {
    setChildDetails(basicDetails);
    goToStep(PractitionerChildRegistrationSteps.caregiverLink);
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
                history.goBack();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Close',
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

  const onNewChild = () => {
    goBackOneStep();
  };

  return (
    <StepViewer
      title="Add a child"
      onBack={() => {
        if (canGoBack()) {
          goBackOneStep();
        } else {
          history.goBack();
        }
      }}
      activeStep={activeStepKey}
      onClose={exitRegistrationPrompt}
      isOnline={isOnline}
    >
      <Step
        stepKey={PractitionerChildRegistrationSteps.childBasicDetails}
        viewBannerWapper={true}
      >
        <ChildBasicInfo onSubmit={onBasicChildInfoSubmitted} />
      </Step>
      <Step
        stepKey={PractitionerChildRegistrationSteps.caregiverLink}
        viewBannerWapper={true}
      >
        {childDetails && (
          <CaregiverLink onNewChild={onNewChild} childDetails={childDetails} />
        )}
      </Step>
    </StepViewer>
  );
};
