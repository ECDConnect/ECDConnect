import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useAppDispatch } from '@/store';
import { classroomsSelectors, classroomsThunkActions } from '@/store/classroom';
import { ClassroomActions } from '@/store/classroom/classroom.actions';
import { useSnackbar } from '@ecdlink/core';
import { ActionModal } from '@ecdlink/ui';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface DeleteClassProps {
  classroomGroupId: string;
  onClose: () => void;
}
export const DeleteClassActionModal = ({
  classroomGroupId,
  onClose,
}: DeleteClassProps) => {
  const { isOnline } = useOnlineStatus();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'classroomData',
    ClassroomActions.UPDATE_CLASSROOM_GROUP
  );

  const canDeleteClassroomGroup = !classroomGroup?.learners?.filter(
    (learner) => learner?.isActive !== false
  ).length;

  const onDelete = () => {
    appDispatch(
      classroomsThunkActions.updateClassroomGroup({
        id: classroomGroupId,
        classroomGroup: {
          ...classroomGroup!,
          learners: [],
          isActive: false,
        },
      })
    );
  };

  useEffect(() => {
    if (!isLoading && wasLoading) {
      if (isRejected) {
        return showMessage({
          message: error,
          type: 'error',
        });
      }

      showMessage({
        message: 'Class deleted successfully',
        type: 'success',
      });
      onClose();
    }
  }, [error, isLoading, isRejected, onClose, showMessage, wasLoading]);

  if (!isOnline) {
    return <OnlineOnlyModal onSubmit={onClose} />;
  }

  if (!canDeleteClassroomGroup) {
    return (
      <ActionModal
        customIcon={
          <ExclamationCircleIcon className="text-alertMain mb-4 h-10 w-10" />
        }
        title={`Cannot delete this class`}
        paragraphs={[
          'To delete a class, first move all children to a different class or remove children who are no longer in your preschool.',
        ]}
        actionButtons={[
          {
            text: 'Close',
            textColour: 'quatenary',
            colour: 'quatenary',
            type: 'outlined',
            onClick: onClose,
            leadingIcon: 'XIcon',
          },
        ]}
      />
    );
  }

  return (
    <ActionModal
      customIcon={
        <ExclamationCircleIcon className="text-alertMain mb-4 h-10 w-10" />
      }
      title={`Delete ${classroomGroup?.name} class?`}
      paragraphs={[
        `Are you sure you want to delete ${classroomGroup?.name} class?`,
      ]}
      actionButtons={[
        {
          text: 'Yes, delete class',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          disabled: isLoading,
          isLoading: isLoading,
          onClick: onDelete,
          leadingIcon: 'TrashIcon',
        },
        {
          text: 'No, cancel',
          textColour: isLoading ? 'textLight' : 'quatenary',
          colour: 'quatenary',
          type: 'outlined',
          disabled: isLoading,
          isLoading: isLoading,
          onClick: onClose,
          leadingIcon: 'XIcon',
        },
      ]}
    />
  );
};
