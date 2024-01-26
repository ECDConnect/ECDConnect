import { useEffect, useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Control,
  Controller,
  FieldValues,
  Message,
  RegisterOptions,
  ValidationRule,
} from 'react-hook-form';
import { Alert, Typography } from '@ecdlink/ui';

interface ComponentProps {
  label: string;
  error?: string;
  onChange: (date: Date) => void;
  contentValue: string;
  subHeading?: string;
  fieldAlert?: string;
}

interface CombinedDatePickersProps {
  contentValue: string;
  label: string;
  error?: string;
  nameProp: string;
  control: Control<FieldValues, object>;
  required?: Message | ValidationRule<boolean>;
  validation?: RegisterOptions['validate'];
  subHeading?: string;
  fieldAlert?: string;
}

const Component = ({
  label,
  onChange,
  error,
  contentValue,
  subHeading,
  fieldAlert,
}: ComponentProps) => {
  const [dayPicker, setDay] = useState<Date>();
  const [monthPicker, setMonth] = useState<Date>();
  const [yearPicker, setYear] = useState<Date>();

  const year = yearPicker?.getFullYear();
  const month = monthPicker?.getMonth();
  const day = dayPicker?.getDate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const minDateSelect = new Date(currentYear, currentMonth, 1);

  useEffect(() => {
    if (contentValue && contentValue !== '') {
      const dateItem = contentValue.split('T');
      const dateItems = dateItem[0].split('-');

      if (dateItems.length > 1) {
        const formattedDate = new Date(
          +dateItems[0],
          +dateItems[1] - 1,
          +dateItems[2]
        );
        setDay(formattedDate);
        setMonth(formattedDate);
        setYear(formattedDate);
      }
    }
  }, [contentValue]);

  const minDate =
    yearPicker && monthPicker ? new Date(year, month, 1) : undefined;
  const maxDate =
    yearPicker && monthPicker ? new Date(year, month + 1, 0) : undefined;

  const fullDate = useMemo(
    () =>
      day && month !== undefined && year
        ? new Date(year, month, day)
        : undefined,
    [day, month, year]
  );

  useEffect(() => {
    if (fullDate) {
      onChange(fullDate);
    }
  }, [fullDate, onChange]);

  const style = `
    disabled:opacity-50 text-textMid bg-adminPortalBg focus:border-primary 
    focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm
  `;

  const onChangeDay = (date: Date) => {
    const formattedDate = new Date(year, month, date.getDate());

    setDay(formattedDate);
    setMonth(formattedDate);
    setYear(formattedDate);
  };

  const onChangeMonth = (date: Date) => {
    const isFilled = day !== undefined && year !== undefined;

    const formattedDate = isFilled
      ? new Date(year, date.getMonth(), day)
      : new Date(currentYear + 1, date.getMonth(), 1);

    setMonth(formattedDate);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      setDay(currentDate);
    } else {
      setDay(formattedDate);
      setYear(formattedDate);
    }
  };

  const onChangeYear = (date: Date) => {
    const isFilled = day !== undefined && month !== undefined;

    const formattedDate = isFilled
      ? new Date(date.getFullYear(), month, day)
      : date;

    setYear(formattedDate);

    if (date.getFullYear() === currentYear) {
      setDay(currentDate);
      setMonth(currentDate);
    } else {
      setDay(formattedDate);
      setMonth(formattedDate);
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  return (
    <>
      <Typography
        type="body"
        // weight='bold'
        color="textMid"
        text={label}
      />
      {subHeading && (
        <Typography type="small" color="textMid" text={subHeading} />
      )}
      {fieldAlert && (
        <Alert
          className="mt-2 mb-2 rounded-md"
          message={fieldAlert}
          type="warning"
        />
      )}
      <div className="flex items-center gap-1 sm:col-span-12">
        <ReactDatePicker
          popperClassName="z-50"
          placeholderText="Day"
          className={`${style} ${
            month === undefined || year === undefined
              ? 'cursor-not-allowed'
              : ''
          }`}
          selected={dayPicker}
          onChange={onChangeDay}
          dateFormat="dd"
          renderDayContents={renderDayContents}
          disabledKeyboardNavigation
          onFocus={(e) => e.target.blur()}
          onChangeRaw={() => {}}
          renderCustomHeader={() => <></>}
          disabled={month === undefined || year === undefined}
          minDate={
            month === currentMonth && year === currentYear
              ? currentDate
              : undefined
          }
        />
        <ReactDatePicker
          popperClassName="z-50"
          placeholderText="Month"
          className={style}
          selected={monthPicker}
          onChange={onChangeMonth}
          renderCustomHeader={() => <></>}
          dateFormat="MMMM"
          showMonthYearPicker
          disabledKeyboardNavigation
          onFocus={(e) => e.target.blur()}
          onChangeRaw={(e) => {}}
          showPopperArrow
          minDate={year === currentYear ? currentDate : undefined}
        />
        <ReactDatePicker
          popperClassName="z-50"
          placeholderText="Year"
          className={style}
          selected={yearPicker}
          onChange={onChangeYear}
          dateFormat="yyyy"
          disabledKeyboardNavigation
          onFocus={(e) => e.target.blur()}
          showYearPicker
          minDate={minDateSelect}
        />
      </div>

      <span className="text-errorMain text-xs"> {error && error} </span>
    </>
  );
};

export const CombinedDatePickers = ({
  contentValue,
  label,
  nameProp,
  control,
  error,
  required,
  validation,
  subHeading,
  fieldAlert,
}: CombinedDatePickersProps) => {
  return (
    <Controller
      defaultValue={contentValue}
      name={nameProp}
      control={control}
      rules={{ validate: validation, required }}
      render={({ field }) => (
        <Component
          label={label}
          error={error}
          onChange={field.onChange}
          contentValue={contentValue}
          subHeading={subHeading}
          fieldAlert={fieldAlert}
        />
      )}
    />
  );
};
