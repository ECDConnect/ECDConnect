import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ViewGridAddIcon } from '@heroicons/react/solid';
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';
import { useMemo, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  control?: any;
}

export const Step6: React.FC<StepProps> = ({
  register,
  setValue,
  errors,
  getValues,
  control,
}) => {
  console.log(getValues());
  const {
    attendanceEnabled,
    progressEnabled,
    classroomActivitiesEnabled,
    businessEnabled,
    trainingEnabled,
    calendarEnabled,
    coachRoleEnabled,
  } = useWatch({
    control: control,
  });
  console.log({ attendanceEnabled });
  const appSectionArray = useMemo(
    () => [
      {
        title: 'Attendance',
        description:
          'Principals and practitioners can take attendance for their classes',
        enable: attendanceEnabled,
        propName: 'attendanceEnabled',
      },
      {
        title: 'Child progress',
        description:
          'Principals & practitioners can assess child progress on the app',
        enable: progressEnabled,
        propName: 'progressEnabled',
      },
      {
        title: 'Classroom activities',
        description:
          'Principals and practitioners can plan their classroom activities in the app',
        enable: classroomActivitiesEnabled,
        propName: 'classroomActivitiesEnabled',
      },
      {
        title: 'Income statements',
        description:
          'Principals can add their income, expenses, and track their preschool profit/loss',
        enable: businessEnabled,
        propName: 'businessEnabled',
      },
      {
        title: 'Training',
        description:
          'Principals, practitioners and coaches can complete online courses on the app',
        enable: trainingEnabled,
        propName: 'trainingEnabled',
      },
      {
        title: 'Calendar',
        description:
          'Principals, practitioners and coaches can add and view events',
        enable: calendarEnabled,
        propName: 'calendarEnabled',
      },
      {
        title: 'Coach/mentor/supervisor/monitor/field agent role',
        description: `This role would be responsible for completing site visits and monitoring practitioner's app use`,
        enable: coachRoleEnabled,
        propName: 'coachRoleEnabled',
      },
    ],
    [
      attendanceEnabled,
      businessEnabled,
      calendarEnabled,
      classroomActivitiesEnabled,
      coachRoleEnabled,
      progressEnabled,
      trainingEnabled,
    ]
  );

  const handleInfoClick = (e) => {
    console.log('hahaha');
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <div className="mt-12 mb-4 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <ViewGridAddIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Which parts of the app would you like to use?`}
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`ECD Connect has been built in a modular way to support a broad range of ECD service providers. You are able to select which app features you want your users to have access to.`}
      />
      <Alert
        className="my-6 rounded-md"
        title={`Once you choose the modules below, you will not be able to change them later.`}
        type="warning"
      />
      <Alert
        className="my-6 rounded-md"
        title={`Note: on the app, principals can decide if practitioners can do the following for the preschool: add or remove children, take attendance, create child progress reports, plan classroom activities.`}
        type="info"
      />
      {appSectionArray?.map((item, index) => (
        <CheckboxGroup
          id={item.title}
          key={item.title}
          title={item?.title}
          description={item.description}
          checked={item?.enable}
          value={item.title}
          className="mb-1"
          register={register}
          nameProp={item?.propName}
          infoIcon={
            <div
              onClick={(e) => {
                handleInfoClick(e);
              }}
              className="bg-infoMain flex h-6 w-6 items-center justify-center rounded-full p-1"
            >
              <InformationCircleIcon className="h-4 w-4 text-white" />
            </div>
          }
          isAdminPortalInput={true}
        />
      ))}
    </div>
  );
};
