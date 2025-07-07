import { Typography, TypographyProps } from '../../../typography/typography';
import { Colours } from '../../../../models/Colours';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import { classNames, renderIcon } from '../../../../utils';
import { DividerType } from '../../../divider/models/Divider';
import * as styles from './base-list-item-updated.styles';
import React from 'react';

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
  onClick,
  overwritePreSlotRender,
  overwriteTextSlotRender,
  overwritePostSlotRender,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        className,
        styles.container(backgroundColor, dividerType, dividerColor)
      )}
    >
      <div className={'flex w-2/3 flex-row items-center justify-start'}>
        {overwritePreSlotRender !== undefined && overwritePreSlotRender()}
        {overwritePreSlotRender === undefined && (
          <div className={`bg-${iconBackgroundColor} mr-4 rounded-full p-3`}>
            {renderIcon(iconName, `w-5 h-5 text-${iconColor}`)}
          </div>
        )}
        <div className={'flex flex-col items-start justify-start'}>
          {overwriteTextSlotRender !== undefined && overwriteTextSlotRender()}
          {overwriteTextSlotRender === undefined && (
            <>
              {titleTypography && (
                <Typography
                  {...titleTypography}
                  className={'w-full truncate'}
                />
              )}
              {!!subTitleTypography && (
                <div className={styles.subTitle}>
                  <Typography
                    className="truncate"
                    {...subTitleTypography}
                  ></Typography>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className={`flex w-1/3 flex-row items-center justify-end`}>
        {overwritePostSlotRender !== undefined && overwritePostSlotRender()}
        {overwritePostSlotRender === undefined &&
          renderIcon(actionIconName, styles.icon(actionIconColor))}
      </div>
    </div>
  );
};

export default BaseListItemUpdated;
