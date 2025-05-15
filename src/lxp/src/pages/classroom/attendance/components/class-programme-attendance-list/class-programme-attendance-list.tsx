import { getAvatarColor } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStackedList,
  AttendanceStatus,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import * as styles from './class-programme-attendance-list.styles';
import { ClassProgrammeAttendanceListProps } from './class-programme-attendance-list.types';
import { LearnerDto } from '@/models/classroom/classroom-group.dto';

export const ClassProgrammeAttendanceList: React.FC<
  ClassProgrammeAttendanceListProps
> = ({
  isPrimaryClass,
  classroomGroup,
  onAttendanceUpdated,
  attendanceDate,
  isMultipleClasses,
  initialAttendanceList,
}) => {
  const [attendanceList, setAttendanceList] = useState<
    AttendanceListDataItem[]
  >([]);

  const children = useSelector(childrenSelectors.getChildren);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!classroomGroup) return;

    const filteredLearners = [];
    const classroomGroupLearners = classroomGroup.learners.filter((x) => {
      const startedAttendance = new Date(x.startedAttendance);
      startedAttendance.setHours(0, 0, 0, 0);
      const child = children?.find((c) => c.userId === x.childUserId);

      return (
        x.isActive &&
        !x.stoppedAttendance &&
        attendanceDate.getTime() >= new Date(startedAttendance).getTime()
      );
    });

    // Probably not required
    const uniqueLearners = classroomGroupLearners.filter(
      (object, index, array) => {
        return (
          index ===
          array.findIndex(
            (newObject) => newObject.childUserId === object.childUserId
          )
        );
      }
    );

    for (const learner of uniqueLearners) {
      const child = children?.find(
        (child) => child.userId === learner.childUserId && child.isActive
      );

      if (
        child &&
        !!child.user &&
        !!child.user.firstName &&
        !!child.user.surname &&
        !!child.caregiverId
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
        const child = children?.find(
          (x) =>
            x.userId === learner.childUserId ||
            x?.user?.id === learner.childUserId
        );
        const initialStatus = initialAttendanceList?.find(
          (x) => x.childUserId === learner.childUserId
        )?.status;

        const profileTextString =
          child?.user?.firstName![0] ?? '' + child?.user?.surname![0] ?? '';

        return {
          title: `${child?.user?.firstName} ${child?.user?.surname}`,
          profileText: profileTextString.toLocaleUpperCase(),
          attenendeeId: child?.user?.id || index.toString(),
          avatarColor: getAvatarColor(),
          status: initialStatus
            ? initialStatus
            : isPrimaryClass
            ? AttendanceStatus.Present
            : AttendanceStatus.None,
          disabledAbsentStatus: !isPrimaryClass,
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
        <div className={'mt-2 mb-2 flex w-full flex-col '}>
          <Typography
            type={'body'}
            weight={'bold'}
            text={classroomGroup?.name}
            color={'black'}
          />
          <Typography
            type={'h4'}
            text={
              isPrimaryClass || attendanceDate.getTime() !== todayDate.getTime()
                ? 'Mark attendance for all children'
                : 'Only mark attendance for children who are here today'
            }
            color={'textMid'}
          />
        </div>
      )}
      <AttendanceStackedList
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
