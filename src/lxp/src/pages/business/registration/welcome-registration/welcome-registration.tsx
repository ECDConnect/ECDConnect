import { ActionModal, ComponentBaseProps, DialogPosition } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { SubsidyStep } from './components/step1/subsidyStep';
import { CertificateStep } from './components/step2/certificateStep';
import {
  initialWelcomeMessageModel,
  WelcomeMessageModel,
  welcomeMessageSchema,
} from './welcome-registration-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { StepViewer } from '@/components/step-viewer/step-viewer';
import { RegistrationSteps } from '../registration.types';
import { useStepNavigation } from '@ecdlink/core/lib/hooks/useStepNavigation';
import { useDialog } from '@ecdlink/core/lib/services/dialog/DialogService';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '../../business.types';
import { Step } from '@/components/step-viewer/components/step';
import { WelcomeStep } from './components/welcome/welcome-step';
import { ChallengesStep } from './components/step3/challengesStep';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface WelcomeRegistrationProps extends ComponentBaseProps {
  onSubmit: (value: WelcomeMessageModel) => void;
}

export const WelcomeRegistration: React.FC<WelcomeRegistrationProps> = ({
  onSubmit,
}) => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  const { setValue, watch } = useForm<WelcomeMessageModel>({
    resolver: yupResolver(welcomeMessageSchema),
    mode: 'onChange',
    defaultValues: initialWelcomeMessageModel,
  });

  const {
    subsidy,
    registration,
    challenge,
    problem,
    certificates,
    otherDetail,
  } = watch();

  const [hasStarted, setHasStarted] = useState(false);

  const { activeStepKey, canGoBack, goBackOneStep, goToStep } =
    useStepNavigation(RegistrationSteps.subsidy); // Start stepper at subsidy (now Step 1)

  useEffect(() => {
    if (!isOnline) {
      openOfflineDialog();
    }
  }, [isOnline]);

  const openOfflineDialog = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onClose) => (
        <OnlineOnlyModal
          onSubmit={() => {
            history.replace(ROUTES.BUSINESS, {
              activeTabIndex: BusinessTabItems.STAFF,
            });
            onClose();
          }}
        />
      ),
    });
  }, [dialog, history]);

  const exitRegistrationPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose, onCancel) => (
        <ActionModal
          className="z-50"
          customIcon={
            <ExclamationCircleIcon className="text-alertMain mb-4 h-10 w-10" />
          }
          title={`Are you sure you want to exit?`}
          detailText={'If you exit now your changes will not be saved.'}
          actionButtons={[
            {
              text: 'Exit',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                onClose();
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.REGISTRATION,
                });
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  const handleStartRegistration = () => {
    setHasStarted(true);
  };

  const getNextStepAfterSubsidy = () => {
    if (subsidy === 'true') {
      return RegistrationSteps.challenges;
    }

    const needsCertificateInfo =
      registration === 'No - I started the process of registering' ||
      registration === 'No - I have not started the process of registering' ||
      registration === "I'm not sure";

    return needsCertificateInfo
      ? RegistrationSteps.certificate
      : RegistrationSteps.challenges;
  };

  if (!hasStarted) {
    return <WelcomeStep onNext={handleStartRegistration} />;
  }

  return (
    <StepViewer
      title="DBE registration helper"
      onBack={() => {
        canGoBack()
          ? goBackOneStep()
          : history.push(ROUTES.BUSINESS, {
              activeTabIndex: BusinessTabItems.REGISTRATION,
            });
      }}
      activeStep={activeStepKey}
      onClose={exitRegistrationPrompt}
      isOnline={isOnline}
      showOfflineCard={false}
    >
      <Step stepKey={RegistrationSteps.subsidy} viewBannerWapper={true}>
        <SubsidyStep
          onNext={() => goToStep(getNextStepAfterSubsidy())}
          setValue={setValue}
          subsidy={subsidy}
          registration={registration}
        />
      </Step>

      <Step stepKey={RegistrationSteps.certificate} viewBannerWapper={true}>
        <CertificateStep
          onNext={() => goToStep(RegistrationSteps.challenges)}
          setValue={setValue}
          initialCertificates={certificates ?? []}
        />
      </Step>

      <Step stepKey={RegistrationSteps.challenges} viewBannerWapper={true}>
        <ChallengesStep
          onSubmit={() =>
            onSubmit({
              subsidy,
              challenge,
              problem,
              certificates,
              registration,
              otherDetail,
            })
          }
          setValue={setValue}
        />
      </Step>
    </StepViewer>
  );
};
