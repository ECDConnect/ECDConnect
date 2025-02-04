import {
  Colours,
  renderIcon,
  classNames,
  Typography,
  TypographyProps,
} from '@ecdlink/ui';
import { ComponentBaseProps, DividerType } from '@ecdlink/ui';
import * as styles from './base-list-item-updated.styles';
import React from 'react';
import { ProgrammeRoutineItemDto } from '@ecdlink/core';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';

interface BaseListItemPropsUpdated extends ComponentBaseProps {
  dividerType?: DividerType;
  dividerColor?: Colours;
  backgroundColor?: Colours;
  titleTypography?: TypographyProps;
  subTitleTypography?: TypographyProps;
  iconName?: string;
  iconBackgroundColor?: Colours;
  iconColor?: Colours;
  actionIconName?: string;
  actionIconColor?: Colours;
  borderRadius?: string;
  routineItem?: ProgrammeRoutineItemDto;
  disabled?: boolean;
  onClick?: () => void;
  overwritePreSlotRender?: () => JSX.Element;
  overwriteTextSlotRender?: () => JSX.Element;
  overwritePostSlotRender?: () => JSX.Element;
}

export const BaseListItemUpdated: React.FC<BaseListItemPropsUpdated> = ({
  className = '',
  dividerType = 'none',
  dividerColor = 'uiLight',
  backgroundColor = 'transparent',
  titleTypography,
  actionIconName = 'ChevronRightIcon',
  actionIconColor = 'textLight',
  iconName = 'InformationIcon',
  iconBackgroundColor = 'uiBg',
  iconColor = 'white',
  routineItem,
  disabled,
  onClick,
  overwritePreSlotRender,
  overwriteTextSlotRender,
  overwritePostSlotRender,
}) => {
  const isMessageRoutineItem = [
    DailyRoutineItemType.messageBoard,
    DailyRoutineItemType.greeting,
    DailyRoutineItemType.freePlay,
  ].includes(routineItem?.name as DailyRoutineItemType);

  const containerWidth = isMessageRoutineItem ? 'w-full' : 'w-3/4';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        className,
        styles.container(backgroundColor, dividerType, dividerColor)
      )}
    >
      {!isMessageRoutineItem && (
        <div className="flex w-1/4 flex-row items-center justify-start">
          {overwritePreSlotRender ? (
            overwritePreSlotRender()
          ) : (
            <div
              className={classNames(
                'mr-4 rounded-full p-3',
                `bg-${iconBackgroundColor}`
              )}
            >
              {renderIcon(iconName, 'w-5 h-5 text-alertBg')}
            </div>
          )}
          <div className="flex flex-col items-start justify-start">
            {overwriteTextSlotRender?.() ||
              (titleTypography && (
                <Typography
                  {...titleTypography}
                  className="text-textMid w-full"
                />
              ))}
          </div>
        </div>
      )}

      <div
        className={classNames(
          'flex flex-row items-center justify-end',
          containerWidth,
          !isMessageRoutineItem
            ? 'border-primaryAccent2 ml-1 border-l p-3 pr-0'
            : ''
        )}
      >
        {overwritePostSlotRender?.() ||
          renderIcon(actionIconName, styles.icon(actionIconColor))}
      </div>
    </button>
  );
};

export default BaseListItemUpdated;
