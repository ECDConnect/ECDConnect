import { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';

import { classNames, renderIcon } from '../../utils';
import Button from '../button/button';
import Typography from '../typography/typography';

export interface StepItem {
  title: string;
  subTitle?: string;
  inProgressStepIcon?: string;
  type: 'todo' | 'inProgress' | 'completed';
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonIcon?: string;
  actionButtonOnClick?: () => void;
}

interface StepsProps {
  items: StepItem[];
}

export const Steps = ({ items }: StepsProps) => {
  const [, updateState] = useState<{}>();

  const forceUpdate = useCallback(() => updateState({}), []);

  const containerRef: LegacyRef<HTMLDivElement> = useRef(null);
  const textRef: LegacyRef<HTMLDivElement> = useRef(null);

  const typeStyle = useCallback(
    (icon?: string) => ({
      todo: {
        style: 'bg-tertiaryAccent2 border-2 border-primary',
        icon: '',
        border: '',
      },
      inProgress: {
        style: 'bg-primary',
        icon: icon || 'CalendarIcon',
        border: 'border-dashed',
      },
      completed: {
        style: 'bg-secondary',
        icon: 'CheckIcon',
        border: 'border-solid	',
      },
    }),
    []
  );

  const getStatus = useCallback(
    (type: StepItem['type'], icon?: string) => {
      switch (type) {
        case 'todo':
          return typeStyle().todo;
        case 'inProgress':
          return typeStyle(icon).inProgress;
        default:
          return typeStyle().completed;
      }
    },
    [typeStyle]
  );

  useEffect(() => {
    setTimeout(() => {
      forceUpdate();
    }, 100);
  }, [forceUpdate]);

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={`step-${item.title}-${index}`}
          ref={containerRef}
          className="relative flex gap-5 pb-6"
        >
          {items.length !== index + 1 && (
            <div
              className={classNames(
                'border-primary absolute top-0 z-0 border-2',
                getStatus(item.type)?.border
              )}
              style={{
                height: item.showActionButton
                  ? (containerRef.current?.clientHeight || 0) +
                    (textRef.current?.clientHeight || 0) / 1.7
                  : containerRef.current?.clientHeight,
                left: 14,
              }}
            ></div>
          )}
          <div
            className={classNames(
              'z-10 flex h-8 w-8 items-center justify-center rounded-full',
              getStatus(item.type)?.style
            )}
          >
            {getStatus(item.type)?.icon &&
              renderIcon(
                getStatus(item.type, item.inProgressStepIcon)?.icon,
                'text-white w-5 h-5'
              )}
          </div>
          <div
            ref={textRef}
            style={item.showActionButton ? { width: '44%' } : { width: '87%' }}
          >
            <Typography
              type="h2"
              align="left"
              weight="bold"
              text={item.title}
              color="textDark"
              className="col-span-2 break-words"
            />
            {item.subTitle && (
              <Typography
                className="col-span-2 row-span-2"
                type="body"
                align="left"
                weight="skinny"
                text={item.subTitle}
                color="textMid"
              />
            )}
          </div>
          {item.showActionButton && (
            <Button
              type="filled"
              color="primary"
              {...(item.actionButtonIcon && { icon: item.actionButtonIcon })}
              iconPosition="end"
              className="h-9 w-32"
              onClick={item.actionButtonOnClick}
              text={item.actionButtonText}
              textColor="white"
            />
          )}
        </div>
      ))}
    </div>
  );
};
