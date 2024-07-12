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
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { communityThunkActions } from '@/store/community';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';

export const NewCommunityWelcome = ({
  setJoinCommunity,
}: {
  setJoinCommunity: (item: boolean) => void;
}) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [step, setStep] = useState(1);

  const { getValues, setValue, register, trigger, formState, watch, control } =
    useForm<WelcomeMessageModel>({
      resolver: yupResolver(welcomeMessageSchema),
      mode: 'onChange',
      defaultValues: initialWelcomeMessageModel,
    });

  const { errors } = formState;
  const {
    shareContactInfo,
    aboutShort,
    shareProfilePhoto,
    shareProvince,
    provinceId,
  } = watch();

  const onAllStepsComplete = async () => {
    const saveCommunityProfileInput: CommunityProfileInputModelInput = {
      userId: practitioner?.userId!,
      aboutShort: aboutShort,
      shareContactInfo: shareContactInfo,
      shareProfilePhoto: shareProfilePhoto,
      shareProvince: shareProvince,
      provinceId: provinceId,
      communitySkillIds: [],
    };

    await dispatch(
      communityThunkActions.saveCommunityProfile({
        input: saveCommunityProfileInput,
      })
    );

    await dispatch(
      practitionerThunkActions.updatePractitionerCommunityTabStatus({
        practitionerUserId: practitioner?.userId!,
      })
    );

    setJoinCommunity(false);
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
            shareProvince={shareProvince}
            provinceId={provinceId}
            aboutShort={aboutShort}
            errors={errors}
            setJoinCommunity={setJoinCommunity}
          />
        );
    }
  };

  const handleBackButtoon = useCallback(async () => {
    if (step === 1) {
      if (!practitioner?.clickedCommunityTab) {
        await dispatch(
          practitionerThunkActions.updatePractitionerCommunityTabStatus({
            practitionerUserId: practitioner?.userId!,
          })
        );
      }
      history?.push(ROUTES.DASHBOARD);
    } else {
      setStep(step - 1);
    }
  }, [step, practitioner?.clickedCommunityTab]);

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
