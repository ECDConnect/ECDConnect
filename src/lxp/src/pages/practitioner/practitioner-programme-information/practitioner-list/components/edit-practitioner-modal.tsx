import ROUTES from '@/routes/routes';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerDto } from '@ecdlink/core';
import { PractitionerRemovalHistory } from '@ecdlink/graphql';
import { Button, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import EditRemovePractitionerFromProgrammePrompt from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/remove-practitioner-from-programme/edit-remove-practitioner-from-programme-prompt';
import { classroomsSelectors } from '@/store/classroom';
import { EditPractitionerPermissions } from './edit-practitioner-permissions';
import { ReassignClassPageState } from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class.types';

export const EditPractitionerModal = ({
  setEditPractitionerModal,
  practitioner,
}: {
  setEditPractitionerModal: (item: boolean) => void;
  practitioner?: PractitionerDto;
}) => {
  const history = useHistory();
  const location = useLocation<object>();

  const userAuth = useSelector(authSelectors.getAuthUser);
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const [existingRemovals, setExisitingRemovals] = useState<
    PractitionerRemovalHistory[]
  >([]);
  const [editPractitionerPermissions, setEditPractitionerPermissions] =
    useState(false);
  const [removingPractitionerId, setRemovingPractitionerId] = useState<
    string | undefined
  >(undefined);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const modalTitle = !practitioner?.isPrincipal
    ? `What do you want to do on ${
        practitioner?.user?.firstName || practitioner?.user?.userName
      }'s profile?`
    : `What do you want to do on your profile?`;

  const getRemovalsForPractitioners = async () => {
    if (practitioners) {
      const removalDetails = await new PractitionerService(
        userAuth?.auth_token!
      ).getRemovalsForPractitioners(
        practitioners!.map((x) => x.userId as string)
      );
      setExisitingRemovals(removalDetails || []);
      return removalDetails;
    }
  };

  const cancelPractitionerRemoval = async () => {
    const removalId = existingRemovals?.find(
      (x) => x.userId === removingPractitionerId
    )?.id;
    if (removalId) {
      await new PractitionerService(
        userAuth?.auth_token || ''
      ).cancelRemovePractitionerFromProgramme(removalId);
      setExisitingRemovals(
        existingRemovals.filter((x) => x.userId !== removingPractitionerId)
      );
      setRemovingPractitionerId(undefined);
    }
  };

  useEffect(() => {
    getRemovalsForPractitioners();
  }, [practitioners]);

  const handleRemoveuser = () => {
    const userId = practitioner?.userId || '';
    if (practitioner?.isPrincipal && userId === practitioner?.userId) {
      if (!!practitioners && practitioners.length) {
        history.push(ROUTES.PRINCIPAL.SWAP_PRINCIPAL);
      }
    } else {
      const existingRemoval = existingRemovals?.find(
        (x) => x.userId === userId
      );
      if (existingRemoval) {
        setRemovingPractitionerId(userId);
      } else {
        history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
          practitionerId: userId,
        });
      }
    }
  };

  const handleReassignClass = () => {
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
      ...location.state,
      practitionerId: practitioner?.userId!,
      isFromEditPractitionersPage: true,
    } as ReassignClassPageState);
  };

  return (
    <div className="h-full w-full p-4">
      <Typography
        type="h4"
        text={modalTitle}
        color={'textDark'}
        className="mt-4 w-full"
        align="center"
      />
      <div className="-mb-4 mt-4 flex h-full  flex-col justify-center gap-2">
        {!practitioner?.isPrincipal && (
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="quatenary"
            text="Change app rules"
            textColor="white"
            icon="LockOpenIcon"
            onClick={() => setEditPractitionerPermissions(true)}
          />
        )}
        <Button
          size="normal"
          className="w-full"
          type="outlined"
          color="quatenary"
          text="Add leave"
          textColor="quatenary"
          icon="PencilAltIcon"
          onClick={() => handleReassignClass()}
        />
        {!practitioner?.isPrincipal && (
          <Button
            size="normal"
            className="w-full"
            type="outlined"
            color="quatenary"
            text={`Remove ${
              practitioner?.user?.firstName || practitioner?.user?.userName
            }`}
            textColor="quatenary"
            icon="TrashIcon"
            onClick={() => handleRemoveuser()}
          />
        )}
        <Button
          size="normal"
          className="mb-8 w-full"
          type="outlined"
          color="quatenary"
          text="Cancel"
          textColor="quatenary"
          icon="XIcon"
          onClick={() => setEditPractitionerModal(false)}
        />
      </div>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={!!removingPractitionerId}
        position={DialogPosition.Bottom}
      >
        <EditRemovePractitionerFromProgrammePrompt
          practitioner={practitioner}
          classroomName={classroom?.name || ''}
          removalDetails={
            existingRemovals?.find(
              (x) => x.userId === removingPractitionerId
            ) as PractitionerRemovalHistory
          }
          onEdit={() => {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
              practitionerId: removingPractitionerId,
            });
          }}
          onCancel={() => {
            cancelPractitionerRemoval();
          }}
          onClose={() => {
            setRemovingPractitionerId(undefined);
          }}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={editPractitionerPermissions}
        position={DialogPosition.Full}
      >
        <EditPractitionerPermissions
          setEditPractitionerModal={setEditPractitionerModal}
          setEditPractitionerPermissions={setEditPractitionerPermissions}
          practitioner={practitioner}
          isFromProfileSection={true}
        />
      </Dialog>
    </div>
  );
};
