import {
  BaseListItem,
  StatusChip,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import * as styles from './programme-summary-list-item.styles';
import { ProgrammeSummaryListItemProps } from './programme-summary-list-item.types';

export const ProgrammeSummaryListItem: React.FC<
  ProgrammeSummaryListItemProps
> = ({ title, subTitle, programmeWeek, isCompleted = false, onClick }) => {
  const getRoutineItemPostSlotRender = () => {
    return (
      <>
        <StatusChip
          className={'mr-2'}
          padding={'px-2 py-1'}
          backgroundColour={'infoBb'}
          text={`Week ${programmeWeek}`}
          textColour={'infoDark'}
          borderColour={'infoBb'}
        >
          {renderIcon('ClockIcon', `w-5 h-5 text-infoDark ml-1`)}
        </StatusChip>
      </>
    );
  };

  const textRenderSlot = () => {
    return (
      <div className={'flex flex-col items-start justify-start'}>
        <Typography type={'body'} color={'black'} weight="bold" text={title} />
        {!isCompleted && (
          <div className={styles.subTitle}>
            <div
              className={classNames(
                'mr-1',
                styles.getShapeClass('triangle', 'alertDark')
              )}
            />

            <Typography
              className="truncate"
              type={'small'}
              weight="skinny"
              color={'alertDark'}
              text={subTitle}
              fontSize={'12'}
            ></Typography>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseListItem
      backgroundColor={'white'}
      iconName={`${isCompleted ? 'CheckIcon' : 'InformationCircleIcon'}`}
      iconBackgroundColor={`${isCompleted ? 'primary' : 'uiLight'}`}
      iconColor={`${isCompleted ? 'white' : 'textMid'}`}
      overwriteTextSlotRender={textRenderSlot}
      overwritePostSlotRender={getRoutineItemPostSlotRender}
      dividerType={'solid'}
      dividerColor={'uiLight'}
      onClick={onClick}
    />
  );
};
