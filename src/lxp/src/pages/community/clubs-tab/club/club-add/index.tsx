import { BannerWrapper, Button } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { PractitionerDto, useSnackbar } from '@ecdlink/core';
import { Step3 } from './steps/step-3';
import { ClubsRouteState } from '../../index.types';

interface MockedStep1 {}
export type Member = PractitionerDto | undefined;
interface MockedStep3 {}

export interface ClubAddProps {
  setStep1?: (step1: MockedStep1) => void;
  setStep2?: (step2: Member[]) => void;
  setStep3?: (step3: MockedStep3) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubAdd: React.FC = () => {
  const [step1, setStep1] = useState<MockedStep1>();
  const [step2, setStep2] = useState<Member[]>();
  const [step3, setStep3] = useState<MockedStep3>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const isFirstStep = step === 0;
  const isLastStep = step === 2;

  const history = useHistory();
  const params = useParams<ClubsRouteState>();

  const { showMessage } = useSnackbar();

  const onClose = () => {
    history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', params.clubId));
  };
  const onSubmit = () => {
    // TODO: call API
    console.log({ step1, step2, step3 });

    // TODO: move it to a success callback (useEffect)
    /////////////////////////////////
    showMessage({ message: '{clubName} club added', type: 'success' });
    onClose();
    /////////////////////////////////
  };

  const handleOnClick = () => {
    if (!isLastStep) {
      setStep((prevStep) => prevStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep(0);
  };

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a club"
      subTitle={`${step + 1} of 3`}
      onBack={handleOnBack}
    >
      {isFirstStep && (
        <Step1 setIsEnabledButton={setIsEnabledButton} setStep1={setStep1} />
      )}
      {step === 1 && (
        <Step2
          title="Add a club"
          setIsEnabledButton={setIsEnabledButton}
          setStep2={setStep2}
          hasSelectedPractitioners={false} // TODO: add real rule
        />
      )}
      {isLastStep && (
        <Step3 setIsEnabledButton={setIsEnabledButton} setStep3={setStep3} />
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
