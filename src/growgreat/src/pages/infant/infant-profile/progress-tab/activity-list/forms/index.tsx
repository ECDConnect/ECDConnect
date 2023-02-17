import { useCallback, useMemo, useState } from 'react';
import { useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfantById } from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { currentActivityKey } from '..';
import { activitiesTypes } from '../activities-list';
import { DynamicForm } from './dynamic-form';
import { careFormMomSteps } from './steps';

interface FormProps {
  onBack: () => void;
}

const sessionStorageKey = 'currentStepNumber';

export const Form = ({ onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const handleOnClose = useCallback(() => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            iconClassName="h-10 w-10"
            title="Are you sure you want to exit?"
            detailText="If you exit now you will lose your progress."
            actionButtons={[
              {
                colour: 'primary',
                text: 'Exit',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'LoginIcon',
                onClick: () => {
                  window.sessionStorage.removeItem(sessionStorageKey);
                  onClose();
                  onBack();
                },
              },
              {
                colour: 'primary',
                text: 'Continue editing',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'PencilIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog, onBack]);

  const handleOnBack = useCallback(() => {
    if (isTip) {
      return setIsTip(false);
    }

    if (step === 0) {
      return onBack();
    }

    return setStep((prevState) => prevState - 1);
  }, [isTip, onBack, step]);

  const handleOnNext = useCallback(() => {
    setStep((preState) => preState + 1);
  }, []);

  const currentSteps = useMemo(() => {
    switch (activityName) {
      case activitiesTypes.careForMom:
        return careFormMomSteps;
      default:
        return [() => <div className="p-4">Coming soon</div>];
    }
  }, [activityName]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={handleOnBack}
      onClose={handleOnClose}
      title={activityName}
      subTitle={`${step + 1} of ${currentSteps.length}`}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <DynamicForm
        name={activityName}
        steps={currentSteps}
        infant={infant}
        isTipPage={isTip}
        currentStep={step}
        setIsTip={setIsTip}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
      />
    </BannerWrapper>
  );
};
