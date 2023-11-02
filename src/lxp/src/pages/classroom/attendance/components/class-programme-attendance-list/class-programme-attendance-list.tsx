import { getAvatarColor, LearnerDto } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStackedList,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import * as styles from './class-programme-attendance-list.styles';
import { ClassProgrammeAttendanceListProps } from './class-programme-attendance-list.types';

export const ClassProgrammeAttendanceList: React.FC<
  ClassProgrammeAttendanceListProps
> = ({
  isPrimaryClass,
  classroomGroup,
  onAttendanceUpdated,
  attendanceDate,
  isMultipleClasses,
}) => {
  const [attendanceList, setAttendanceList] = useState<
    AttendanceListDataItem[]
  >([]);

  const children = useSelector(childrenSelectors.getChildren);
  const childUsers = useSelector(childrenSelectors.getChildUsers);
  const allLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  useEffect(() => {
    if (!classroomGroup) return;
    const filteredLearners = [];
    const _allLearners = allLearners.filter(
      (x) =>
        !Boolean(x.stoppedAttendance) &&
        new Date(attendanceDate).toDateString() >=
          new Date(x.startedAttendance).toDateString()
    );

    const uniqueLearners = _allLearners.filter((object, index, array) => {
      return (
        index ===
        array.findIndex((newObject) => newObject.userId === object.userId)
      );
    });
    for (const learner of uniqueLearners) {
      if (learner.classroomGroupId !== classroomGroup.id) continue;

      const child = children?.find(
        (child) => child.userId === learner.userId && child.isActive
      );

      const childUser = childUsers?.find((y) => y.id === learner.userId);

      if (child && childUser?.firstName && childUser?.surname) {
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
        const profileTextString =
          childUser?.firstName![0] ?? '' + childUser?.surname![0] ?? '';

        return {
          title: `${childUser?.firstName} ${childUser?.surname}`,
          profileText: profileTextString.toLocaleUpperCase(),
          attenendeeId: childUser?.id || index.toString(),
          avatarColor: getAvatarColor(),
          status: 1,
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
      {isMultipleClasses && (
        <div className={'bg-uiBg mt-2 flex w-full flex-col items-start border'}>
          <Typography
            type={'body'}
            weight={'bold'}
            text={classroomGroup?.name}
            color={'black'}
            className={'mr-1 ml-4'}
          />
          <Typography
            type={'help'}
            text={
              isPrimaryClass
                ? 'Mark attendance for all children'
                : 'Only mark attendance for children who are here today'
            }
            color={'textLight'}
            className={'mr-1 ml-4'}
          />
        </div>
      )}

      <AttendanceStackedList
        className={'ml-4 w-11/12'}
        scroll={false}
        listItems={attendanceList || []}
        onChange={(updateList: AttendanceListDataItem[]) => {
          onAttendanceListUpdated(updateList);
        }}
      />
    </div>
  );
};

export default ClassProgrammeAttendanceList;
