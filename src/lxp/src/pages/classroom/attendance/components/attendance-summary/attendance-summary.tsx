import {
  AttendanceDto,
  ClassroomGroupDto,
  LocalStorageKeys,
  PractitionerDto,
  sortDateFunction,
} from '@ecdlink/core';
import { Holiday } from '@ecdlink/graphql';
import {
  ActionListDataItem,
  Alert,
  Dialog,
  DialogPosition,
  MessageModal,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { addDays, format, getTime, isSameDay, startOfWeek } from 'date-fns';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
import { AttendanceResult } from '@models/classroom/attendance/AttendanceResult';
import { MissedAttendanceGroups } from '@models/classroom/attendance/MissedAttendanceGroups';
import { attendanceSelectors } from '@store/attendance';
import { classroomsSelectors } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import { getPointsMessage } from '@utils/classroom/attendance/attendance-message-utils';
import {
  getAllMissedAttendanceGroupsByClassroomGroupId,
  getClassroomGroupSchoolDays,
  getMissedAttendanceSummaryGroups,
  isValidAttendableDate,
} from '@utils/classroom/attendance/track-attendance-utils';
import {
  getStorageItem,
  setStorageItem,
} from '@utils/common/local-storage.utils';
import EditAttendanceRegister from '../edit-attendance-register/edit-attendance-register';
import * as styles from './attendance-summary.styles';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { userSelectors } from '@store/user';
import { practitionerSelectors } from '@/store/practitioner';

export const AttendanceSummary: React.FC = () => {
  const [displaySmartStartMessage, setDisplaySmartStartMessage] =
    useState<boolean>(false);
  const [successMessageVisible, setSuccessMessageVisible] =
    useState<boolean>(true);
  const [isSmartStartUser, setIsSmartStartUser] = useState<boolean>(true);
  const [attendanceActionList, setAttendanceActionList] = useState<
    ActionListDataItem[]
  >([]);

  const userData = useSelector(userSelectors.getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner: any = practitioners?.find(
    (item) => item?.userId === userData?.id
  );
  const [attendanceEditDay, setAttendanceEditDay] = useState<Date>();
  const [missedAttendanceGroups, setMissedAttendanceGroups] = useState<
    MissedAttendanceGroups[]
  >([]);
  const [submitText, setSubmitText] = useState<string>(
    'Submit & go to next day'
  );
  const [editAttendanceRegisterVisible, setEditAttendanceRegisterVisible] =
    useState<boolean>(false);
  const [isValidAttendanceDay, setIsValidAttendanceDay] =
    useState<boolean>(false);
  const [currentEditClassroomGroupId, setCurrentEditClassroomGroupId] =
    useState<string>();
  const todayDate = new Date();
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );
  const classroomGroupsForPrincipal = classroomGroups.filter(
    (item) => item?.userId === userData?.id
  );

  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const classProgrammesForPrincipal = classProgrammes.filter((el) => {
    return classroomGroupsForPrincipal.some((f) => {
      return f.id === el.classroomGroupId;
    });
  });

  const classProgrammesUpdated =
    practitioner?.isPrincipal === true
      ? classProgrammesForPrincipal
      : classProgrammes;
  const publicHolidays = useSelector(staticDataSelectors.getHolidays);
  const attendanceData = useSelector(attendanceSelectors.getAttendance);

  useEffect(() => {
    let hasClosedPointsMessage = getStorageItem<boolean>(
      LocalStorageKeys.hasClosedAttendanceSmartStartPointsMessage
    );
    let isCurrentSmartStartUser = getStorageItem<boolean>(
      LocalStorageKeys.isSmartStartUser
    );

    if (hasClosedPointsMessage === undefined) {
      hasClosedPointsMessage = false;
    }

    if (isCurrentSmartStartUser === undefined) {
      isCurrentSmartStartUser = true;
    }

    setIsSmartStartUser(isCurrentSmartStartUser);

    if (todayDate.getDay() === 1 && !hasClosedPointsMessage) {
      setDisplaySmartStartMessage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (classProgrammes && attendanceData && publicHolidays) {
      const attendance = attendanceData as AttendanceDto[];
      const holidays = publicHolidays as Holiday[];

      const meetingDays: number[] = getClassroomGroupSchoolDays(
        classProgrammesUpdated
      );

      setIsValidAttendanceDay(
        isValidAttendableDate(todayDate, meetingDays || [], holidays)
      );
      const attendanceToDoList: MissedAttendanceGroups[] =
        getMissedAttendanceSummaryGroups(
          practitioner?.isPrincipal === true
            ? classroomGroupsForPrincipal
            : classroomGroups || [],
          classProgrammesUpdated,
          attendance,
          holidays,
          todayDate
        );

      if (attendanceToDoList) {
        setMissedAttendanceGroups(attendanceToDoList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicHolidays, attendanceData, classProgrammesUpdated]);

  useEffect(() => {
    if (
      !isValidAttendanceDay &&
      missedAttendanceGroups &&
      missedAttendanceGroups.length === 0 &&
      classProgrammesUpdated
    ) {
      const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 });
      let actionListToDisplayWrapper: {
        date: Date;
        item: ActionListDataItem;
        group: ClassroomGroupDto;
      }[] = [];
      for (const classProgramme of classProgrammesUpdated) {
        const group =
          practitioner?.isPrincipal === true
            ? classroomGroupsForPrincipal?.find(
                (x) => x.id === classProgramme.classroomGroupId
              )
            : classroomGroups?.find(
                (x) => x.id === classProgramme.classroomGroupId
              );

        if (group) {
          const dayDate = addDays(
            startOfWeekDate,
            classProgramme.meetingDay - 1
          );
          const theDate = dayDate.valueOf();
          const programmeStartDate = new Date(
            classProgramme.programmeStartDate
          ).valueOf();
          if (theDate < new Date().valueOf() && theDate > programmeStartDate) {
            actionListToDisplayWrapper.push({
              date: dayDate,
              group: group,
              item: {
                title: group.name || '',
                subTitle: format(dayDate, 'EEEE, d LLLL'),
                actionName: 'Edit',
                actionIcon: 'PencilIcon',
                switchTextStyles: true,
                onActionClick: () => {},
              },
            });
          }
        }
      }
      const actionListToDisplay = actionListToDisplayWrapper
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .map((x, idx) => ({
          ...x.item,
          onActionClick: () => {
            openEditRegister(x.group.id ?? '', x.date, true);
          },
        }));
      setAttendanceActionList(actionListToDisplay);
    } else {
      setAttendanceActionList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidAttendanceDay, missedAttendanceGroups, classProgrammesUpdated]);

  useEffect(() => {
    if (missedAttendanceGroups && missedAttendanceGroups.length > 0) {
      const actionListToDisplay: ActionListDataItem[] = [];

      const sortedMissedAttendanceGroups = missedAttendanceGroups.sort((a, b) =>
        a.missedDay > b.missedDay ? 1 : -1
      );
      sortedMissedAttendanceGroups.forEach((group, idx) => {
        actionListToDisplay.push({
          title: group.classroomGroup.name || '',
          subTitle: format(group.missedDay, 'EEEE, d LLLL'),
          actionName: 'Edit',
          actionIcon: 'PencilIcon',
          switchTextStyles: true,
          onActionClick: () => {
            openEditRegister(
              group.classroomGroup.id ?? '',
              group.missedDay,
              idx === sortedMissedAttendanceGroups.length - 1
            );
          },
        });
      });
      setAttendanceActionList(actionListToDisplay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missedAttendanceGroups]);

  const openEditRegister = (
    classroomGroupCacheId: string,
    attendanceDay: Date,
    isLast: boolean
  ) => {
    if (isValidAttendanceDay) {
      const allMissedAttendanceDays =
        getAllMissedAttendanceGroupsByClassroomGroupId(missedAttendanceGroups);

      if (allMissedAttendanceDays && allMissedAttendanceDays.length > 0) {
        allMissedAttendanceDays.sort(sortDateFunction);

        const index = allMissedAttendanceDays.findIndex(
          (day) => getTime(day) === getTime(attendanceDay)
        );

        if (index >= 0) {
          setCurrentEditClassroomGroupId(classroomGroupCacheId);
          setAttendanceEditDay(allMissedAttendanceDays[index]);
          setEditAttendanceRegisterVisible(true);
        }
      }
    } else {
      setCurrentEditClassroomGroupId(classroomGroupCacheId);
      setAttendanceEditDay(attendanceDay);
      setEditAttendanceRegisterVisible(true);
    }

    setSubmitText(isLast ? 'Submit' : 'Submit & go to next day');
  };

  const goToNextEditAttendanceRegister = (
    attendanceResult: AttendanceResult
  ) => {
    if (
      currentEditClassroomGroupId &&
      missedAttendanceGroups &&
      attendanceResult
    ) {
      const updatedMissedAttendanceItemIndex = missedAttendanceGroups.findIndex(
        (x) => {
          return isSameDay(x.missedDay, attendanceResult.attendanceDate);
        }
      );

      const updatedMissedAttendance: MissedAttendanceGroups[] = _.cloneDeep(
        missedAttendanceGroups
      );

      if (updatedMissedAttendanceItemIndex >= 0) {
        updatedMissedAttendance.splice(updatedMissedAttendanceItemIndex, 1);
      }
      setMissedAttendanceGroups(updatedMissedAttendance);

      const allMissedAttendanceDays =
        getAllMissedAttendanceGroupsByClassroomGroupId(updatedMissedAttendance);

      if (allMissedAttendanceDays && allMissedAttendanceDays.length > 0) {
        setSubmitText(
          allMissedAttendanceDays.length > 1
            ? 'Submit & go to next day'
            : 'Submit'
        );
        setAttendanceEditDay(allMissedAttendanceDays[0]);
      } else {
        setEditAttendanceRegisterVisible(false);
      }
    }
  };

  const closeMessage = () => {
    setDisplaySmartStartMessage(false);
    setStorageItem(
      true,
      LocalStorageKeys.hasClosedAttendanceSmartStartPointsMessage
    );
  };

  const closeEditAttendanceRegister = () => {
    setEditAttendanceRegisterVisible(false);
  };

  return (
    <>
      <div className={'flex flex-1 h-full flex-col px-4 pt-4 gap-4'}>
        {isValidAttendanceDay ? (
          <PointsSuccessCard
            visible={successMessageVisible}
            isSmartStartUser={isSmartStartUser}
            points={100}
            onClose={() => setSuccessMessageVisible(false)}
            message={getPointsMessage(isSmartStartUser)}
            icon={'SparklesIcon'}
          />
        ) : (
          <div>
            <Alert
              title={'Today is not a school day.'}
              message={
                'This is a great time to catch up on your attendance registers!'
              }
              type={'info'}
            />
          </div>
        )}

        {attendanceActionList.length > 0 && missedAttendanceGroups.length > 0 && (
          <div className={'flex flex-col'}>
            <div className={'flex flex-row items-center'}>
              <div className={styles.iconRound}>
                <Typography
                  type={'help'}
                  weight={'bold'}
                  text={attendanceActionList.length.toString()}
                  color={'white'}
                />
              </div>
              <Typography
                type={'body'}
                weight={'bold'}
                text={'incomplete registers this week.'}
                color={'alertMain'}
              />
            </div>
            <Typography
              className={'pt-2'}
              type={'body'}
              weight={'bold'}
              text={'Let’s get them done:'}
              color={'textMid'}
            />
          </div>
        )}

        <StackedList
          listItems={attendanceActionList}
          type={'ActionList'}
        ></StackedList>

        <MessageModal
          title={'What can you do with SmartStart points?'}
          message={'Get R5 airtime for every 500 points you earn!'}
          visible={displaySmartStartMessage}
          icon={'GiftIcon'}
          onClose={closeMessage}
        />
      </div>
      {attendanceEditDay && (
        <Dialog
          fullScreen
          visible={editAttendanceRegisterVisible}
          position={DialogPosition.Top}
        >
          <div className={styles.dialogContent}>
            <EditAttendanceRegister
              attendanceDate={attendanceEditDay}
              submitText={submitText}
              onComplete={(attendanceSuccessList: AttendanceResult) =>
                goToNextEditAttendanceRegister(attendanceSuccessList)
              }
              onBack={() => closeEditAttendanceRegister()}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};
