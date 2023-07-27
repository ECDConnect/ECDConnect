import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Alert,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import { EditInfantDetailsProps } from './infant-details.types';
import {
  InfantDetailsModel,
  infantDetailsModelSchema,
} from '@/schemas/infant/infant-details';
import { intervalToDuration, addYears } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import { getPreviousAndNextMonths, getNextDateByDay } from '@ecdlink/core';

export const InfantDetails: React.FC<EditInfantDetailsProps> = ({
  onSubmit,
  numberOfChildren,
  multipleChildrenCount,
  motherInfo,
  name,
  genderId,
}) => {
  const {
    getValues: getInfantDetailsFormValues,
    setValue: setInfantDetailsFormValue,
    register: infantFormRegister,
    control: infantDetailsFormControl,
  } = useForm<InfantDetailsModel>({
    resolver: yupResolver(infantDetailsModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const genders = useSelector(staticDataSelectors.getGenders);

  const currentDate = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => getNextDateByDay(1), []);

  const { sixYearsAgo } = useMemo(() => {
    const sixYearsAgo = addYears(tomorrow, -6);
    return { sixYearsAgo };
  }, [tomorrow]);

  const { expectedDateOfDelivery, twoMonthsAgo, twoMonthsLater } =
    useMemo(() => {
      const expectedDateOfDelivery = motherInfo?.expectedDateOfDelivery
        ? new Date(motherInfo?.expectedDateOfDelivery)
        : null;

      if (expectedDateOfDelivery) {
        const { nextDate, previousDate } = getPreviousAndNextMonths(
          expectedDateOfDelivery,
          2
        );
        const { previousDate: previousDateByCurrentDate } =
          getPreviousAndNextMonths(currentDate, 2);

        const twoMonthsAgo =
          previousDate < currentDate ? previousDate : previousDateByCurrentDate;
        const twoMonthsLater = nextDate < currentDate ? nextDate : currentDate;

        return {
          expectedDateOfDelivery,
          twoMonthsAgo,
          twoMonthsLater,
        };
      }

      return { expectedDateOfDelivery };
    }, [currentDate, motherInfo?.expectedDateOfDelivery]);

  const genderOptionsUpdated = genders
    ?.filter((gender) => gender?.description !== 'Other')
    .map((item) => {
      return {
        text: item?.description,
        value: String(item?.id),
      };
    });

  const [myMonth, setMyMonth] = useState(currentDate);
  const [myYear, setMyYear] = useState(currentDate);
  const [myDay, setMyDay] = useState(currentDate);

  const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
  const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);
  const { years, months, days } = intervalToDuration({
    start: myDay > new Date() ? new Date() : myDay,
    end: currentDate,
  });
  const { isValid } = useFormState({ control: infantDetailsFormControl });

  useEffect(() => {
    setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
  }, [myMonth, myYear, setMyDay]);

  useEffect(() => {
    if (myDay) {
      setInfantDetailsFormValue('dateOfBirth', myDay);
    }
  }, [myDay, setInfantDetailsFormValue]);

  const renderDayContents = (day: any, date: any) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  const onChangeYear = (date: Date) => {
    if (expectedDateOfDelivery) {
      if (date.getFullYear() < expectedDateOfDelivery.getFullYear()) {
        setMyDay(twoMonthsAgo);
        setMyMonth(twoMonthsAgo);
        return setMyYear(twoMonthsAgo);
      }

      if (date.getFullYear() >= expectedDateOfDelivery.getFullYear()) {
        setMyDay(twoMonthsLater);
        setMyMonth(twoMonthsLater);
        return setMyYear(twoMonthsLater);
      }

      if (date.getFullYear() > myYear.getFullYear()) {
        setMyDay(currentDate);
        setMyMonth(currentDate);
        return setMyYear(currentDate);
      }
    } else {
      if (date.getFullYear() === sixYearsAgo.getFullYear()) {
        setMyDay(sixYearsAgo);
        setMyMonth(sixYearsAgo);
        return setMyYear(sixYearsAgo);
      }
    }
    return setMyYear(date);
  };

  const handleDateChangeRaw = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={
          numberOfChildren && numberOfChildren > 1
            ? `Child ${multipleChildrenCount}`
            : 'Child'
        }
        className="pt-6"
      />
      <Typography
        type="h4"
        color={'textMid'}
        text={'Details'}
        className="w-11/12 pt-2"
      />
      <div className="flex w-11/12 justify-center text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <FormInput<InfantDetailsModel>
        label={'First name'}
        register={infantFormRegister}
        nameProp={'firstName'}
        placeholder={'First name'}
        type={'text'}
        className="mt-4"
      ></FormInput>
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={'Date of birth:'}
          className="mt-4 w-11/12 pt-2"
        />
        <div className="flex items-center gap-1">
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-textMid bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myDay}
            onChange={(date: Date) => setMyDay(date || currentDate)}
            dateFormat="dd"
            renderDayContents={renderDayContents}
            disabledKeyboardNavigation
            onFocus={(e) => e.target.blur()}
            onChangeRaw={(e) => handleDateChangeRaw(e)}
            renderCustomHeader={() => <></>}
            {...(myMonth.getMonth() === currentDate.getMonth() && {
              maxDate: currentDate,
            })}
            {...(!!expectedDateOfDelivery && {
              minDate: twoMonthsAgo,
              maxDate: twoMonthsLater,
            })}
            {...(!expectedDateOfDelivery &&
              myMonth.getFullYear() === sixYearsAgo.getFullYear() && {
                minDate: sixYearsAgo,
              })}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-textMid bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myMonth}
            onChange={(date: Date) => setMyMonth(date || currentDate)}
            renderCustomHeader={() => <></>}
            dateFormat="MMMM"
            showMonthYearPicker
            disabledKeyboardNavigation
            onFocus={(e) => e.target.blur()}
            onChangeRaw={(e) => handleDateChangeRaw(e)}
            showPopperArrow={true}
            {...(!!expectedDateOfDelivery && {
              minDate: twoMonthsAgo,
              maxDate: twoMonthsLater,
            })}
            {...(!expectedDateOfDelivery &&
              myYear.getFullYear() === currentDate.getFullYear() && {
                maxDate: currentDate,
              })}
            {...(!expectedDateOfDelivery &&
              myYear.getFullYear() === sixYearsAgo.getFullYear() && {
                minDate: sixYearsAgo,
              })}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="bg-uiBg text-textMid focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myYear}
            onChange={(date: Date) => onChangeYear(date || currentDate)}
            dateFormat="yyyy"
            disabledKeyboardNavigation
            onFocus={(e) => e.target.blur()}
            onChangeRaw={(e) => handleDateChangeRaw(e)}
            showYearPicker
            {...(!!expectedDateOfDelivery
              ? {
                  minDate: twoMonthsAgo,
                  maxDate: twoMonthsLater,
                }
              : {
                  minDate: sixYearsAgo,
                  maxDate: currentDate,
                })}
          />
        </div>
        {years! < 1 && months! < 1 && (
          <div className="mt-6 flex w-full justify-start">
            <Alert
              type={'info'}
              message={`${days} days old`}
              className="w-full"
            />
          </div>
        )}
        {years! < 1 && months! > 0 && (
          <div className="mt-6 flex w-full justify-start">
            <Alert
              type={'info'}
              message={`${months} months and ${days} days old`}
              className="w-full"
            />
          </div>
        )}
        {years! > 0 && (
          <div className="mt-6 flex w-full justify-start">
            <Alert
              type={'info'}
              message={`${years} years and ${months} months old`}
              className="w-full"
            />
          </div>
        )}
      </div>
      <Typography
        type="h3"
        color={'textDark'}
        text={'Sex'}
        className="w-11/12 pt-2"
      />
      <div className="mt-2">
        <ButtonGroup<string>
          options={genderOptionsUpdated}
          onOptionSelected={(value: string | string[]) => {
            setInfantDetailsFormValue('genderId', value as string, {
              shouldValidate: true,
            });
          }}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={'w-full'}
        />
      </div>
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'bottom-10 mt-2 max-h-10 w-full'}
          textColor={'white'}
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getInfantDetailsFormValues());
          }}
          disabled={!isValid}
        />
      </div>
    </>
  );
};
