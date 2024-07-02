import { ReactElement } from 'react';
import { Colours, ComponentBaseProps } from '../../models';
import { classNames, renderIcon } from '../../utils';
import Button from '../button/button';
import { IconWrapper } from '../icon-wrapper/icon-wrapper';
import { TypographyWeight } from '../typography/models/TypographyTypes';

import Typography from '../typography/typography';
import * as styles from './action-modal.styles';
import { ActionModalButton } from './models/ActionModalButton';
import { Alert, AlertType } from '../alert';

export interface ActionModalProps extends ComponentBaseProps {
  icon?: string;
  iconColor?: Colours;
  iconBorderColor?: Colours;
  iconClassName?: string;
  iconSize?: number;
  buttonClass?: string;
  customIcon?: ReactElement;
  title?: string;
  importantText?: string;
  detailText?: string;
  customDetailText?: JSX.Element;
  paragraphs?: string[];
  linkText?: string;
  linkTextWeight?: TypographyWeight;
  linkClick?: () => void;
  actionButtons?: ActionModalButton[];
  textAlignment?: 'left' | 'right' | 'center';
  hasAlert?: boolean;
  alertMessage?: string;
  alertType?: AlertType;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  icon = '',
  iconColor = 'errorMain',
  iconBorderColor = 'white',
  iconClassName,
  customIcon,
  title = '',
  importantText = '',
  detailText = '',
  linkText = '',
  paragraphs = [],
  linkTextWeight = 'normal',
  actionButtons = [],
  linkClick,
  textAlignment = 'center',
  children,
  customDetailText,
  className,
  buttonClass,
  hasAlert,
  alertMessage,
  alertType,
  iconSize,
}) => {
  return (
    <div
      className={classNames(
        className,
        styles.wrapper(
          textAlignment === 'left'
            ? 'start'
            : textAlignment === 'right'
            ? 'end'
            : textAlignment
        )
      )}
    >
      {customIcon}
      {!customIcon && icon?.length > 0 && (
        <IconWrapper
          icon={icon}
          iconBorderColor={iconBorderColor}
          iconColor={iconColor}
          className={iconClassName}
          iconSize={iconSize}
        />
      )}
      {title?.length > 0 && (
        <div
          className={styles.textWrapper(textAlignment)}
          data-testid="title-wrapper"
        >
          <Typography
            type={'h2'}
            weight="bold"
            text={title}
            color={'textDark'}
          />
        </div>
      )}
      {importantText?.length > 0 && (
        <div
          className={styles.textWrapper(textAlignment)}
          data-testid="important-wrapper"
        >
          <Typography
            type="unspecified"
            fontSize="18"
            hasMarkup
            text={importantText}
            className={'font-semibold leading-snug'}
            color="textDark"
          />
        </div>
      )}
      {customDetailText}
      {detailText?.length > 0 && (
        <div
          className={styles.textWrapper(textAlignment)}
          data-testid="detail-wrapper"
        >
          <Typography type={'body'} text={detailText} color={'textMid'} />
        </div>
      )}
      {paragraphs?.length > 0 &&
        paragraphs.map((text, index) => {
          return (
            <div
              key={`action-list-${index}`}
              className={styles.textWrapper(textAlignment)}
              data-testid="detail-wrapper"
            >
              <Typography type={'body'} text={text} color={'textLight'} />
            </div>
          );
        })}
      {hasAlert && alertMessage && (
        <Alert
          className={'mt-5 mb-3'}
          message={alertMessage || ''}
          type={(alertType as AlertType) || 'error'}
        />
      )}
      {linkText?.length > 0 && (
        <div
          className={styles.textWrapper(textAlignment)}
          data-testid="detail-wrapper"
          onClick={() => linkClick && linkClick()}
        >
          <Typography
            type={'body'}
            weight={linkTextWeight}
            underline={true}
            hover={true}
            text={linkText}
            color={'primary'}
          />
        </div>
      )}
      {children}
      {actionButtons.map((button, index, { length }) => (
        <Button
          key={`action-modal-button-${index}`}
          className={classNames(
            `mt-2 w-full ${index + 1 === length ? 'mb-0' : 'mb-2'}`,
            buttonClass
          )}
          type={button.type}
          color={button.colour}
          onClick={button.onClick}
          disabled={button.disabled}
          isLoading={button.isLoading}
          testId="close-button"
        >
          <div className="flex flex-row items-center">
            {button.leadingIcon &&
              renderIcon(
                button.leadingIcon,
                `text-${button.textColour} h-4 w-4 mr-2`
              )}
            <Typography
              className={button.textClassName}
              type={button?.textType || 'button'}
              color={button.textColour}
              text={button.text}
            ></Typography>
            {button.trailingIcon &&
              renderIcon(
                button.trailingIcon,
                `text-${button.textColour} h-4 w-4 mr-2`
              )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ActionModal;
