import { useEffect, useState } from 'react';
import { generateEmptyPlaygroups } from '@utils/practitioner/playgroups-utils';
import { EditPlaygroupForm } from '../edit-playgroup-form/edit-playgroup.form';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { EditMultiplePlayGroupsProps } from './edit-multiple-playgroups.types';
import { useSelector } from 'react-redux';
import { notificationsSelectors } from '@/store/notifications';
import { useAppDispatch } from '@/store';

export const EditMultiplePlayGroups: React.FC<EditMultiplePlayGroupsProps> = ({
  numberOfPlaygroups,
  defaultPlayGroups,
  editPlaygroupAtIndex,
  onSubmit,
  onPlayGroupDelete,
}) => {
  const appDispatch = useAppDispatch();
  const [playgroups, setPlaygroups] = useState<EditPlaygroupModel[]>(
    defaultPlayGroups || generateEmptyPlaygroups(numberOfPlaygroups)
  );
  const [currentPlayGroupIndex, setCurrentPlaygroupIndex] = useState<number>(
    editPlaygroupAtIndex || 0
  );
  const currentPlayGroup = playgroups[currentPlayGroupIndex];

  useEffect(() => {
    if (!defaultPlayGroups) return;

    setPlaygroups(defaultPlayGroups);

    setCurrentPlaygroupIndex(editPlaygroupAtIndex || 0);
  }, [defaultPlayGroups, editPlaygroupAtIndex]);

  const assignPractitionerNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter((item) => item?.message?.cta?.includes('[[AssignPractitioner]]'));

  const removeNotifications = async (playgroup?: EditPlaygroupModel) => {
    if (
      assignPractitionerNotifications &&
      assignPractitionerNotifications?.length > 0 &&
      playgroup
    ) {
      const classNotifications = assignPractitionerNotifications.filter(
        (item) => item?.message?.title.includes(playgroup.name)
      );
      classNotifications.map((notification) => {
        appDispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      });
    }
  };

  const onPlayGroupSubmitted = (playgroup?: EditPlaygroupModel) => {
    if (playgroup) {
      playgroups.splice(currentPlayGroupIndex, 1, playgroup);
      removeNotifications(playgroup);
    }

    setPlaygroups(playgroups);

    const isLast = currentPlayGroupIndex === numberOfPlaygroups - 1;

    if (isLast || editPlaygroupAtIndex !== undefined) {
      onSubmit(playgroups);
      return;
    }

    const nextPlaygroupIndex = currentPlayGroupIndex + 1;
    setCurrentPlaygroupIndex(nextPlaygroupIndex);
  };

  const deletePlaygroup = (playgroup: EditPlaygroupModel) => {
    onPlayGroupDelete && onPlayGroupDelete(playgroup);
    removeNotifications(playgroup);
  };

  return (
    <EditPlaygroupForm
      isNew={editPlaygroupAtIndex === undefined}
      playgroup={currentPlayGroup}
      title={`Class ${currentPlayGroupIndex + 1}`}
      onSubmit={onPlayGroupSubmitted}
      onDelete={() => {
        deletePlaygroup(currentPlayGroup);
      }}
    />
  );
};
