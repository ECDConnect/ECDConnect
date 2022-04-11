import { Colours } from '../../models/Colours';
import { SpinnerSizeType } from './models/LoadingSpinner';
import * as styles from './loading-spinner.styles';

export interface LoadingSpinnerProps {
  className?: string;
  size: SpinnerSizeType;
  spinnerColor: Colours;
  backgroundColor: Colours;
}

export const LoadingSpinner = ({
  className,
  size,
  spinnerColor,
  backgroundColor,
}: LoadingSpinnerProps) => {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <div
        className={styles.getSpinnerClass(size, spinnerColor, backgroundColor)}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
