import { Typography, TypographyProps } from '../../../typography/typography';
import { Colours } from '../../../../models/Colours';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import { classNames, renderIcon } from '../../../../utils';
import { DividerType } from '../../../divider/models/Divider';
import * as styles from './base-list-item.styles';
import React from 'react';

interface BaseListItemProps extends ComponentBaseProps {
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
  onClick?: () => void;
  overwritePreSlotRender?: () => JSX.Element;
  overwriteTextSlotRender?: () => JSX.Element;
  overwritePostSlotRender?: () => JSX.Element;
}

export const BaseListItem: React.FC<BaseListItemProps> = ({
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
      <div className={'flex flex-row justify-start items-center w-2/3'}>
        {overwritePreSlotRender !== undefined && overwritePreSlotRender()}
        {overwritePreSlotRender === undefined && (
          <div className={`bg-${iconBackgroundColor} p-3 rounded-full mr-4`}>
            {renderIcon(iconName, `w-5 h-5 text-${iconColor}`)}
          </div>
        )}
        <div className={'flex flex-col items-start justify-start truncate'}>
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
      <div className={`flex flex-row items-center justify-end w-1/3`}>
        {overwritePostSlotRender !== undefined && overwritePostSlotRender()}
        {overwritePostSlotRender === undefined &&
          renderIcon(actionIconName, styles.icon(actionIconColor))}
      </div>
    </div>
  );
};

export default BaseListItem;
