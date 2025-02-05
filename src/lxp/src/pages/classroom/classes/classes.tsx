import { practitionerSelectors } from '@/store/practitioner';
import { getAvatarColor, useDialog } from '@ecdlink/core';
import {
  DialogPosition,
  FADButton,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ClassMenu } from './components/class-menu';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { classroomsSelectors } from '@/store/classroom';
import { EditPlaygroupsRouteState } from '@/pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups.types';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { childrenThunkActions } from '@/store/children';
import { useAppDispatch } from '@store';

export const Classes = () => {
  const [addChildButtonExpanded, setAddChildButtonExpanded] = useState(true);
  const dialog = useDialog();
  const history = useHistory();
  const isTrialPeriod = useIsTrialPeriod();

  // Selectors
  const practitionerLoggedIn = useSelector(
    practitionerSelectors.getPractitioner
  );
  const classes = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = !!practitionerLoggedIn?.isPrincipal;
  const appDispatch = useAppDispatch();

  useEffect(() => {
    if (classes?.length) {
      (async () => {
        await Promise.all(
          classes.map((group) =>
            appDispatch(
              childrenThunkActions.getChildrenForClassroomGroup({
                classroomGroupId: group.id,
                overrideCache: true,
              })
            ).unwrap()
          )
        );
      })();
    }
  }, []);

  /**
   * Matches each class with its practitioner
   */
  const getClassesWithPractitioners = () => {
    return classes.map((cls) => {
      const linkedPractitioner =
        cls.userId === practitionerLoggedIn?.userId
          ? practitionerLoggedIn
          : practitioners?.find(
              (practitioner) => practitioner.userId === cls.userId
            );

      return {
        ...cls,
        practitioner: linkedPractitioner
          ? { name: linkedPractitioner.user?.firstName ?? '' }
          : null,
      };
    });
  };

  /**
   * Generates list data for StackedList
   */
  const getClassList = () => {
    return getClassesWithPractitioners().map((currentClass) => ({
      title: currentClass.name,
      profileText: currentClass.name.slice(0, 2).toUpperCase(),
      subTitle: `${
        currentClass.practitioner?.name
          ? `${currentClass.practitioner.name}, `
          : ''
      }${
        currentClass.learners?.filter((child) => child?.isActive !== false)
          ?.length ?? 0
      } children`,
      alertSeverity: 'none',
      avatarColor: getAvatarColor(),
      iconColor: 'secondary',
      hideAlertSeverity: true,
      onActionClick: () => handleClassClick(currentClass.id, currentClass.name),
    }));
  };

  // Memoized class list for performance
  const classList = useMemo(getClassList, [
    classes,
    practitionerLoggedIn,
    practitioners,
  ]);

  /**
   * Handles class click event to open menu
   */
  const handleClassClick = (id: string, name: string) => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <ClassMenu
          isPrincipal={isPrincipal}
          classroomGroupId={id}
          className={name}
          onClose={onClose}
        />
      ),
    });
  };

  /**
   * Handles scrolling behavior
   */
  const handleScroll = (scrollTop: number) => {
    setAddChildButtonExpanded(scrollTop < 30);
  };

  return (
    <div className="p-4 pt-6">
      {!!classList.length ? (
        <StackedList
          className="mb-20 flex flex-col gap-2"
          type="UserAlertList"
          listItems={classList}
          onScroll={handleScroll}
        />
      ) : (
        <IconInformationIndicator
          icon="SearchIcon"
          title="You don't have any classes yet!"
          subTitle={''}
        />
      )}

      {(isPrincipal || isTrialPeriod) && (
        <FADButton
          title="Add a class"
          icon="PlusIcon"
          iconDirection="left"
          textToggle={addChildButtonExpanded}
          type="filled"
          color="quatenary"
          shape="round"
          className="absolute bottom-6 right-0 z-10 m-3 px-3.5 py-2.5"
          click={() =>
            history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, {
              redirectToClassesPage: true,
            } as EditPlaygroupsRouteState)
          }
        />
      )}
    </div>
  );
};
