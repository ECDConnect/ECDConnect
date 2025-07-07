import { BannerWrapper, DialogPosition } from '@ecdlink/ui';
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
import { useDialog } from '@ecdlink/core';
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
import { AddPhotoDialog } from './components/add-photo-dialog';
import { userSelectors } from '@/store/user';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import { notificationsSelectors } from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';

export const NewCommunityWelcome = ({
  setJoinCommunity,
  seNotJoining,
}: {
  setJoinCommunity: (item: boolean) => void;
  seNotJoining: (item: boolean) => void;
}) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { setValue, formState, watch } = useForm<WelcomeMessageModel>({
    resolver: yupResolver(welcomeMessageSchema),
    mode: 'onChange',
    defaultValues: initialWelcomeMessageModel,
  });

  const removalNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter((item) =>
    item?.message?.reference?.includes('practitioner-no-community-profile')
  );

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
      shareContactInfo: true,
      shareProfilePhoto: shareProfilePhoto,
      shareProvince: shareProvince,
      provinceId: provinceId || null,
      communitySkillIds: [],
    };

    const doThisLaterInput: CommunityProfileInputModelInput = {
      userId: practitioner?.userId!,
      aboutShort: '',
      shareContactInfo: true,
      shareProfilePhoto: false,
      shareProvince: false,
      provinceId: null,
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

    if (removalNotifications && removalNotifications?.length > 0) {
      removalNotifications.map((notification) => {
        if (notification?.message?.isFromBackend) {
          return dispatch(
            disableBackendNotification({
              notificationId: notification.message.reference ?? '',
            })
          );
        }
      });
    }
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
            seNotJoining={seNotJoining}
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
  }, [
    step,
    practitioner?.clickedCommunityTab,
    practitioner?.userId,
    history,
    dispatch,
  ]);

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
        backgroundUrl={TransparentLayer}
        displayOffline={!isOnline}
      >
        {renderStep(step)}
      </BannerWrapper>
      <div className="h-full"></div>
    </>
  );
};
