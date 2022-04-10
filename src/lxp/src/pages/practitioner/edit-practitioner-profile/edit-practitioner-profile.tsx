import { useDialog, useStepNavigation } from '@ecdlink/core';
import { ClassProgrammeDto, ClassroomDto, ClassroomGroupDto } from '@ecdlink/core';
import { IonContent } from '@ionic/react';
import { ActionModal, BannerWrapper } from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { classroomsActions } from '../../../store/classroom';
import { staticDataSelectors } from '../../../store/static-data';
import { userSelectors } from '../../../store/user';
import { newGuid } from '../../../utils/common/uuid.utils';
import { AddPhoto } from './components/add-photo/add-photo';
import { ConfirmPlayGroups } from './components/confirm-playgroups/confirm-playgroups';
import { EditMultiplePlayGroups } from './components/edit-mutliple-playgroups/edit-multiple-playgroups';
import { EditPlaygroupModel } from '../../../schemas/practitioner/edit-playgroups';
import { EditPlaygroupCountForm } from './components/edit-practitioner-playgroup-count-form/edit-playgroup-count-form';
import { EditProgrammeForm } from './components/edit-programme-form/edit-programme-form';
import { EditProgrammeModel } from '../../../schemas/practitioner/edit-programme';
import { EditPractitionerSteps } from './edit-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';
import { useStoreSetup } from '@hooks/useStoreSetup';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';

