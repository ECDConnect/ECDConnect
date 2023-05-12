import { getAvatarColor, LearnerDto } from '@ecdlink/core';
import { AttendanceListDataItem, AttendanceStackedList } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { attendanceSelectors } from '@store/attendance';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import * as styles from './class-programme-attendance-list.styles';
import { ClassProgrammeAttendanceListProps } from './class-programme-attendance-list.types';
import { isBefore, isAfter, isSameDay } from 'date-fns';

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
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);

  useEffect(() => {
    if (!classroomGroup) return;
    const filteredLearners = [];
    const _allLearners = allLearners.filter(
      (x) => !Boolean(x.stoppedAttendance)
    );

    for (const learner of _allLearners) {
      if (learner.classroomGroupId !== classroomGroup.id) continue;

      const child = children?.find(
        (child) => child.userId === learner.userId && child.isActive
      );

      const childUser = childUsers?.find((y) => y.id === learner.userId);

      if (
        child &&
        child?.caregiverId &&
        childUser?.firstName &&
        childUser?.surname
      ) {
        filteredLearners.push(learner);
      }
    }

    getAttendanceClassrooms(filteredLearners);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroup]);

  const getAttendanceClassrooms = (learners?: LearnerDto[]) => {
    if (!learners || learners.length === 0) return;

    const attendanceStackList: AttendanceListDataItem[] = learners.map(
      (learner, index) => {
        const childUser = childUsers?.find((x) => x.id === learner.userId);
        const existingAttendanceRecord = attendance.find(
          (att) => att.userId === learner.userId
        );
        const profileTextString =
          childUser?.firstName![0] ?? '' + childUser?.surname![0] ?? '';

        return {
          title: `${childUser?.firstName} ${childUser?.surname}`,
          profileText: profileTextString.toLocaleUpperCase(),
          attenendeeId: childUser?.id || index.toString(),
          avatarColor: getAvatarColor(),
          status: existingAttendanceRecord
            ? existingAttendanceRecord.attended
              ? 1
              : 2
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
        <div className="flex justify-center">
          <AttendanceStackedList
            className={'w-11/12'}
            scroll={false}
            listItems={attendanceList || []}
            onChange={(updateList: AttendanceListDataItem[]) => {
              onAttendanceListUpdated(updateList);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassProgrammeAttendanceList;
