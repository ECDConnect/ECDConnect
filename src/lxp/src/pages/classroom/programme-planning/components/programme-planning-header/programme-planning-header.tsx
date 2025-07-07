import { StatusChip, Typography, classNames } from '@ecdlink/ui/';
import { ProgrammePlanningHeaderProps } from './programme-planning-header.types';

export const ProgrammePlanningHeader: React.FC<
  ProgrammePlanningHeaderProps
> = ({
  themeName,
  headerText,
  subHeaderText,
  plannedWeeks = 0,
  totalWeeks = 0,
  showCount = true,
  showChips = true,
  className,
}) => {
  return (
    <div className={classNames(className, 'w-full px-4')}>
      <div className="flex flex-row items-center ">
        {showChips && (
          <StatusChip
            backgroundColour={'infoDark'}
            borderColour="transparent"
            textColour="white"
            text={themeName}
          />
        )}
        {themeName && themeName !== 'No theme' && showCount && showChips && (
          <>
            <StatusChip
              className={'ml-2'}
              backgroundColour={
                plannedWeeks < totalWeeks || totalWeeks === 0
                  ? 'alertMain'
                  : 'successMain'
              }
              borderColour="transparent"
              textColour="white"
              text={`${plannedWeeks} of ${totalWeeks}`}
            />
            <Typography
              type={'small'}
              text={'weeks planned'}
              color={
                plannedWeeks < totalWeeks || totalWeeks === 0
                  ? 'alertMain'
                  : 'successMain'
              }
              className={'ml-2'}
            />
          </>
        )}
      </div>
      <Typography type="h1" text={headerText} color={'primary'} />
      <Typography type="body" text={subHeaderText} />
    </div>
  );
};
