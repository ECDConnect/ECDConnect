import * as styles from './programme-base-list-item.styles';
import React from 'react';
import {
  classNames,
  Colours,
  ComponentBaseProps,
  DividerType,
  renderIcon,
  Typography,
  TypographyProps,
} from '@ecdlink/ui';

interface ProgrammeBaseListItemProps extends ComponentBaseProps {
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

export const ProgrammeBaseListItem: React.FC<ProgrammeBaseListItemProps> = ({
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
        styles.container(
          backgroundColor,
          dividerType,
          dividerColor,
          borderRadius
        )
      )}
    >
      <div className={`flex w-full flex-row items-center justify-between`}>
        <div className={'flex max-w-full flex-col items-start justify-start'}>
          {overwriteTextSlotRender !== undefined && overwriteTextSlotRender()}
          {overwriteTextSlotRender === undefined && (
            <>
              {titleTypography && (
                <Typography {...titleTypography} className={'w-full '} />
              )}
            </>
          )}
        </div>
        {overwritePostSlotRender !== undefined && overwritePostSlotRender()}
        {overwritePostSlotRender === undefined &&
          renderIcon(actionIconName, styles.icon(actionIconColor))}
      </div>
      <div className={'flex w-2/3 flex-row items-center justify-start'}></div>
    </div>
  );
};

export default ProgrammeBaseListItem;
