import {
  useTheme,
  useDialog,
  usePrevious,
  LocalStorageKeys,
} from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { MutationAddPractitionerToPrincipalArgs } from '@ecdlink/graphql';
import { IonContent } from '@ionic/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AddProgrammeForm } from '../components/add-programme-form/add-programme-form';
import ConfirmPractitioners from '../components/confirm-practitioners/confirm-practitioners';
import {
  PractitionerSetupSteps,
  ConfirmPractitionersSteps,
  ConfirmClassesSteps,
} from './setup-principal.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { SetupClasses } from '../components/setup-classes/setup-classes';
import { AddPhoto } from '@/pages/practitioner/edit-practitioner-profile/components/add-photo/add-photo';
import { WelcomePage } from '@/components/welcome-page';
import { staticDataSelectors } from '@/store/static-data';
import { userSelectors } from '@/store/user';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { PractitionerService } from '@/services/PractitionerService';
import ROUTES from '@/routes/routes';
import { useNotificationService } from '@/hooks/useNotificationService';
import { notificationActions } from '@/store/notifications';
import { PractitionerSignature } from '../components/practitioner-signature/practitioner-signature';
import { SelectPractitionerRole } from '../components/select-practitioner-role/select-practitioner-role';
import { PreschoolCodeCheck } from '../components/preschool-code-check/preschool-code-check';
import { updatePrincipalInvitation } from '@/store/practitioner/practitioner.actions';
import { useTenant } from '@/hooks/useTenant';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import { usePractitionerNotification } from '@/hooks/usePractitionerNotification';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { ClassroomService } from '@/services/ClassroomService';
import { ClassroomDto as SimpleClassroomDto } from '@/models/classroom/classroom.dto';
import { PrincipalInviteDto } from '@/models/practitioner/PrincipalInvite.dto';

