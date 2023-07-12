import { useCallback, useMemo, useState } from 'react';
import { DynamicForm, SectionQuestions } from './dynamic-form';
import { useSelector } from 'react-redux';
import { getUser } from '@/store/user/user.selectors';
import { selfAssessmentSteps } from './steps';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';

export const visitIdKey = 'practitionerVisitId';
export const currentActivityKey = 'practitionerSelectedFormOption';

interface FormProps {
  visitId?: string;
  onBack: () => void;
}

export const Form = ({ visitId, onBack }: FormProps) => {
  const [isSecondaryPage, setIsSecondaryPage] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const { isOnline } = useOnlineStatus();

  const user = useSelector(getUser);

  const dialog = useDialog();

  const handleOnBack = useCallback(() => {
    if (isSecondaryPage) {
      return setIsSecondaryPage(false);
    }

    if (step === 0) {
      return onBack();
    }

    return setStep((prevState) => prevState - 1);
  }, [isSecondaryPage, onBack, step]);

  const handleOnNext = useCallback(() => {
    setStep((preState) => preState + 1);
  }, []);

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

  const handleOnSubmit = () => {
    console.log('Submitting...', sectionQuestions);
  };

  const currentSteps = useMemo(() => {
    setTitle('Self-assessment');
    return selfAssessmentSteps;
  }, []);
  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={handleOnBack}
      onClose={handleOnClose}
      title={`${title || activityName}`}
      subTitle={`step ${step + 1} of ${currentSteps.length}`}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <DynamicForm
        name={activityName}
        steps={currentSteps}
        smartStarter={user}
        isSecondaryPage={isSecondaryPage}
        currentStep={step}
        setIsSecondaryPage={setIsSecondaryPage}
        setSectionQuestions={setSectionQuestions}
        onPreviousStep={handleOnBack}
        onNextStep={handleOnNext}
        onClose={onBack}
        onSubmit={handleOnSubmit}
        isLoading={false}
      />
    </BannerWrapper>
  );
};
