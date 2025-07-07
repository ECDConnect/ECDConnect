import { Typography } from '@ecdlink/ui';
import { TitleStatusChip } from '../TitleStatusChip/title-status-chip';
import { ProgrammeRoutineSubItemProps } from './daily-routine-sub-item-info.types';

export const DailyRoutineSubItemInfo: React.FC<
  ProgrammeRoutineSubItemProps
> = ({ routineSubItem }) => {
  return (
    <div className={'flex flex-col mt-4'}>
      <div className={'flex flex-row items-center justify-start'}>
        <div
          className={'rounded-md flex flex-col items-center justify-center'}
          style={{ backgroundColor: routineSubItem.imageBackgroundColor }}
        >
          <img src={routineSubItem.image} alt="routine item" />
        </div>
        <TitleStatusChip
          className={'ml-4'}
          timeSpan={routineSubItem.timeSpan}
          titleTypographyProps={{
            type: 'unspecified',
            fontSize: '16',
            color: 'textMid',
            text: `${routineSubItem.name}`,
          }}
        />
      </div>
      <Typography
        className={'mt-2'}
        type={'unspecified'}
        hasMarkup
        fontSize={'14'}
        color={'textMid'}
        text={routineSubItem.description}
      />
    </div>
  );
};
