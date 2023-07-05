import { useDialog } from '@ecdlink/core';
import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';
import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ConfirmPlayGroups } from '../edit-practitioner-profile/components/confirm-playgroups/confirm-playgroups';
import { EditMultiplePlayGroups } from '../edit-practitioner-profile/components/edit-mutliple-playgroups/edit-multiple-playgroups';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import * as styles from './save-practitioner-playgroups.styles';
import { useAppDispatch } from '@store';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@store/classroom';
import { newGuid } from '@utils/common/uuid.utils';
import {
  EditPlaygroupsState,
  EditPlaygroupsSteps,
} from './save-practitioner-playgroups.types';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';

export const EditPlaygroups: React.FC = () => {
  const location = useLocation<EditPlaygroupsState>();
  const { returnRoute } = location.state;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [activePlaygroupIndex, setActivePlaygroupIndex] = useState<number>(0);
  const [activePage, setActivePage] = useState<EditPlaygroupsSteps>(
    EditPlaygroupsSteps.confirm
  );
  const { syncClassroom } = useStoreSetup();
  const [addingPlayGroup, setAddingPlayGroup] = useState<boolean>(false);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const playGroupType = useSelector(
    staticDataSelectors.getPlaygroupProgrammeType
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;
  const programmeType = useSelector(
    classroomsSelectors.getClassroomProgrammeType()
  );

  const [updatedPlaygroups, setUpdatedPlaygroups] = useState<
    EditPlaygroupModel[]
  >([]);

  useEffect(() => {
    if (classroomGroups && classProgrammes) {
      const groupedItems = [] as EditPlaygroupModel[];
      const _filteredClassroomGroups = classroomGroups.filter(
        (x) => x.name !== NoPlaygroupClassroomType.name
      );

      _filteredClassroomGroups.forEach((groupedItem) => {
        const filteredClassProgrammes = classProgrammes?.filter(
          (x) => x.classroomGroupId === groupedItem.id
        );

        groupedItems.push({
          groupName: groupedItem.name,
          id: groupedItem.id,
          classroomId: groupedItem.classroomId,
          name: groupedItem.name,
          classroomGroupId: groupedItem.id,
          userId: groupedItem.userId,
          meetingDays:
            filteredClassProgrammes &&
            filteredClassProgrammes?.map((x) => x.meetingDay).sort(),
          isFullDay:
            filteredClassProgrammes && filteredClassProgrammes[0]?.isFullDay,
        } as EditPlaygroupModel);
      });

      setUpdatedPlaygroups(groupedItems);
    }
  }, [classroomGroups, classProgrammes]);

  const onPlayGroupsEdit = (
    playgroups: EditPlaygroupModel[],
    index: number,
    addingPlayGroup: boolean = false
  ) => {
    setUpdatedPlaygroups(playgroups);
    setActivePlaygroupIndex(index);
    setActivePage(EditPlaygroupsSteps.edit);
    setAddingPlayGroup(addingPlayGroup);
  };

  const updateClassroomData = async () => {
    try {
      if (isOnline) {
        setIsLoading(true);
        await syncClassroom();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlayGroup = (playgroup: EditPlaygroupModel) => {
    const classroomGroupInputModel: ClassroomGroupDto = {
      id: newGuid(),
      insertedDate: new Date().toISOString(),
      classroomId: classroom?.id ?? '',
      name: playgroup.name,
      programmeTypeId: playGroupType?.id ?? '',
      isActive: true,
      userId: playgroup?.userId,
    };

    appDispatch(
      classroomsActions.createClassroomGroup(classroomGroupInputModel)
    );

    for (const meetingDay of playgroup.meetingDays) {
      const classProgrammeInputModel: ClassProgrammeDto = {
        id: newGuid(),
        classroomGroupId: classroomGroupInputModel.id ?? '',
        insertedDate: new Date().toISOString(),
        meetingDay: meetingDay,
        isFullDay: playgroup?.isFullDay || false,
        programmeStartDate: new Date().toISOString(),
        isActive: true,
      };

      appDispatch(
        classroomsActions.createClassroomProgramme(classProgrammeInputModel)
      );
    }
  };

  const confirmPlaygroups = async (playgroups: EditPlaygroupModel[]) => {
    setUpdatedPlaygroups(playgroups);

    const removedClassroomGroups = classroomGroups.filter(
      (group) => !playgroups.some((pg) => pg.classroomGroupId === group.id)
    );

    for (const playG of removedClassroomGroups) {
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
        const currentPlayGroup = classroomGroups?.find(
          (x) => x.id === playGroup.classroomGroupId
        );

        const hasChanges =
          currentPlayGroup?.name !== playGroup?.name ||
          playGroup?.userId !== currentPlayGroup?.userId;

        if (currentPlayGroup) {
          if (hasChanges) {
            appDispatch(
              classroomsActions.updateClassroomGroup({
                ...currentPlayGroup,
                programmeTypeId: programmeType?.id,
                name: playGroup.name,
                userId: playGroup.userId,
              })
            );

            appDispatch(
              classroomsThunkActions.updateClassroomGroup({
                id: currentPlayGroup.id!,
                classroomGroup: {
                  ...currentPlayGroup,
                  classroomId: playGroup?.classroomId!,
                  id: playGroup?.id,
                  programmeTypeId: playGroup?.id,
                  name: playGroup.name,
                  userId: playGroup.userId,
                  isActive: true,
                },
              })
            );
          }

          const currentPlayGroupProgrammes = classProgrammes?.filter(
            (x) => x.classroomGroupId === currentPlayGroup.id
          );

          /* Remove deleted classProgrammes */
          const deletedClassProgrammes = currentPlayGroupProgrammes?.filter(
            (x) => !playGroup.meetingDays.includes(x.meetingDay)
          );

          for (const deletedClassProgramme of deletedClassProgrammes) {
            appDispatch(
              classroomsActions.deleteClassroomProgramme(deletedClassProgramme)
            );
          }

          /* Update/Create new classProgrammes */
          for (const meetingDay of playGroup.meetingDays) {
            const playGroupProgramme = currentPlayGroupProgrammes?.find(
              (x) => x.meetingDay === meetingDay
            );

            const playgroupInputModel: ClassProgrammeDto = {
              id: newGuid(),
              insertedDate: new Date().toISOString(),
              classroomGroupId: currentPlayGroup.id ?? '',
              meetingDay: meetingDay,
              isFullDay: playGroup?.isFullDay || false,
              programmeStartDate: new Date().toISOString(),
              isActive: true,
            };

            if (playGroupProgramme) {
              playgroupInputModel.id = playGroupProgramme.id;
              appDispatch(
                classroomsActions.updateClassroomProgramme(playgroupInputModel)
              );
            } else {
              appDispatch(
                classroomsActions.createClassroomProgramme(playgroupInputModel)
              );
            }
          }
        } else {
          createPlayGroup(playGroup);
        }
      }

      await updateClassroomData();
    }
  };

  const deletePlayGroup = async (playgroup: EditPlaygroupModel) => {
    const index = updatedPlaygroups.findIndex(
      (pg) => pg.classroomGroupId === playgroup.classroomGroupId
    );
    updatedPlaygroups.splice(index, 1);

    setUpdatedPlaygroups(updatedPlaygroups);

    setActivePage(EditPlaygroupsSteps.confirm);
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
              setActivePage(EditPlaygroupsSteps.confirm);
            }}
          />
        );
      case EditPlaygroupsSteps.confirm:
      default:
        return (
          <ConfirmPlayGroups
            defaultPlayGroups={updatedPlaygroups || []}
            onEditPlaygroup={onPlayGroupsEdit}
            title={isPrincipal ? 'Edit classes' : 'View classes'}
            isLoading={isLoading}
            onSubmit={(value) => {
              confirmPlaygroups(value);
            }}
          />
        );
    }
  };

  const onBack = () => {
    if (activePage === EditPlaygroupsSteps.edit) {
      if (addingPlayGroup) {
        updatedPlaygroups.splice(updatedPlaygroups.length - 1, 1);
        setUpdatedPlaygroups(updatedPlaygroups);
      }
      setActivePage(EditPlaygroupsSteps.confirm);
    } else {
      history.goBack();
    }
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
      title={isPrincipal ? 'Edit classes' : 'View Classes'}
      onBack={onBack}
      onClose={exitPrompt}
      size="medium"
      renderBorder
      displayOffline={!isOnline}
    >
      <div className={styles.stepsWrapper}>
        {steps(activePage as EditPlaygroupsSteps)}
      </div>
    </BannerWrapper>
  );
};
