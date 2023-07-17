import { classNames, Colours, renderIcon, Typography } from '@ecdlink/ui';
import { useMemo } from 'react';

export interface CardProps {
  label: string;
  value: string;
  date: string;
  message: string;
  color: 'Success' | 'Warning' | 'Error';
  measure: 'kg' | 'cm';
  className?: string;
}

export const Card = ({
  className,
  label,
  value,
  date,
  message,
  color,
  measure,
}: CardProps) => {
  const { primaryColour, secondaryColour, icon } = useMemo((): {
    primaryColour: Colours;
    secondaryColour: Colours;
    icon: string;
  } => {
    switch (color) {
      case 'Warning':
        return {
          primaryColour: 'alertMain',
          secondaryColour: 'alertBg',
          icon: 'ExclamationIcon',
        };
      case 'Error':
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          icon: 'ExclamationCircleIcon',
        };
      case 'Success':
      default:
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          icon: 'BadgeCheckIcon',
        };
    }
  }, [color]);

  const currentDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formattedDate =
    date && currentDate.toLocaleDateString('en-ZA', options);

  return (
    <div
      className={classNames(
        className,
        `rounded-10 p-4 bg-${secondaryColour} flex`
      )}
    >
      <div className={`w-2/4 border-r border-dashed border-${primaryColour}`}>
        <Typography type="h4" text={label} />
        <span className="my-3 flex gap-1">
          <Typography
            type="h4"
            className="text-3xl"
            color={primaryColour}
            text={value}
          />
          <Typography type="body" color="textMid" text={measure} />
        </span>
        <Typography color="textMid" type="body" text={formattedDate} />
      </div>
      <div className="flex w-2/4 flex-col items-center justify-center px-4 text-center">
        {renderIcon(icon, `w-5 h-5 text-${primaryColour}`)}
        <Typography color="textMid" type="body" text={message} />
      </div>
    </div>
  );
};
