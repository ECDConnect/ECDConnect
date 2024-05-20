import { ChildListRouteState } from '@/pages/classroom/child-list/child-list.types';
import {
  ClassDashboardRouteState,
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import ROUTES from '@/routes/routes';
import { ActionModal } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useHistory } from 'react-router';

interface ClassMenuProps {
  isPrincipal: boolean;
  classId: string;
  className: string;
  onClose: () => void;
}

export const ClassMenu = ({
  isPrincipal,
  classId,
  className,
  onClose,
}: ClassMenuProps) => {
  const history = useHistory();

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
              classroomGroupId: classId,
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
              activeTabIndex: isPrincipal
                ? TabsItemForPrincipal.ATTENDANCE
                : TabsItems.ATTENDANCE,
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
          onClick: () => {},
          textColour: 'quatenary',
        },
        {
          leadingIcon: 'AcademicCapIcon',
          colour: 'quatenary',
          text: `${isPrincipal ? 'Plan' : 'See'} activities`,
          type: 'outlined',
          onClick: () => {},
          textColour: 'quatenary',
        },
        ...(isPrincipal
          ? ([
              {
                leadingIcon: 'SwitchHorizontalIcon',
                colour: 'quatenary',
                text: 'Change practitioner',
                type: 'outlined',
                onClick: () => {},
                textColour: 'quatenary',
              },
              {
                leadingIcon: 'TrashIcon',
                colour: 'errorMain',
                text: 'Remove class',
                type: 'outlined',
                onClick: () => {},
                textColour: 'errorMain',
              },
            ] as ActionModalButton[])
          : []),
      ]}
    />
  );
};
