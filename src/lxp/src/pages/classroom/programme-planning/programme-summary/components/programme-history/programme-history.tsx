import { ProgrammeDto } from '@ecdlink/core/';
import { BaseListItem, Button, Typography } from '@ecdlink/ui/';
import { programmeSelectors } from '@store/programme';
import { useSelector } from 'react-redux';
import { getDateRangeText } from '@utils/classroom/programme-planning/programmes.utils';
import { ProgrammeHistoryProps } from './programme-history.types';

export const ProgrammeHistory: React.FC<ProgrammeHistoryProps> = ({
  date,
  onViewItem,
}) => {
  const historicalProgrammes: ProgrammeDto[] = useSelector(
    programmeSelectors.getProgrammesBeforeDate(date || new Date())
  );

  const postSlotRender = (item: ProgrammeDto) => {
    return (
      <Button
        type={'outlined'}
        color={'primary'}
        icon={'EyeIcon'}
        iconPosition={'end'}
        textColor={'primary'}
        text={'View'}
        size={'small'}
        onClick={() => onViewItem(item)}
      />
    );
  };

  const preSlotRender = () => <></>;

  if (historicalProgrammes.length === 0) return <></>;

  return (
    <div className={'w-full flex flex-col'}>
      <Typography
        text={'Previous programmes'}
        type={'body'}
        className={'ml-4'}
      />
      {historicalProgrammes &&
        historicalProgrammes.map((programme, idx) => {
          return (
            <BaseListItem
              key={programme.id}
              overwritePreSlotRender={preSlotRender}
              titleTypography={{
                text: programme.name,
                weight: 'skinny',
                type: 'small',
                color: 'textLight',
              }}
              subTitleTypography={{
                text: getDateRangeText(programme.startDate, programme.endDate),
                type: 'body',
              }}
              backgroundColor={'transparent'}
              dividerType={`${idx > 0 ? 'dashed' : 'none'}`}
              dividerColor={'uiLight'}
              overwritePostSlotRender={() => postSlotRender(programme)}
            />
          );
        })}
    </div>
  );
};
