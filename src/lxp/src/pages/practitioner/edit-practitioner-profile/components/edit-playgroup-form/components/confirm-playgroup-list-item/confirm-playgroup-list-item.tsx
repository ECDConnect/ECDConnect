import { Button, Typography, renderIcon } from '@ecdlink/ui';
import {
  formatMeetingDays,
  getWeekdayValue,
  Weekdays,
} from '@utils/practitioner/playgroups-utils';
import * as styles from './confirm-playgroup-list-item.styles';
import { ConfirmPlaygroupListItemProps } from './confirm-playgroup-list-item.types';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

export const ConfirmPlayGroupListItem: React.FC<
  ConfirmPlaygroupListItemProps
> = ({ index, playGroup, onPlayGroupEdit }) => {
  const isTrialPeriod = useIsTrialPeriod();
  const getText = () => {
    return playGroup.meetingDays
      .map((day) => getWeekdayValue(day as Weekdays).substring(0, 3))
      .join(', ');
  };

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const isPrincipal = practitioner?.isPrincipal === true;

  const getPractitionerName = () => {
    const classPractitionerName =
      practitioners?.find((item) => item?.user?.id === playGroup?.userId)?.user
        ?.firstName ||
      practitioners?.find((item) => item?.user?.id === playGroup?.userId)?.user
        ?.userName;

    const classPractitionerUserName = practitioners?.find(
      (item) => item?.user?.id === playGroup?.userId
    )?.user?.userName;
    return classPractitionerName
      ? `${classPractitionerName}; `
      : `${practitioner?.user?.firstName || practitioner?.user?.userName}; `;
  };

  return (
    <div className={styles.wrapper} key={`confirm-playgroup-item-${index}`}>
      <div className="flex-column flex-1">
        <Typography
          type="h4"
          color={'textDark'}
          text={`${playGroup.name}`}
          weight={'bold'}
        />
        <div>
          <Typography
            type={'span'}
            color={'textMid'}
            text={getPractitionerName()}
          />
          <Typography type={'span'} color={'textMid'} text={getText()} />
        </div>
      </div>
      {(isPrincipal || isTrialPeriod) && (
        <div>
          <Button
            size="small"
            shape="normal"
            color="secondaryAccent2"
            type="filled"
            onClick={onPlayGroupEdit}
          >
            <Typography type="help" color="secondary" text="Edit" />
            {renderIcon('PencilIcon', styles.buttonIcon)}
          </Button>
        </div>
      )}
    </div>
  );
};
