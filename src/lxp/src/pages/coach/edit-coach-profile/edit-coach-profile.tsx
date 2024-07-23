import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useDialog, UserDto } from '@ecdlink/core';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IonContent } from '@ionic/react';
import { cloneDeep } from 'lodash';

import { EditProfileForm } from './components/edit-profile-form/edit-profile-form';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { EditProfileInformationModel } from '@schemas/coach/edit-profile';
import { EditCoachSteps } from './edit-coach-profile.types';
import { AddPhoto } from './components/add-photo/add-photo';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import ROUTES from '@routes/routes';
import { coachActions, coachSelectors, coachThunkActions } from '@store/coach';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import { notificationActions } from '@/store/notifications';

export const EditCoachProfile: React.FC = () => {
  const [activeStep, setActiveStep] = useState(EditCoachSteps.completeProfile);
  const { isOnline } = useOnlineStatus();
  const [label, setLabel] = useState('');
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();

  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(userSelectors.getUser);

  const [coachProfileInformation, setCoachProfileInformation] =
    useState<EditProfileInformationModel>({
      email: coach?.user?.email || '',
    });

  useEffect(() => {
    setLabel(`step 1 of 2`);
  }, []);

  const onAllStepsComplete = async () => {
    if (isOnline) {
      const coachCopy = cloneDeep(coach);
      const userCopy = cloneDeep(user);

      if (coachCopy && userCopy) {
        userCopy.email = coachProfileInformation.email;

        Object.assign(coachCopy.user as UserDto, userCopy);

        appDispatch(userActions.updateUser(userCopy));
        appDispatch(userThunkActions.updateUser(userCopy));

        appDispatch(coachActions.updateCoach(coachCopy));
        appDispatch(coachThunkActions.updateCoach(coachCopy));
        appDispatch(notificationActions.resetFrontendNotificationState());
      }

      history.push(ROUTES.ROOT);
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to be online to complete your profile'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  };

  const steps = (step: EditCoachSteps) => {
    switch (step) {
      case EditCoachSteps.completeProfile:
      default:
        return (
          <EditProfileForm
            coachProfileInformation={coachProfileInformation}
            onSubmit={(coachProfileInformation) => {
              setCoachProfileInformation(coachProfileInformation);
              setActiveStep(EditCoachSteps.addPhoto);
              setLabel(`step 2 of 2`);
            }}
          />
        );
      case EditCoachSteps.addPhoto:
        return (
          <AddPhoto
            onSubmit={() => {
              onAllStepsComplete();
            }}
          />
        );
    }
  };

  const exitPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          icon={'XCircleIcon'}
          iconColor={'alertMain'}
          iconBorderColor="alertBg"
          importantText={
            'Please complete the process otherwise you will lose your changes.'
          }
          actionButtons={[
            {
              colour: 'primary',
              text: 'Exit',
              onClick: () => {
                onSubmit();
                history.goBack();
              },
              textColour: 'white',
              type: 'filled',
              leadingIcon: 'LoginIcon',
            },
            {
              colour: 'primary',
              text: 'Continue editing',
              onClick: () => {
                onCancel();
              },
              textColour: 'primary',
              type: 'outlined',
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  const onBack = () => {
    switch (activeStep) {
      case EditCoachSteps.completeProfile:
      default:
        return history.goBack();
      case EditCoachSteps.addPhoto:
        return setActiveStep(EditCoachSteps.completeProfile);
    }
  };

  return (
    <>
      <IonContent scrollY={true}>
        <BannerWrapper
          size={'medium'}
          renderBorder={true}
          title={'Edit Profile'}
          subTitle={label}
          onBack={onBack}
          onClose={exitPrompt}
          backgroundColour={'white'}
          displayOffline={!isOnline}
        >
          <div className={'px-4 pb-5'}>{steps(activeStep)}</div>
        </BannerWrapper>
      </IonContent>
    </>
  );
};
