import { getArrayRange } from '@ecdlink/core';
import {
  Alert,
  AlertProps,
  Button,
  Dropdown,
  DropDownOption,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { subYears } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { ShortMonths } from '../../../../constants/Dates';
import {
  ChildInformationFormModel,
  childInformationFormSchema,
  childInformationFormSchemaCaregiver,
  dobYearsBetweenHigher,
  idMismatchList,
  idMismatchMessage,
  invalidDateList,
  invalidDateMessage,
  olderList,
  olderMessage,
  yearsHeading,
} from '@schemas/child/child-registration/child-information-form';
import { calculateFullAge } from '@utils/common/date.utils';
import { ChildInformationFormProps } from './child-information-form.types';

export const ChildInformationForm: React.FC<ChildInformationFormProps> = ({
  childInformation,
  onSubmit,
  variation,
}) => {
  const daysInMonth = getArrayRange(1, 31);
  const years = getArrayRange(
    subYears(new Date(), 10).getFullYear(),
    new Date().getFullYear()
  );
  const [dayDropDownList, setDayDropDownList] = useState<
    DropDownOption<number>[]
  >([]);
  const [monthDropDownList] = useState<DropDownOption<number>[]>(ShortMonths);
  const [yearDropDownList, setYearDropDownList] = useState<
    DropDownOption<number>[]
  >([]);

  const [alerts, setAlerts] = useState<AlertProps[]>();

  const {
    getValues: getChildInformationFormValues,
    setValue: setChildInformationFormValue,
    register: childInformationFormRegister,
    trigger: triggerChildInformationForm,
    control: childInformationFormControl,
  } = useForm<ChildInformationFormModel>({
    resolver: yupResolver(
      variation === 'practitioner'
        ? childInformationFormSchema
        : childInformationFormSchemaCaregiver
    ),
    mode: 'onBlur',
    defaultValues: childInformation,
  });

  const { childIdField, dobDay, dobMonth, dobYear } = useWatch({
    control: childInformationFormControl,
    defaultValue: childInformation,
  });

  const { isValid, errors } = useFormState({
    control: childInformationFormControl,
  });

  useEffect(() => {
    const dayDropDownListToAdd: DropDownOption<number>[] = [];
    const yearDropDownListToAdd: DropDownOption<number>[] = [];

    daysInMonth.forEach((day) => {
      dayDropDownListToAdd.push({ label: day.toString(), value: day });
    });

    setDayDropDownList(dayDropDownListToAdd);
    years.forEach((year) => {
      yearDropDownListToAdd.push({ label: year.toString(), value: year });
    });

    setYearDropDownList(yearDropDownListToAdd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDateOfBirthById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childIdField]);

  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const dateOfBirth = new Date(dobYear, dobMonth - 1, dobDay);
      setChildInformationFormValue('dob', dateOfBirth);
      validateDateOfBirth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dobDay, dobMonth, dobYear]);

  const validateDateOfBirth = () => {
    const alertsArray: AlertProps[] = [];

    if (!dobDay || !dobMonth || !dobYear) {
      setChildInformationFormValue('dobValid', false);
      return;
    }

    if (childIdField && childIdField.length >= 6) {
      const idSubString = childIdField;

      const day = idSubString.substring(4, 6);
      const month = idSubString.substring(2, 4);
      const year = `20${idSubString.substring(0, 2)}`;

      const hasMisMatchWithId =
        dobDay !== +day || dobMonth !== +month || dobYear !== +year;

      if (hasMisMatchWithId) {
        alertsArray.push({
          type: 'warning',
          title: idMismatchMessage,
          list: idMismatchList,
        });
      }
    }

    // js months start at 0
    const dateOfBirth = new Date(dobYear, dobMonth - 1, dobDay);
    const today = new Date();
    const { years: childAge } = calculateFullAge(dateOfBirth);

    let yearHigherThresholdBreach = false;

    if (childAge > dobYearsBetweenHigher) {
      alertsArray.push({
        type: 'error',
        title: olderMessage(childAge),
        list: olderList,
      });
      yearHigherThresholdBreach = true;
    }

    if (dateOfBirth >= today) {
      alertsArray.push({
        type: 'error',
        title: invalidDateMessage,
        list: invalidDateList,
      });
    }

    if (!yearHigherThresholdBreach && alertsArray.length === 0) {
      alertsArray.push({
        type: 'info',
        title: `${yearsHeading(childAge)}`,
      });
    }

    if (alertsArray.filter((x) => x.type === 'error').length > 0) {
      setChildInformationFormValue('dobValid', false);
    } else {
      setChildInformationFormValue('dobValid', true);
    }
    triggerChildInformationForm();
    setAlerts(alertsArray);
  };

  const setDateOfBirthById = () => {
    if (!childIdField || childIdField.length < 6) return;

    const idSubString = childIdField.replaceAll(' ', '');

    const yearPrefix =
      parseInt(idSubString.substring(0, 2), 10) >
      parseInt(new Date().getFullYear().toString().substring(2, 4), 10)
        ? '19'
        : '20';
    const year = yearPrefix + idSubString.substring(0, 2);

    setChildInformationFormValue('dobYear', +year);
    setChildInformationFormValue('dobMonth', +idSubString.substring(2, 4));
    setChildInformationFormValue('dobDay', +idSubString.substring(4, 6));
  };

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildInformationFormValues());
    }
  };

  return (
    <div className={'flex h-full flex-col bg-white p-4'}>
      <Typography type={'h2'} text={"Child's details"} color={'primary'} />
      <FormInput<ChildInformationFormModel>
        label={'ID number'}
        className={'mt-4'}
        hint={'Leave blank if not available'}
        nameProp={'childIdField'}
        register={childInformationFormRegister}
        error={errors['childIdField']}
        placeholder={'E.g. 1901010000000'}
        maxLength={13}
      />
      <Typography
        type="h4"
        color="textDark"
        text="Date of birth"
        className="mt-4"
      />
      <div className={'flex items-center gap-2'}>
        <Dropdown
          className="w-full"
          placeholder={'Day'}
          textColor="textMid"
          selectedValue={getChildInformationFormValues().dobDay}
          list={dayDropDownList}
          onChange={(item) => {
            setChildInformationFormValue('dobDay', item as number);
          }}
        />
        <Dropdown
          className="w-full"
          placeholder={'Month'}
          textColor="textMid"
          list={monthDropDownList}
          selectedValue={getChildInformationFormValues().dobMonth}
          onChange={(item) => {
            setChildInformationFormValue('dobMonth', item as number);
          }}
        />
        <Dropdown
          className="w-full"
          placeholder={'Year'}
          textColor="textMid"
          list={yearDropDownList}
          selectedValue={getChildInformationFormValues().dobYear}
          onChange={(item) => {
            setChildInformationFormValue('dobYear', item as number);
          }}
        />
      </div>

      {alerts &&
        alerts.map((alert: AlertProps, index: number) => {
          return (
            <Alert
              key={'child-reg-alert-' + index}
              className={'mt-5'}
              title={alert.title}
              message={alert.message}
              list={alert.list}
              type={alert.type}
            />
          );
        })}
      <Button
        onClick={handleFormSubmit}
        disabled={!isValid}
        className="mt-auto w-full"
        size="small"
        color="quatenary"
        type="filled"
        icon="ArrowCircleRightIcon"
        iconPosition="start"
        text="Next"
        textColor="white"
      />
    </div>
  );
};
