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
import { DynamicForm, Question } from './dynamic-form';
import {
  careForBabySteps,
  careForMomSteps,
  getPillar1Steps,
  getPillar4Steps,
  pillar2Steps,
  pillar3Steps,
} from './steps';
import { nutritionQuestion } from './pillar-1-steps/nutrition';
import {
  breastfeedingIssuesCheckboxQuestion,
  breastfeedingIssuesCheckboxOptions,
} from './pillar-1-steps/nutrition/breast-milk-only-flow/breastfeeding-issues';

interface FormProps {
  onBack: () => void;
}

const sessionStorageKey = 'currentStepNumber';

export const Form = ({ onBack }: FormProps) => {
  const [isTip, setIsTip] = useState(false);
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>();

  const nutritionAnswer = questions?.find(
    (item) => item.question === nutritionQuestion
  )?.answer;
  const breastfeedingIssuesAnswers = questions?.find(
    (item) => item.question === breastfeedingIssuesCheckboxQuestion
  )?.answer as string[];

  const isToSkipBreastfeedingIssuesRelevantItemsStep =
    breastfeedingIssuesAnswers?.includes(
      breastfeedingIssuesCheckboxOptions.noneOption
    );

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  // TODO: add integration (G5.6.2)
  const isPillar4FollowUp = true;

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
        return careForMomSteps;
      case activitiesTypes.careForBaby:
        return careForBabySteps;
      case activitiesTypes.pillar1:
        return getPillar1Steps(
          nutritionAnswer,
          isToSkipBreastfeedingIssuesRelevantItemsStep
        );
      case activitiesTypes.pillar2:
        return pillar2Steps;
      case activitiesTypes.pillar3:
        return pillar3Steps;
      case activitiesTypes.pillar4:
        return getPillar4Steps(isPillar4FollowUp);
      default:
        return [() => <div className="p-4">Coming soon</div>];
    }
  }, [
    activityName,
    isPillar4FollowUp,
    isToSkipBreastfeedingIssuesRelevantItemsStep,
    nutritionAnswer,
  ]);

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
        setQuestions={setQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
      />
    </BannerWrapper>
  );
};
