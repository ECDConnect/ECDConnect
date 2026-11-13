import { Button, Typography } from '@ecdlink/ui';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

interface PinPadProps {
  title: string;
  detail: string;
  value: string;
  maxLength: number;
  error?: string;
  helper?: string;
  isChecking?: boolean;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  primaryAction?: {
    text: string;
    disabled?: boolean;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
}

export const PinPad: React.FC<PinPadProps> = ({
  title,
  detail,
  value,
  maxLength,
  error,
  helper,
  isChecking = false,
  onDigit,
  onDelete,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-white px-6 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-lock-title"
    >
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <Typography
          type="h2"
          text={title}
          align="center"
          color="textDark"
          id="pin-lock-title"
        />
        <Typography
          type="body"
          text={detail}
          align="center"
          color="textMid"
          className="mt-3"
        />

        <div className="mt-8 flex justify-center gap-3" aria-hidden="true">
          {Array.from({ length: maxLength }, (_, index) => (
            <span
              key={index}
              className={`border-quatenary h-3 w-3 rounded-full border ${
                index < value.length ? 'bg-quatenary' : 'bg-white'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 min-h-[1.5rem] text-center">
          {error && (
            <Typography
              type="small"
              text={error}
              align="center"
              color="errorMain"
            />
          )}
          {!error && helper && (
            <Typography
              type="small"
              text={helper}
              align="center"
              color="textMid"
            />
          )}
          {isChecking && (
            <Typography
              type="small"
              text="Checking PIN..."
              align="center"
              color="textMid"
            />
          )}
        </div>

        <div className="mt-auto grid grid-cols-3 justify-items-center gap-4">
          {DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              className="bg-uiBg text-textDark h-16 w-16 rounded-full text-2xl font-semibold"
              onClick={() => onDigit(digit)}
              disabled={isChecking || value.length >= maxLength}
              aria-label={digit}
            >
              {digit}
            </button>
          ))}
          <span />
          <button
            type="button"
            className="bg-uiBg text-textDark h-16 w-16 rounded-full text-2xl font-semibold"
            onClick={() => onDigit('0')}
            disabled={isChecking || value.length >= maxLength}
            aria-label="0"
          >
            0
          </button>
          <button
            type="button"
            className="text-quatenary h-16 w-16 rounded-full text-base font-semibold"
            onClick={onDelete}
            disabled={isChecking || value.length === 0}
            aria-label="Delete"
          >
            Delete
          </button>
        </div>

        {primaryAction && (
          <Button
            className="mt-8 w-full"
            type="filled"
            color="quatenary"
            text={primaryAction.text}
            disabled={primaryAction.disabled || isChecking}
            onClick={primaryAction.onClick}
          />
        )}
        {secondaryAction && (
          <button
            type="button"
            className="text-quatenary mt-4 text-center text-sm font-semibold"
            onClick={secondaryAction.onClick}
            disabled={isChecking}
          >
            {secondaryAction.text}
          </button>
        )}
      </div>
    </div>
  );
};
