import ROUTES from '@/routes/routes';
import { BannerWrapper, Button } from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { Step3 } from './steps/step-3';
import { useSnackbar } from '@ecdlink/core';

export const AddAFamilyDayEvent: React.FC = () => {
  const [step1, setStep1] = useState<unknown>();
  const [step2, setStep2] = useState<unknown>();
  const [step3, setStep3] = useState<unknown>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const history = useHistory();
  const { showMessage } = useSnackbar();

  const isFirstStep = step === 0;
  const isSecondStep = step === 1;
  const isLastStep = step === 2;

  const isNext = !isLastStep;

  const onSubmit = () => {
    console.log({ step1, step2, step3 });

    /////////////////////////////////////////////////////////////
    // TODO: put it inside a callback function (useEffect)
    history.push(ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT);
    showMessage({ message: 'Event added!' });
    /////////////////////////////////////////////////////////////
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

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a family day event"
      subTitle={`step ${step + 1} of 3`}
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
        icon={!isLastStep ? 'ArrowCircleRightIcon' : 'SaveIcon'}
        type="filled"
        color="primary"
        textColor="white"
        text={!isLastStep ? 'Next' : 'Save'}
        disabled={!isEnabledButton}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