export const EditPractitionerProfile: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const { syncClassroom } = useStoreSetup();
  const user = useSelector(userSelectors.getUser);
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);

  const [label, setLabel] = useState('');
  const [playGroupCount, setPlayGroupCount] = useState<number>(0);
  const [programme, setProgramme] = useState<EditProgrammeModel>();
  const [playgroups, setPlaygroups] = useState<EditPlaygroupModel[]>();
  const [editPlaygroupAtIndex, setEditPlayGroupAtIndex] = useState<number>();

  const { activeStepKey, goBackOneStep, canGoBack, goToStep } = useStepNavigation(
    EditPractitionerSteps.setupProgramme
  );

  useEffect(() => {
    setLabel(`step 1 of 3`);
  }, []);

  const onPlayGroupsEdit = (playgroups: EditPlaygroupModel[], index: number) => {
    setPlaygroups(playgroups);
    setEditPlayGroupAtIndex(index);
    goToStep(EditPractitionerSteps.setupPlaygroups);
  };

  const deletePlayGroup = async (playgroup: EditPlaygroupModel) => {
    if (!playgroups) return;
    const updatedPlaygroups = [...playgroups];

    const index = updatedPlaygroups.findIndex(
      (pg) => pg.classroomGroupId === playgroup.classroomGroupId
    );
    updatedPlaygroups.splice(index, 1);

    setPlaygroups(updatedPlaygroups);

    goToStep(EditPractitionerSteps.confirmPlaygroups);
  };

  const onAllStepsComplete = async () => {
    if (isOnline) {
      const classroomId = newGuid();

      const classroomInputModel: ClassroomDto = {
        userId: user?.id ?? '',
        name: programme?.name ?? '',
        isPrinciple: programme?.isPrincipleOrLeader ?? false,
        numberPractitioners: programme?.smartStartPractitioners
          ? +programme?.smartStartPractitioners
          : 0,
        numberOfAssistants: programme?.assistants ? +programme?.assistants : 0,
        numberOfOtherAssistants: programme?.nonSmartStartPractitioners
          ? +programme?.nonSmartStartPractitioners
          : 0,
        doesOwnerTeach: programme?.isTeacher ?? false,
        id: classroomId,
        insertedDate: new Date().toISOString(),
        isActive: true,
      };

      appDispatch(classroomsActions.createClassroom(classroomInputModel));

      const programmeType = programmeTypes.find((x) => x.enumId === ProgrammeTypeEnum.Playgroup);
      if (programme?.type === programmeType?.id && playgroups && classroomId) {
        for (const playGroup of playgroups) {
          const classroomGroupId = newGuid();
          const classProgrammeInputModel: ClassroomGroupDto = {
            id: classroomGroupId,
            classroomId: classroomId,
            name: playGroup.name,
            programmeTypeId: programme?.type,
            isActive: true,
          };

          appDispatch(classroomsActions.createClassroomGroup(classProgrammeInputModel));

          for (const meetingDay of playGroup.meetingDays) {
            const classProgrammeId = newGuid();

            const classProgrammeInputModel: ClassProgrammeDto = {
              id: classProgrammeId,
              classroomGroupId: classroomGroupId,
              meetingDay: meetingDay,
              isFullDay: playGroup?.isFullDay || false,
              programmeStartDate: new Date().toISOString(),
              isActive: true,
            };

            appDispatch(classroomsActions.createClassroomProgramme(classProgrammeInputModel));
          }
        }
      } else {
        const classroomGroupId = newGuid();
        const classProgrammeInputModel: ClassroomGroupDto = {
          id: classroomGroupId,
          classroomId: classroomId,
          name: programme?.name ?? '',
          programmeTypeId: programme?.type,
          isActive: true,
        };

        appDispatch(classroomsActions.createClassroomGroup(classProgrammeInputModel));

        const weekDays = [1, 2, 3, 4, 5];
        for (const meetingDay of weekDays) {
          const classProgrammeId = newGuid();

          const classProgrammeInputModel: ClassProgrammeDto = {
            id: classProgrammeId,
            classroomGroupId: classroomGroupId,
            meetingDay: meetingDay,
            isFullDay: true,
            programmeStartDate: new Date().toISOString(),
            isActive: true,
          };

          appDispatch(classroomsActions.createClassroomProgramme(classProgrammeInputModel));
        }
      }

      await syncClassroom();
      history.push('/');
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
      case EditPractitionerSteps.setupProgramme:
      default:
        return (
          <div>
            <EditProgrammeForm
              programme={programme}
              onSubmit={(programme) => {
                setProgramme(programme);

                const playgroupProgrammeType = programmeTypes.find(
                  (x) => x.enumId === ProgrammeTypeEnum.Playgroup
                );

                if (programme.type === playgroupProgrammeType?.id) {
                  goToStep(EditPractitionerSteps.setPlaygroupCount);
                } else {
                  goToStep(EditPractitionerSteps.addPhoto);
                  setLabel(`step 3 of 3`);
                }
              }}
            />
          </div>
        );
      case EditPractitionerSteps.setPlaygroupCount:
        return (
          <EditPlaygroupCountForm
            onSubmit={(value) => {
              setPlayGroupCount(value);
              goToStep(EditPractitionerSteps.setupPlaygroups);
              setLabel(`step 2 of 3`);
            }}
          />
        );
      case EditPractitionerSteps.setupPlaygroups:
        return (
          <EditMultiplePlayGroups
            numberOfPlaygroups={playGroupCount}
            defaultPlayGroups={playgroups}
            editPlaygroupAtIndex={editPlaygroupAtIndex}
            onPlayGroupDelete={deletePlayGroup}
            onSubmit={(value) => {
              setPlaygroups(value);
              goToStep(EditPractitionerSteps.confirmPlaygroups);
            }}
          />
        );
      case EditPractitionerSteps.confirmPlaygroups:
        return (
          <ConfirmPlayGroups
            defaultPlayGroups={playgroups || []}
            onEditPlaygroup={onPlayGroupsEdit}
            onSubmit={(value) => {
              setPlaygroups(value);
              goToStep(EditPractitionerSteps.addPhoto);
              setLabel(`step 3 of 3`);
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
          importantText={'Please complete the process otherwise you will lose your changes.'}
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

  return (
    <>
      <IonContent scrollY={true}>
        <BannerWrapper
          size={'medium'}
          renderBorder={true}
          title={'Edit Profile'}
          subTitle={label}
          onBack={() => {
            if (canGoBack()) goBackOneStep();
            else {
              history.goBack();
            }
          }}
          onClose={exitPrompt}
          backgroundColour={'uiBg'}
          displayOffline={!isOnline}
        >
          <div className={'px-4 pb-5'}>{steps(activeStepKey as EditPractitionerSteps)}</div>
        </BannerWrapper>
      </IonContent>
    </>
  );
};
