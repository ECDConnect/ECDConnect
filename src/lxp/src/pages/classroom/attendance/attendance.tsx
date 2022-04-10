import { AttendanceDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';
import { endOfWeek, isSameDay } from 'date-fns';
import getDay from 'date-fns/getDay';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AttendanceResult } from '../../../models/classroom/attendance/AttendanceResult';
import { attendanceSelectors } from '@store/attendance';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import {
  classroomGroupHasAttendanceOnDate,
  getClassroomGroupSchoolDays,
  getMissedClassAttendance,
  isValidAttendableDate,
} from '../../../utils/classroom/attendance/track-attendance-utils';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { AttendanceComponentType } from './attendance.types';
import AttendanceList from './components/attendance-list/attendance-list';
import { AttendanceReport } from './components/attendance-report/attendance-report';
import { AttendanceSummary } from './components/attendance-summary/attendance-summary';

export const AttendanceComponent: React.FC<ComponentBaseProps> = () => {
  const [attendanceComponentType, setAttendanceComponentType] = useState<AttendanceComponentType>();

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const children = useSelector(childrenSelectors.getChildren);
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const publicHolidays = useSelector(staticDataSelectors.getHolidays);
  const attendance = useSelector(attendanceSelectors.getAttendance);

  useEffect(() => {
    if (!classroomGroups || classroomGroups?.length === 0) return;

    if (attendance === undefined) return;

    const currentWeekAttendance: AttendanceDto[] = attendance;
    const currentDate = new Date();

    const currentClassProgramme = classroomGroupHasAttendanceOnDate(classProgrammes, currentDate);

    const currentDayClassroomGroup = classroomGroups.find(
      (x) => x.id === currentClassProgramme?.classroomGroupId
    );

    if (!currentDayClassroomGroup) {
      setAttendanceComponentType('summary');
      return;
    }

    const currentClassProgrammes = classProgrammes.filter(
      (x) => x.classroomGroupId === currentDayClassroomGroup.id
    );
    const meetingDays = getClassroomGroupSchoolDays(currentClassProgrammes);

    const attendanceAlreadyTaken = currentWeekAttendance.some((att) => {
      return isSameDay(new Date(att.attendanceDate as Date), currentDate);
    });

    const isValidDayForAttendance = isValidAttendableDate(
      currentDate,
      meetingDays || [],
      publicHolidays || []
    );

    if (!attendanceAlreadyTaken && isValidDayForAttendance) {
      setAttendanceComponentType('attendance');
    } else {
      setAttendanceComponentType('summary');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups, attendance]);

  const attendanceSubmitted = async (attendanceResult: AttendanceResult) => {
    // is attendance complete for whole weeek?
    if (!classroom) return;

    const classgroup = classroomGroups?.find((x) => x.id === attendanceResult.classroomGroupId);

    if (!classgroup) return;

    const missedClassAttendance = getMissedClassAttendance(
      [classgroup],
      classProgrammes.filter((x) => x.classroomGroupId === classgroup.id),
      attendance || [],
      endOfWeek(new Date())
    );
    const removeTodaysAttendance = missedClassAttendance.filter(
      (x) => x.meetingDay !== getDay(attendanceResult.attendanceDate)
    );

    if (removeTodaysAttendance.length === 0) {
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
        return <AttendanceReport classroom={classroom} />;
      case 'summary':
        return <AttendanceSummary />;
      default:
        return null;
    }
  };

  if (children?.length === 0) {
    return (
      <IconInformationIndicator
        title="You don't have any children yet!"
        subTitle="Navigate to the 'Children' tab to add children"
      />
    );
  }

  return (
    <div>{attendanceComponentType ? getComponentToRender(attendanceComponentType) : null}</div>
  );
};
