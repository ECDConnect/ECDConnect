import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgressBar } from '@react-aria/progress';
import { Colours } from '../../models';
import { classNames } from '../../utils';
import StatusChip, { StatusChipProps } from '../status-chip/status-chip';

export type ProgressBarProps = {
  subLabel: string;
  label: string;
  hint?: string;
  hintClassName?: string;
  textPosition?: 'left' | 'center';
  isHiddenSubLabel?: boolean;
  isHiddenBar?: boolean;
  value: number;
  className?: string;
  primaryColour?: Colours;
  secondaryColour?: Colours;
  textColour?: Colours;
  divides?: {
    colour?: Colours;
    widthPercentage: number;
  }[];
  size?: 'small' | 'medium' | 'large';
  statusChip?: StatusChipProps;
  style?: React.CSSProperties;
  isBigTitle?: boolean;
  isDashboardItem?: boolean;
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
  divides,
  size = 'small',
  statusChip,
  style: customStyle,
  isHiddenBar,
  isBigTitle,
  isDashboardItem,
}: ProgressBarProps) => {
  const [statusChipWidth, setStatusChipWidth] = useState<number>();

  const statusChipRef = useRef<HTMLDivElement>(null);

  const currentSize = useMemo(() => {
    switch (size) {
      case 'medium':
        return 'h-4';
      case 'large':
        return 'h-6';
      default:
        return 'h-2';
    }
  }, [size]);

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

  useEffect(() => {
    setTimeout(() => {
      setStatusChipWidth(statusChipRef?.current?.clientWidth);
    }, 100);
  }, [setStatusChipWidth]);

  return (
    <div
      {...progressBarProps}
      className={className}
      style={{ height: '100%', width: '100%', ...customStyle }}
      id="progress-bar"
    >
      <div className={textPositionStyle}>
        <p
          className={classNames(
            hintClassName,
            `${!hint && 'mb-2'} ${
              textPosition === 'left' && 'mb-2'
            } text-center ${
              isBigTitle ? 'text-6xl' : 'text-4xl'
            } font-semibold text-${textColour || primaryColour}`
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
      {!isHiddenBar && (
        <div
          className={`rounded-10 ${currentSize} bg-${secondaryColour} relative z-0 overflow-hidden`}
        >
          <div
            className={`bg-${primaryColour} relative z-20 h-full`}
            style={style}
          ></div>
          {divides?.length && (
            <div className="absolute top-0 z-10 flex h-full w-full">
              {divides?.map((divide, index) => (
                <div
                  key={index}
                  className={classNames(
                    index + 1 === divides?.length ? '' : 'border-r-2',
                    divide?.colour
                      ? `border-${divide.colour}`
                      : 'border-primary',
                    'h-full bg-transparent'
                  )}
                  style={{ width: `${divide.widthPercentage}%` }}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}
      {statusChip && (
        <div
          className={`z-20 mt-4 flex h-auto justify-end bg-transparent`}
          style={{ ...style, minWidth: statusChipWidth }}
        >
          <div ref={statusChipRef} style={{ width: 'fit-content' }}>
            <StatusChip {...statusChip} />
          </div>
        </div>
      )}
      {!isHiddenSubLabel && subLabel && (
        <div {...labelProps} className={'text-textMid text-center'}>
          {subLabel}
        </div>
      )}
    </div>
  );
};
