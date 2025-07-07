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
  subTitleTypography,
  actionIconName = 'ChevronRightIcon',
  actionIconColor = 'textLight',
  iconName = 'InformationIcon',
  iconBackgroundColor = 'uiBg',
  iconColor = 'white',
  borderRadius = '',
  routineItem,
  disabled,
  onClick,
  overwritePreSlotRender,
  overwriteTextSlotRender,
  overwritePostSlotRender,
}) => {
  const isMessageRoutineItem =
    routineItem?.name === DailyRoutineItemType.messageBoard ||
    routineItem?.name === DailyRoutineItemType.greeting ||
    routineItem?.name === DailyRoutineItemType.freePlay
      ? 'w-full'
      : 'w-3/4';
  const showTitle =
    routineItem?.name === DailyRoutineItemType.messageBoard ||
    routineItem?.name === DailyRoutineItemType.greeting ||
    routineItem?.name === DailyRoutineItemType.freePlay;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        className,
        styles.container(backgroundColor, dividerType, dividerColor)
      )}
    >
      {!showTitle && (
        <div className={'flex w-1/4 flex-row items-center justify-start'}>
          {overwritePreSlotRender === undefined && (
            <div className={`bg-${iconBackgroundColor} mr-4 rounded-full p-3`}>
              {renderIcon(iconName, `w-5 h-5 text-alertBg`)}
            </div>
          )}
          <div className={'flex flex-col items-start justify-start'}>
            {overwriteTextSlotRender !== undefined && overwriteTextSlotRender()}
            {overwriteTextSlotRender === undefined && (
              <>
                {titleTypography &&
                  routineItem?.name !== DailyRoutineItemType.messageBoard &&
                  routineItem?.name !== DailyRoutineItemType.greeting &&
                  routineItem?.name !== DailyRoutineItemType.freePlay && (
                    <Typography
                      {...titleTypography}
                      className={'text-textMid w-full'}
                    />
                  )}
              </>
            )}
          </div>
        </div>
      )}
      <div
        className={`flex ${isMessageRoutineItem} flex-row items-center justify-end ${
          !showTitle && `border-primaryAccent2 ml-1 border-l p-3 pr-0 `
        }`}
      >
        {overwritePostSlotRender !== undefined && overwritePostSlotRender()}
        {overwritePostSlotRender === undefined &&
          renderIcon(actionIconName, styles.icon(actionIconColor))}
      </div>
    </button>
  );
};

export default BaseListItemUpdated;
