import {
  ClassroomGroupDto,
  getArrayRange,
  ProgrammeAttendanceReasonDto,
} from '@ecdlink/core';
import {
  Alert,
  AlertProps,
  Button,
  classNames,
  Divider,
  Dropdown,
  DropDownOption,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { subYears } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ShortMonths } from '../../../../constants/Dates';
import {
  ChildInformationFormModel,
  childInformationFormSchema,
  childInformationFormSchemaCaregiver,
  dobYearsBetweenHigher,
  dobYearsBetweenLower,
  dobYearsLess,
  idMismatchList,
  idMismatchMessage,
  invalidDateList,
  invalidDateMessage,
  olderList,
  olderMessage,
  yearsBetweenList,
  yearsHeading,
  yearsLessList,
  yearsMessage,
} from '@schemas/child/child-registration/child-information-form';
import { classroomsSelectors } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import { calculateFullAge } from '@utils/common/date.utils';
import * as styles from './child-information-form.styles';
import { ChildInformationFormProps } from './child-information-form.types';
import { practitionerSelectors } from '@/store/practitioner';
import { useLocation } from 'react-router';
import { PractitionerChildRegisterState } from '../../practitioner-child-registration/types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { filterUniqueClassrooms } from '@/utils/classroom/classroom';
import { UNSURE_CLASS } from '@/constants/classroom';

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

  const location = useLocation<PractitionerChildRegisterState>();

  const practitionerIdFromCoachView = location?.state?.practitionerId;

  const [provideReason, setProvideReason] = useState(false);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getAllClassroomGroups
  );
  const reasons = useSelector(
    staticDataSelectors.getProgrammeAttendanceReasons
  );
  const allPractitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersForPrincipal = allPractitioners?.filter(
    (item) => item.principalHierarchy === practitionerIdFromCoachView
  );
  const classroomsByPractitionersForPrincipal = allClassroomGroups.filter(
    (item) =>
      practitionersForPrincipal?.some(
        (practitioner) => practitioner.userId === item.userId
      )
  );
  const classroomsForPractitioner = allClassroomGroups.filter((item) => {
    return practitionerIdFromCoachView
      ? item.userId === practitionerIdFromCoachView
      : item;
  });

  // suppress also the unsure class for principal
  const classroomsForPrincipal = [
    ...classroomsForPractitioner,
    ...classroomsByPractitionersForPrincipal,
  ].filter((item: ClassroomGroupDto) => item.name !== UNSURE_CLASS);

  const [updatedPlaygroups, setUpdatedPlaygroups] = useState<
    DropDownOption<string>[]
  >([]);

  const classroomsForPractitionerFromPractitionerFlow = useSelector(
    classroomsSelectors.getClassroom
  );
  const [
    classroomsForPractitionerAnyType,
    setClassroomsForPractitionerAnyType,
  ] = useState<any>([]);

  const practitionerFromCoachView = useSelector(
    getPractitionerByUserId(practitionerIdFromCoachView || '')
  );

  const practitionerFromPractitionerView = useSelector(
    practitionerSelectors.getPractitioner
  );

  const practitioner =
    practitionerFromPractitionerView || practitionerFromCoachView;

  useEffect(() => {
    if (classroomsForPractitionerFromPractitionerFlow) {
      setClassroomsForPractitionerAnyType([
        classroomsForPractitionerFromPractitionerFlow,
      ]);
    }
  }, [classroomsForPractitionerFromPractitionerFlow]);

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

  const { childIdField, dobDay, dobMonth, dobYear, reason } = useWatch({
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

  // Should not be able to see the “Unsure” class or add children to the unsure class
  useEffect(() => {
    if (
      !practitionerIdFromCoachView &&
      practitioner?.isPrincipal !== true &&
      classroomsForPractitionerAnyType.length > 0
    ) {
      const groupedItems: DropDownOption<string>[] = [];

      filterUniqueClassrooms(
        classroomsForPractitionerAnyType.filter(
          (item: ClassroomGroupDto) => item.name !== UNSURE_CLASS
        )
      ).forEach((groupedItem: any) => {
        groupedItems.push({
          label: groupedItem.name,
          value: groupedItem.id ?? '',
        });
      });
      setUpdatedPlaygroups(groupedItems);
    }
    if (classroomGroups.length > 0) {
      const groupedItems: DropDownOption<string>[] = [];

      const currentClassroomGroups =
        practitionerIdFromCoachView && practitioner?.isPrincipal
          ? classroomsForPrincipal
          : classroomsForPractitioner;

      filterUniqueClassrooms(
        currentClassroomGroups.filter((item) => item.name !== UNSURE_CLASS)
      ).forEach((groupedItem) => {
        groupedItems.push({
          label: groupedItem.name,
          value: groupedItem.id ?? '',
        });
      });

      setUpdatedPlaygroups(groupedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups, classroomsForPractitionerAnyType, allClassroomGroups]);

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

    if (childAge > dobYearsBetweenLower && childAge < dobYearsBetweenHigher) {
      alertsArray.push({
        type: 'warning',
        title: yearsHeading(childAge),
        message: yearsMessage,
        list: yearsBetweenList,
      });
    }

    if (childAge >= dobYearsBetweenHigher) {
      alertsArray.push({
        type: 'error',
        title: olderMessage,
        list: olderList,
      });
      yearHigherThresholdBreach = true;
    } else if (dateOfBirth >= today) {
      alertsArray.push({
        type: 'error',
        title: invalidDateMessage,
        list: invalidDateList,
      });
    } else if (childAge < dobYearsLess) {
      alertsArray.push({
        type: 'warning',
        title: yearsHeading(childAge),
        message: yearsMessage,
        list: yearsLessList,
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
    setProvideReason(childAge > dobYearsBetweenLower);
    setAlerts(alertsArray);
  };

  const setDateOfBirthById = () => {
    if (!childIdField || childIdField.length < 6) return;

    const idSubString = childIdField.replaceAll(' ', '');

    setChildInformationFormValue(
      'dobYear',
      +('20' + idSubString.substring(0, 2))
    );
    setChildInformationFormValue('dobMonth', +idSubString.substring(2, 4));
    setChildInformationFormValue('dobDay', +idSubString.substring(4, 6));
  };

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildInformationFormValues());
    }
  };

  return (
    <div className={'bg-uiBg pt-2'}>
      <Typography
        type={'h1'}
        text={"Child's details"}
        color={'primary'}
        className={'px-4'}
      />
      <div className={'p-4'}>
        {variation === 'practitioner' && (
          <PractitionerForm
            childInformationFormRegister={childInformationFormRegister}
            updatedPlaygroups={updatedPlaygroups}
            getChildInformationFormValues={getChildInformationFormValues}
            setChildInformationFormValue={setChildInformationFormValue}
            triggerChildInformationForm={triggerChildInformationForm}
          />
        )}

        {variation === 'caregiver' && (
          <CaregiverForm
            childInformationFormRegister={childInformationFormRegister}
          />
        )}

        <FormInput<ChildInformationFormModel>
          label={'ID number'}
          className={'mt-4'}
          hint={'Leave blank if not available'}
          nameProp={'childIdField'}
          register={childInformationFormRegister}
          error={errors['childIdField']}
          placeholder={'E.g. 190101 0000 000'}
        />
        <label className={classNames(styles.label, 'mt-4')}>
          {'Date of birth'}
        </label>
        <div className={'flex items-center justify-between'}>
          <Dropdown
            placeholder={'Day'}
            fillType="clear"
            selectedValue={getChildInformationFormValues().dobDay}
            list={dayDropDownList}
            onChange={(item) => {
              setChildInformationFormValue('dobDay', item as number);
            }}
          />
          <Dropdown
            placeholder={'Month'}
            fillType="clear"
            list={monthDropDownList}
            selectedValue={getChildInformationFormValues().dobMonth}
            onChange={(item) => {
              setChildInformationFormValue('dobMonth', item as number);
            }}
          />
          <Dropdown
            placeholder={'Year'}
            fillType="clear"
            list={yearDropDownList}
            selectedValue={getChildInformationFormValues().dobYear}
            onChange={(item) => {
              setChildInformationFormValue('dobYear', item as number);
            }}
          />
        </div>

        {provideReason && (
          <>
            <label className={classNames(styles.label, 'mt-4')}>
              {'Reason for child registration'}
            </label>
            <Dropdown<ProgrammeAttendanceReasonDto>
              placeholder={'Select reason'}
              fullWidth
              fillType="clear"
              list={
                (reasons &&
                  reasons.map((x: ProgrammeAttendanceReasonDto) => {
                    return { label: x.reason, value: x };
                  })) ||
                []
              }
              selectedValue={getChildInformationFormValues().reason}
              onChange={(item) => {
                setChildInformationFormValue('reason', item);
                triggerChildInformationForm();
              }}
            />
          </>
        )}

        {reason?.reason === 'Other' && provideReason && (
          <FormInput<ChildInformationFormModel>
            label={'Reason'}
            className={'mt-3'}
            textInputType="textarea"
            register={childInformationFormRegister}
            nameProp={'otherReason'}
            placeholder={'Please enter reason'}
          />
        )}

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
        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={handleFormSubmit}
          disabled={!isValid}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          icon="ArrowCircleRightIcon"
          iconPosition="start"
          text="Next"
          textColor="white"
        />
      </div>
    </div>
  );
};

const PractitionerForm: React.FC<any> = ({
  childInformationFormRegister,
  updatedPlaygroups,
  getChildInformationFormValues,
  setChildInformationFormValue,
  triggerChildInformationForm,
}) => {
  return (
    <>
      <FormInput<ChildInformationFormModel>
        label={'First name'}
        register={childInformationFormRegister}
        nameProp={'firstname'}
        placeholder={'First name'}
      />
      <FormInput<ChildInformationFormModel>
        label={'Surname'}
        className={'mt-3'}
        register={childInformationFormRegister}
        nameProp={'surname'}
        placeholder={'Surname/family name'}
      />
      <Dropdown<string>
        placeholder={'Select class'}
        list={updatedPlaygroups}
        fillType="clear"
        label={'Which class will the child attend?'}
        fullWidth
        className={'mt-3 w-full'}
        selectedValue={getChildInformationFormValues().playgroupId}
        onChange={(item) => {
          setChildInformationFormValue('playgroupId', item);
          triggerChildInformationForm();
        }}
      />
    </>
  );
};

const CaregiverForm: React.FC<any> = ({ childInformationFormRegister }) => {
  return (
    <>
      <FormInput<ChildInformationFormModel>
        label={'First name'}
        register={childInformationFormRegister}
        nameProp={'firstname'}
        placeholder={'First name'}
      />
      <FormInput<ChildInformationFormModel>
        label={'Surname'}
        className={'mt-3'}
        register={childInformationFormRegister}
        nameProp={'surname'}
        placeholder={'Surname/family name'}
      />
    </>
  );
};
