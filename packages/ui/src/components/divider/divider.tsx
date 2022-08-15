import { classNames } from '../../utils/style-class.utils';
import * as styles from './divider.styles';
import { DividerType } from './models/Divider';
import { ComponentBaseProps } from '../../models';

export interface DividerProps extends ComponentBaseProps {
  title?: string;
  dividerType?: DividerType;
}

export function Divider({
  title,
  dividerType = 'solid',
  className,
}: DividerProps) {
  return (
    <div
      className={classNames(
        className ? className : '',
        styles.dividerContainer
      )}
    >
      <div className={styles.dividerWrapper}>
        <div className={classNames(styles.divider, 'border-' + dividerType)} />
      </div>
      {title && (
        <div className={styles.titleContainer}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
    </div>
  );
}

export default Divider;
