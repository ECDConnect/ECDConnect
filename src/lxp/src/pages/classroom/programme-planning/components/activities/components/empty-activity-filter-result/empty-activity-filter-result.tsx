import { classNames, RoundIcon, Typography } from '@ecdlink/ui';
import { EmprtActivitiesProps } from './empty-activity-filter-result.types';

export const EmptyActivities: React.FC<EmprtActivitiesProps> = ({
  title,
  subTitle,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-auto flex-col pb-6 justify-center items-center',
        className
      )}
    >
      <RoundIcon
        icon="ExclamationCircleIcon"
        className={'bg-alertMain text-white mt-6'}
      />
      <Typography
        type="body"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        text={title}
      />
      <Typography
        type="body"
        className="mt-1 w-1/2"
        align={'center'}
        weight="skinny"
        text={subTitle}
        color={'textMid'}
        fontSize="14"
      />
    </div>
  );
};
