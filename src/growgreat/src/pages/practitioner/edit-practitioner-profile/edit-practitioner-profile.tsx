import { useDialog, useTheme } from '@ecdlink/core';
import { IonContent } from '@ionic/react';
import { ActionModal, BannerWrapper } from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { userSelectors } from '@store/user';
import { AddPhoto } from './components/add-photo/add-photo';
import { EditPractitionerSteps } from './edit-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
// import { authSelectors } from '@/store/auth';
import { PractitionerSetup } from './components/practitioner-setup/practitioner-setup';
import { WelcomePage } from '@/components/welcome-page';

import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@store';
import {
  healthCareWorkerActions,
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from '@/store/healthCareWorker';

export const EditPractitionerProfile: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  // const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const healthCareWorker = useSelector(
    healthCareWorkerSelectors?.getHealthCareWorker
  );

  const [label, setLabel] = useState('');
  const [activeStep, setActiveStep] = useState(EditPractitionerSteps.WELCOME);
  const [language, setLanguage] = useState<string>();

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

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
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

  const onAllStepsComplete = async () => {
    // const healthCareWorkerForm = healthCareWorker;

    const copy = Object.assign({}, healthCareWorker);
    if (copy) {
      copy.languageId = language! as string;
      copy.isRegistered = true;
      // copy.user!.emailConfirmed! = true;

      appDispatch(healthCareWorkerActions.updateHealthCareWorker(copy));
      appDispatch(
        healthCareWorkerThunkActions.updateHealthCareWorkerById({
          id: user?.id!,
          input: copy,
        })
      );

      if (isOnline) {
        //   await healthCareWorkerThunkActions?.updateHealthCareWorkerById({
        // id: user?.id!, input: copy}
        //   )
      } else {
        showOnlineOnly();
      }
      history.push(ROUTES.ROOT);
    }
  };

  const steps = (step: EditPractitionerSteps) => {
    switch (step) {
      case EditPractitionerSteps.SETUP_PRACTITIONER:
        return (
          <PractitionerSetup
            onSubmit={(form: string) => {
              setLanguage(form!);
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
          <div className={'px-4'}>
            {steps(activeStep as EditPractitionerSteps)}
          </div>
        </BannerWrapper>
      </IonContent>
    </>
  );
};
