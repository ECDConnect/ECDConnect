import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { classNames, renderIcon } from '../../utils';
import Typography from '../typography/typography';
import { useState } from 'react';
import { Colours } from '../../models';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';

interface BaseDatePickerProps
  extends Omit<ReactDatePickerProps, 'selectsRange' | 'onChange'> {
  label?: string;
  hint?: string;
  hideCalendarIcon?: boolean;
  showChevronIcon?: boolean;
  chevronIconColour?: Colours;
  colour?: Colours;
  textColour?: Colours;
  isFullWidth?: boolean;
  withPortal?: boolean;
}

export interface DatePickerSingleProps extends BaseDatePickerProps {
  selectsRange?: false;
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any> | undefined
  ) => void;
}

export interface DatePickerRangeProps extends BaseDatePickerProps {
  selectsRange: true;
  onChange: (
    date: [Date | null, Date | null],
    event: React.SyntheticEvent<any> | undefined
  ) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  hint,
  hideCalendarIcon,
  colour = 'uiBg',
  textColour = 'textDark',
  className,
  showChevronIcon,
  isFullWidth = true,
  chevronIconColour = 'white',
  withPortal,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {label && <label className="text-textDark font-semibold">{label}</label>}
      {hint && <Typography type="help" color="textMid" text={hint} />}
      <div
        className={classNames(
          className,
          `bg-${colour} relative ${
            !!label || !!hint ? 'mt-2' : ''
          } rounded-md ${isFullWidth ? 'w-full' : ''}`
        )}
      >
        <ReactDatePicker
          {...props}
          className={`text-${textColour} relative w-full rounded-md border-0 bg-transparent ${
            showChevronIcon ? 'pr-7' : ''
          }`}
          wrapperClassName="w-full"
          calendarClassName="react-datepicker--large-calendar"
          onCalendarOpen={() => setIsOpen(true)}
          onCalendarClose={() => setIsOpen(false)}
          onFocus={(e) => (e.target.readOnly = true)}
          withPortal={withPortal}
          portalId={!!withPortal ? 'root-portal' : undefined}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="react-datepicker__header-custom flex items-center justify-between border-b bg-white px-3 py-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-8 w-8 text-gray-700" />
              </button>

              <div className="font-medium text-gray-900">
                {date.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRightIcon className="h-8 w-8 text-gray-700" />
              </button>
            </div>
          )}
        />
        {!hideCalendarIcon &&
          renderIcon(
            'CalendarIcon',
            'absolute z-0 text-primary top-2 right-4 w-6 h-6'
          )}
        {showChevronIcon && (
          <ChevronDownIcon
            className={`absolute right-2 top-1/2 z-0 h-6 w-6 transform text-${chevronIconColour} ${
              isOpen ? 'rotate-180' : ''
            } -translate-y-1/2`}
          />
        )}
      </div>
    </>
  );
};
