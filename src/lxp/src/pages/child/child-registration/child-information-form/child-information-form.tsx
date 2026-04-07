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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = getArrayRange(CURRENT_YEAR - 10, CURRENT_YEAR);
const DAYS = getArrayRange(1, 31);

export const ChildInformationForm: React.FC<ChildInformationFormProps> = ({
  childInformation,
  onSubmit,
  variation,
}) => {
  const schema =
    variation === 'practitioner'
      ? childInformationFormSchema
      : childInformationFormSchemaCaregiver;

  const {
    register,
    control,
    setValue,
    getValues,
    trigger,
    formState: { isValid, errors },
  } = useForm<ChildInformationFormModel>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: childInformation,
  });

  const { childIdField, dobDay, dobMonth, dobYear } = useWatch({ control });
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const dayOptions = useMemo(
    () => [
      { label: 'Day', value: undefined, disabled: true },
      ...DAYS.map((d) => ({ label: String(d), value: d })),
    ],
    [DAYS]
  );

  const monthOptions = useMemo(() => ShortMonths, []);

  const yearOptions = useMemo<DropDownOption<number>[]>(
    () => YEARS.map((y) => ({ label: y.toString(), value: y })),
    []
  );

  // Parse South African ID and auto-fill DOB
  const autoFillDobFromId = useCallback(() => {
    if (!childIdField || childIdField.length < 6) return;

    const cleanId = childIdField.replace(/\s/g, '');
    if (!/^\d{6}/.test(cleanId)) return;

    const yy = parseInt(cleanId.substring(0, 2), 10);
    const currentYy = CURRENT_YEAR % 100;

    const century = yy > currentYy ? '19' : '20';
    const year = parseInt(century + cleanId.substring(0, 2), 10);
    const month = parseInt(cleanId.substring(2, 4), 10);
    const day = parseInt(cleanId.substring(4, 6), 10);

    // Only update if values are plausible
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      setValue('dobYear', year, { shouldValidate: true });
      setValue('dobMonth', month, { shouldValidate: true });
      setValue('dobDay', day, { shouldValidate: true });
    }
  }, [childIdField, setValue]);

  const validateDateOfBirth = useCallback(() => {
    if (!dobDay || !dobMonth || !dobYear || dobYear === 1) {
      setValue('dobValid', false);
      setAlerts([]);
      return;
    }

    const alertsList: AlertProps[] = [];

    // ID vs DOB mismatch check
    if (childIdField && childIdField.length >= 6) {
      const cleanId = childIdField.replace(/\s/g, '');
      const idDay = parseInt(cleanId.substring(4, 6), 10);
      const idMonth = parseInt(cleanId.substring(2, 4), 10);
      const idYear = parseInt('20' + cleanId.substring(0, 2), 10);

      if (dobDay !== idDay || dobMonth !== idMonth || dobYear !== idYear) {
        alertsList.push({
          type: 'warning',
          title: idMismatchMessage,
          list: idMismatchList,
        });
      }
    }

    const dob = new Date(dobYear, dobMonth - 1, dobDay);
    if (isNaN(dob.getTime())) return;

    setValue('dob', dob);

    const today = new Date();
    const { years: ageInYears } = calculateFullAge(dob);

    // Future date
    if (dob >= today) {
      alertsList.push({
        type: 'error',
        title: invalidDateMessage,
        list: invalidDateList,
      });
    }

    // Too old
    if (ageInYears > dobYearsBetweenHigher) {
      alertsList.push({
        type: 'error',
        title: olderMessage(ageInYears),
        list: olderList,
      });
    }

    // Show age info when valid
    if (alertsList.every((a) => a.type !== 'error')) {
      alertsList.push({
        type: 'info',
        title: yearsHeading(ageInYears),
      });
    }

    const hasError = alertsList.some((a) => a.type === 'error');
    setValue('dobValid', !hasError, { shouldValidate: true });

    setAlerts(alertsList);
    trigger();
  }, [dobDay, dobMonth, dobYear, childIdField, setValue, trigger]);

  // Effects
  useEffect(() => {
    autoFillDobFromId();
  }, [autoFillDobFromId]);

  useEffect(() => {
    if (
      dobDay &&
      dobMonth &&
      dobYear &&
      !(dobDay === 1 && dobMonth === 1 && dobYear === 1)
    ) {
      validateDateOfBirth();
    }
  }, [dobDay, dobMonth, dobYear, validateDateOfBirth]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit?.(getValues());
    }
  };

  return (
    <div className="flex h-full flex-col bg-white p-4">
      <Typography type="h2" text="Child's details" color="primary" />

      <FormInput<ChildInformationFormModel>
        label="ID number"
        className="mt-4"
        hint="Leave blank if not available"
        nameProp="childIdField"
        register={register}
        error={errors.childIdField}
        placeholder="E.g. 1901010000000"
        maxLength={13}
      />

      <Typography
        type="h4"
        color="textDark"
        text="Date of birth"
        className="mt-4"
      />

      <div className="mt-2 flex items-center gap-2">
        <Dropdown
          className="w-full flex-1"
          placeholder="Day"
          textColor="textMid"
          list={dayOptions}
          selectedValue={dobDay ?? undefined}
          onChange={(val) => setValue('dobDay', val as number | undefined)}
        />

        <Dropdown
          className="w-full flex-1"
          placeholder="Month"
          textColor="textMid"
          list={monthOptions}
          selectedValue={dobMonth ?? undefined}
          onChange={(val) => setValue('dobMonth', val as number | undefined)}
        />

        <Dropdown
          className="w-full flex-1"
          placeholder="Year"
          textColor="textMid"
          list={yearOptions}
          selectedValue={dobYear ?? undefined}
          onChange={(val) => setValue('dobYear', val as number | undefined)}
        />
      </div>

      {alerts.map((alert, idx) => (
        <Alert
          key={`alert-${idx}`}
          className="mt-5"
          type={alert.type}
          title={alert.title}
          list={alert.list}
          message={alert.message}
        />
      ))}

      <Button
        onClick={handleSubmit}
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
