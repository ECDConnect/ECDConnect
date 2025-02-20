import {
  AttendanceDto,
  LocalStorageKeys,
  sortDateFunction,
  useSnackbar,
} from '@ecdlink/core';
import { Holiday } from '@ecdlink/graphql';
import {
  ActionListDataItem,
  Alert,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import {
  addDays,
  closestTo,
  format,
  getDay,
  getTime,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PointsSuccessCard from '../../../../../components/points-success-card/points-success-card';
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
import { practitionerSelectors } from '@/store/practitioner';
import { usePrevious } from '@ecdlink/core/lib/hooks/usePrevious';
import { AttendanceSummaryState } from './attendance-summary.types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useHistory, useLocation } from 'react-router';
import { ClassDashboardRouteState } from '@/pages/classroom/class-dashboard/class-dashboard.types';

export const AttendanceSummary: React.FC<AttendanceSummaryState> = ({
  hidePopup,
  openReports,
  currentUserId,
  openCompletedRegisters,
}) => {
  const [registersToShow, setRegistersToShow] = useState(5);

  const [classroomName, setClassroomName] = useState<string>('');
  const [successMessageVisible, setSuccessMessageVisible] =
    useState<boolean>(false);

  const [isSmartStartUser, setIsSmartStartUser] = useState<boolean>(true);
  const [attendanceActionList, setAttendanceActionList] = useState<
    ActionListDataItem[]
  >([]);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [attendanceEditDay, setAttendanceEditDay] = useState<Date>();
  const [missedAttendanceGroups, setMissedAttendanceGroups] = useState<
    MissedAttendanceGroups[]
  >([]);
  const [editAttendanceRegisterVisible, setEditAttendanceRegisterVisible] =
    useState<boolean>(false);
  const [isValidAttendanceDay, setIsValidAttendanceDay] =
    useState<boolean>(true);
  const [currentEditClassroomGroupId, setCurrentEditClassroomGroupId] =
    useState<string>();
  const [todayDate] = useState(new Date());

  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const [isLoading, setIsLoading] = useState(true);

  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  const classProgrammes = classroomGroups
    ?.flatMap((x) => x?.classProgrammes)
    ?.filter((x) => x?.isActive);

  const publicHolidays = useSelector(staticDataSelectors.getHolidays);
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const trackedAttendance = useSelector(
    attendanceSelectors.getTrackedAttendance
  );

  const previousMissedAttendanceGroups =
    usePrevious(missedAttendanceGroups) || [];
  const previousAttendanceData = usePrevious(attendanceData);

  const location = useLocation<ClassDashboardRouteState>();
  const history = useHistory();

  const { showMessage } = useSnackbar();

  let isCurrentSmartStartUser = getStorageItem<boolean>(
    LocalStorageKeys.isSmartStartUser
  );

  const onSeeMoreRegisters = () => {
    setRegistersToShow(registersToShow + 5);
  };

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

      const meetingDays: number[] =
        getClassroomGroupSchoolDays(classProgrammes);

      setIsValidAttendanceDay(
        isValidAttendableDate(todayDate, meetingDays || [], holidays)
      );
      const attendanceToDoList: MissedAttendanceGroups[] =
        getMissedAttendanceSummaryGroups(
          classroomGroups,
          classProgrammes,
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
    attendanceData,
    classProgrammes,
    classroomGroupLearners,
    classroomGroups,
    previousAttendanceData,
    publicHolidays,
    todayDate,
  ]);

  useEffect(() => {
    setIsLoading(false);
    if (
      !!previousMissedAttendanceGroups.length &&
      previousMissedAttendanceGroups.length === missedAttendanceGroups.length
    )
      return;

    if (
      !isValidAttendanceDay &&
      missedAttendanceGroups &&
      missedAttendanceGroups.length === 0 &&
      classProgrammes
    ) {
      const startOfWeekDate = startOfWeek(todayDate, { weekStartsOn: 1 });
      let actionListToDisplayWrapper: {
        date: Date;
        item: ActionListDataItem;
        group: ClassroomGroupDto;
      }[] = [];
      for (const classProgramme of classProgrammes) {
        const classroomGroup = classroomGroups?.find(
          (x) => x.id === classProgramme.classroomGroupId
        );

        if (classroomGroup) {
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
              group: classroomGroup,
              item: {
                title: classroomGroup.name || '',
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
            openEditRegister(x.group.id ?? '', x.date, x.item.title);
          },
        }));
      if (missedAttendanceGroups.length > 0) {
        setAttendanceActionList(actionListToDisplay.reverse());
      } else {
        openReports();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups, missedAttendanceGroups]);

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
              group?.classroomGroup?.name
            );
          },
        });
      });
      setAttendanceActionList(actionListToDisplay.reverse());

      if (location.state?.classroomGroupIdFromClassTab) {
        const missedAttendanceGroup = sortedMissedAttendanceGroups.filter(
          (attendanceGroup) =>
            attendanceGroup?.classroomGroup?.id ===
            location.state?.classroomGroupIdFromClassTab
        );

        if (missedAttendanceGroup?.length) {
          const closestDate = closestTo(
            new Date(),
            missedAttendanceGroup.map((group) => group.missedDay)
          );
          const closestDay = missedAttendanceGroup.find((item) =>
            isSameDay(item.missedDay, closestDate!)
          )!;

          openEditRegister(
            closestDay.classroomGroup.id ?? '',
            closestDay.missedDay,
            closestDay?.classroomGroup?.name
          );
        } else {
          showMessage({
            message:
              'The selected class has all attendance registers up to date.',
            type: 'info',
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missedAttendanceGroups]);

  const openEditRegister = (
    classroomGroupCacheId: string,
    attendanceDay: Date,
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
  };

  const closeEditAttendanceRegister = () => {
    setEditAttendanceRegisterVisible(false);
    history.replace(location.pathname, {
      ...location.state,
      classroomGroupIdFromClassTab: undefined,
    });
  };

  const closeNotification = () => {
    setSuccessMessageVisible(false);
    setStorageItem(true, LocalStorageKeys.hasClosedSuccessAttendanceSubmitted);
    const today = new Date().toDateString();
    localStorage.setItem('summarylastDate', today);
  };

  return (
    <div className="flex h-full flex-col px-4 pt-4">
      {isLoading ? (
        <LoadingSpinner
          className="mt-6"
          size="medium"
          spinnerColor="quatenary"
          backgroundColor="uiBg"
        />
      ) : (
        <>
          {!isValidAttendanceDay ? (
            <div>
              <PointsSuccessCard
                visible={successMessageVisible}
                isSmartStartUser={isSmartStartUser}
                points={100}
                onClose={() => closeNotification()}
                message={getPointsMessage(isSmartStartUser)}
                icon=""
              />
              <div>
                <Alert
                  title="Today is not a school day."
                  message="This is a great time to catch up on your attendance registers!"
                  type="info"
                />
              </div>
            </div>
          ) : (
            <>
              {attendanceActionList.length > 0 &&
                missedAttendanceGroups.length > 0 && (
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
                      text={'incomplete registers:'}
                      color={'textDark'}
                    />
                  </div>
                )}
              {attendanceActionList
                .slice(0, registersToShow)
                .map((register, index) => (
                  <Fragment key={index}>
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <Typography
                          type={'h3'}
                          weight={'bold'}
                          text={register.title}
                          color={'textDark'}
                        />
                        <Typography
                          type={'h4'}
                          text={register.subTitle}
                          color={'textMid'}
                        />
                      </div>
                      <Button
                        className="h-9"
                        size="small"
                        type="filled"
                        color="secondaryAccent2"
                        textColor="secondary"
                        text="Edit"
                        icon="PencilIcon"
                        iconPosition="end"
                        onClick={register.onActionClick}
                      />
                    </div>
                    <Divider dividerType="dashed" />
                  </Fragment>
                ))}
              {registersToShow < attendanceActionList.length && (
                <Button
                  type="outlined"
                  color="quatenary"
                  className="mt-4"
                  onClick={onSeeMoreRegisters}
                  icon="EyeIcon"
                  text="See more registers"
                  textColor="quatenary"
                />
              )}
              {attendanceActionList.length > 0 && (
                <div className="mt-auto w-full py-4">
                  <Button
                    className="w-full"
                    type="filled"
                    color="quatenary"
                    onClick={openCompletedRegisters}
                    icon="EyeIcon"
                    text="See completed registers"
                    textColor="white"
                  />
                </div>
              )}

              {attendanceEditDay && (
                <Dialog
                  fullScreen
                  visible={editAttendanceRegisterVisible}
                  position={DialogPosition.Top}
                >
                  <EditAttendanceRegister
                    attendanceDate={attendanceEditDay}
                    onBack={() => closeEditAttendanceRegister()}
                    editAttendanceRegisterVisible={
                      editAttendanceRegisterVisible
                    }
                    classroomName={classroomName ?? ''}
                    classroomGroupId={currentEditClassroomGroupId ?? ''}
                  />
                </Dialog>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
