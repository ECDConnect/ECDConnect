import {
  Typography,
  Card,
  Button,
  BannerWrapper,
  DialogPosition,
} from '@ecdlink/ui';
import { useTenant } from '@/hooks/useTenant';
import { Step1 } from './components/step1/step1';
import { useCallback, useState } from 'react';
import {
  WelcomeMessageModel,
  initialWelcomeMessageModel,
  welcomeMessageSchema,
} from '@/schemas/community/welcome/welcome-message';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Step2 } from './components/step2/step2';
import { useDialog, useTheme } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import { AddPhotoDialog } from './components/add-photo-dialog';
import { userSelectors } from '@/store/user';

export const NewCommunityWelcome = ({
  setJoinCommunity,
}: {
  setJoinCommunity: (item: boolean) => void;
}) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const user = useSelector(userSelectors.getUser);
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const profilePhoto = communityProfile?.communityUser?.profilePhoto;
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  const onAllStepsComplete = async (doThisLater: boolean) => {
    setIsLoading(true);
    const saveCommunityProfileInput: CommunityProfileInputModelInput = {
      userId: practitioner?.userId!,
      aboutShort: aboutShort,
      shareContactInfo: shareContactInfo,
      shareProfilePhoto: shareProfilePhoto,
      shareProvince: shareProvince,
      provinceId: provinceId || '',
      communitySkillIds: [],
    };

    const doThisLaterInput: CommunityProfileInputModelInput = {
      userId: practitioner?.userId!,
      aboutShort: '',
      shareContactInfo: false,
      shareProfilePhoto: false,
      shareProvince: false,
      provinceId: '58f42ddf-38d5-4008-a007-af7cb220206c',
      communitySkillIds: [],
    };

    await dispatch(
      communityThunkActions.saveCommunityProfile({
        input: doThisLater ? doThisLaterInput : saveCommunityProfileInput,
      })
    );

    await dispatch(
      practitionerThunkActions.updatePractitionerCommunityTabStatus({
        practitionerUserId: practitioner?.userId!,
      })
    );

    setIsLoading(false);

    if (!user?.profileImageUrl && shareProfilePhoto) {
      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => (
          <AddPhotoDialog
            onClose={() => {
              history.push(ROUTES.COMMUNITY.ROOT);
              onClose();
              setJoinCommunity(false);
            }}
            onSubmit={() => {
              history.push(ROUTES.PRACTITIONER.ABOUT.ROOT, {
                isFromCommunityWelcome: true,
              });
              onClose();
            }}
          />
        ),
      });
    } else {
      setJoinCommunity(false);
    }

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
            shareProfilePhoto={shareProfilePhoto}
            shareProvince={shareProvince}
            setValue={setValue}
            onAllStepsComplete={onAllStepsComplete}
            provinceId={provinceId}
            aboutShort={aboutShort}
            errors={errors}
            setJoinCommunity={setJoinCommunity}
            isLoading={isLoading}
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
