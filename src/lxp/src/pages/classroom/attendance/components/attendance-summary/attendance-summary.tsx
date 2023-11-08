import {
  AttendanceDto,
  ClassroomGroupDto,
  LocalStorageKeys,
  sortDateFunction,
} from '@ecdlink/core';
import { Holiday } from '@ecdlink/graphql';
import {
  ActionListDataItem,
  Alert,
  Dialog,
  DialogPosition,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import {
  addDays,
  format,
  getDay,
  getTime,
  isSameDay,
  startOfWeek,
} from 'date-fns';
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
import { usePrevious } from '@ecdlink/core/lib/hooks/usePrevious';
import { AttendanceSummaryState } from './attendance-summary.types';

export const AttendanceSummary: React.FC<AttendanceSummaryState> = ({
  hidePopup,
  openReports,
  currentUserId,
}) => {
  const [classroomName, setClassroomName] = useState<string>('');

  const [successMessageVisible, setSuccessMessageVisible] =
    useState<boolean>(false);

  const [missedAttendanceDays, setMissedAttendanceDays] = useState<Date[]>([]);

  const [isSmartStartUser, setIsSmartStartUser] = useState<boolean>(true);
  const [attendanceActionList, setAttendanceActionList] = useState<
    ActionListDataItem[]
  >([]);

  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
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
  const [todayDate] = useState(new Date());
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );
  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
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
  const trackedAttendance = useSelector(
    attendanceSelectors.getTrackedAttendance
  );

  const previousMissedAttendanceGroups =
    usePrevious(missedAttendanceGroups) || [];
  const previousAttendanceData = usePrevious(attendanceData);

  let isCurrentSmartStartUser = getStorageItem<boolean>(
    LocalStorageKeys.isSmartStartUser
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (!currentUserId || currentUserId !== storedUserId) {
      setSuccessMessageVisible(true);
      localStorage.setItem('currentUserId', currentUserId);
      localStorage.setItem('summarylastDate', Date());
    } else {
      const lastDate = localStorage.getItem('summarylastDate');
      const today = new Date().toDateString();
      if (lastDate !== today) {
        // Show notification on a new day
        if (trackedAttendance) {
          let date = getDay(new Date(trackedAttendance[0]?.attendanceDate));
          if (date === getDay(new Date(today))) {
            setSuccessMessageVisible(true);
            localStorage.setItem('summarylastDate', today);
          }
        }
      } else {
        setSuccessMessageVisible(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackedAttendance]);

  useEffect(() => {
    if (isCurrentSmartStartUser === undefined) {
      setStorageItem(true, LocalStorageKeys.isSmartStartUser);
    }
    setIsSmartStartUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      classProgrammes &&
      attendanceData &&
      publicHolidays &&
      previousAttendanceData !== attendanceData
    ) {
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
          todayDate,
          classroomGroupLearners
        );

      if (attendanceToDoList.length > 0) {
        setMissedAttendanceGroups(attendanceToDoList);
      }
    }
  }, [
    publicHolidays,
    attendanceData,
    previousAttendanceData,
    classProgrammesUpdated,
    classProgrammes,
    todayDate,
    practitioner?.isPrincipal,
    classroomGroupsForPrincipal,
    classroomGroups,
    classroomGroupLearners,
  ]);

  useEffect(() => {
    if (
      !!previousMissedAttendanceGroups.length &&
      previousMissedAttendanceGroups.length === missedAttendanceGroups.length
    )
      return;

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
            openEditRegister(x.group.id ?? '', x.date, true, x.item.title);
          },
        }));
      if (missedAttendanceGroups.length > 0) {
        setAttendanceActionList(actionListToDisplay);
      } else {
        openReports();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    classProgrammesUpdated,
    classroomGroups,
    classroomGroupsForPrincipal,
    isValidAttendanceDay,
    missedAttendanceGroups,
  ]);

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
            setCurrentEditClassroomGroupId(group.classroomGroup.id);
            openEditRegister(
              group.classroomGroup.id ?? '',
              group.missedDay,
              idx === sortedMissedAttendanceGroups.length - 1,
              group?.classroomGroup?.name
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
    isLast: boolean,
    classGroupName: string
  ) => {
    if (isValidAttendanceDay) {
      setClassroomName(classGroupName);
      const allMissedAttendanceDays =
        getAllMissedAttendanceGroupsByClassroomGroupId(
          missedAttendanceGroups,
          classroomGroupCacheId
        );

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
        getAllMissedAttendanceGroupsByClassroomGroupId(
          updatedMissedAttendance,
          currentEditClassroomGroupId
        );

      if (allMissedAttendanceDays.length === 0) {
        setAttendanceActionList([]);
        openReports();
      }

      if (allMissedAttendanceDays && allMissedAttendanceDays.length > 0) {
        setSubmitText(
          missedAttendanceDays.length > 1 ? 'Submit & go to next day' : 'Submit'
        );

        const dateSubmitted = new Date(attendanceResult.attendanceDate);

        if (allMissedAttendanceDays.length !== 0) {
          const filteredDates = allMissedAttendanceDays.filter(
            (date) => new Date(date).getTime() !== dateSubmitted.getTime()
          );
          setMissedAttendanceDays(filteredDates);
        } else {
          const filteredDates = allMissedAttendanceDays.filter(
            (date) => new Date(date).getTime() !== dateSubmitted.getTime()
          );
          setMissedAttendanceDays(filteredDates);
        }
      } else {
        setEditAttendanceRegisterVisible(false);
      }
    }
  };

  useEffect(() => {
    setAttendanceEditDay(missedAttendanceDays[0]);
    if (missedAttendanceDays.length === 0) {
      setAttendanceEditDay(missedAttendanceDays[-1]);
    }
  }, [missedAttendanceDays]);

  const closeEditAttendanceRegister = () => {
    setEditAttendanceRegisterVisible(false);
  };

  const closeNotification = () => {
    setSuccessMessageVisible(false);
    setStorageItem(true, LocalStorageKeys.hasClosedSuccessAttendanceSubmitted);
    const today = new Date().toDateString();
    localStorage.setItem('summarylastDate', today);
  };

  return (
    <>
      <div className={'flex h-full flex-1 flex-col gap-4 px-4 pt-4'}>
        {isValidAttendanceDay ? (
          <div></div>
        ) : (
          // EC-1909 - Suppress ticket
          // <PointsSuccessCard
          //   visible={successMessageVisible}
          //   isSmartStartUser={isSmartStartUser}
          //   points={100}
          //   onClose={() => closeNotification()}
          //   message={getPointsMessage(isSmartStartUser)}
          //   icon={''}
          // />
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

        {attendanceActionList.length > 0 &&
          missedAttendanceGroups.length > 0 && (
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
            </div>
          )}

        <StackedList
          listItems={attendanceActionList}
          type={'ActionList'}
        ></StackedList>
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
              editAttendanceRegisterVisible={editAttendanceRegisterVisible}
              classroomName={classroomName ?? ''}
              classroomgroupId={currentEditClassroomGroupId ?? ''}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};
