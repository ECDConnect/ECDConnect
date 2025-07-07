import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { ReassignClassPageState } from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class.types';
import ROUTES from '@/routes/routes';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { useAppDispatch } from '@/store';
import { authSelectors } from '@/store/auth';
import { practitionerThunkActions } from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface LeaveCardMenuProps {
  practitioner: PractitionerDto;
  absentee: AbsenteeDto;
  reassignClassRouteState?: Partial<ReassignClassPageState>;
  onClose: () => void;
}

export const LeaveCardMenu = ({
  absentee,
  practitioner,
  reassignClassRouteState,
  onClose,
}: LeaveCardMenuProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);

  const history = useHistory();

  const { refreshClassroom } = useStoreSetup();

  const appDispatch = useAppDispatch();

  const { getAbsenteeDetails } = usePractitionerAbsentees(practitioner);
  const { currentClassesReassigned } = getAbsenteeDetails(absentee);

  const onDelete = async () => {
    if (userAuth) {
      setIsDeleting(true);
      try {
        for (const leave of currentClassesReassigned ?? []) {
          await new ClassroomGroupService(userAuth.auth_token).editAbsentee(
            leave?.absenteeId!,
            true,
            practitioner?.id!,
            leave?.reason!,
            new Date(leave?.absentDate),
            new Date(leave?.absentDateEnd)
          );
        }
        await refreshClassroom();

        // Invalidate or refetch absentees after deletion
        await appDispatch(
          practitionerThunkActions.getAllPractitioners({})
        ).unwrap();
        await appDispatch(
          practitionerThunkActions.getPractitionerByUserId({
            userId: practitioner?.userId!,
          })
        ).unwrap();
      } catch (error) {
        console.error('Error deleting leave:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Dialog visible position={DialogPosition.Middle} className="px-4">
      <ActionModal
        icon="QuestionMarkCircleIcon"
        iconColor="infoMain"
        iconSize={24}
        title="What would you like to edit?"
        actionButtons={[
          {
            isLoading: isDeleting,
            disabled: isDeleting,
            type: 'filled',
            colour: 'quatenary',
            text: 'Edit this leave/absence',
            textColour: 'white',
            leadingIcon: 'PencilAltIcon',
            onClick: () => {
              history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
                practitionerId: practitioner?.userId,
                principalPractitioner: practitioner?.isPrincipal
                  ? practitioner
                  : undefined,
                allAbsenteeClasses: currentClassesReassigned,
                ...reassignClassRouteState,
              } as ReassignClassPageState);
              onClose();
            },
          },
          {
            isLoading: isDeleting,
            disabled: isDeleting,
            type: 'outlined',
            colour: 'quatenary',
            text: 'Add a new leave/absence',
            textColour: 'quatenary',
            leadingIcon: 'PlusIcon',
            onClick: () => {
              history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
                practitionerId: practitioner?.userId,
                principalPractitioner: practitioner?.isPrincipal
                  ? practitioner
                  : undefined,
                ...reassignClassRouteState,
              } as ReassignClassPageState);
              onClose();
            },
          },
          {
            isLoading: isDeleting,
            disabled: isDeleting,
            type: 'outlined',
            colour: 'quatenary',
            text: 'Delete this leave/absence',
            textColour: 'quatenary',
            leadingIcon: 'TrashIcon',
            onClick: async () => {
              await onDelete();
              onClose();
            },
          },
        ]}
      />
    </Dialog>
  );
};
