import { FormComponentProps } from '@ecdlink/core';
import {
  Button,
  Divider,
  LoadingSpinner,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useState } from 'react';
import { newGuid } from '@utils/common/uuid.utils';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import * as styles from '../../edit-practitioner-profile.styles';
import { ConfirmPlayGroupListItem } from '../edit-playgroup-form/components/confirm-playgroup-list-item/confirm-playgroup-list-item';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
interface ConfirmPlayGroupsProps extends FormComponentProps<any | void> {
  defaultPlayGroups: EditPlaygroupModel[];
  onEditPlaygroup: (
    playgroups: EditPlaygroupModel[],
    index: number,
    addingPlayGroup?: boolean
  ) => void;
  title?: string;
  isLoading?: boolean;
}

export const ConfirmPlayGroups: React.FC<ConfirmPlayGroupsProps> = ({
  defaultPlayGroups,
  onSubmit,
  onEditPlaygroup,
  title = 'Confirm Playgroups',
  isLoading,
}) => {
  const [playgroups, setPlayGroups] =
    useState<EditPlaygroupModel[]>(defaultPlayGroups);
  const onAddNewPlaygroup = () => {
    playgroups.push({
      meetingDays: [],
      name: '',
      classroomGroupId: newGuid(),
      meetEveryday: undefined,
    });
    onEditPlaygroup(playgroups, playgroups.length - 1, true);
  };
  const isTrialPeriod = useIsTrialPeriod();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;

  useEffect(() => {
    setPlayGroups(defaultPlayGroups);
  }, [defaultPlayGroups]);

  return (
    <>
      <Typography
        type={'h1'}
        text={title}
        color={'primary'}
        className={'mt-3'}
      />

      {isLoading ? (
        <LoadingSpinner
          size="medium"
          spinnerColor={'quatenary'}
          backgroundColor={'uiLight'}
          className="my-8 w-full"
        />
      ) : (
        playgroups.map((playGroup, index) => {
          return (
            <div key={`confirm-playgroup-${index}`}>
              {index > 0 && (
                <Divider dividerType="dashed" className={styles.divider} />
              )}

              <ConfirmPlayGroupListItem
                playGroup={playGroup}
                index={index}
                onPlayGroupEdit={() => onEditPlaygroup(playgroups, index)}
              />
            </div>
          );
        })
      )}

      <Divider className="mt-4 mb-1" dividerType="dashed" />

      {(isPrincipal || isTrialPeriod) && (
        <Button
          className="my-4"
          color="quatenary"
          type="filled"
          shape="normal"
          onClick={onAddNewPlaygroup}
          isLoading={isLoading}
        >
          {renderIcon('PlusSmIcon', 'text-white w-5')}
          <Typography text="Add class" type="help" color="white" />
        </Button>
      )}

      {(isPrincipal || isTrialPeriod) && playgroups?.length > 0 && (
        <Button
          type="filled"
          color="quatenary"
          className={'my-3 w-full'}
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            onSubmit(playgroups);
          }}
        >
          {!isLoading && renderIcon('CheckCircleIcon', styles.icon)}
          <Typography type={'help'} text={'Confirm'} color={'white'} />
        </Button>
      )}
    </>
  );
};
