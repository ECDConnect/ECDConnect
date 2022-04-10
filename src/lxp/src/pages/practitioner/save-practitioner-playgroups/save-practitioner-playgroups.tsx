import { useDialog, useStepNavigation } from '@ecdlink/core';
import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ConfirmPlayGroups } from '../edit-practitioner-profile/components/confirm-playgroups/confirm-playgroups';
import { EditMultiplePlayGroups } from '../edit-practitioner-profile/components/edit-mutliple-playgroups/edit-multiple-playgroups';
import { EditPlaygroupModel } from '../../../schemas/practitioner/edit-playgroups';
import * as styles from './save-practitioner-playgroups.styles';
import { useAppDispatch } from '../../../store';
import { classroomsActions, classroomsSelectors } from '../../../store/classroom';
import { newGuid } from '../../../utils/common/uuid.utils';
import { EditPlaygroupsState, EditPlaygroupsSteps } from './save-practitioner-playgroups.types';
import { staticDataSelectors } from '../../../store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ProgrammeTypeEnum } from '@ecdlink/graphql';

export const EditPlaygroups: React.FC = () => {
  const location = useLocation<EditPlaygroupsState>();
  const { returnRoute } = location.state;
  const history = useHistory();
  const [activePlaygroupIndex, setActivePlaygroupIndex] = useState<number>(0);
  const { activeStepKey, goToStep, goBackOneStep, canGoBack } = useStepNavigation(
    EditPlaygroupsSteps.confirm
  );
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const programmeTypes = useSelector(staticDataSelectors.getProgrammeTypes);

  const [updatedPlaygroups, setUpdatedPlaygroups] = useState<EditPlaygroupModel[]>([]);

  useEffect(() => {
    if (classroomGroups && classProgrammes) {
      const groupedItems = [] as EditPlaygroupModel[];

      classroomGroups.forEach((groupedItem) => {
        const filteredClassProgrammes = classProgrammes?.filter(
          (x) => x.classroomGroupId === groupedItem.id
        );

        groupedItems.push({
          groupName: groupedItem.name,
          id: groupedItem.id,
          classroomId: groupedItem.classroomId,
          name: groupedItem.name,
          classroomGroupId: groupedItem.id,
          meetingDays: filteredClassProgrammes && filteredClassProgrammes?.map((x) => x.meetingDay),
          isFullDay: filteredClassProgrammes && filteredClassProgrammes[0].isFullDay,
        } as EditPlaygroupModel);
      });

      setUpdatedPlaygroups(groupedItems);
    }
  }, [classroomGroups, classProgrammes]);

  const onPlayGroupsEdit = (playgroups: EditPlaygroupModel[], index: number) => {
    setUpdatedPlaygroups(playgroups);
    setActivePlaygroupIndex(index);
    goToStep(EditPlaygroupsSteps.edit);
  };

  const confirmPlaygroups = async (playgroups: EditPlaygroupModel[]) => {
    setUpdatedPlaygroups(playgroups);

    const removedPlaygroups = classroomGroups.filter(
      (group) => !playgroups.some((pg) => pg.classroomGroupId === group.id)
    );

    for (const playG of removedPlaygroups) {
      appDispatch(classroomsActions.deleteClassroomGroup(playG));
    }

    await saveEditedPlayGroups(playgroups);

    if (returnRoute) {
      history.push(returnRoute);
    } else {
      history.goBack();
    }
  };

  const saveEditedPlayGroups = async (results: EditPlaygroupModel[]) => {
    if (classroom) {
      for (const playGroup of results) {
        const currentGroup = classroomGroups?.find((x) => x.id === playGroup.classroomGroupId);

        if (currentGroup) {
          const currentGroupCopy = Object.assign({}, currentGroup);
          currentGroupCopy.name = playGroup.name;

          appDispatch(classroomsActions.updateClassroomGroup(currentGroupCopy));

          const filteredClassProgrammes = classProgrammes?.filter(
            (x) => x.classroomGroupId === currentGroup.id
          );

          const removablePlaygroups = filteredClassProgrammes?.filter(
            (x) => !playGroup.meetingDays.includes(x.meetingDay)
          );

          if (removablePlaygroups) {
            for (const removePlaygroup of removablePlaygroups) {
              appDispatch(classroomsActions.deleteClassroomProgramme(removePlaygroup));
            }
          }

          for (const meetingDay of playGroup.meetingDays) {
            const currentGroupItem = classProgrammes?.find((x) => x.meetingDay === meetingDay);

            const playgroupInputModel: ClassProgrammeDto = {
              id: newGuid(),
              insertedDate: new Date().toISOString(),
              classroomGroupId: currentGroup.id ?? '',
              meetingDay: meetingDay,
              isFullDay: playGroup?.isFullDay || false,
              programmeStartDate: new Date().toISOString(),
              isActive: true,
            };

            if (currentGroupItem) {
              playgroupInputModel.id = currentGroupItem.id;
              appDispatch(classroomsActions.updateClassroomProgramme(playgroupInputModel));
            } else {
              appDispatch(classroomsActions.createClassroomProgramme(playgroupInputModel));
            }
          }
        } else {
          const type = programmeTypes.find((x) => x.enumId === ProgrammeTypeEnum.Playgroup);

          const classroomGroupInputModel: ClassroomGroupDto = {
            id: newGuid(),
            insertedDate: new Date().toISOString(),
            classroomId: classroom.id ?? '',
            name: playGroup.name,
            programmeTypeId: type?.id ?? '',
            isActive: true,
          };

          appDispatch(classroomsActions.createClassroomGroup(classroomGroupInputModel));

          for (const meetingDay of playGroup.meetingDays) {
            const classProgrammeInputModel: ClassProgrammeDto = {
              id: newGuid(),
              classroomGroupId: classroomGroupInputModel.id ?? '',
              insertedDate: new Date().toISOString(),
              meetingDay: meetingDay,
              isFullDay: playGroup?.isFullDay || false,
              programmeStartDate: new Date().toISOString(),
              isActive: true,
            };

            appDispatch(classroomsActions.createClassroomProgramme(classProgrammeInputModel));
          }
        }
      }
    }
  };

  const deletePlayGroup = async (playgroup: EditPlaygroupModel) => {
    const index = updatedPlaygroups.findIndex(
      (pg) => pg.classroomGroupId === playgroup.classroomGroupId
    );
    updatedPlaygroups.splice(index, 1);

    setUpdatedPlaygroups(updatedPlaygroups);

    goToStep(EditPlaygroupsSteps.confirm);
  };

  const steps = (step: number) => {
    switch (step) {
      case EditPlaygroupsSteps.edit:
        return (
          <EditMultiplePlayGroups
            numberOfPlaygroups={classProgrammes?.length ?? 0}
            defaultPlayGroups={updatedPlaygroups}
            editPlaygroupAtIndex={activePlaygroupIndex}
            onPlayGroupDelete={deletePlayGroup}
            onSubmit={(value) => {
              setUpdatedPlaygroups(value);
              goToStep(EditPlaygroupsSteps.confirm);
            }}
          />
        );
      case EditPlaygroupsSteps.confirm:
      default:
        return (
          <ConfirmPlayGroups
            defaultPlayGroups={updatedPlaygroups || []}
            onEditPlaygroup={onPlayGroupsEdit}
            title="Edit Playgroups"
            onSubmit={(value) => {
              confirmPlaygroups(value);
            }}
          />
        );
    }
  };

  const onBack = () => {
    if (canGoBack()) goBackOneStep();
    else history.goBack();
  };

  const onClose = () => {
    returnRoute ? history.push(returnRoute) : history.goBack();
  };

  const exitPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to exit now?`}
          detailText={'If you exit now you will lose your progress.'}
          actionButtons={[
            {
              text: 'Exit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                onClose();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <BannerWrapper
      title={'Edit playgroups'}
      onBack={onBack}
      onClose={exitPrompt}
      size="medium"
      renderBorder
      displayOffline={!isOnline}
    >
      <div className={styles.stepsWrapper}>{steps(activeStepKey as EditPlaygroupsSteps)}</div>
    </BannerWrapper>
  );
};
