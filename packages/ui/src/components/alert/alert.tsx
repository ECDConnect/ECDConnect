import { classNames } from '../../utils/style-class.utils';
import { Typography } from '../typography/typography';
import * as styles from './alert.style';
import { AlertProps } from './alert.types';

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  titleColor,
  message,
  messageColor,
  customIcon,
  list,
  className,
  variant = 'flat',
  listColor = 'black',
  button,
}) => {
  const icon = styles.alertIcon(type, variant);

  return (
    <div
      className={classNames(
        styles.wrapper,
        styles.alertColor(type, variant),
        className
      )}
    >
      <div className={styles.innerWrapper}>
        {customIcon || <div className={styles.iconWrapper}>{icon}</div>}
        <div className={styles.contentWrapper}>
          <div className={styles.messageWrapper}>
            {title && (
              <Typography
                type={'help'}
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
      </div>
    </div>
  );
};
export default Alert;
