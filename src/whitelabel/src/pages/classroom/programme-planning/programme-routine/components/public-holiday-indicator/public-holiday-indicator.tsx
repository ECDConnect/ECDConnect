import { RoundIcon, Typography } from '@ecdlink/ui';
import { DateFormats } from '../../../../../../constants/Dates';

export const PublicHolidayIndicator: React.FC<{ date: Date }> = ({ date }) => {
  return (
    <div className={'flex flex-auto flex-col items-center justify-center'}>
      <RoundIcon
        icon="ExclamationCircleIcon"
        className={'bg-alertMain mt-12 text-white'}
      />
      <Typography
        type="body"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        text={`${date.toLocaleString(
          'en-ZA',
          DateFormats.dayWithLongMonthName
        )} is a public holiday`}
      />
      <Typography
        type="body"
        className="mt-1 w-1/2"
        align={'center'}
        weight="skinny"
        text={`You don't need to create a plan for this day`}
        color={'textMid'}
        fontSize="14"
      />
    </div>
  );
};
