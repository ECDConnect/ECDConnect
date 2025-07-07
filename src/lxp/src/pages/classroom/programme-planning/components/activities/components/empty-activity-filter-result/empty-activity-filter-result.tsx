import { classNames, Typography } from '@ecdlink/ui';
import { EmprtActivitiesProps } from './empty-activity-filter-result.types';
import { ReactComponent as Emoji4 } from '@/assets/ECD_Connect_emoji4.svg';

export const EmptyActivities: React.FC<EmprtActivitiesProps> = ({
  title,
  subTitle,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-auto flex-col items-center justify-center pb-6',
        className
      )}
    >
      <Emoji4 className="h-28 w-28" />
      <Typography
        type="h2"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        color="textDark"
        text={title}
      />
      <Typography
        type="body"
        className="mt-1"
        align={'center'}
        weight="skinny"
        text={subTitle}
        color={'textMid'}
        fontSize="14"
      />
    </div>
  );
};
