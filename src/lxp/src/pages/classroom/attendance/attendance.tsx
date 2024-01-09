import {
  AttendanceDto,
  ClassroomGroupDto,
  LearnerDto,
  useDialog,
} from '@ecdlink/core';
import {
  ComponentBaseProps,
  Button,
  Typography,
  renderIcon,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import {
  add,
  addDays,
  format,
  getDayOfYear,
  isFriday,
  isPast,
  isSameDay,
  isToday,
  isWeekend,
  nextMonday,
  startOfWeek,
} from 'date-fns';
import getDay from 'date-fns/getDay';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AttendanceResult } from '@models/classroom/attendance/AttendanceResult';
import { attendanceSelectors } from '@store/attendance';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import {
  classroomGroupHasAttendanceDate,
  getClassroomGroupSchoolDays,
  getMissedAttendanceSummaryGroups,
  isValidAttendableDate,
} from '@utils/classroom/attendance/track-attendance-utils';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { AttendanceComponentType } from './attendance.types';
import AttendanceList from './components/attendance-list/attendance-list';
import { AttendanceReport } from './components/attendance-report/attendance-report';
import { AttendanceSummary } from './components/attendance-summary/attendance-summary';
import { isWorkingDay } from '@/utils/common/date.utils';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { MissedAttendanceGroups } from '@/models/classroom/attendance/MissedAttendanceGroups';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { coachSelectors } from '@/store/coach';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import AttendanceWrapper from '@/pages/classroom/attendance/components/attendance-wrapper/AttendanceWrapper';

