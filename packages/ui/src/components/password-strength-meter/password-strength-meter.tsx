import {
  PasswordStrength,
  PasswordStrengthMeterBar,
} from './models/PasswordStrength';
import * as styles from './password-strength-meter.style';

const passwordStrengthDisplay: PasswordStrengthMeterBar[] = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
  { index: 4 },
];

export interface PasswordStrengthMeterProps {
  type: PasswordStrength;
  message?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  type,
  message,
}) => {
  return (
    <div className={'my-1 mt-2'}>
      <div className="flex flex-row justify-evenly">
        {passwordStrengthDisplay.map((display, index) => (
          <div
            key={'password-strength-meter-index-' + index}
            className={styles.getStrengthBarStyle(type, display.index)}
          ></div>
        ))}
      </div>
      {message && (
        <div
          className={styles.message + styles.getStrengthBarMessageStyle(type)}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
