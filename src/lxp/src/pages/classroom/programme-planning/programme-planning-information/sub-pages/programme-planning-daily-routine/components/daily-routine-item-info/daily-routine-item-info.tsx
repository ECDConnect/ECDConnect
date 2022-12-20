import { Alert, RoundIcon, Typography } from '@ecdlink/ui';
import { DailyRoutineSubItemInfo } from '../daily-routine-sub-item-info/daily-routine-sub-item-info';
import { TitleStatusChip } from '../TitleStatusChip/title-status-chip';
import {
  DailyRoutineItemInfoHeaderProps,
  DailyRoutineItemInfoProps,
} from './daily-routine-item-info.types';

export const DailyRoutineItemInfo: React.FC<DailyRoutineItemInfoProps> = ({
  routineItem,
}) => {
  return (
    <div className={'mt-4 flex w-full flex-col'}>
      <div
        className={'flex flex-col items-center justify-center rounded-md'}
        style={{ backgroundColor: routineItem.imageBackgroundColor }}
      >
        <img src={routineItem.image} alt="routine item" />
      </div>
      <DailyRoutineItemInfoHeader routineItem={routineItem} />
      <Typography
        className={'mt-2'}
        type={'unspecified'}
        hasMarkup
        fontSize={'14'}
        color={'textMid'}
        text={routineItem.description}
      />

      {routineItem?.routineSubItems?.map((subItem) => (
        <DailyRoutineSubItemInfo key={subItem.id} routineSubItem={subItem} />
      ))}

      {routineItem.alert?.length > 0 && (
        <Alert className={'mt-2'} type={'info'} message={routineItem.alert} />
      )}
    </div>
  );
};

export const DailyRoutineItemInfoHeader: React.FC<
  DailyRoutineItemInfoHeaderProps
> = ({ routineItem }) => {
  return (
    <div className={'mt-2 flex flex-row items-center justify-start'}>
      <RoundIcon
        hexBackgroundColor={routineItem.iconBackgroundColor}
        imageUrl={routineItem.icon}
      />
      <TitleStatusChip
        className={'ml-4'}
        timeSpan={routineItem.timeSpan}
        titleTypographyProps={{
          type: 'unspecified',
          fontSize: '16',
          text: `${routineItem.sequence ? routineItem.sequence : ''} ${
            routineItem.name
          }`,
        }}
      />
    </div>
  );
};
