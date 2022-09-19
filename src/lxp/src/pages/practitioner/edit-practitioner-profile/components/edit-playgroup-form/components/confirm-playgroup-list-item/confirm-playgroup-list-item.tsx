import { Button, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import {
  getWeekdayValue,
  Weekdays,
} from '@utils/practitioner/playgroups-utils';
import * as styles from './confirm-playgroup-list-item.styles';
import { ConfirmPlaygroupListItemProps } from './confirm-playgroup-list-item.types';

export const ConfirmPlayGroupListItem: React.FC<
  ConfirmPlaygroupListItemProps
> = ({ index, playGroup, onPlayGroupEdit }) => {
  const getText = () => {
    return playGroup.meetingDays
      .map((day) => getWeekdayValue(day as Weekdays))
      .join(' & ');
  };

  return (
    <div className={styles.wrapper} key={`confirm-playgroup-item-${index}`}>
      <div className="flex-1 flex-column">
        <Typography
          type="body"
          color={'textMid'}
          text={`Class ${index + 1}: ${playGroup.name}`}
          weight={'bold'}
        />
        <div>
          <Typography type={'span'} color={'textMid'} text={getText()} />
          <Typography
            type={'span'}
            color={'textMid'}
            text={`, ${playGroup.isFullDay ? 'Full Day' : 'Half Day'}`}
          />
        </div>
      </div>
      <div>
        <Button
          size="small"
          shape="normal"
          color="primary"
          type="outlined"
          onClick={onPlayGroupEdit}
        >
          <Typography type="help" color="primary" text="Edit" />
          {renderIcon('PencilIcon', styles.buttonIcon)}
        </Button>
      </div>
    </div>
  );
};
