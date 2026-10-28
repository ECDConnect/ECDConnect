import { useState } from 'react';
import {
  PIN_MAX_LENGTH,
  PIN_MIN_LENGTH,
  isPinShape,
  savePin,
} from '@/utils/security/pin-lock';
import { PinPad } from './pin-pad';

interface PinSetupProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export const PinSetup: React.FC<PinSetupProps> = ({
  userId,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<'choose' | 'confirm'>('choose');
  const [firstPin, setFirstPin] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addDigit = (digit: string) => {
    setError('');
    setValue((current) =>
      current.length >= PIN_MAX_LENGTH ? current : `${current}${digit}`
    );
  };

  const submitChoice = () => {
    if (!isPinShape(value)) {
      setError(`Enter ${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits`);
      return;
    }
    setFirstPin(value);
    setValue('');
    setStep('confirm');
  };

  const submitConfirm = async () => {
    if (value !== firstPin) {
      setError('Those PINs do not match. Enter it again.');
      setValue('');
      return;
    }

    setIsSaving(true);
    try {
      await savePin(userId, value);
      onComplete();
    } catch {
      setError('This browser cannot store a PIN. You can skip it for now.');
      setIsSaving(false);
    }
  };

  return (
    <PinPad
      title={step === 'choose' ? 'Choose a PIN' : 'Confirm your PIN'}
      detail={
        step === 'choose'
          ? 'Use 4 to 6 digits. ECD Connect will ask for this PIN when you come back after being away.'
          : 'Enter the same PIN again.'
      }
      value={value}
      maxLength={step === 'confirm' ? firstPin.length : PIN_MAX_LENGTH}
      error={error}
      helper={
        step === 'choose'
          ? `${PIN_MIN_LENGTH} to ${PIN_MAX_LENGTH} digits`
          : undefined
      }
      isChecking={isSaving}
      onDigit={addDigit}
      onDelete={() => setValue((current) => current.slice(0, -1))}
      primaryAction={{
        text: step === 'choose' ? 'Continue' : 'Save PIN',
        disabled:
          step === 'choose'
            ? !isPinShape(value)
            : value.length !== firstPin.length,
        onClick: step === 'choose' ? submitChoice : () => void submitConfirm(),
      }}
      secondaryAction={
        step === 'choose'
          ? { text: 'Not now', onClick: onSkip }
          : {
              text: 'Start again',
              onClick: () => {
                setStep('choose');
                setFirstPin('');
                setValue('');
                setError('');
              },
            }
      }
    />
  );
};
