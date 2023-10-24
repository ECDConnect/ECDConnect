import { AttendanceDto, ClassroomGroupDto, LearnerDto } from '@ecdlink/core';
import {
  ComponentBaseProps,
  Button,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { addDays, getDayOfYear, isSameDay, startOfWeek } from 'date-fns';
import getDay from 'date-fns/getDay';
import { useEffect, useState } from 'react';
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
import MultiRouteWrapper from '@/pages/classroom/attendance/components/attendance-wrapper/AttendanceWrapper';
import { MissedAttendanceGroups } from '@/models/classroom/attendance/MissedAttendanceGroups';

export const AttendanceComponent: React.FC<ComponentBaseProps> = () => {
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

  if (children?.length === 0 || learners?.length === 0) {
    return (
      <IconInformationIndicator
        title="You don't have any children allocated to classes yet!"
        subTitle="Navigate to the 'Children' tab to add children"
      />
    );
  }

  return (
    <div>
      <MultiRouteWrapper />
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
