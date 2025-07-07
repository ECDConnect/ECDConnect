import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { Step1 } from './components/step1/step1';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { setuOrgSchema, setupOrgValues } from '../../../schemas/setup-org';
import { Config, useTheme } from '@ecdlink/core';
import { Step2 } from './components/step2/step2';
import { Step3 } from './components/step3/step3';
import { Step4 } from './components/step4/step4';
import { Step5 } from './components/step5/step5';
import { Step6 } from './components/step6/step6';
import { Step7 } from './components/step7/step7';
import { Step8 } from './components/step8/step8';
import { AddTenantSetupInfo } from '../../../services/auth.service';
import { ConfirmationScreen } from './components/confirmation-screen/confirmation-screen';
import { useHistory } from 'react-router';
import ROUTES from '../../../routes/app.routes-constants';

export const SetupOrgForm = () => {
  const { theme } = useTheme();
  const history = useHistory();
  const [step, setStep] = useState(1);
  const renderButtonText = useMemo(
    () => (step < 8 ? 'Next' : 'Confirm & save'),
    [step]
  );
  const renderButtonIcon = useMemo(
    () => (step < 8 ? 'ArrowCircleRightIcon' : 'SaveIcon'),
    [step]
  );
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmationScreen, setOpenConfirmationScreen] = useState(false);

  const { register, getValues, setValue, formState, control } = useForm({
    resolver: yupResolver(setuOrgSchema),
    defaultValues: setupOrgValues,
    mode: 'onChange',
  });
  const { errors } = formState;

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    }
  };

  const handleSte4NextStep = () => {
    setValue('primaryColor', '#27385A');
    setValue('secondaryColor', '#FF2180');
    setValue('tertiaryColor', '#83BB26');

    if (step < 8) {
      setStep(step + 1);
    }
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      history.push(ROUTES.SETUP_ORG);
    }
  };

  const addNewTenant = useCallback(async () => {
    setIsLoading(true);
    const addNewTenant = await AddTenantSetupInfo(
      Config.authApi,
      JSON.stringify(getValues())
    );

    if (addNewTenant?.id) {
      setOpenConfirmationScreen(true);
    }
    setIsLoading(false);
  }, [getValues]);

  const renderStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <Step2
            setValue={setValue}
            register={register}
            errors={errors}
            setDisableButton={setDisableButton}
            getValues={getValues}
            control={control}
          />
        );
      case 3:
        return (
          <Step3
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
          />
        );
      case 4:
        return (
          <Step4
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            control={control}
            setDisableButton={setDisableButton}
          />
        );
      case 5:
        return (
          <Step5
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            setDisableButton={setDisableButton}
            control={control}
          />
        );
      case 6:
        return (
          <Step6
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            control={control}
            setDisableButton={setDisableButton}
          />
        );
      case 7:
        return (
          <Step7
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            control={control}
            setDisableButton={setDisableButton}
          />
        );
      case 8:
        return (
          <Step8
            setValue={setValue}
            register={register}
            errors={errors}
            getValues={getValues}
            control={control}
            setDisableButton={setDisableButton}
            setStep={setStep}
          />
        );
      default:
        return (
          <Step1
            setValue={setValue}
            register={register}
            errors={errors}
            control={control}
            setDisableButton={setDisableButton}
          />
        );
    }
  };

  return (
    <BannerWrapper
      size={'small'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      menuLogoUrl={theme?.images?.logoUrl}
      backgroundColour={'white'}
      onBack={handleGoBack}
      hasDecoratedBackButton={true}
    >
      <div className="p-24">
        <Typography type="h1" color="textDark" text={`Step ${step} of 8`} />
        <div>{renderStep(step)}</div>
        <div className="flex gap-4">
          <Button
            className="mt-8 w-3/12 rounded-2xl"
            icon={renderButtonIcon}
            type="filled"
            color="secondary"
            textColor="white"
            text={renderButtonText}
            disabled={disableButton || isLoading}
            isLoading={isLoading}
            onClick={step === 8 ? () => addNewTenant() : () => handleNextStep()}
          />
          {step === 3 && (
            <Button
              className="mt-8 w-3/12 rounded-2xl"
              icon={'ClockIcon'}
              type="outlined"
              color="secondary"
              textColor="secondary"
              text={'Do this later'}
              onClick={() => handleNextStep()}
            />
          )}
          {step === 4 && (
            <Button
              className="mt-8 w-3/12 rounded-2xl"
              icon={'ClockIcon'}
              type="outlined"
              color="secondary"
              textColor="secondary"
              text={'Do this later'}
              onClick={() => handleSte4NextStep()}
            />
          )}
          {step === 8 && (
            <Button
              className="mt-8 w-3/12 rounded-2xl"
              icon={'PencilIcon'}
              type="outlined"
              color="secondary"
              textColor="secondary"
              text={'Edit my responses'}
              onClick={() => setStep(1)}
              disabled={isLoading}
              isLoading={isLoading}
            />
          )}
        </div>
        <Dialog
          stretch={true}
          visible={openConfirmationScreen}
          position={DialogPosition.Full}
          fullScreen
        >
          <ConfirmationScreen orgName={getValues()?.organisationName} />
        </Dialog>
      </div>
    </BannerWrapper>
  );
};