export const SetupPrincipal: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const { syncClassroom } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const tenant = useTenant();
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);
  const user = useSelector(userSelectors.getUser);
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const classroomSetupPractitioners = useSelector(
    classroomsSelectors.getSetupClassroomPractitioners
  );
  const [principalClassroom, setPrincipalClassroom] = useState<ClassroomDto>();
  const principalPractitioners = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [isNotPrincipal, setIsNotPrincipal] = useState(false);
  const [label, setLabel] = useState('Welcome');
  const [page, setPage] = useState<PractitionerSetupSteps>(
    PractitionerSetupSteps.WELCOME
  );
  const { getPractitionerProgressNotification } = usePractitionerNotification();
  const [practitionerPreschoolData, setPractitionerPreschoolData] =
    useState<MutationAddPractitionerToPrincipalArgs>();
  const [practitionerPrincipalData, setPractitionerPrincipalData] =
    useState<PrincipalInviteDto>();

  const handlePreschoolData = (
    args: MutationAddPractitionerToPrincipalArgs
  ) => {
    setPractitionerPreschoolData(args);
  };

  const handlePrincipalNumberDetails = (args: PrincipalInviteDto) => {
    setPractitionerPrincipalData(args);
  };

  const [isLoading, setIsLoading] = useState(false);
  const inviTePractitionerUserId = localStorage
    .getItem(LocalStorageKeys.practitionerInvitedPrincipalUserId)
    ?.replace(/['"]+/g, '');

  const [confirmPractitionerPage, setConfirmPractitionerPage] =
    useState<ConfirmPractitionersSteps>(
      ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS
    );
  const [classesPage, setClassesPage] = useState<ConfirmClassesSteps>(
    ConfirmClassesSteps.CONFIRM_CLASSES
  );

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

  const previousPage = usePrevious(page);
  const subTitleRules =
    confirmPractitionerPage === ConfirmPractitionersSteps.EDIT_PRACTITIONER ||
    confirmPractitionerPage === ConfirmPractitionersSteps.ADD_PRACTITIONER ||
    page === PractitionerSetupSteps.SELECT_PRACTITIONER_ROLE ||
    classesPage === ConfirmClassesSteps.ADD_CLASS ||
    classesPage === ConfirmClassesSteps.EDIT_CLASS;

  const showBgRules = tenant?.isWhiteLabel
    ? confirmPractitionerPage === ConfirmPractitionersSteps.ADD_PRACTITIONER ||
      (page === PractitionerSetupSteps.CONFIRM_CLASSES &&
        classesPage === ConfirmClassesSteps.ADD_CLASS) ||
      (page === PractitionerSetupSteps.CONFIRM_CLASSES &&
        classesPage === ConfirmClassesSteps.EDIT_CLASS) ||
      confirmPractitionerPage === ConfirmPractitionersSteps.EDIT_PRACTITIONER
    : (page === PractitionerSetupSteps.OA_CONFIRM_CLASSES &&
        classesPage === ConfirmClassesSteps.ADD_CLASS) ||
      (page === PractitionerSetupSteps.OA_CONFIRM_CLASSES &&
        classesPage === ConfirmClassesSteps.EDIT_CLASS);
  const notificationClassroom = classroom?.name
    ? classroom?.name
    : principalClassroom?.name;
  const { practitionerNotification } = getPractitionerProgressNotification(
    tenant?.tenant?.applicationName,
    practitioner,
    notificationClassroom
  );

  const { stopService } = useNotificationService();

  useEffect(() => {
    if (previousPage === page) return;

    if (page === PractitionerSetupSteps.ADD_PHOTO && isNotPrincipal) {
      return setLabel('Step 2 of 2');
    }

    if (page === PractitionerSetupSteps.ADD_PHOTO && tenant?.isWhiteLabel) {
      return setLabel('Step 4 of 4');
    }
    if (page === PractitionerSetupSteps.ADD_PHOTO && tenant?.isOpenAccess) {
      return setLabel('Step 3 of 3');
    }

    if (
      page === PractitionerSetupSteps.CONFIRM_PRACTITIONERS &&
      tenant?.isWhiteLabel
    ) {
      setLabel('Step 2 of 4');
    }
    if (
      page === PractitionerSetupSteps.CONFIRM_PRACTITIONERS &&
      tenant?.isOpenAccess
    ) {
      setLabel('Step 2 of 3');
    }

    if (page === PractitionerSetupSteps.SETUP_PROGRAMME && isNotPrincipal) {
      setLabel('Step 1 of 2');
      return;
    }

    if (
      page === PractitionerSetupSteps.SETUP_PROGRAMME &&
      tenant?.isWhiteLabel
    ) {
      setLabel('Step 1 of 4');
    }

    if (page === PractitionerSetupSteps.WELCOME) {
      setLabel('Welcome');
    }

    if (
      classesPage === ConfirmClassesSteps.CONFIRM_CLASSES &&
      page === PractitionerSetupSteps.CONFIRM_CLASSES
    ) {
      return setLabel('Step 3 of 4');
    }
  }, [classesPage, isNotPrincipal, page, previousPage]);

  const onAllStepsComplete = async () => {
    appDispatch(notificationActions.resetNotificationState());

    if (isNotPrincipal === true && practitioner?.progress !== 1) {
      if (user) {
        if (practitionerPreschoolData && !!practitionerPreschoolData.userId) {
          await new PractitionerService(
            userAuth?.auth_token!
          ).UpdatePractitionerProgress(user?.id!, 2.0);
          await new PractitionerService(
            userAuth?.auth_token!
          ).AddPractitionerToPrincipal(practitionerPreschoolData);
          const principalHierarchy = practitionerPreschoolData.userId;
          const userId = user?.id!;
          const accepted = true;
          await appDispatch(
            updatePrincipalInvitation({ userId, principalHierarchy, accepted })
          );
          await new PractitionerService(
            userAuth?.auth_token!
          ).UpdatePractitionerShareInfo(user?.id!);

          await appDispatch(
            practitionerThunkActions.getPractitionerByUserId({
              userId: user?.id!,
            })
          );
          await appDispatch(practitionerThunkActions.getAllPractitioners({}));
          await appDispatch(
            classroomsThunkActions.getClassroom({ overrideCache: true })
          ).unwrap();
        }

        if (practitionerPrincipalData) {
          await new PractitionerService(
            userAuth?.auth_token!
          ).practitionerInvitePrincipal(
            practitionerPrincipalData.principalPhoneNumber,
            practitionerPrincipalData.userId
          );
        }

        await appDispatch(
          practitionerThunkActions.updatePractitionerRegistered({
            practitionerId: user.id,
            status: true,
          })
        );
        await appDispatch(
          practitionerThunkActions.updatePractitionerProgress({
            practitionerId: user.id,
            progress: 2.0,
          })
        );
        stopService();
      }

      history.push(ROUTES.ROOT);
      return;
    }

    setIsLoading(true);

    // update school
    // EC-3957 - only save school information when you add a class for the principle
    const classroomInputModel = classroom as ClassroomDto;
    await appDispatch(
      classroomsThunkActions.upsertClassroom(classroomInputModel)
    );
    // save practitioners and permissions
    await appDispatch(
      classroomsThunkActions.updateClassroomPractitionerPermissions({})
    );
    // add classes
    await appDispatch(classroomsThunkActions.upsertClassroomGroups({}));
    // programmes
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroupProgrammes({})
    );
    await appDispatch(classroomsThunkActions.getClassroomGroups({}));
    // Update classroom number of practitioners
    appDispatch(
      classroomsActions.updateClassroomNumberPractitioners(
        principalPractitioners?.length ?? 0
      )
    );
    // Update classroom data
    await syncClassroom();
    // Update the principal data
    if (userAuth?.auth_token && user?.id) {
      if (practitioner?.progress === 1.0 && !practitioner?.isPrincipal) {
        await appDispatch(
          notificationActions.addNotifications(practitionerNotification)
        );
        history.push(ROUTES.DASHBOARD, { isFromCompleteProfile: true });
        return;
      }
      await new PractitionerService(
        userAuth?.auth_token
      ).PromotePractitionerToPrincipal(user?.id);
      await appDispatch(
        practitionerThunkActions.getPractitionerByUserId({
          userId: user?.id || '',
        })
      );
      await appDispatch(
        practitionerThunkActions.updatePractitionerRegistered({
          practitionerId: user.id,
          status: true,
        })
      );
      await appDispatch(
        practitionerThunkActions.updatePractitionerProgress({
          practitionerId: user.id,
          progress: 2.0,
        })
      );
    }

    // WL - adding practitioners to principal + invites
    if (tenant.isWhiteLabel) {
      if (principalPractitioners?.length) {
        if (userAuth?.auth_token) {
          principalPractitioners.forEach(async (principalPractitioner) => {
            if (
              !principalPractitioner?.userId &&
              principalPractitioner?.phoneNumber &&
              principalPractitioner?.userId !== inviTePractitionerUserId
            ) {
              const principalInvite = await new PractitionerService(
                userAuth?.auth_token!
              )
                .sendPractitionerInviteToPreschool(
                  principalPractitioner?.phoneNumber,
                  classroom?.preschoolCode!,
                  classroom?.name!,
                  user?.id!
                )
                .catch((error) => {
                  console.log(error);
                  return;
                });
            } else {
              const input: MutationAddPractitionerToPrincipalArgs = {
                userId: user?.id,
                idNumber: principalPractitioner.idNumber,
                firstName: principalPractitioner.firstName,
                lastName: principalPractitioner.surname,
                preschoolCode: '',
              };
              await new PractitionerService(
                userAuth?.auth_token
              ).AddPractitionerToPrincipal(input);
            }
          });
          if (inviTePractitionerUserId) {
            await appDispatch(
              practitionerThunkActions.updatePractitionerProgress({
                practitionerId: inviTePractitionerUserId,
                progress: 2.0,
              })
            ).unwrap();
            await appDispatch(
              updatePrincipalInvitation({
                userId: inviTePractitionerUserId,
                principalHierarchy: user?.id!,
                accepted: true,
              })
            ).unwrap();
          }
          await appDispatch(
            practitionerThunkActions.getAllPractitioners({})
          ).unwrap();
          await appDispatch(
            notificationActions.resetFrontendNotificationState()
          );
        }
      }
    } else {
      if (inviTePractitionerUserId) {
        // Add practitioner to prinicipal
        const input: MutationAddPractitionerToPrincipalArgs = {
          userId: inviTePractitionerUserId,
          preschoolCode: '',
        };
        await new PractitionerService(
          userAuth?.auth_token!
        ).AddPractitionerToPrincipal(input);

        await appDispatch(
          practitionerThunkActions.updatePractitionerProgress({
            practitionerId: inviTePractitionerUserId,
            progress: 2.0,
          })
        ).unwrap();
        await appDispatch(
          updatePrincipalInvitation({
            userId: inviTePractitionerUserId,
            principalHierarchy: user?.id!,
            accepted: true,
          })
        ).unwrap();
        await appDispatch(
          practitionerThunkActions.getAllPractitioners({})
        ).unwrap();
        await appDispatch(notificationActions.resetFrontendNotificationState());
      }
    }
    localStorage.removeItem(
      LocalStorageKeys.practitionerInvitedPrincipalIdNumber
    );
    localStorage.removeItem(
      LocalStorageKeys.practitionerInvitedPrincipalUserId
    );
    // clear practitioners and permissions on state
    await appDispatch(classroomsActions.deleteClassroomPractitioner());
    setIsLoading(false);
    stopService();
    history.push(ROUTES.DASHBOARD, { isFromCompleteProfile: true });
  };

  const updateClassroomOnCancel = async () => {
    // need to reset values when cancelling the process
    // School values
    const classroomInputModel: SimpleClassroomDto = {
      ...classroom,
    } as SimpleClassroomDto;
    classroomInputModel.preschoolCode = '';
    classroomInputModel.name = `${
      practitioner?.user?.userName + "'s testing pre-school"
    }`;
    classroomInputModel.isDummySchool = true;
    await appDispatch(classroomsActions.updateClassroom(classroomInputModel));
    // clear linked practitioners and classes
    await appDispatch(classroomsActions.resetClassroomObjects());
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
              colour: 'quatenary',
              text: 'Exit',
              onClick: () => {
                updateClassroomOnCancel();
                appDispatch(
                  notificationActions.addNotifications(practitionerNotification)
                );
                onSubmit();
                history.push('/');
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

  const onChangeIsPrincipal = (value: boolean) => {
    if (value) {
      setLabel('step 1 of 2');
    } else {
      setLabel(
        `step ${page} of ${
          Object.values(PractitionerSetupSteps).filter(Number).length
        }`
      );
    }
  };

  const renderStep = (step: PractitionerSetupSteps) => {
    switch (step) {
      case PractitionerSetupSteps.WELCOME:
        return (
          <WelcomePage
            onNext={() => {
              setPage(PractitionerSetupSteps.SELECT_PRACTITIONER_ROLE);
            }}
          />
        );

      case PractitionerSetupSteps.SELECT_PRACTITIONER_ROLE:
        return isNotPrincipal ? (
          <PreschoolCodeCheck
            onNext={setPage}
            onPreschoolNext={handlePreschoolData}
            setPrincipalNumberDetails={handlePrincipalNumberDetails}
          />
        ) : (
          <SelectPractitionerRole
            onNext={() => setPage(PractitionerSetupSteps.SETUP_PROGRAMME)}
            setIsNotPrincipal={setIsNotPrincipal}
            setPage={setPage}
          />
        );

      case PractitionerSetupSteps.SETUP_PROGRAMME:
        return isNotPrincipal ? (
          <PreschoolCodeCheck
            onNext={setPage}
            onPreschoolNext={handlePreschoolData}
            setPrincipalNumberDetails={handlePrincipalNumberDetails}
          />
        ) : (
          <AddProgrammeForm
            onNext={setPage}
            setIsNotPrincipal={setIsNotPrincipal}
            isNotPrincipal={isNotPrincipal}
            onChangeIsPrincipal={onChangeIsPrincipal}
          />
        );

      case PractitionerSetupSteps.CONFIRM_PRACTITIONERS:
        return tenant.isWhiteLabel ? (
          <ConfirmPractitioners
            page={confirmPractitionerPage}
            setConfirmPractitionerPage={setConfirmPractitionerPage}
            onNext={setPage}
          />
        ) : (
          <SetupClasses
            page={classesPage}
            setClassesPage={setClassesPage}
            onNext={setPage}
          />
        );

      case PractitionerSetupSteps.CONFIRM_CLASSES:
        return (
          <SetupClasses
            page={classesPage}
            setClassesPage={setClassesPage}
            onNext={setPage}
          />
        );

      case PractitionerSetupSteps.ADD_SIGNATURE:
        return <PractitionerSignature page={classesPage} onNext={setPage} />;

      case PractitionerSetupSteps.ADD_PHOTO:
        return (
          <AddPhoto
            onSubmit={() => {
              onAllStepsComplete();
            }}
            isLoading={isLoading}
          />
        );

      default:
        return <></>;
    }
  };

  const onBack = async () => {
    await appDispatch(
      notificationActions.addNotifications(practitionerNotification)
    );
    switch (page) {
      case PractitionerSetupSteps.SETUP_PROGRAMME:
        return setPage(PractitionerSetupSteps.SELECT_PRACTITIONER_ROLE);

      case PractitionerSetupSteps.CONFIRM_PRACTITIONERS:
        if (
          confirmPractitionerPage ===
            ConfirmPractitionersSteps.EDIT_PRACTITIONER ||
          confirmPractitionerPage === ConfirmPractitionersSteps.ADD_PRACTITIONER
        ) {
          return setConfirmPractitionerPage(
            ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS
          );
        }
        return setPage(PractitionerSetupSteps.SETUP_PROGRAMME);

      case PractitionerSetupSteps.CONFIRM_CLASSES:
        if (
          classesPage === ConfirmClassesSteps.EDIT_CLASS ||
          classesPage === ConfirmClassesSteps.ADD_CLASS
        ) {
          return setClassesPage(ConfirmClassesSteps.CONFIRM_CLASSES);
        }
        setConfirmPractitionerPage(
          ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS
        );
        return setPage(PractitionerSetupSteps.CONFIRM_PRACTITIONERS);

      case PractitionerSetupSteps.ADD_SIGNATURE:
        setClassesPage(ConfirmClassesSteps.CONFIRM_CLASSES);
        return setPage(PractitionerSetupSteps.CONFIRM_CLASSES);

      case PractitionerSetupSteps.ADD_PHOTO:
        if (practitioner?.progress === 1 || isNotPrincipal) {
          if (practitioner?.progress === 2) {
            return setPage(PractitionerSetupSteps.SETUP_PROGRAMME);
          }
          return setPage(PractitionerSetupSteps.SELECT_PRACTITIONER_ROLE);
        }
        return setPage(PractitionerSetupSteps.CONFIRM_CLASSES);

      case PractitionerSetupSteps.WELCOME:
      default:
        return history.push('/');
    }
  };

  const renderBannerWrapperTitle = useMemo(() => {
    if (
      confirmPractitionerPage === ConfirmPractitionersSteps.EDIT_PRACTITIONER ||
      confirmPractitionerPage === ConfirmPractitionersSteps.ADD_PRACTITIONER
    ) {
      return 'Add Practitioners';
    }

    if (
      page === PractitionerSetupSteps.SETUP_PROGRAMME ||
      page === PractitionerSetupSteps.CONFIRM_PRACTITIONERS ||
      page === PractitionerSetupSteps.CONFIRM_CLASSES ||
      page === PractitionerSetupSteps.ADD_PHOTO
    ) {
      return 'Preschool information';
    }
    return 'Edit profile';
  }, [confirmPractitionerPage, page]);

  return (
    <IonContent scrollY={true}>
      <BannerWrapper
        size={'large'}
        renderBorder={true}
        showBackground={showBgRules ? false : true}
        title={renderBannerWrapperTitle}
        subTitle={subTitleRules ? '' : label}
        onBack={onBack}
        onClose={exitPrompt}
        backgroundColour={'white'}
        className={'relative'}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        displayOffline={!isOnline}
      >
        <div className={'px-4'}>{renderStep(page)}</div>
      </BannerWrapper>
    </IonContent>
  );
};
