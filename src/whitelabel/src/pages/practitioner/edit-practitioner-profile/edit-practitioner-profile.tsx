import { useDialog, useTheme } from '@ecdlink/core';
import { IonContent } from '@ionic/react';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userSelectors } from '@store/user';
import { AddPhoto } from './components/add-photo/add-photo';
import {
  EditPractitionerSteps,
  PractitionerFormData,
} from './edit-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { authSelectors } from '@/store/auth';
import { PractitionerSetup } from './components/practitioner-setup/practitioner-setup';
import { WelcomePage } from '@/components/welcome-page';
import { PractitionerService } from '@/services/PractitionerService';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@store';
import { notificationActions } from '@/store/notifications';
import { useNotificationService } from '@/hooks/useNotificationService';

export const EditPractitionerProfile: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const [label, setLabel] = useState('');
  const [activeStep, setActiveStep] = useState(EditPractitionerSteps.WELCOME);
  const [formData, setFormData] = useState<PractitionerFormData>({
    practitionerToProgramme: false,
    allowPermissions: false,
  });

  const addedByPrincipal = !!practitioner?.principalHierarchy;

  const { stopService } = useNotificationService();

  useEffect(() => {
    if (!addedByPrincipal) {
      return history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
    }
  }, [addedByPrincipal, history]);

  useEffect(() => {
    if (activeStep === EditPractitionerSteps.WELCOME) {
      setLabel('Welcome');
    } else {
      setLabel(
        `step ${activeStep} of ${
          Object.values(EditPractitionerSteps).filter(Number).length
        }`
      );
    }
  }, [activeStep]);

  const onAllStepsComplete = async () => {
    if (isOnline) {
      if (
        userAuth?.auth_token &&
        user?.id &&
        practitioner?.principalHierarchy
      ) {
        if (formData.allowPermissions) {
          // explicitly checking that the user concent to share info
          await new PractitionerService(
            userAuth.auth_token
          ).UpdatePractitionerShareInfo(
            user.id,
            practitioner.principalHierarchy
          );
          await new PractitionerService(
            userAuth.auth_token
          ).UpdatePractitionerRegistered(user.id, true);
        }
        appDispatch(notificationActions.resetNotificationState());
        appDispatch(practitionerThunkActions.getAllPractitioners({}));
        stopService();
        history.push(ROUTES.ROOT);
      }
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

  const steps = (step: EditPractitionerSteps) => {
    switch (step) {
      case EditPractitionerSteps.SETUP_PRACTITIONER:
        return (
          <PractitionerSetup
            onSubmit={(form: PractitionerFormData) => {
              setFormData(form);
              setActiveStep(EditPractitionerSteps.ADD_PHOTO);
            }}
          />
        );

      case EditPractitionerSteps.ADD_PHOTO:
        return (
          <AddPhoto
            onSubmit={() => {
              onAllStepsComplete();
            }}
          />
        );

      case EditPractitionerSteps.WELCOME:
      default:
        return (
          <WelcomePage
            onNext={() =>
              setActiveStep(EditPractitionerSteps.SETUP_PRACTITIONER)
            }
          />
        );
    }
  };

  const exitPrompt = () => {
    dialog({
      position: DialogPosition.Bottom,
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
      case EditPractitionerSteps.WELCOME:
      default:
        return history.goBack();
      case EditPractitionerSteps.SETUP_PRACTITIONER:
        return setActiveStep(EditPractitionerSteps.WELCOME);
      case EditPractitionerSteps.ADD_PHOTO:
        return setActiveStep(EditPractitionerSteps.SETUP_PRACTITIONER);
    }
  };

  return (
    <>
      <IonContent scrollY={true}>
        <BannerWrapper
          size={
            activeStep === EditPractitionerSteps.WELCOME ? 'large' : 'medium'
          }
          renderBorder={true}
          showBackground={activeStep === EditPractitionerSteps.WELCOME}
          title={'Edit Profile'}
          subTitle={label}
          onBack={onBack}
          onClose={exitPrompt}
          backgroundColour={'white'}
          className={
            activeStep === EditPractitionerSteps.WELCOME ? 'relative' : ''
          }
          backgroundUrl={
            activeStep === EditPractitionerSteps.WELCOME
              ? theme?.images.graphicOverlayUrl
              : ''
          }
          displayOffline={!isOnline}
        >
          <div className={'px-4'}>{steps(activeStep)}</div>
        </BannerWrapper>
      </IonContent>
    </>
  );
};
