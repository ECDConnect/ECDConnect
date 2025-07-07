import { practitionerSelectors } from '@/store/practitioner';
import { getAvatarColor, useDialog } from '@ecdlink/core';
import {
  DialogPosition,
  FADButton,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ClassMenu } from './components/class-menu';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { classroomsSelectors } from '@/store/classroom';
import { EditPlaygroupsRouteState } from '@/pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups.types';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

interface ClassMenuProps {
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Classes = ({ setSelectedTabIndex }: ClassMenuProps) => {
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);

  const dialog = useDialog();

  const history = useHistory();

  const isTrialPeriod = useIsTrialPeriod();

  const practitionerLoggedIn = useSelector(
    practitionerSelectors?.getPractitioner
  );
  const classes = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const classesWithPractitionerData = classes.map((cls) => {
    let linkedPractitioner = undefined;

    if (cls.userId === practitionerLoggedIn?.userId) {
      linkedPractitioner = practitionerLoggedIn;
    }

    if (!linkedPractitioner && practitioners) {
      linkedPractitioner = practitioners.find(
        (practitioner) => practitioner.userId === cls.userId
      );
    }

    return {
      ...cls,
      practitioner: linkedPractitioner
        ? { name: linkedPractitioner.user?.firstName }
        : null,
    };
  });

  const isPrincipal = !!practitionerLoggedIn?.isPrincipal;

  const onScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const onClassClick = (id: string, name: string): void => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ClassMenu
            isPrincipal={isPrincipal}
            classroomGroupId={id}
            className={name}
            onClose={onClose}
            setSelectedTabIndex={setSelectedTabIndex}
          />
        );
      },
    });
  };

  const classList: UserAlertListDataItem[] = classesWithPractitionerData?.map(
    (currentClass) => ({
      title: currentClass.name,
      profileText: currentClass.name.slice(0, 2).toUpperCase(),
      subTitle: `${
        currentClass.practitioner?.name
          ? currentClass.practitioner.name + ' , '
          : ''
      }${
        currentClass.learners?.filter((child) => child?.isActive !== false)
          ?.length
      } children`,
      alertSeverity: 'none',
      avatarColor: getAvatarColor(),
      iconColor: 'secondary',
      hideAlertSeverity: true,
      onActionClick: () => onClassClick(currentClass.id, currentClass.name),
    })
  );

  return (
    <div className="p-4 pt-6">
      {!!classList?.length ? (
        <StackedList
          className="mb-20 flex flex-col gap-2"
          type="UserAlertList"
          listItems={classList}
          onScroll={onScroll}
        />
      ) : (
        <IconInformationIndicator
          icon="SearchIcon"
          title="You don't have any classes yet!"
          subTitle=""
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
          shape={'round'}
          className="absolute bottom-6 right-0 z-10 m-3 px-3.5 py-2.5"
          // TODO: when W3 (EC-2534) is done, please review this redirect
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
