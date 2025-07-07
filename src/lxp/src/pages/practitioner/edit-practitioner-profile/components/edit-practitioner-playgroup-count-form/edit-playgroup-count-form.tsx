import { FormComponentProps } from '@ecdlink/core';
import {
  Button,
  ButtonGroup,
  Divider,
  Typography,
  ButtonGroupTypes,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';
import * as styles from '../../edit-practitioner-profile.styles';
import { playgroupsOptions } from './edit-playgroup-count-form.types';

export const EditPlaygroupCountForm: React.FC<FormComponentProps<number>> = ({
  onSubmit,
}) => {
  const [playGroupCount, setPlaygroupCount] = useState<number>(0);

  return (
    <>
      <Typography
        type={'h1'}
        text={'Set up your playgroups'}
        color={'primary'}
        className={'my-3'}
      />
      <div className={'w-full'}>
        <label className={styles.label}>How many playgroups do you have?</label>
        <div className="mt-1">
          <ButtonGroup
            options={playgroupsOptions}
            onOptionSelected={(value: number | number[]) => {
              setPlaygroupCount(value as number);
            }}
            selectedOptions={[playGroupCount]}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
          />
        </div>
      </div>
      <Divider className={'mb-3 mt-3'} />

      <Button
        type="filled"
        color="primary"
        className={'w-full'}
        disabled={playGroupCount <= 0}
        onClick={() => onSubmit(playGroupCount)}
      >
        {renderIcon('ArrowCircleRightIcon', styles.icon)}
        <Typography type={'help'} text={'Next'} color={'white'} />
      </Button>
    </>
  );
};
