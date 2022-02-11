import { classNames } from '../../utils/style-class.utils';
import { Typography } from '../typography/typography';
import * as styles from './alert.style';
import { AlertProps } from './alert.types';

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  list,
  className,
  variant = 'outlined',
  button,
}) => {
  const icon = styles.alertIcon(type);

  return (
    <div
      className={classNames(
        styles.wrapper(variant),
        styles.alertColor(type, variant),
        className
      )}
    >
      <div className={styles.innerWrapper}>
        <div className={styles.iconWrapper}>{icon}</div>
        <div className={styles.contentWrapper}>
          <div className={styles.messageWrapper}>
            {title && (
              <Typography
                type={'help'}
                weight="bolder"
                text={title}
                className={styles.title}
                color={styles.alertTextColor(type)}
              />
            )}
            {message && (
              <Typography
                type={'help'}
                weight={'bold'}
                hasMarkup
                text={message}
                className={styles.message(!!title)}
                color={styles.alertTextColor(type)}
              />
            )}
            {list && (
              <ul className={styles.list}>
                {list.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography
                      type={'help'}
                      hasMarkup
                      text={item}
                      className={styles.message(!!title || !!message)}
                      color={styles.alertTextColor(type)}
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
