import { Typography } from '../../../typography/typography';
import { Button } from '../../../button/button';
import { StatusChip } from '../../../status-chip/status-chip';
import { Colours } from '../../../../models/Colours';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import { classNames, renderIcon } from '../../../../utils';
import { ButtonShapeType, ButtonType } from '../../../button/button.types';
import { DividerType } from '../../../divider/models/Divider';
import { TypographyType } from '../../../typography/models/TypographyTypes';
import * as styles from './list-item.styles';
import { SubTitleShape } from './models/list-item';

export interface ListItemProps extends ComponentBaseProps {
  key: string;
  showIcon?: boolean;
  showButton?: boolean;
  showChevronIcon?: boolean;
  showDivider?: boolean;
  showSubTitleShape?: boolean;
  showChip?: boolean;
  chipText?: string;
  chipBackgroundColor?: Colours;
  chipTextColor?: Colours;
  chipIcon?: string;
  withPaddingY?: boolean;
  withPaddingX?: boolean;
  withBorderRadius?: boolean;
  dividerType?: DividerType;
  dividerColor?: Colours;
  iconName?: string;
  iconImageSrc?: string;
  iconImageBackgroundColor?: string;
  iconColor?: Colours;
  iconBackgroundColor?: Colours;
  backgroundColor?: Colours;
  buttonTextColor?: Colours;
  titleColor?: Colours;
  subTitleColor?: Colours;
  buttonColor?: Colours;
  title?: string;
  subTitle?: string;
  subTitleShape?: SubTitleShape;
  titleTypographyType?: TypographyType;
  subTitleTypographyType?: TypographyType;
  buttonShapeType?: ButtonShapeType;
  buttonType?: ButtonType;
  buttonText?: string;
  buttonIcon?: string;
  onButtonClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  className,
  showIcon = false,
  showButton = false,
  showChevronIcon = false,
  showDivider = false,
  showSubTitleShape = false,
  showChip = false,
  chipText = '',
  chipTextColor = 'white',
  chipIcon = '',
  chipBackgroundColor = 'primary',
  dividerType = 'none',
  dividerColor = 'uiLight',
  iconName,
  iconImageSrc,
  iconImageBackgroundColor,
  iconColor = 'transparent',
  iconBackgroundColor = 'transparent',
  backgroundColor = 'transparent',
  buttonColor = 'primary',
  buttonTextColor = 'black',
  titleColor = 'black',
  subTitleColor = 'textLight',
  title = '',
  withPaddingY = false,
  withPaddingX = false,
  withBorderRadius = true,
  subTitle = '',
  subTitleShape = 'circle',
  titleTypographyType = 'body',
  subTitleTypographyType = 'small',
  buttonShapeType = 'normal',
  buttonType = 'outlined',
  buttonText = '',
  buttonIcon = '',
  onButtonClick = () => {},
}) => {
  return (
    <div
      className={classNames(
        className,
        styles.container(
          backgroundColor,
          withPaddingY,
          withPaddingX,
          withBorderRadius,
          showDivider,
          dividerType,
          dividerColor
        )
      )}
      onClick={onButtonClick}
    >
      <div className={'flex flex-row items-center'}>
        {showIcon &&
          (iconImageSrc ? (
            <div
              style={{ backgroundColor: iconImageBackgroundColor }}
              className={`mr-4 rounded-full p-4`}
            >
              <img src={iconImageSrc} className={'w-22 h-22'} />
            </div>
          ) : (
            <div
              className={`bg-${iconBackgroundColor} p-13 mr-4 h-12 w-12 rounded-full`}
            >
              {renderIcon(
                iconName || 'InformationIcon',
                `w-22 h-22 text-${iconColor}`
              )}
            </div>
          ))}

        <div className={'flex flex-col items-start justify-start'}>
          <Typography
            type={titleTypographyType}
            hasMarkup={true}
            color={titleColor}
            weight="bold"
            text={title}
          />
          {!!subTitle && (
            <div className={styles.subTitle}>
              {showSubTitleShape && (
                <div
                  className={classNames(
                    'mr-1',
                    styles.getShapeClass(subTitleShape, subTitleColor)
                  )}
                ></div>
              )}
              <Typography
                className="truncate"
                type={subTitleTypographyType}
                weight="skinny"
                color={subTitleColor}
                text={subTitle}
                fontSize={'12'}
                hasMarkup
              ></Typography>
            </div>
          )}
        </div>
      </div>
      <div className={'flex flex-row items-center'}>
        {showChip && (
          <StatusChip
            className={'mr-2'}
            padding={'px-2 py-1'}
            backgroundColour={chipBackgroundColor}
            text={chipText}
            textColour={chipTextColor}
            borderColour={chipBackgroundColor}
          >
            {chipIcon &&
              renderIcon(chipIcon, `w-5 h-5 text-${chipTextColor} ml-1`)}
          </StatusChip>
        )}

        {showButton && (
          <Button
            type={buttonType}
            color={buttonColor}
            size="small"
            shape={buttonShapeType}
          >
            <Typography
              className={'mr-1'}
              type={'small'}
              color={buttonTextColor}
              text={buttonText}
            ></Typography>
            {renderIcon(buttonIcon, `h-4 w-4 text-${buttonTextColor}`)}
          </Button>
        )}

        {showChevronIcon && (
          <div>{renderIcon('ChevronRightIcon', styles.chevronIcon)}</div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
