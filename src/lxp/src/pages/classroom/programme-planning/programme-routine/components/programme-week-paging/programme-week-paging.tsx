import { Button, Typography } from '@ecdlink/ui';
import { ProgrammeWeekPagingProps } from './programme-week-paging.types';

export const ProgrammeWeekPaging: React.FC<ProgrammeWeekPagingProps> = ({
  activeIndex = 0,
  onBack,
  onNext,
  maxIndex,
}) => {
  const displayIndex = activeIndex + 1;

  return (
    <div className={'w-full p-4 flex flex-row items-center justify-between'}>
      <div className={'w-1/3 flex flex-row justify-center'}>
        {activeIndex - 1 > -1 && (
          <Button
            type={'outlined'}
            textColor={'primary'}
            color={'primary'}
            size={'small'}
            icon={'ArrowCircleLeftIcon'}
            iconPosition={'start'}
            text={`Week ${displayIndex - 1}`}
            onClick={onBack}
          />
        )}
      </div>
      <div className={'w-1/3 flex flex-row justify-center'}>
        <Typography
          text={`Week ${displayIndex} of ${maxIndex + 1}`}
          type={'small'}
        />
      </div>
      <div className={'w-1/3 flex flex-row justify-center'}>
        {activeIndex < maxIndex && (
          <Button
            type={'outlined'}
            textColor={'primary'}
            color={'primary'}
            size={'small'}
            icon={'ArrowCircleRightIcon'}
            iconPosition={'end'}
            text={`Week ${displayIndex + 1}`}
            onClick={onNext}
          />
        )}
      </div>
    </div>
  );
};
