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
import { useState, useEffect } from 'react';
import { EditInfantDetailsProps } from './infant-details.types';
import {
  InfantDetailsModel,
  infantDetailsModelSchema,
} from '@/schemas/infant/infant-details';
import { intervalToDuration } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { getGenders } from '@/store/static-data/static-data.selectors';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';

export const InfantDetails: React.FC<EditInfantDetailsProps> = ({
  onSubmit,
  numberOfChildren,
  multipleChildrenCount,
}) => {
  const {
    // watch,
    getValues: getInfantDetailsFormValues,
    // formState: InfantDetailsFormState,
    setValue: setInfantDetailsFormValue,
    register: infantFormRegister,
    // reset: resetInfantDetailsFormValue,
    control: infantDetailsFormControl,
  } = useForm<InfantDetailsModel>({
    resolver: yupResolver(infantDetailsModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const genders = useSelector(staticDataSelectors.getGenders);
  const currentDate = new Date();

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
  const { years, months } = intervalToDuration({
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

  const setYearDate = (date: Date) => {
    if (date > new Date()) {
      setMyYear(new Date());
      return;
    }
    setMyYear(date);
  };

  const setMonthDate = (date: Date) => {
    if (date > new Date()) {
      setMyMonth(new Date());
      return;
    }
    setMyMonth(date);
  };

  const setDayDate = (date: Date) => {
    if (date > new Date()) {
      setMyDay(new Date());
      return;
    }
    setMyDay(date);
  };

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={
          numberOfChildren! > 1 ? `Child ${multipleChildrenCount}` : 'Child'
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
            onChange={(date: Date) => setDayDate(date)}
            dateFormat="dd"
            renderDayContents={renderDayContents}
            renderCustomHeader={({ date }) => <div></div>}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-textMid bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myMonth}
            onChange={(date: Date) => setMonthDate(date)}
            renderCustomHeader={({ date }) => <div></div>}
            dateFormat="MMMM"
            showMonthYearPicker
            showPopperArrow={true}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="bg-uiBg text-textMid focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myYear}
            onChange={(date: Date) => setYearDate(date)}
            dateFormat="yyyy"
            showYearPicker
          />
        </div>
        <div className="mt-6 flex w-full justify-start">
          <Alert
            type={'info'}
            message={`${years} years and ${months} months old`}
            className="w-full"
          />
        </div>
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
