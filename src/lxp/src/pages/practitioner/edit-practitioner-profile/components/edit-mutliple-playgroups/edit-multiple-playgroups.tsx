import { useEffect } from 'react';
import { useState } from 'react';
import { generateEmptyPlaygroups } from '../../../../../utils/practitioner/playgroups-utils';
import { EditPlaygroupForm } from '../edit-playgroup-form/edit-playgroup.form';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { EditMultiplePlayGroupsProps } from './edit-multiple-playgroups.types';

export const EditMultiplePlayGroups: React.FC<EditMultiplePlayGroupsProps> = ({
  numberOfPlaygroups,
  defaultPlayGroups,
  editPlaygroupAtIndex,
  onSubmit,
  onPlayGroupDelete,
}) => {
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

  const onPlayGroupSubmitted = (playgroup?: EditPlaygroupModel) => {
    if (playgroup) {
      playgroups.splice(currentPlayGroupIndex, 1, playgroup);
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
  };

  return (
    <EditPlaygroupForm
      isNew={editPlaygroupAtIndex === undefined}
      playgroup={currentPlayGroup}
      title={`Playgroup ${currentPlayGroupIndex + 1}`}
      onSubmit={onPlayGroupSubmitted}
      onDelete={() => {
        deletePlaygroup(currentPlayGroup);
      }}
    />
  );
};
