import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { Step1 } from './components/step1/step1';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { setuOrgSchema, setupOrgValues } from '../../../schemas/setup-org';
import { useTheme } from '@ecdlink/core';
import { Step2 } from './components/step2/step2';
import { Step3 } from './components/step3/step3';

export const SetupOrgForm = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const renderButtonText = useMemo(() => (step < 8 ? 'Next' : 'Save'), [step]);
  const renderButtonIcon = useMemo(
    () => (step < 8 ? 'ArrowCircleRightIcon' : 'SaveIcon'),
    [step]
  );

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(setuOrgSchema),
    defaultValues: setupOrgValues,
    mode: 'onChange',
  });
  const { errors } = formState;

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      console.log('savinnnggg.....');
    }
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <Step2 setValue={setValue} register={register} errors={errors} />
        );
      case 3:
        return (
          <Step3 setValue={setValue} register={register} errors={errors} />
        );
      default:
        return (
          <Step1 setValue={setValue} register={register} errors={errors} />
        );
    }
  };
  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
      backgroundColour={'white'}
      onBack={() => {}}
    >
      <div className="p-24">
        <Typography type="h1" color="textDark" text={`Step ${step} of 8`} />
        <div>{renderStep(step)}</div>
        <Button
          className="mt-8 w-3/12 rounded-2xl"
          icon={renderButtonIcon}
          type="filled"
          color="secondary"
          textColor="white"
          text={renderButtonText}
          onClick={() => handleNextStep()}
        />
      </div>
    </BannerWrapper>
  );
};
