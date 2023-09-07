import { useMemo } from 'react';
import { useProgressBar } from '@react-aria/progress';
import { Colours } from '../../models';

export type ProgressBarProps = {
  subLabel: string;
  label: string;
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
  subLabel,
  primaryColour = 'primary',
  secondaryColour = 'uiBg',
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

  return (
    <div
      {...progressBarProps}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <p
        className={`mb-2 text-center text-4xl font-semibold text-${
          textColour || primaryColour
        }`}
      >
        {label}
      </p>
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
