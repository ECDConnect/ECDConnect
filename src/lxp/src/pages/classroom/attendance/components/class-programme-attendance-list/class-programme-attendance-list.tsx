import { getAvatarColor, LearnerDto } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStackedList,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { attendanceSelectors } from '@store/attendance';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import * as styles from './class-programme-attendance-list.styles';
import { ClassProgrammeAttendanceListProps } from './class-programme-attendance-list.types';
import { classroomGroupHasAttendanceOnDate } from '@/utils/classroom/attendance/track-attendance-utils';
import { getDay, isBefore, isAfter, isSameDay } from 'date-fns';

export const ClassProgrammeAttendanceList: React.FC<
  ClassProgrammeAttendanceListProps
> = ({
  isPrimaryClass,
  classroomGroup,
  onAttendanceUpdated,
  attendanceDate,
}) => {
  const [attendanceList, setAttendanceList] = useState<
    AttendanceListDataItem[]
  >([]);

  const children = useSelector(childrenSelectors.getChildren);
  const childUsers = useSelector(childrenSelectors.getChildUsers);
  const allLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );
  const attendance = useSelector(
    attendanceSelectors.getClassroomProgrammeAttendanceFor(attendanceDate)
  );
  const classProgrammes = useSelector(
    classroomsSelectors.getClassProgrammesByClassGroupId(classroomGroup.id)
  );

  useEffect(() => {
    if (!classroomGroup) return;
    const currentDate = new Date();
    const filteredLearners = [];
    const _learners: LearnerDto[] = allLearners;

    const currentClassProgramme = classroomGroupHasAttendanceOnDate(
      classProgrammes,
      currentDate
    );

    if (!currentClassProgramme) return;

    const programmeStartDate =
      typeof currentClassProgramme?.programmeStartDate != 'undefined'
        ? new Date(currentClassProgramme?.programmeStartDate)
        : new Date();

    for (const learner of _learners) {
      if (learner.classroomGroupId !== classroomGroup.id) continue;

      const child = children?.find(
        (child) => child.userId === learner.userId && child.isActive
      );
      const childUser = childUsers?.find((y) => y.id === learner.userId);
      const attendanceDay = getDay(attendanceDate);
      const [currentClassProgram] = classProgrammes.filter(
        (x) => x.meetingDay === attendanceDay
      );

      if (!currentClassProgram) return;

      const programStartDate = new Date(programmeStartDate);
      const startedAttendanceDate = new Date(learner.startedAttendance);
      const showChildInRegister =
        (isBefore(startedAttendanceDate, attendanceDate) ||
          isSameDay(startedAttendanceDate, attendanceDate)) &&
        (isAfter(startedAttendanceDate, programStartDate) ||
          isSameDay(startedAttendanceDate, attendanceDate));

      if (
        child &&
        child?.caregiverId &&
        childUser?.firstName &&
        childUser?.surname &&
        showChildInRegister
      ) {
        filteredLearners.push(learner);
      }
    }

    getAttendanceClassrooms(filteredLearners);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroup.id]);

  const getAttendanceClassrooms = (learners?: LearnerDto[]) => {
    if (!learners || learners.length === 0) return;

    const attendanceStackList: AttendanceListDataItem[] = learners.map(
      (learner, index) => {
        const childUser = childUsers?.find((x) => x.id === learner.userId);
        const existingAttendanceRecord = attendance.find(
          (att) => att.userId === learner.userId
        );
        const profileTextString =
          childUser?.firstName[0] ?? '' + childUser?.surname[0] ?? '';

        return {
          title: `${childUser?.firstName} ${childUser?.surname}`,
          profileText: profileTextString,
          attenendeeId: childUser?.id || index.toString(),
          avatarColor: getAvatarColor(),
          status: existingAttendanceRecord
            ? existingAttendanceRecord.attended
              ? 2
              : 3
            : 1,
        };
      }
    );

    setAttendanceList(attendanceStackList);
    onAttendanceListUpdated(attendanceStackList);
  };

  const onAttendanceListUpdated = (
    updatedAttendanceList: AttendanceListDataItem[]
  ) => {
    onAttendanceUpdated({
      listItems: updatedAttendanceList,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <div className={'bg-uiBg flex flex-col items-start w-full px-4 py-1'}>
          <Typography
            type={'body'}
            weight={'bolder'}
            text={classroomGroup?.name}
            color={'black'}
          />
          <Typography
            type={'help'}
            text={
              isPrimaryClass
                ? 'Mark attendance for all children'
                : 'Only mark attendance for children who are here today'
            }
            color={'textLight'}
          />
        </div>
        <AttendanceStackedList
          className={'bg-white'}
          scroll={false}
          listItems={attendanceList || []}
          onChange={(updateList: AttendanceListDataItem[]) =>
            onAttendanceListUpdated(updateList)
          }
        />
      </div>
    </div>
  );
};

export default ClassProgrammeAttendanceList;
