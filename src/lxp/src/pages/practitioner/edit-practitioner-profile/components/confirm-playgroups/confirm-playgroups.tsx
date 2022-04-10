import { FormComponentProps } from '@ecdlink/core';
import { Button, Divider, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useState } from 'react';
import { newGuid } from '@utils/common/uuid.utils';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import * as styles from '../../edit-practitioner-profile.styles';
import { ConfirmPlayGroupListItem } from '../edit-playgroup-form/components/confirm-playgroup-list-item/confirm-playgroup-list-item';
interface ConfirmPlayGroupsProps extends FormComponentProps<any | void> {
  defaultPlayGroups: EditPlaygroupModel[];
  onEditPlaygroup: (playgroups: EditPlaygroupModel[], index: number) => void;
  title?: string;
}

export const ConfirmPlayGroups: React.FC<ConfirmPlayGroupsProps> = ({
  defaultPlayGroups,
  onSubmit,
  onEditPlaygroup,
  title = 'Confirm Playgroups',
}) => {
  const [playgroups, setPlayGroups] = useState<EditPlaygroupModel[]>(defaultPlayGroups);

  const onAddNewPlaygroup = () => {
    playgroups.push({ meetingDays: [], name: '', classroomGroupId: newGuid() });
    onEditPlaygroup(playgroups, playgroups.length - 1);
  };

  useEffect(() => {
    setPlayGroups(defaultPlayGroups);
  }, [defaultPlayGroups]);

  return (
    <>
      <Typography type={'h1'} text={title} color={'primary'} className={'mt-3'} />

      {playgroups.map((playGroup, index) => {
        return (
          <div key={`confirm-playgroup-${index}`}>
            {index > 0 && <Divider dividerType="dashed" className={styles.divider} />}

            <ConfirmPlayGroupListItem
              playGroup={playGroup}
              index={index}
              onPlayGroupEdit={() => onEditPlaygroup(playgroups, index)}
            />
          </div>
        );
      })}

      {playgroups.length < 5 && (
        <Button
          className="mt-4"
          color="secondary"
          type="filled"
          shape="normal"
          onClick={onAddNewPlaygroup}
        >
          {renderIcon('PlusSmIcon', styles.icon)}
          <Typography className="mx-2" text="Add playgroup" type="help" color="white" />
        </Button>
      )}

      <Divider className="mt-4 mb-1" dividerType="solid" />

      <Button
        type="filled"
        color="primary"
        className={'w-full my-3'}
        onClick={() => {
          onSubmit(playgroups);
        }}
      >
        {renderIcon('CheckCircleIcon', styles.icon)}
        <Typography type={'help'} text={'Confirm'} color={'white'} />
      </Button>
    </>
  );
};
