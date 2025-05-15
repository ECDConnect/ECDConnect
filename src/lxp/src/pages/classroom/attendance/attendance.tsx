import { AttendanceDto } from '@ecdlink/core';
import {
  ComponentBaseProps,
  DialogPosition,
  Dialog,
  BannerWrapper,
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
} from '@utils/classroom/attendance/track-attendance-utils';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { AttendanceComponentType } from './attendance.types';
import { AttendanceReport } from './components/attendance-report/attendance-report';
import { AttendanceSummary } from './components/attendance-summary/attendance-summary';
import { isWorkingDay } from '@/utils/common/date.utils';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { MissedAttendanceGroups } from '@/models/classroom/attendance/MissedAttendanceGroups';
import { useHistory, useLocation } from 'react-router';
import AttendanceWrapper from '@/pages/classroom/attendance/components/attendance-wrapper/AttendanceWrapper';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useWindowSize } from '@reach/window-size';
import { ClassDashboardRouteState } from '../class-dashboard/class-dashboard.types';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

const headerHeight = 121;

export const AttendanceComponent: React.FC<ComponentBaseProps> = () => {
  const { height } = useWindowSize();
  const location = useLocation<ClassDashboardRouteState>();
  const history = useHistory();
  const userData = useSelector(userSelectors.getUser);
  const [seeCompletedRegisters, setSeeCompletedRegisters] =
    useState<boolean>(false);
  const [previousClassroomGroupId, setPreviousClassroomGroupId] =
    useState<string>('');
  const [userCurrentClassroomGroup, setUserCurrentClassroomGroup] =
    useState<ClassroomGroupDto>();

  const [attendanceComponentType, setAttendanceComponentType] =
    useState<AttendanceComponentType>();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const children = useSelector(childrenSelectors.getChildren);

  const classProgrammes = classroomGroups
    ?.flatMap((x) => x?.classProgrammes)
    ?.filter((x) => x?.isActive);

  const publicHolidays = useSelector(staticDataSelectors.getHolidays);
  const attendance = useSelector(attendanceSelectors.getAttendance);
  const learners = useSelector(classroomsSelectors.getClassroomGroupLearners);
  const holidays = useSelector(staticDataSelectors.getHolidays);
  const [currentDate] = useState(new Date());
  const isTrialPeriod = useIsTrialPeriod();

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

  const missedDays: MissedAttendanceGroups[] = getMissedAttendanceSummaryGroups(
    classroomGroups,
    classProgrammes,
    attendance ?? [],
    holidays,
    currentDate,
    learners
  );

  const isAllRegistersCompleted = !missedDays?.length;

  const { hasPermissionToTakeAttendance } = useUserPermissions();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance || isTrialPeriod;

  useEffect(() => {
    if (location.state?.fromChildAttendanceReport && !seeCompletedRegisters) {
      setSeeCompletedRegisters(true);
    }
  }, [seeCompletedRegisters, history, location]);

  useEffect(() => {
    if (!classroomGroups?.length) return;

    if (attendance === undefined) return;

    const currentWeekAttendance: AttendanceDto[] = attendance;

    const currentClassProgramme = classroomGroupHasAttendanceDate(
      classProgrammes,
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

    const uniqueLearners = learners?.filter((object, index, array) => {
      const child = children?.find((c) => c.userId === object.childUserId);
      return (
        child &&
        !!child.caregiverId &&
        index ===
          array.findIndex(
            (newObject) => newObject.childUserId === object.childUserId
          )
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

    const currentClassProgrammes =
      currentDayClassroomGroup?.classProgrammes.filter((x) => x.isActive) || [];
    const meetingDays = getClassroomGroupSchoolDays(currentClassProgrammes);

    const attendanceAlreadyTaken = currentWeekAttendance.some((att) => {
      return isSameDay(
        getDay(new Date(att.attendanceDate as Date)) - 1,
        getDay(currentDate)
      );
    });

    //weekend check
    if (!currentDayClassroomGroup && missedDays.length === 0) {
      return setAttendanceComponentType('report');
    }

    if (missedDays.length === 0 || !hasPermissionToEdit) {
      return setAttendanceComponentType('report');
    } else {
      return setAttendanceComponentType('summary');
    }
  }, [
    hasPermissionToEdit,
    missedDays,
    allChildrenInsertedBeforeToday,
    attendance,
    classProgrammes,
    classroomGroups,
    currentDate,
    holidays,
    learners,
    practitioner?.isPrincipal,
    publicHolidays,
    seeCompletedRegisters,
    previousClassroomGroupId,
  ]);

  const attendanceSubmitted = async (attendanceResult: AttendanceResult) => {
    // is attendance complete for whole weeek?
    if (!classroom) return;

    const classroomGroup = classroomGroups?.find(
      (x) => x.id === attendanceResult.classroomGroupId
    );

    setPreviousClassroomGroupId(attendanceResult.classroomGroupId);

    if (!classroomGroup) return;

    const missedClassAttendance: MissedAttendanceGroups[] =
      getMissedAttendanceSummaryGroups(
        classroomGroups ?? [],
        classProgrammes,
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

  const onCloseCompletedRegisters = () => {
    setSeeCompletedRegisters(false);
    history.replace({
      ...location,
      state: {
        ...location.state,
        fromChildAttendanceReport: false,
      },
    });
  };

  const getComponentToRender = (type?: AttendanceComponentType) => {
    switch (type) {
      case 'report':
        return (
          <AttendanceReport
            isAllRegistersCompleted={isAllRegistersCompleted}
            classroom={classroom}
            currentClassroomGroup={userCurrentClassroomGroup}
            classroomGroups={classroomGroups}
          />
        );
      case 'summary':
        return (
          <AttendanceSummary
            openReports={() => setAttendanceComponentType('report')}
            openCompletedRegisters={() => setSeeCompletedRegisters(true)}
            currentUserId={userData?.id || ''}
          />
        );
      default:
        return null;
    }
  };

  if (!classroomGroups?.length) {
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
    <div className={'flex flex-col'} style={{ height: height - headerHeight }}>
      <AttendanceWrapper />
      {attendanceComponentType && getComponentToRender(attendanceComponentType)}
      <Dialog
        position={DialogPosition.Full}
        visible={seeCompletedRegisters}
        backdropColour="white"
        borderRadius="normal"
        stretch
      >
        <BannerWrapper
          title="Attendance registers"
          size="small"
          onBack={onCloseCompletedRegisters}
        >
          <AttendanceReport
            isAllRegistersCompleted={isAllRegistersCompleted}
            classroom={classroom}
            currentClassroomGroup={userCurrentClassroomGroup}
            classroomGroups={classroomGroups}
            onTakeAttendance={onCloseCompletedRegisters}
          />
        </BannerWrapper>
      </Dialog>
    </div>
  );
};
