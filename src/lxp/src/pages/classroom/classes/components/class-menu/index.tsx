import { DeleteClassActionModal } from '@/components/delete-class/delete-class';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useTenant } from '@/hooks/useTenant';
import { useTenantModules } from '@/hooks/useTenantModules';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { ChildListRouteState } from '@/pages/classroom/child-list/child-list.types';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { EditPlaygroupsRouteState } from '@/pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups.types';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSnackbar } from '@ecdlink/core';
import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface ClassMenuProps {
  isPrincipal: boolean;
  classroomGroupId: string;
  className: string;
  onClose: () => void;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const ClassMenu = ({
  isPrincipal,
  classroomGroupId,
  className,
  onClose,
  setSelectedTabIndex,
}: ClassMenuProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const history = useHistory();

  const { showMessage } = useSnackbar();
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const isOpenAccess = tenant?.isOpenAccess;
  const { hasPermissionToTakeAttendance } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();
  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance || isTrialPeriod;

  if (isDeleteModalOpen) {
    return (
      <DeleteClassActionModal
        classroomGroupId={classroomGroupId}
        onClose={onClose}
      />
    );
  }

  return (
    <ActionModal
      title={`What do you want to do for the ${className} class?`}
      actionButtons={[
        {
          leadingIcon: 'UserGroupIcon',
          colour: 'quatenary',
          text: 'See children',
          type: 'filled',
          onClick: () => {
            history.push(ROUTES.CLASSROOM.CHILDREN, {
              classroomGroupId,
            } as ChildListRouteState);
            onClose();
          },
          textColour: 'white',
        },
        ...((hasPermissionToEdit && attendanceEnabled && isWhiteLabel) ||
        (isOpenAccess && hasPermissionToEdit)
          ? ([
              {
                leadingIcon: 'ClipboardCheckIcon',
                colour: 'quatenary',
                text: 'Take attendance',
                type: 'outlined',
                onClick: async () => {
                  onClose();
                  setSelectedTabIndex(TabsItems.ATTENDANCE);
                  return history.push(ROUTES.CLASSROOM.ROOT, {
                    activeTabIndex: TabsItems.ATTENDANCE,
                    classroomGroupIdFromClassTab: classroomGroupId,
                  } as ClassDashboardRouteState);
                },
                textColour: 'quatenary',
              },
            ] as ActionModalButton[])
          : []),
        ...((hasPermissionToEdit && progressEnabled && isWhiteLabel) ||
        (isOpenAccess && hasPermissionToEdit)
          ? ([
              {
                leadingIcon: 'PresentationChartBarIcon',
                colour: 'quatenary',
                text: 'Track child progress',
                type: 'outlined',
                onClick: () => {
                  setSelectedTabIndex(TabsItems.PROGRESS);
                  history.push(ROUTES.CLASSROOM.ROOT, {
                    activeTabIndex: TabsItems.PROGRESS,
                  });
                  onClose();
                },
                textColour: 'quatenary',
              },
            ] as ActionModalButton[])
          : []),
        ...((hasPermissionToEdit &&
          classroomActivitiesEnabled &&
          isWhiteLabel) ||
        (isOpenAccess && hasPermissionToEdit)
          ? ([
              {
                leadingIcon: 'AcademicCapIcon',
                colour: 'quatenary',
                text: `${isPrincipal ? 'Plan' : 'See'} activities`,
                type: 'outlined',
                onClick: () => {
                  history.push(
                    ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
                      ':classroomGroupId',
                      classroomGroupId
                    )
                  );
                  onClose();
                },
                textColour: 'quatenary',
              },
            ] as ActionModalButton[])
          : []),
        ...(isPrincipal
          ? ([
              {
                leadingIcon: 'SwitchHorizontalIcon',
                colour: 'quatenary',
                text: 'Change practitioner',
                type: 'outlined',
                onClick: () => {
                  history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, {
                    redirectToClassesPage: true,
                    selectedClassroomGroupId: classroomGroupId,
                  } as EditPlaygroupsRouteState);
                  onClose();
                },
                textColour: 'quatenary',
              },
              {
                leadingIcon: 'TrashIcon',
                colour: 'errorMain',
                text: 'Remove class',
                type: 'outlined',
                onClick: () => setIsDeleteModalOpen(true),
                textColour: 'errorMain',
              },
            ] as ActionModalButton[])
          : []),
      ]}
    />
  );
};
