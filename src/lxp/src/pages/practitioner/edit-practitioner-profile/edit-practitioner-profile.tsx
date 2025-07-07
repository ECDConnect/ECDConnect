import { useDialog, useTheme } from '@ecdlink/core';
import { IonContent } from '@ionic/react';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
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
import { PractitionerShareDetails } from './components/practitioner-share-details/practitioner-share-details';
import { useTenant } from '@/hooks/useTenant';
import { PractitionerSetup } from './components/practitioner-setup/practitioner-setup';
import { classroomsSelectors, classroomsThunkActions } from '@/store/classroom';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import { usePractitionerNotification } from '@/hooks/usePractitionerNotification';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomService } from '@/services/ClassroomService';

export const EditPractitionerProfile: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;

  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const [principalClassroom, setPrincipalClassroom] = useState<ClassroomDto>();

  const [label, setLabel] = useState('');
  const [activeStep, setActiveStep] = useState(EditPractitionerSteps.WELCOME);
  const [formData, setFormData] = useState<PractitionerFormData>({
    practitionerToProgramme: false,
    allowPermissions: false,
  });

  useEffect(() => {
    if (practitioner?.principalHierarchy) {
      getPrincipalClassroom();
    }
  }, [practitioner?.principalHierarchy]);

  const getPrincipalClassroom = useCallback(async () => {
    const classroom = await new ClassroomService(
      userAuth?.auth_token!
    ).getClassroomForUser(practitioner?.principalHierarchy!);

    if (classroom) {
      setPrincipalClassroom(classroom);
    }
  }, [practitioner?.principalHierarchy]);

  const addedByPrincipal = !!practitioner?.principalHierarchy;
  const { getPractitionerProgressNotification } = usePractitionerNotification();
  const notificationClassroom = classroom?.name
    ? classroom?.name
    : principalClassroom?.name;
  const { practitionerNotification } = getPractitionerProgressNotification(
    tenant?.tenant?.applicationName,
    practitioner,
    notificationClassroom
  );

  const { stopService } = useNotificationService();

  const showOnlineOnly = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to be online to complete your profile'}
            onSubmit={() => {
              history.goBack();
              onSubmit();
            }}
          ></OnlineOnlyModal>
        );
      },
    });
  }, [dialog, history]);

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
    }
  }, [isOnline, showOnlineOnly]);

  useEffect(() => {
    if (!addedByPrincipal && isOnline) {
      return history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
    }
  }, [addedByPrincipal, history, isOnline]);

  useEffect(() => {
    if (activeStep === EditPractitionerSteps.WELCOME) {
      setLabel('Welcome');
    } else {
      setLabel(
        `step ${activeStep - 1} of ${
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
          ).UpdatePractitionerShareInfo(user.id);
          await new PractitionerService(
            userAuth.auth_token
          ).UpdatePractitionerRegistered(user.id, true);
          if (practitioner?.progress === 1.0 && !practitioner?.isPrincipal) {
            history.push(ROUTES.DASHBOARD, { isFromCompleteProfile: true });
            return;
          }
          await new PractitionerService(
            userAuth.auth_token
          ).UpdatePractitionerProgress(user.id, 2.0);
        }
        appDispatch(notificationActions.resetNotificationState());
        appDispatch(
          practitionerThunkActions.getPractitionerByUserId({ userId: user.id })
        );
        appDispatch(practitionerThunkActions.getAllPractitioners({}));
        appDispatch(
          classroomsThunkActions.getClassroom({ overrideCache: true })
        ).unwrap();
        stopService();
        history.push(ROUTES.ROOT);
      }
    } else {
      showOnlineOnly();
    }
  };

  const steps = (step: EditPractitionerSteps) => {
    switch (step) {
      case EditPractitionerSteps.SET_PRACTITIONER_DETAILS:
        return (
          <PractitionerShareDetails
            onNext={() =>
              setActiveStep(EditPractitionerSteps.SETUP_PRACTITIONER)
            }
          />
        );
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
              isOpenAccess && !user?.firstName
                ? setActiveStep(EditPractitionerSteps.SET_PRACTITIONER_DETAILS)
                : setActiveStep(EditPractitionerSteps.SETUP_PRACTITIONER)
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
              colour: 'quatenary',
              text: 'Exit',
              onClick: () => {
                appDispatch(
                  notificationActions.addNotifications(practitionerNotification)
                );
                onSubmit();
                if (
                  activeStep === EditPractitionerSteps.SETUP_PRACTITIONER ||
                  activeStep === EditPractitionerSteps.WELCOME
                ) {
                  history.push(ROUTES.DASHBOARD);
                  return;
                }
                history.goBack();
              },
              textColour: 'white',
              type: 'filled',
              leadingIcon: 'LoginIcon',
            },
            {
              colour: 'quatenary',
              text: 'Continue editing',
              onClick: () => {
                onCancel();
              },
              textColour: 'quatenary',
              type: 'outlined',
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  const onBack = async () => {
    await appDispatch(
      notificationActions.addNotifications(practitionerNotification)
    );
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
          size={'large'}
          renderBorder={true}
          showBackground={true}
          title={'Edit Profile'}
          subTitle={label}
          onBack={onBack}
          onClose={exitPrompt}
          backgroundImageColour={'primary'}
          className={'relative'}
          backgroundUrl={TransparentLayer}
          displayOffline={!isOnline}
        >
          <div className={'h-screen px-4'}>{steps(activeStep)}</div>
        </BannerWrapper>
      </IonContent>
    </>
  );
};
