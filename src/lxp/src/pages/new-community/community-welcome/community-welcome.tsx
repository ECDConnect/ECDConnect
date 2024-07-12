import { Typography, Card, Button, BannerWrapper } from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useTenant } from '@/hooks/useTenant';
import { Step1 } from './components/step1';
import { useCallback, useState } from 'react';
import {
  WelcomeMessageModel,
  initialWelcomeMessageModel,
  welcomeMessageSchema,
} from '@/schemas/community/welcome/welcome-message';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step2 } from './components/step2';
import { useTheme } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

export const NewCommunityWelcome = ({
  setJoinCommunity,
}: {
  setJoinCommunity: (item: boolean) => void;
}) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const [step, setStep] = useState(1);
  console.log({ step });
  const { getValues, setValue, register, trigger, formState, watch, control } =
    useForm<WelcomeMessageModel>({
      resolver: yupResolver(welcomeMessageSchema),
      mode: 'onChange',
      defaultValues: initialWelcomeMessageModel,
    });
  console.log(getValues().shareContactInfo);
  const {
    shareContactInfo,
    aboutShort,
    shareProfilePhoto,
    shareProvince,
    provinceId,
  } = watch();
  console.log({ shareContactInfo });

  const onAllStepsComplete = () => {
    console.log(
      shareContactInfo,
      aboutShort,
      shareProfilePhoto,
      shareProvince,
      provinceId
    );
  };
  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Step1
            setStep={setStep}
            shareContactInfo={shareContactInfo}
            setValue={setValue}
            step={step}
            setJoinCommunity={setJoinCommunity}
          />
        );
      default:
        return (
          <Step2
            setStep={setStep}
            step={step}
            shareContactInfo={shareContactInfo}
            setValue={setValue}
            onAllStepsComplete={onAllStepsComplete}
          />
        );
    }
  };

  const handleBackButtoon = useCallback(() => {
    if (step === 1) {
      history?.push(ROUTES.DASHBOARD);
    } else {
      setStep(step - 1);
    }
  }, [step]);
  return (
    <>
      <BannerWrapper
        size={'large'}
        renderBorder={true}
        showBackground={true}
        title={`Welcome to the ECD community!`}
        onBack={handleBackButtoon}
        onClose={() => history?.push(ROUTES.DASHBOARD)}
        backgroundColour={'white'}
        className={'relative'}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        displayOffline={!isOnline}
      >
        {renderStep(step)}
      </BannerWrapper>
      <div className="h-full"></div>
    </>
  );
};
