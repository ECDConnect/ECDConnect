import {
  createRef,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Colours } from '../../models';

import { classNames, renderIcon } from '../../utils';
import Button from '../button/button';
import Typography from '../typography/typography';
import { ButtonType } from '../button/button.types';

export interface StepItem<T = {}> {
  title: string;
  subTitle?: string;
  subTitleColor?: Colours;
  customSubTitle?: string;
  todoStepIcon?: string;
  inProgressStepIcon?: string;
  completedStepIcon?: string;
  type: 'todo' | 'inProgress' | 'completed';
  color?: Colours;
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonTextColor?: Colours;
  actionButtonColor?: Colours;
  actionButtonIcon?: string;
  actionButtonType?: ButtonType;
  actionButtonClassName?: string;
  actionButtonIconStartPosition?: boolean;
  actionButtonIsLoading?: boolean;
  actionButtonOnClick?: () => void;
  showAccordion?: boolean;
  accordionContent?: ReactElement;
  extraData?: T;
}

interface StepsProps {
  items: StepItem[];
  typeColor?: {
    completed?: Colours;
    todoAndInProgress?: Colours;
    todo?: Colours;
  };
}

interface Icon {
  todo?: string;
  inProgress?: string;
  completed?: string;
}

export const Steps = ({ items, typeColor }: StepsProps) => {
  const [refs, setRefs] = useState<RefObject<HTMLDivElement>[]>();
  const [isAccordingOpen, setIsAccordingOpen] = useState<
    { index: number; isOpen: boolean }[]
  >([]);

  const divRefs = useRef<RefObject<HTMLDivElement>[]>([]);

  divRefs.current = Array.from({ length: items.length }, () => createRef());

  const typeStyle = useCallback(
    ({
      icon,
      typeColor,
      itemColor,
    }: {
      icon?: Icon;
      typeColor?: StepsProps['typeColor'];
      itemColor?: StepItem['color'];
    }) => ({
      todo: {
        style: `bg-${
          itemColor || typeColor?.todo || 'tertiaryAccent2'
        } border-2 border-primary`,
        icon: icon?.todo || '',
        border: 'border-solid',
      },
      inProgress: {
        style: `bg-${itemColor || 'primary'}`,
        icon: icon?.inProgress || 'CalendarIcon',
        border: 'border-dashed',
      },
      completed: {
        style: `bg-${itemColor || typeColor?.completed || 'secondary'}`,
        icon: icon?.completed || 'CheckIcon',
        border: 'border-solid',
      },
    }),
    []
  );

  const getStatus = useCallback(
    (type: StepItem['type'], icon?: Icon, itemColor?: StepItem['color']) => {
      switch (type) {
        case 'todo':
          return typeStyle({ typeColor, icon: { todo: icon?.todo }, itemColor })
            .todo;
        case 'inProgress':
          return typeStyle({
            icon: { inProgress: icon?.inProgress },
            itemColor,
          }).inProgress;
        default:
          return typeStyle({
            typeColor,
            icon: { completed: icon?.completed },
            itemColor,
          }).completed;
      }
    },
    [typeStyle, typeColor]
  );

  const handleOnClickAccording = useCallback((index: number) => {
    setIsAccordingOpen((prevState) => {
      if (prevState.some((item) => item.index === index)) {
        return prevState?.map((item) => {
          if (item.index === index) {
            return { ...item, isOpen: !item.isOpen };
          }

          return item;
        });
      }
      return [...prevState, { index, isOpen: true }];
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setRefs(divRefs?.current);
    }, 100);
  }, [items, isAccordingOpen]);

  return (
    <div>
      {items &&
        items.map((item, index) => {
          const isOpen = isAccordingOpen?.find(
            (item) => item.index === index
          )?.isOpen;

          return (
            <div
              id={String(index)}
              key={`step-${item.title}-${index}`}
              ref={divRefs?.current[index]}
              className="relative flex gap-5 pb-6"
            >
              {items.length !== index + 1 && (
                <div
                  className={classNames(
                    'absolute top-0 z-0 border-2',
                    getStatus(item.type)?.border
                  )}
                  style={{
                    borderColor:
                      (!items[index - 1] ||
                        (items[index - 1] &&
                          items[index - 1].type === 'completed')) &&
                      item.type === 'completed' &&
                      items[index + 1] &&
                      items[index + 1].type === 'completed'
                        ? `var(--${
                            item.color || typeColor?.completed || 'secondary'
                          })`
                        : `var(--${
                            item.color ||
                            typeColor?.todoAndInProgress ||
                            'primary'
                          })`,
                    height: refs && refs[index]?.current?.clientHeight,
                    left: 14,
                  }}
                ></div>
              )}
              <div className="z-10">
                <div
                  className={classNames(
                    'min-h-8 min-w-8 flex h-8 w-8 items-center justify-center rounded-full',
                    getStatus(item.type, {}, item?.color)?.style
                  )}
                >
                  {getStatus(item.type)?.icon &&
                    renderIcon(
                      getStatus(item.type, {
                        completed: item.completedStepIcon,
                        inProgress: item.inProgressStepIcon,
                        todo: item?.todoStepIcon,
                      })?.icon,
                      'text-white w-5 h-5'
                    )}
                </div>
              </div>
              <div style={{ width: isOpen ? '75%' : '87%' }} className="">
                <Typography
                  type="body"
                  align="left"
                  weight="bold"
                  text={item.title}
                  color="textDark"
                  className="col-span-2 break-words"
                />
                {item.subTitle && (
                  <Typography
                    className="col-span-2 row-span-2 text-sm"
                    type="body"
                    align="left"
                    weight="skinny"
                    text={item.subTitle}
                    color={item.subTitleColor || 'textMid'}
                  />
                )}
                {item.customSubTitle}
                {item.showAccordion && isOpen && item.accordionContent}
              </div>
              {item.showActionButton && (
                <div className="absolute right-0 flex w-32 justify-end">
                  <Button
                    type={item?.actionButtonType || 'filled'}
                    color={item.actionButtonColor || 'primary'}
                    {...(item.actionButtonIcon && {
                      icon: item.actionButtonIcon,
                    })}
                    iconPosition={
                      item?.actionButtonIconStartPosition ? 'start' : 'end'
                    }
                    isLoading={item.actionButtonIsLoading}
                    disabled={item.actionButtonIsLoading}
                    className={'h-9 w-auto'}
                    onClick={item.actionButtonOnClick}
                    text={item.actionButtonText}
                    textColor={item.actionButtonTextColor || 'white'}
                  />
                </div>
              )}
              {item.showAccordion && (
                <button
                  className="absolute right-4 top-2 z-0 flex h-full w-full justify-end"
                  onClick={() => handleOnClickAccording(index)}
                >
                  {renderIcon(
                    isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon',
                    'w-8 h-8 text-primary'
                  )}
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};
