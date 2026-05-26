import { useDialog, useSnackbar } from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
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
import { useOnlineStatus } from '@hooks/useOnlineStatus';
// import { useStoreSetup } from '@hooks/useStoreSetup';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import ROUTES from '@/routes/routes';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { notificationsSelectors } from '@/store/notifications';

export const EditPlaygroups: React.FC = () => {
  const location = useLocation<EditPlaygroupsRouteState>();
  const routeReturn = location?.state?.returnRoute
    ? location?.state?.returnRoute
    : null;
  const history = useHistory();
  const isTrialPeriod = useIsTrialPeriod();
  const [isLoading, setIsLoading] = useState(false);
  const [activeClassroomGroupIndex, setActiveClassroomGroupIndex] =
    useState<number>();
  const [activePage, setActivePage] = useState<EditPlaygroupsSteps>(
    EditPlaygroupsSteps.confirm
  );
  // const { syncClassroom } = useStoreSetup();
  const [addingPlayGroup, setAddingPlayGroup] = useState<boolean>(false);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;

  const [updatedClassroomGroups, setUpdatedClassroomGroups] = useState<
    EditPlaygroupModel[]
  >([]);

  const assignToClassNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter((item) =>
    item?.message?.cta?.includes('[[[[AssignPractitioner]]]]')
  );

  const removeNotifications = async () => {
    if (assignToClassNotifications && assignToClassNotifications?.length > 0) {
      assignToClassNotifications.map((notification) => {
        appDispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      });
    }
  };

  useEffect(() => {
    if (classroomGroups) {
      const groupedItems = [] as EditPlaygroupModel[];
      const _filteredClassroomGroups = classroomGroups.filter(
        (x) => x.name !== NoPlaygroupClassroomType.name
      );

      _filteredClassroomGroups.forEach((groupedItem) => {
        const isEveryDayClass =
          groupedItem?.classProgrammes?.length === 5
            ? true
            : groupedItem?.id
            ? false
            : undefined;

        groupedItems.push({
          groupName: groupedItem.name,
          id: groupedItem.id,
          classroomId: groupedItem.classroomId,
          meetEveryday: isEveryDayClass,
          name: groupedItem.name || `Class ${groupedItems?.length}`,
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
    removeNotifications();
  };

  const createPlayGroup = async (playgroup: EditPlaygroupModel) => {
    const classroomGroupId = newGuid();
    const today = new Date().toISOString();
    const classroomGroupModel: ClassroomGroupDto = {
      id: classroomGroupId || '',
      classroomId: classroom?.id ?? '',
      name: playgroup?.name ?? '',
      userId: playgroup?.userId!,
      learners: [],
      classProgrammes: playgroup.meetingDays.map((x) => {
        return {
          id: newGuid(),
          classroomGroupId: classroomGroupId,
          meetingDay: x,
          isActive: true,
          programmeStartDate: today,
          isFullDay: playgroup?.isFullDay || false,
          synced: false,
        };
      }),
    };

    await appDispatch(
      classroomsActions.createClassroomGroup(classroomGroupModel)
    );
    if (isOnline) {
      await appDispatch(classroomsThunkActions.upsertClassroomGroups({}));
      await appDispatch(
        classroomsThunkActions.upsertClassroomGroupProgrammes({})
      );
    }
  };

  const confirmPlaygroups = async (playgroups: EditPlaygroupModel[]) => {
    setUpdatedClassroomGroups(playgroups);

    const removedClassroomGroups = classroomGroups.filter(
      (group) => !playgroups.some((pg) => pg.classroomGroupId === group.id)
    );

    if (isOnline) {
      for (const playG of removedClassroomGroups) {
        appDispatch(
          classroomsThunkActions.updateClassroomGroup({
            id: playG.id,
            classroomGroup: {
              id: playG?.id,
              name: playG?.name || `Class ${playgroups?.length}`,
              classroomId: playG?.classroomId,
              isActive: false,
              practitionerId: playG?.userId!,
              userId: playG?.userId,
            },
          })
        ).then(() => {
          showMessage({
            message: 'Class deleted',
            type: 'success',
            duration: 3000,
          });
        });
      }
    }

    await saveEditedPlayGroups(playgroups);

    if (routeReturn) {
      history.push(routeReturn);
    } else {
      handleGoBack();
    }
  };

  const saveEditedPlayGroups = async (results: EditPlaygroupModel[]) => {
    if (!classroom) return;

    const promises: Promise<any>[] = [];

    for (const edited of results) {
      const existing = classroomGroups?.find(
        (g) => g.id === edited.classroomGroupId
      );

      if (!existing) {
        createPlayGroup(edited);
        continue;
      }

      // ─── UPDATE EXISTING GROUP ──────────────────────────────────
      const nameChanged = existing.name !== edited.name;
      const teacherChanged = existing.userId !== edited.userId;
      const hasMetaChanges = nameChanged || teacherChanged;

      // Programme (meeting days) diff
      const currentDays = new Set(
        existing.classProgrammes
          .filter((p) => p.isActive)
          .map((p) => p.meetingDay)
      );

      const newDays = new Set(edited.meetingDays);
      const daysAdded = [...newDays].filter((d) => !currentDays.has(d));
      const daysRemoved = [...currentDays].filter((d) => !newDays.has(d));

      const hasProgrammeChanges =
        daysAdded.length > 0 || daysRemoved.length > 0 || teacherChanged;

      if (!hasMetaChanges && !hasProgrammeChanges) {
        continue; // nothing to do
      }

      // ─── Prepare updated programmes list ─────────────────────────
      const updatedProgrammes = existing.classProgrammes.map((p) => {
        const isBeingRemoved = daysRemoved.includes(p.meetingDay);
        return {
          ...p,
          isActive: !isBeingRemoved,
          synced: !isBeingRemoved || !teacherChanged,
        };
      });

      // Add newly selected days
      for (const day of daysAdded) {
        updatedProgrammes.push({
          id: newGuid(),
          classroomGroupId: existing.id,
          meetingDay: day,
          isFullDay: true,
          programmeStartDate: new Date().toISOString(),
          isActive: true,
          synced: false, // new entry → not yet synced
        });
      }

      // ─── Prepare group payload ───────────────────────────────────
      const groupPayload = {
        ...existing,
        name: edited.name?.trim() || `Class ${results.length}`,
        userId: edited.userId ?? existing.userId, // safeguard
        classProgrammes: updatedProgrammes,
        synced: !hasMetaChanges,
      } as ClassroomGroupDto;

      // Local update
      appDispatch(classroomsActions.updateClassroomGroup(groupPayload));

      // ─── Online sync ─────────────────────────────────────────────
      if (!isOnline) continue;

      // 1. Update group metadata (name / teacher)
      if (hasMetaChanges) {
        promises.push(
          appDispatch(
            classroomsThunkActions.updateClassroomGroup({
              id: existing.id,
              classroomGroup: {
                ...existing,
                classroomId: edited.classroomId ?? existing.classroomId,
                id: existing.id,
                name: groupPayload.name,
                userId: groupPayload.userId,
                isActive: true,
                learners: existing.learners,
              },
            })
          )
        );
      }

      // 2. Sync programmes (add / deactivate)
      if (hasProgrammeChanges) {
        promises.push(
          appDispatch(classroomsThunkActions.upsertClassroomGroupProgrammes({}))
        );
      }
    }

    // Wait for local updates
    await Promise.allSettled(promises);
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
            title={
              isPrincipal || isTrialPeriod ? 'Edit classes' : 'View classes'
            }
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
      handleGoBack();
    }
  };

  const onClose = () => {
    routeReturn ? history.push(routeReturn) : handleGoBack();
  };

  const handleGoBack = () => {
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.CLASSES,
    });
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
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                onClose();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'Continue editing',
              textColour: 'quatenary',
              colour: 'quatenary',
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
        isPrincipal || isTrialPeriod
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
