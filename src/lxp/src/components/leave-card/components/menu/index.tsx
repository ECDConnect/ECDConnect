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
import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface LeaveCardMenuProps {
  practitioner: PractitionerDto;
  onClose: () => void;
}

export const LeaveCardMenu = ({
  practitioner,
  onClose,
}: LeaveCardMenuProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);

  const history = useHistory();

  const { refreshClassroom } = useStoreSetup();

  const appDispatch = useAppDispatch();

  const { currentClassesReassigned } = usePractitionerAbsentees(practitioner);

  const onDelete = async () => {
    if (userAuth) {
      setIsDeleting(true);
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
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
      if (user?.id === practitioner?.userId) {
        await appDispatch(
          practitionerThunkActions.getPractitionerByUserId({
            userId: practitioner?.id!,
          })
        ).unwrap();
      }
      setIsDeleting(false);
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
                practitionerId: practitioner?.id,
                principalPractitioner: practitioner?.isPrincipal
                  ? practitioner
                  : undefined,
                allAbsenteeClasses: currentClassesReassigned,
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
                practitionerId: practitioner?.id,
                principalPractitioner: practitioner?.isPrincipal
                  ? practitioner
                  : undefined,
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
