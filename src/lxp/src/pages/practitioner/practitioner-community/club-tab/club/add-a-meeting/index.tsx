import ROUTES from '@/routes/routes';
import { BannerWrapper, Button, DialogPosition } from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { Step3 } from './steps/step-3';
import { Step1Props } from './index.types';
import { useDialog } from '@ecdlink/core';
import { AddCollageDialog } from '../../0-components/add-collage';

export const AddMeeting: React.FC = () => {
  const [step1, setStep1] = useState<Step1Props>();
  const [step2, setStep2] = useState<unknown>();
  const [step3, setStep3] = useState<unknown>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const history = useHistory();

  const dialog = useDialog();

  const isFirstStep = step === 0;
  const isSecondStep = step === 1;
  const isLastStep = step === 2;

  const isScheduleInCalendar = step1?.hasMeetingHappened === false;
  const isNext = !isLastStep && !isScheduleInCalendar;

  const onAddCollage = () => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <AddCollageDialog onClose={onClose} />;
      },
    });
  };

  const onSubmit = () => {
    console.log({ step1, step2, step3 });
    // TODO: put it inside a callback function (useEffect)
    onAddCollage();
  };

  const handleOnClick = () => {
    if (isNext) {
      setStep((prevStep) => prevStep + 1);
    } else {
      onSubmit();
    }
  };

  const onClose = () => {
    history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT);
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep((prevStep) => prevStep - 1);
  };

  const renderButtonInfo = useMemo((): { icon: string; text: string } => {
    if (isScheduleInCalendar) {
      return {
        icon: 'CalendarIcon',
        text: 'Schedule in calendar',
      };
    }

    if (isNext) {
      return {
        icon: 'ArrowCircleRightIcon',
        text: 'Next',
      };
    }

    return {
      icon: 'SaveIcon',
      text: 'Save',
    };
  }, [isNext, isScheduleInCalendar]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a meeting"
      subTitle={isScheduleInCalendar ? 'step 1 of 1' : `step ${step + 1} of 3`}
      onBack={handleOnBack}
    >
      {isFirstStep && (
        <Step1 setIsEnabledButton={setIsEnabledButton} setStep1={setStep1} />
      )}
      {isSecondStep && (
        <Step2 setIsEnabledButton={setIsEnabledButton} setStep2={setStep2} />
      )}
      {isLastStep && (
        <Step3 setIsEnabledButton={setIsEnabledButton} setStep1={setStep3} />
      )}
      <Button
        className="mt-auto"
        icon={renderButtonInfo.icon}
        type="filled"
        color="primary"
        textColor="white"
        text={renderButtonInfo.text}
        disabled={!isEnabledButton}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