export const AttendanceComponent: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();
  const coach = useSelector(coachSelectors.getCoach);
  const history = useHistory();
  const userData = useSelector(userSelectors.getUser);
  const [seeRegister, setSeeRegister] = useState<boolean>(false);
  const [previousClassroomGroupId, setPreviousClassroomGroupId] =
    useState<string>('');
  const [userCurrentClassroomGroup, setUserCurrentClassroomGroup] =
    useState<ClassroomGroupDto>();

  const [attendanceComponentType, setAttendanceComponentType] =
    useState<AttendanceComponentType>();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroupsForPrincipal = allClassroomGroups.filter(
    (item) => item?.userId === userData?.id
  );
  const classroomGroups = isPrincipal
    ? classroomGroupsForPrincipal.filter(
        (x) => x.name !== NoPlaygroupClassroomType.name
      )
    : allClassroomGroups.filter(
        (x) => x.name !== NoPlaygroupClassroomType.name
      );
  const children = useSelector(childrenSelectors.getChildren);
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const classProgrammesForPrincipal = classProgrammes.filter((el) => {
    return classroomGroupsForPrincipal.some((f) => {
      return f.id === el.classroomGroupId;
    });
  });
  const classProgrammesUpdated = isPrincipal
    ? classProgrammesForPrincipal
    : classProgrammes;
  const publicHolidays = useSelector(staticDataSelectors.getHolidays);
  const attendance = useSelector(attendanceSelectors.getAttendance);
  const learners = useSelector(classroomsSelectors.getClassroomGroupLearners);
  const holidays = useSelector(staticDataSelectors.getHolidays);
  const [currentDate] = useState(new Date());

  function isAllStudentsInsertedBeforeToday(studentsArray: any[]): boolean {
    const filteredArray: boolean[] = studentsArray.map((student) => {
      const insertedDate = new Date(student.insertedDate); // convert insertedDate to a Date object
      return getDayOfYear(insertedDate) <= getDayOfYear(currentDate);
    });
    return filteredArray.every((value) => value === true);
  }

  const allChildrenInsertedBeforeToday = isAllStudentsInsertedBeforeToday(
    children ?? []
  );

  const call = () => {
    window.open(`tel:${coach?.user?.phoneNumber}`);
  };

  const practitionerAbsentees = practitioner?.absentees;
  const validAbsenteesDates = practitionerAbsentees?.filter(
    (item) =>
      !isPast(new Date(item?.absentDateEnd as string)) ||
      isToday(new Date(item?.absentDate as string))
  );
  const currentDates = validAbsenteesDates?.map((item) => {
    return item?.absentDate as string;
  });
  const orderedDates = currentDates?.sort(function (a, b) {
    return Date.parse(a) - Date.parse(b);
  });
  const currentAbsentee = validAbsenteesDates?.find(
    (item) => item?.absentDate === orderedDates?.[0]
  ) as AbsenteeDto;

  const practitionerIsOnLeave = useMemo(
    () =>
      isPast(new Date(currentAbsentee?.absentDate as string)) &&
      !isPast(
        add(new Date(currentAbsentee?.absentDateEnd as string), { days: 1 })
      ),
    [currentAbsentee?.absentDate, currentAbsentee?.absentDateEnd]
  );

  const handleComebackDay = useCallback((date: Date) => {
    if (isFriday(new Date(date)) || isWeekend(new Date(date))) {
      return nextMonday(new Date(date));
    }

    return new Date(addDays(new Date(date), 1));
  }, []);

  const handleIsOnleaveModal = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            icon="ExclamationCircleIcon"
            iconBorderColor="alertBg"
            iconColor="alertMain"
            importantText={`You are on leave and cannot use this section`}
            paragraphs={[
              `You are on leave from ${format(
                new Date(
                  (currentAbsentee?.absentDateEnd as Date) || new Date()
                ),
                'd MMM yyyy'
              )} to ${format(
                new Date(
                  handleComebackDay(
                    (currentAbsentee?.absentDateEnd as Date) || new Date()
                  )
                ),
                'd MMM yyyy'
              )}. If you believe this is a mistake please reach out to ${
                currentAbsentee?.loggedByPerson
              }.`,
            ]}
            actionButtons={[
              {
                text: `Contact ${currentAbsentee?.loggedByPerson}`,
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: () => {
                  call();
                  onSubmit();
                },
                leadingIcon: 'PhoneIcon',
              },
              {
                text: `Close`,
                textColour: 'primary',
                colour: 'primary',
                type: 'outlined',
                onClick: () => {
                  history.push(ROUTES.DASHBOARD);
                  onClose();
                },
                leadingIcon: 'XCircleIcon',
              },
            ]}
          />
        );
      },
    });
  };

  useEffect(() => {
    if (practitionerIsOnLeave) {
      handleIsOnleaveModal();
    }
  }, [practitionerIsOnLeave]);

  useEffect(() => {
    if (!classroomGroups || classroomGroups?.length === 0) return;

    if (attendance === undefined) return;

    const currentWeekAttendance: AttendanceDto[] = attendance;
    const _learners: LearnerDto[] = learners;

    const currentClassProgramme = classroomGroupHasAttendanceDate(
      classProgrammesUpdated,
      currentDate
    );

    const currentDayClassroomGroup = classroomGroups.find(
      (x) => x.id === currentClassProgramme?.classroomGroupId
    );

    //this must be updated for user with multiple classes
    setUserCurrentClassroomGroup(currentDayClassroomGroup);

    const currentLearners = [];
    const programmeStartDate =
      typeof currentClassProgramme?.programmeStartDate != 'undefined'
        ? new Date(currentClassProgramme?.programmeStartDate)
        : new Date();

    const uniqueLearners = _learners.filter((object, index, array) => {
      return (
        index ===
        array.findIndex((newObject) => newObject.userId === object.userId)
      );
    });

    for (const learner of uniqueLearners) {
      const startedAttendanceDay = getDayOfYear(
        new Date(learner.startedAttendance)
      );

      const showChildInRegister =
        startedAttendanceDay >= getDayOfYear(programmeStartDate);

      if (showChildInRegister) {
        currentLearners.push(learner);
      }
    }

    const currentClassProgrammes = classProgrammesUpdated.filter(
      (x) => x.classroomGroupId === currentDayClassroomGroup?.id
    );
    const meetingDays = getClassroomGroupSchoolDays(currentClassProgrammes);

    const attendanceAlreadyTaken = currentWeekAttendance.some((att) => {
      return isSameDay(
        getDay(new Date(att.attendanceDate as Date)) - 1,
        getDay(currentDate)
      );
    });

    const isValidDayForAttendance = isValidAttendableDate(
      currentDate,
      meetingDays || [],
      publicHolidays || []
    );

    const missedDays: MissedAttendanceGroups[] =
      getMissedAttendanceSummaryGroups(
        practitioner?.isPrincipal === true
          ? classroomGroupsForPrincipal
          : classroomGroups || [],
        classProgrammesUpdated,
        attendance,
        holidays,
        currentDate,
        learners
      );

    //weekend check
    if (!currentDayClassroomGroup && missedDays.length === 0) {
      setAttendanceComponentType('report');
      return;
    }
    if (!attendanceAlreadyTaken && isValidDayForAttendance && !seeRegister) {
      setAttendanceComponentType('attendance');
    } else if (missedDays.length === 0) {
      setAttendanceComponentType('report');
    } else {
      setAttendanceComponentType('summary');
      return;
    }
  }, [
    allChildrenInsertedBeforeToday,
    attendance,
    classProgrammesUpdated,
    classroomGroups,
    classroomGroupsForPrincipal,
    currentDate,
    holidays,
    learners,
    practitioner?.isPrincipal,
    publicHolidays,
    seeRegister,
    previousClassroomGroupId,
    classProgrammes,
  ]);

  const attendanceSubmitted = async (attendanceResult: AttendanceResult) => {
    // is attendance complete for whole weeek?
    if (!classroom) return;

    const classgroup = classroomGroups?.find(
      (x) => x.id === attendanceResult.classroomGroupId
    );

    setPreviousClassroomGroupId(attendanceResult.classroomGroupId);

    if (!classgroup) return;

    const missedClassAttendance: MissedAttendanceGroups[] =
      getMissedAttendanceSummaryGroups(
        practitioner?.isPrincipal === true
          ? classroomGroupsForPrincipal
          : classroomGroups || [],
        classProgrammesUpdated,
        attendance || [],
        holidays,
        currentDate,
        learners
      );

    const removeTodaysAttendance = missedClassAttendance.filter(
      (x) => getDay(x.missedDay) !== getDay(attendanceResult.attendanceDate)
    );
    const removeHolidays = removeTodaysAttendance.filter((x) => {
      return isWorkingDay(
        addDays(startOfWeek(currentDate), getDay(x.missedDay)),
        holidays
      );
    });

    if (removeHolidays.length === 0 && missedClassAttendance) {
      setAttendanceComponentType('report');
    } else {
      setAttendanceComponentType('summary');
    }
  };

  const getComponentToRender = (type?: AttendanceComponentType) => {
    switch (type) {
      case 'attendance':
        return <AttendanceList onSubmitSuccess={attendanceSubmitted} />;
      case 'report':
        return (
          <AttendanceReport
            classroom={classroom}
            currentClassroomGroup={userCurrentClassroomGroup}
            classroomGroups={classroomGroups}
          />
        );
      case 'summary':
        return (
          <AttendanceSummary
            openReports={() => setAttendanceComponentType('report')}
            currentUserId={userData?.id || ''}
          />
        );
      default:
        return null;
    }
  };

  if (!classroomGroups || classroomGroups?.length === 0) {
    return (
      <div className={'h-full flex-1 bg-white px-4 pt-4'}>
        <IconInformationIndicator
          title="You don't have any classes yet!"
          subTitle="Assign a class to capture attendance."
        />
      </div>
    );
  }

  if (children?.length === 0 || learners?.length === 0) {
    return (
      <IconInformationIndicator
        title="You don't have any children allocated to classes yet!"
        subTitle="Navigate to the 'Children' tab to add children."
      />
    );
  }

  return (
    <div>
      <AttendanceWrapper />
      {attendanceComponentType && getComponentToRender(attendanceComponentType)}
      <div className={'flex h-full w-full flex-1 flex-col px-4'}>
        {attendanceComponentType === 'attendance' && (
          <Button
            type="outlined"
            color="primary"
            className={'mt-0'}
            onClick={() => {
              setSeeRegister(!seeRegister);
            }}
          >
            {renderIcon('EyeIcon', 'h-5 w-5 text-primary')}
            <Typography
              type="h6"
              color="primary"
              text={'See attendance registers'}
              className="ml-2"
            ></Typography>
          </Button>
        )}
      </div>
    </div>
  );
};
