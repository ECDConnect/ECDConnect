import { useRef, useState } from 'react';
import {
  PIN_ATTEMPT_LIMIT,
  getPinLength,
  verifyPin,
} from '@/utils/security/pin-lock';
import { PinPad } from './pin-pad';

interface PinUnlockProps {
  userId: string;
  onUnlock: () => void;
  onUsePassword: () => void;
}

export const PinUnlock: React.FC<PinUnlockProps> = ({
  userId,
  onUnlock,
  onUsePassword,
}) => {
  const length = getPinLength(userId) ?? 4;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const attemptsRef = useRef(0);
  const [isChecking, setIsChecking] = useState(false);

  const checkPin = async (pin: string) => {
    setIsChecking(true);
    const matches = await verifyPin(userId, pin);
    if (matches) {
      onUnlock();
      return;
    }

    attemptsRef.current += 1;
    if (attemptsRef.current >= PIN_ATTEMPT_LIMIT) {
      onUsePassword();
      return;
    }
    setValue('');
    setIsChecking(false);
    setError('That PIN is not right.');
  };

  const addDigit = (digit: string) => {
    if (isChecking || value.length >= length) return;
    const next = `${value}${digit}`;
    setError('');
    setValue(next);
    if (next.length === length) {
      void checkPin(next);
    }
  };

  return (
    <PinPad
      title="Enter your PIN"
      detail="ECD Connect is locked. Enter your PIN to continue."
      value={value}
      maxLength={length}
      error={error}
      isChecking={isChecking}
      onDigit={addDigit}
      onDelete={() => setValue((current) => current.slice(0, -1))}
      secondaryAction={{
        text: 'Forgot PIN? Log in with your password',
        onClick: onUsePassword,
      }}
    />
  );
};
