import { Colours } from '../../models';
import { renderIcon } from '../../utils';
import { classNames } from '../../utils/style-class.utils';
import Button from '../button/button';
import StatusChip from '../status-chip/status-chip';
import { Typography } from '../typography/typography';
import * as styles from './alert.style';
import { AlertProps } from './alert.types';

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  titleType,
  titleColor,
  message,
  messageColor,
  customMessage,
  customIcon,
  list,
  className,
  variant = 'flat',
  listColor = 'black',
  button,
  leftChip,
  rightChip,
  onDismiss,
}) => {
  const icon = styles.alertIcon(type, variant);

  const chipBackground = styles
    .alertColor(type, variant)
    .split(' ')?.[0]
    ?.split('-')?.[1] as Colours;

  return (
    <div
      className={classNames(
        styles.wrapper,
        styles.alertColor(type, variant),
        className
      )}
    >
      <div className={styles.innerWrapper}>
        {!leftChip &&
          (customIcon || <div className={styles.iconWrapper}>{icon}</div>)}
        {leftChip && (
          <StatusChip
            className="self-center"
            borderColour={chipBackground}
            backgroundColour={chipBackground}
            textColour="white"
            text={leftChip}
          />
        )}
        <div
          className={styles.contentWrapper(
            !!title && !message && !list?.length
          )}
        >
          <div className={styles.messageWrapper}>
            {title && (
              <Typography
                type={titleType ? titleType : 'help'}
                text={title}
                weight="normal"
                className={styles.title}
                color={titleColor || styles.alertTextColor(type, variant)}
              />
            )}
            {message && (
              <Typography
                type={'help'}
                hasMarkup
                text={message}
                className={styles.message(!!title)}
                color={messageColor || styles.alertTextColor(type, variant)}
              />
            )}
            {customMessage}
            {list && (
              <ul className={styles.list + `text-${listColor}`}>
                {list.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography
                      type={'help'}
                      hasMarkup
                      text={item}
                      className={'text-sm font-normal'}
                      color={listColor}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {button && (
            <div className={styles.extendedContentWrapper}>{button}</div>
          )}
        </div>
        {rightChip && (
          <StatusChip
            className="ml-auto self-center"
            borderColour="primary"
            backgroundColour="primary"
            textColour="white"
            text={rightChip}
          />
        )}
        {!!onDismiss && (
          <div
            className="items-top mb-2 flex pr-1"
            style={{ marginLeft: 'auto' }}
          >
            <div onClick={onDismiss}>
              {renderIcon(
                'XIcon',
                `h-4 w-4 text-${
                  titleColor || styles.alertTextColor(type, variant)
                }`
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Alert;
