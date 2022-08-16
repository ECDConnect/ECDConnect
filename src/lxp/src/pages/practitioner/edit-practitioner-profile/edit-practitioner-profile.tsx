import { useDialog, useTheme } from '@ecdlink/core';
import {
  ClassProgrammeDto,
  ClassroomDto,
  ClassroomGroupDto,
} from '@ecdlink/core';
import { IonContent } from '@ionic/react';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Card,
  Typography,
} from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '@store';
import { classroomsActions, classroomsSelectors } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import { userSelectors } from '@store/user';
import { newGuid } from '@utils/common/uuid.utils';
import { AddPhoto } from './components/add-photo/add-photo';
// import { ConfirmPlayGroups } from './components/confirm-playgroups/confirm-playgroups';
// import { EditMultiplePlayGroups } from './components/edit-mutliple-playgroups/edit-multiple-playgroups';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { EditPlaygroupCountForm } from './components/edit-practitioner-playgroup-count-form/edit-playgroup-count-form';
import { EditProgrammeForm } from './components/edit-programme-form/edit-programme-form';
import { EditProgrammeModel } from '@schemas/practitioner/edit-programme';
import { EditPractitionerSteps } from './edit-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  MutationAddPractitionerToPrincipalArgs,
  ProgrammeTypeEnum,
} from '@ecdlink/graphql';
import { useStoreSetup } from '@hooks/useStoreSetup';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import ROUTES from '@routes/routes';
import EditMultiplePractitioners from './components/edit-multiple-practitioners/edit-multiple-practitioners';
import { ReactComponent as Cebisa } from '@/assets/cebisa.svg';
import { SetupClasses } from './components/setup-classes/setup-classes';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';

export enum SetupPractitionersPage {
  confirmPractitioners = 1,
  addPractitioners = 2,
  editPractitioners = 3,
}

