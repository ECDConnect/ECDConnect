import { Typography } from '@ecdlink/ui';
import { UseFormGetValues, useWatch } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';
import { useMemo } from 'react';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
  control?: any;
}

export const Step6: React.FC<StepProps> = ({ getValues, control }) => {
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

  const appSectionArray = useMemo(
    () => [
      {
        title: 'Attendance',
        enable: attendanceEnabled,
      },
      {
        title: 'Child progress',
        enable: progressEnabled,
      },
      {
        title: 'Classroom activities',
        enable: classroomActivitiesEnabled,
      },
      {
        title: 'Income statements',
        enable: businessEnabled,
      },
      {
        title: 'Training',
        enable: trainingEnabled,
      },
      {
        title: 'Calendar',
        enable: calendarEnabled,
      },
      {
        title: 'Coach/mentor/supervisor/monitor/field agent role',
        enable: coachRoleEnabled,
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

  const renderStep6Items = useMemo(() => {
    return appSectionArray
      ?.filter((item) => item?.enable)
      ?.map((item2) => (
        <div>
          <Typography type="help" color="textDark" text={item2?.title} />
        </div>
      ));
  }, [appSectionArray]);

  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 6`} />
      <div>
        <Typography
          type="help"
          weight="bold"
          color="textDark"
          text={`Parts of the app that will be available to users`}
          className="mb-2"
        />
        <div>{renderStep6Items}</div>
        {getValues()?.coachRoleName && (
          <div className="mt-6">
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`Name of “Coach” role`}
              className="mb-2"
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues()?.coachRoleName}
            />
          </div>
        )}
      </div>
    </div>
  );
};
