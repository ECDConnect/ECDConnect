import { useMemo } from 'react';
import { useProgressBar } from '@react-aria/progress';
import { Colours } from '../../models';
import { classNames } from '../../utils';

export type ProgressBarProps = {
  subLabel: string;
  label: string;
  hint?: string;
  hintClassName?: string;
  textPosition?: 'left' | 'center';
  isHiddenSubLabel?: boolean;
  value: number;
  className?: string;
  primaryColour?: Colours;
  secondaryColour?: Colours;
  textColour?: Colours;
};
export const ProgressBar = ({
  className,
  value,
  label,
  hint,
  hintClassName,
  subLabel,
  primaryColour = 'primary',
  secondaryColour = 'uiBg',
  textPosition = 'center',
  textColour,
  isHiddenSubLabel,
}: ProgressBarProps) => {
  const progressBarOptions = useMemo(
    () => ({
      value: value,
      ...(isHiddenSubLabel ? { 'aria-label': subLabel } : { label: subLabel }),
    }),
    [isHiddenSubLabel, subLabel, value]
  );
  const { progressBarProps, labelProps } = useProgressBar(progressBarOptions);

  const style = useMemo(
    () => ({ width: `${value}%`, borderRadius: 'inherit' }),
    [value]
  );

  const textPositionStyle = useMemo(() => {
    if (textPosition === 'center') {
      return 'flex flex-col';
    }

    return 'flex items-end gap-2';
  }, [textPosition]);

  return (
    <div
      {...progressBarProps}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <div className={textPositionStyle}>
        <p
          className={classNames(
            hintClassName,
            `${!hint && 'mb-2'} ${
              textPosition === 'left' && 'mb-2'
            } text-center text-4xl font-semibold text-${
              textColour || primaryColour
            }`
          )}
        >
          {label}
        </p>
        <p
          className={`text-16 mb-2 text-center font-semibold text-${
            textColour || primaryColour
          }`}
        >
          {hint}
        </p>
      </div>
      <div className={`rounded-10 h-full bg-${secondaryColour}`}>
        <div className={`bg-${primaryColour} h-full`} style={style}></div>
      </div>
      {!isHiddenSubLabel && subLabel && (
        <div {...labelProps} className={'text-textMid text-center'}>
          {subLabel}
        </div>
      )}
    </div>
  );
};
