import {
  ActionModal,
  Alert,
  CheckboxGroup,
  Dialog,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ViewGridAddIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';
import { useEffect, useMemo, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  setDisableButton?: (item: boolean) => void;
  control?: any;
}

export const Step6: React.FC<StepProps> = ({
  register,
  setValue,
  errors,
  getValues,
  control,
  setDisableButton,
}) => {
  const {
    attendanceEnabled,
    progressEnabled,
    classroomActivitiesEnabled,
    businessEnabled,
    trainingEnabled,
    calendarEnabled,
    coachRoleEnabled,
    coachRoleName,
  } = useWatch({
    control: control,
  });

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');
  const appSectionArray = useMemo(
    () => [
      {
        title: 'Attendance',
        description:
          'Principals and practitioners can take attendance for their classes',
        enable: attendanceEnabled,
        propName: 'attendanceEnabled',
        modalTitle: 'Attendance Management',
        modalText:
          'Allow principals and practitioners to track class attendance. They can mark children present or absent and download attendance PDFs.',
      },
      {
        title: 'Child progress',
        description:
          'Principals & practitioners can assess child progress on the app',
        enable: progressEnabled,
        propName: 'progressEnabled',
        modalTitle: 'Child Progress Assessment',
        modalText:
          'Allow principals and practitioners to assess child development. They can create and download PDF reports to share with caregivers.',
      },
      {
        title: 'Classroom activities',
        description:
          'Principals and practitioners can plan their classroom activities in the app',
        enable: classroomActivitiesEnabled,
        propName: 'classroomActivitiesEnabled',
        modalTitle: 'Classroom Activities',
        modalText:
          'A tool for principals and practitioners to plan classroom activities. They can select themes, activities, and stories and schedule them for each class.',
      },
      {
        title: 'Income statements',
        description:
          'Principals can add their income, expenses, and track their preschool profit/loss',
        enable: businessEnabled,
        propName: 'businessEnabled',
        modalTitle: 'Income Statements',
        modalText:
          'Enable principals to manage preschool finances. They can track income, expenses, and profit/loss.',
      },
      {
        title: 'Training',
        description:
          'Principals, practitioners and coaches can complete online courses on the app',
        enable: trainingEnabled,
        propName: 'trainingEnabled',
        modalTitle: 'Online Training Courses',
        modalText:
          'Offer access to online courses for principals, practitioners, and coaches. Enable this feature to support ongoing professional development.',
      },
      {
        title: 'Calendar',
        description:
          'Principals, practitioners and coaches can add and view events',
        enable: calendarEnabled,
        propName: 'calendarEnabled',
        modalTitle: 'Calendar',
        modalText:
          'Allow principals, practitioners, and coaches to add and view events (birthdays, caregiver meetings, fundraising events, holiday celebrations, open days, trainings, and others).',
      },
      {
        title: 'Coach/mentor/supervisor/monitor/field agent role',
        description: `This role would be responsible for completing site visits and monitoring practitioner's app use`,
        enable: coachRoleEnabled,
        propName: 'coachRoleEnabled',
        modalTitle: 'Coach/Supervisor Role',
        modalText: ``,
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

  const coachRoleCustomizedText = (
    <div>
      <div className="font-bold">Customisation</div>
      <div className="mb-6">
        You can define the name of this supervisory role, whether it's a coach,
        mentor, supervisor, monitor, or field agent. Choose the name you
        currently use for this role at your organisation.
      </div>{' '}
      <div className="font-bold">
        Enhanced support for practitioners & principals
      </div>{' '}
      <div>
        Enable this role to help coaches/supervisors provide better support to
        practitioners and principals by giving them insights into overall
        performance. Supervisors can access aggregated data, such as:
      </div>{' '}
      <ul className="mb-6 list-disc">
        <li className="ml-8">
          Class attendance percentages: See the overall attendance rates for
          each class.
        </li>{' '}
        <li className="ml-8">
          Class progress summary: View summaries of child development progress
          without accessing individual child details.
        </li>{' '}
        <li className="ml-8">
          Financial summaries: Monitor the preschool’s basic income and expense
          summaries for the current and previous month.
        </li>
      </ul>{' '}
      <div className="font-bold">Site visits management</div>{' '}
      <div className="mb-6">
        Supervisors can complete site visits within the app, linked to specific
        principals and practitioners. Admins can decide which site visits
        supervisors can access, ensuring relevant and focused support.
      </div>{' '}
      <div className="font-bold">Request and Feedback System</div> Practitioners
      and principals can request visits from supervisors and give feedback about
      supervisors directly to admins, making communication easy and encouraging
      the coach to improve.
    </div>
  );
  const handleInfoClick = (e: any, modalTitle: string, modalText: string) => {
    setOpenInfoModal(true);
    setModalTitle(modalTitle);
    setModalText(modalText);
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (coachRoleEnabled && !coachRoleName) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [coachRoleEnabled, coachRoleName, setDisableButton]);

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
              key={item?.title + Math.random()}
              onClick={(e) => {
                handleInfoClick(e, item?.modalTitle, item?.modalText);
              }}
              className="bg-infoMain flex h-6 w-6 items-center justify-center rounded-full p-1"
            >
              <InformationCircleIcon className="h-4 w-4 text-white" />
            </div>
          }
          isAdminPortalInput={true}
        />
      ))}
      {coachRoleEnabled && (
        <div className="my-6">
          <FormInput<SetupOrgModel>
            label={
              'What would you like to call the “Coach” role on your app? *'
            }
            subLabel={`You will not be able to change this name later. Some examples: coach, mentor, supervisor, monitor, field agent. Character limit: 20`}
            visible={true}
            nameProp={'coachRoleName'}
            register={register}
            error={errors['coachRoleName']}
            placeholder={'Name of role'}
            className="w-full"
            isAdminPortalField={true}
            value={coachRoleName}
            maxCharacters={20}
            maxLength={20}
          />
        </div>
      )}
      <Dialog
        className={'px-56'}
        stretch={true}
        visible={openInfoModal}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={modalTitle}
          detailText={modalText}
          customDetailText={
            modalTitle === 'Coach/Supervisor Role' && coachRoleCustomizedText
          }
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              text: 'Close',
              textColour: 'quatenaryMain',
              colour: 'quatenaryMain',
              type: 'outlined',
              onClick: () => setOpenInfoModal(false),
              leadingIcon: 'XIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
