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
  EditPlaygroupsRouteState,
  EditPlaygroupsSteps,
} from './save-practitioner-playgroups.types';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import { s } from 'msw/lib/glossary-297d38ba';

export const EditPlaygroups: React.FC = () => {
  const location = useLocation<EditPlaygroupsRouteState>();

  const routeReturn = location?.state?.returnRoute
    ? location?.state?.returnRoute
    : null;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [activeClassroomGroupIndex, setActiveClassroomGroupIndex] =
    useState<number>();
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
  const playGroupType = useSelector(
    staticDataSelectors.getPlaygroupProgrammeType
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;

  const [updatedClassroomGroups, setUpdatedClassroomGroups] = useState<
    EditPlaygroupModel[]
  >([]);

  useEffect(() => {
    if (classroomGroups) {
      const groupedItems = [] as EditPlaygroupModel[];
      const _filteredClassroomGroups = classroomGroups.filter(
        (x) => x.name !== NoPlaygroupClassroomType.name
      );

      _filteredClassroomGroups.forEach((groupedItem) => {
        groupedItems.push({
          groupName: groupedItem.name,
          id: groupedItem.id,
          classroomId: groupedItem.classroomId,
          name: groupedItem.name,
          classroomGroupId: groupedItem.id,
          userId: groupedItem.userId,
          meetingDays: groupedItem.classProgrammes
            .map((x) => x.meetingDay)
            .sort(),
          isFullDay:
            !!groupedItem.classProgrammes.length &&
            groupedItem.classProgrammes[0].isFullDay,
        } as EditPlaygroupModel);
      });

      setUpdatedClassroomGroups(groupedItems);
    }
  }, [classroomGroups]);

  const onPlayGroupsEdit = (
    playgroups: EditPlaygroupModel[],
    index: number,
    addingPlayGroup: boolean = false
  ) => {
    setUpdatedClassroomGroups(playgroups);
    setActiveClassroomGroupIndex(index);
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

    // TODO
    // appDispatch(
    //   classroomsActions.createClassroomGroup(classroomGroupInputModel)
    // );

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

      // appDispatch(
      //   classroomsActions.createClassroomProgramme(classProgrammeInputModel)
      // );
    }
  };

  const confirmPlaygroups = async (playgroups: EditPlaygroupModel[]) => {
    setUpdatedClassroomGroups(playgroups);

    const removedClassroomGroups = classroomGroups.filter(
      (group) => !playgroups.some((pg) => pg.classroomGroupId === group.id)
    );

    // TODO
    // for (const playG of removedClassroomGroups) {
    //   appDispatch(classroomsActions.deleteClassroomGroup(playG));
    // }

    await saveEditedPlayGroups(playgroups);

    if (routeReturn) {
      history.push(routeReturn);
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
          // Mark any deleted as inactive
          const currentPlayGroupProgrammes =
            currentPlayGroup.classProgrammes.map((programme) => {
              const removed = !playGroup.meetingDays.includes(
                programme.meetingDay
              );
              return {
                ...programme,
                isActive: !removed,
                synced: !removed,
              };
            });

          /* Update/Create new classProgrammes */
          playGroup.meetingDays.forEach((meetingDay) => {
            if (
              !currentPlayGroupProgrammes.some(
                (p) => p.meetingDay === meetingDay
              )
            ) {
              currentPlayGroupProgrammes.push({
                id: newGuid(),
                classroomGroupId: currentPlayGroup.id,
                meetingDay: meetingDay,
                isFullDay: playGroup?.isFullDay || false,
                programmeStartDate: new Date().toISOString(),
                isActive: true,
                synced: false,
              });
            }
          });
          console.log('currentPlayGroupProgrammes', currentPlayGroupProgrammes);

          appDispatch(
            classroomsActions.updateClassroomGroup({
              ...currentPlayGroup,
              name: playGroup.name,
              userId: playGroup.userId!,
              classProgrammes: currentPlayGroupProgrammes,
            })
          );

          if (hasChanges) {
            appDispatch(
              classroomsThunkActions.updateClassroomGroup({
                id: currentPlayGroup.id!,
                classroomGroup: {
                  ...currentPlayGroup,
                  classroomId: playGroup?.classroomId!,
                  id: playGroup?.id,
                  name: playGroup.name,
                  userId: playGroup.userId,
                  isActive: true,
                  learners: [],
                },
              })
            );
          }
          appDispatch(
            classroomsThunkActions.upsertClassroomGroupProgrammes({})
          );
        } else {
          createPlayGroup(playGroup);
        }
      }

      await updateClassroomData();
    }
  };

  const deletePlayGroup = async (playgroup: EditPlaygroupModel) => {
    const index = updatedClassroomGroups.findIndex(
      (pg) => pg.classroomGroupId === playgroup.classroomGroupId
    );
    updatedClassroomGroups.splice(index, 1);

    setUpdatedClassroomGroups(updatedClassroomGroups);

    setActivePage(EditPlaygroupsSteps.confirm);
  };

  const steps = (step: number) => {
    switch (step) {
      case EditPlaygroupsSteps.edit:
        return (
          <EditMultiplePlayGroups
            numberOfPlaygroups={classroomGroups?.length ?? 0}
            defaultPlayGroups={updatedClassroomGroups}
            editPlaygroupAtIndex={activeClassroomGroupIndex}
            onPlayGroupDelete={deletePlayGroup}
            onSubmit={(value) => {
              setUpdatedClassroomGroups(value);
              setActiveClassroomGroupIndex(undefined);
              setActivePage(EditPlaygroupsSteps.confirm);
            }}
          />
        );
      case EditPlaygroupsSteps.confirm:
      default:
        return (
          <ConfirmPlayGroups
            defaultPlayGroups={updatedClassroomGroups || []}
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
        updatedClassroomGroups.splice(updatedClassroomGroups.length - 1, 1);
        setUpdatedClassroomGroups(updatedClassroomGroups);
      }
      setActiveClassroomGroupIndex(undefined);
      setActivePage(EditPlaygroupsSteps.confirm);
    } else {
      history.goBack();
    }
  };

  const onClose = () => {
    routeReturn ? history.push(routeReturn) : history.goBack();
  };

  useEffect(() => {
    if (
      location?.state?.redirectToClassesPage &&
      updatedClassroomGroups?.length
    ) {
      setActivePage(EditPlaygroupsSteps.confirm);

      if (location.state?.selectedClassroomGroupId) {
        const classroomGroupIndex = updatedClassroomGroups.findIndex(
          (x) => x.classroomGroupId === location.state.selectedClassroomGroupId
        );
        onPlayGroupsEdit(updatedClassroomGroups, classroomGroupIndex, true);
      }
      history.replace({
        pathname: location.pathname,
        state: {
          ...location.state,
          redirectToClassesPage: undefined,
          selectedClassroomGroupId: undefined,
        },
      });
    }
  }, [history, location.pathname, location.state, updatedClassroomGroups]);

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
      title={
        isPrincipal
          ? `Edit class${
              typeof activeClassroomGroupIndex === 'number' ? '' : 'es'
            }`
          : 'View Classes'
      }
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
