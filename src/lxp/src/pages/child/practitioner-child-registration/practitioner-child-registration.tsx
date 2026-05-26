import { useDialog, useStepNavigation } from '@ecdlink/core';
import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';
import { ChildBasicInfo } from './child-basic-info/child-basic-info';
import { StepViewer } from '../../../components/step-viewer/step-viewer';
import { Step } from '../../../components/step-viewer/components/step';
enum PractitionerChildRegistrationSteps {
  childBasicDetails = 1,
  caregiverLink = 2,
}

export const PractitionerChildRegistration: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const [childDetails, setChildDetails] = useState<ChildBasicInfoModel>();

  const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
    useStepNavigation(PractitionerChildRegistrationSteps.childBasicDetails);

  const onBasicChildInfoSubmitted = async (
    basicDetails: ChildBasicInfoModel
  ) => {
    setChildDetails(basicDetails);
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
    >
      <Step
        stepKey={PractitionerChildRegistrationSteps.childBasicDetails}
        viewBannerWapper={true}
      >
        <ChildBasicInfo onSubmit={onBasicChildInfoSubmitted} />
      </Step>
    </StepViewer>
  );
};