export const EditPractitionerProfile: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const { syncClassroom } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const principalPractitioners = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );

  const [label, setLabel] = useState('');
  const [programme, setProgramme] = useState<EditProgrammeModel>();
  const [activeStep, setActiveStep] = useState(
    EditPractitionerSteps.welcomePage
  );

  useEffect(() => {
    setLabel(`step 1 of 3`);
  }, []);

  useEffect(() => {
    if (principalPractitioners?.length) {
      setActiveStep(EditPractitionerSteps.setupClasses);
    } else if (classroom?.id && classroomGroups.length) {
      setActiveStep(EditPractitionerSteps.setConfirmPractitioners);
    }
  }, [classroom?.id, classroomGroups.length, principalPractitioners?.length]);

  const createClassroom = (
    programme: EditProgrammeModel,
    classroomId: string
  ) => {
    const classroomInputModel: ClassroomDto = {
      userId: user?.id ?? '',
      id: classroomId,
      name: programme?.name ?? '',
      isPrinciple: programme?.isPrincipalOrLeader ?? false,
      numberPractitioners: programme?.smartStartPractitioners
        ? +programme?.smartStartPractitioners
        : 0,
      numberOfOtherAssistants: programme?.nonSmartStartPractitioners
        ? +programme?.nonSmartStartPractitioners
        : 0,
      insertedDate: new Date().toISOString(),
      isActive: true,
    };

    appDispatch(classroomsActions.createClassroom(classroomInputModel));
    appDispatch(classroomsActions.setProgrammeType(programme.type));
  };

  const onAllStepsComplete = async () => {
    if (isOnline) {
      const classroomId = newGuid();

      if (programme) {
        createClassroom(programme, classroomId);
      }

      // Update classroom data
      await syncClassroom();

      // Update the principal data

      if (classroom?.isPrinciple) {
        if (userAuth?.auth_token) {
          const res = await new PractitionerService(
            userAuth?.auth_token
          ).PromotePractitionerToPrincipal(classroom.userId);
          console.log('set practitioner to principal:', classroom.userId, res);
        }
      }

      if (principalPractitioners?.length) {
        if (userAuth?.auth_token) {
          principalPractitioners.forEach(async (principalPractitioner) => {
            const input: MutationAddPractitionerToPrincipalArgs = {
              userId: principalPractitioner.userId,
              idNumber: principalPractitioner.idNumber,
              firstName: principalPractitioner.firstName,
              lastName: principalPractitioner.surname,
            };
            const res = await new PractitionerService(
              userAuth?.auth_token
            ).AddPractitionerToPrincipal(input);
            console.log('add practitioners to principal:', res);
          });
        }
      }

      history.push(ROUTES.ROOT);
    } else {
      showOnlineOnly();
    }
  };

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

  const steps = (step: EditPractitionerSteps) => {
    switch (step) {
      case EditPractitionerSteps.welcomePage:
      default:
        return (
          <div className="h-full pt-7">
            <div className="flex flex-col gap-11">
              <Typography
                color="white"
                type="h1"
                text="Hello, my name is Cebisa and I'm here to help you!"
              />
              <div>
                <Card
                  className="bg-uiBg p-4 flex items-center flex-col gap-3"
                  borderRaduis="lg"
                  shadowSize="lg"
                >
                  <>
                    <div className="">
                      <Cebisa />
                    </div>
                    <Typography
                      color="textDark"
                      text="I'd like to get to know you."
                      type={'h3'}
                    />
                    <Typography
                      className="text-center"
                      color="textMid"
                      text="Please give me more information to make Funda App useful for you!"
                      type={'body'}
                    />
                  </>
                </Card>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 max-h-20">
              <Button
                size="normal"
                className="w-full"
                type="filled"
                color="primary"
                text="Start"
                textColor="white"
                icon="ArrowCircleRightIcon"
                onClick={() => {
                  setActiveStep(EditPractitionerSteps.setupProgramme);
                }}
              />
            </div>
          </div>
        );
      case EditPractitionerSteps.setupProgramme:
        return (
          <div>
            <EditProgrammeForm
              programme={programme}
              onSubmit={(programme) => {
                setProgramme(programme);
                const classroomId = newGuid();

                createClassroom(programme, classroomId);

                const playgroupProgrammeType = programmeTypes.find(
                  (x) => x.enumId === ProgrammeTypeEnum.Playgroup
                );

                if (programme.isPrincipalOrLeader) {
                  setActiveStep(EditPractitionerSteps.setConfirmPractitioners);
                } else if (programme.type === playgroupProgrammeType?.id) {
                  setActiveStep(EditPractitionerSteps.setPlaygroupCount);
                } else {
                  setActiveStep(EditPractitionerSteps.addPhoto);
                  setLabel(`step 3 of 3`);
                }
              }}
            />
          </div>
        );
      case EditPractitionerSteps.setConfirmPractitioners:
        return (
          <EditMultiplePractitioners
            page={SetupPractitionersPage.confirmPractitioners}
            onSubmit={() => {
              setActiveStep(EditPractitionerSteps.setupClasses);
            }}
          />
        );
      case EditPractitionerSteps.setupClasses:
        return (
          <SetupClasses
            onSubmit={() => {
              setActiveStep(EditPractitionerSteps.addPhoto);
            }}
          />
        );
      case EditPractitionerSteps.addPhoto:
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
      case EditPractitionerSteps.welcomePage:
      default:
        return history.goBack();
      case EditPractitionerSteps.setupProgramme:
        return setActiveStep(EditPractitionerSteps.welcomePage);
      case EditPractitionerSteps.setConfirmPractitioners:
        return setActiveStep(EditPractitionerSteps.setupProgramme);
      case EditPractitionerSteps.setupClasses:
        return setActiveStep(EditPractitionerSteps.setConfirmPractitioners);
      case EditPractitionerSteps.confirmClasses:
        return setActiveStep(EditPractitionerSteps.setupClasses);
      case EditPractitionerSteps.addPhoto:
        return setActiveStep(EditPractitionerSteps.confirmClasses);
    }
  };

  return (
    <>
      <IonContent scrollY={true}>
        <BannerWrapper
          size={
            activeStep === EditPractitionerSteps.welcomePage
              ? 'large'
              : 'medium'
          }
          renderBorder={true}
          showBackground={activeStep === EditPractitionerSteps.welcomePage}
          title={'Edit Profile'}
          subTitle={label}
          onBack={onBack}
          onClose={exitPrompt}
          backgroundColour={'white'}
          className={
            activeStep === EditPractitionerSteps.welcomePage ? 'relative' : ''
          }
          backgroundUrl={
            activeStep === EditPractitionerSteps.welcomePage
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
