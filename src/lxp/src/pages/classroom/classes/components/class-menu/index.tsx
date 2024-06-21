import { DeleteClassActionModal } from '@/components/delete-class/delete-class';
import { ChildListRouteState } from '@/pages/classroom/child-list/child-list.types';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { EditPlaygroupsRouteState } from '@/pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups.types';
import ROUTES from '@/routes/routes';
import { useSnackbar } from '@ecdlink/core';
import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useState } from 'react';
import { useHistory } from 'react-router';

interface ClassMenuProps {
  isPrincipal: boolean;
  classroomGroupId: string;
  className: string;
  onClose: () => void;
}

export const ClassMenu = ({
  isPrincipal,
  classroomGroupId,
  className,
  onClose,
}: ClassMenuProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const history = useHistory();

  const { showMessage } = useSnackbar();

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
        {
          leadingIcon: 'ClipboardCheckIcon',
          colour: 'quatenary',
          text: 'Take attendance',
          type: 'outlined',
          onClick: () => {
            history.push(ROUTES.CLASSROOM.ROOT, {
              activeTabIndex: TabsItems.ATTENDANCE,
              classroomGroupIdFromClassTab: classroomGroupId,
            } as ClassDashboardRouteState);
            onClose();
          },
          textColour: 'quatenary',
        },
        {
          leadingIcon: 'PresentationChartBarIcon',
          colour: 'quatenary',
          text: 'Track child progress',
          type: 'outlined',
          onClick: () => {
            // TODO: redirect to W9 when it's ready
            showMessage({
              message: 'This feature is not available yet (W9)',
              type: 'info',
            });
          },
          textColour: 'quatenary',
        },
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
