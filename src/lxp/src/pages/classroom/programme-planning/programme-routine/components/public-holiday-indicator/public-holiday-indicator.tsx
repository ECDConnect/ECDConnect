import { Button, Typography, renderIcon } from '@ecdlink/ui';
import HolidayEmoji from '../../../../../../assets/holidayEmoji.png';
import { DailyProgrammeDto } from '@/../../../packages/core/lib';
import { nextMonday } from 'date-fns';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

interface PublicHolidayProps {
  date: Date;
  nextProgrammeDaysWithoutActivity?: DailyProgrammeDto[];
  setSelectedDate?: (date: Date) => void;
}

export const PublicHolidayIndicator: React.FC<PublicHolidayProps> = ({
  date,
  nextProgrammeDaysWithoutActivity,
  setSelectedDate,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  return (
    <div className={'flex flex-auto flex-col items-center justify-center'}>
      <div>
        <img
          src={HolidayEmoji}
          alt="weekend emoji"
          className="mt-8 h-28 w-28"
        />
      </div>
      <Typography
        type="body"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        text={`This is a public holiday. Get a head start by planning next week!`}
      />
      <Typography
        type="body"
        className="mt-1 w-1/2"
        align={'center'}
        weight="skinny"
        text={
          nextProgrammeDaysWithoutActivity?.length
            ? `You have ${nextProgrammeDaysWithoutActivity?.length} ${
                nextProgrammeDaysWithoutActivity?.length === 1 ? 'day' : 'days'
              } to plan next week`
            : ``
        }
        color={'textMid'}
        fontSize="14"
      />
      {hasPermissionToEdit && (
        <div className={'pt-2'}>
          <Button
            color={'secondary'}
            type={'outlined'}
            onClick={() =>
              setSelectedDate && nextProgrammeDaysWithoutActivity?.length
                ? setSelectedDate(
                    new Date(nextProgrammeDaysWithoutActivity?.[0]?.dayDate!)
                  )
                : setSelectedDate && setSelectedDate(nextMonday(new Date(date)))
            }
            className={'mt-4 mb-4 w-full'}
          >
            {renderIcon('ClipboardListIcon', `w-5 h-5 text-secondary`)}
            <Typography
              color={'secondary'}
              type={'help'}
              weight={'normal'}
              text={'Start planning'}
            />
          </Button>
        </div>
      )}
    </div>
  );
};
