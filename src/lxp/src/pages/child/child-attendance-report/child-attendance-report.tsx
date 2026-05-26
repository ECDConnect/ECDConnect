import {
  ChildGroupingAttendanceReportModel,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getYear } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  badScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import { useAppDispatch } from '@store';
import { attendanceSelectors, attendanceThunkActions } from '@store/attendance';
import { childrenSelectors } from '@store/children';
import { analyticsActions } from '@store/analytics';
import {
  getColor,
  getShape,
  getShapeClass,
} from '@utils/classroom/attendance/track-attendance-utils';
import { ChildAttendanceReportState } from './child-attendance-report.types';
import { classroomsSelectors } from '@/store/classroom';
import ROUTES from '@/routes/routes';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { userSelectors } from '@store/user';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { MonthlyAttendanceReportRouteState } from '@/pages/classroom/attendance/components/attendance-report/components/attendance-monthly-report/attendance-report.types';

export const ChildAttendanceReportPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();

  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ChildAttendanceReportState>();
  const { childId, classroomGroupId, childUserId } = state;
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const learner = useSelector(
    classroomsSelectors.getChildLearnerByClassroomGroup(
      classroomGroupId,
      child?.userId || childUserId
    )
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Child Attendance Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const currentYear = getYear(new Date());
  const childAttendanceReportData = useSelector(
    attendanceSelectors.getClassAttendanceForId(child?.userId || childUserId)
  );

  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [classroomGroup, setClassroomGroup] =
    useState<ChildGroupingAttendanceReportModel>();

  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const getAttendanceText = (score: number): string => {
    if (score >= goodScoreThreshold) {
      return `${child?.user?.firstName}'s attendance is good!`;
    }

    if (score <= badScoreThreshold) {
      return `${child?.user?.firstName}'s attendance has not been good!`;
    }

    return '';
  };

  useEffect(() => {
    // Only run if we don't already have meaningful data
    if (childAttendanceReportData?.classGroupAttendance?.length > 0) {
      setIsLoading(false);
      return;
    }

    const userId = child?.userId ?? childUserId ?? child?.user?.id ?? '';

    if (!userId || !classroomGroupId) {
      console.warn('Missing userId or classroomGroupId → skipping fetch');
      setIsLoading(false);
      return;
    }

    const start = new Date(learner?.startedAttendance || Date.now());
    const end = new Date();

    setIsLoading(true);

    appDispatch(
      attendanceThunkActions.getChildAttendanceRecords({
        userId,
        classgroupId: classroomGroupId,
        startDate: start,
        endDate: end,
      })
    )
      .unwrap()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [
    childAttendanceReportData?.classGroupAttendance?.length,
    child?.userId,
    childUserId,
    child?.user?.id,
    classroomGroupId,
    learner?.startedAttendance,
    appDispatch,
  ]);

  useEffect(() => {
    if (!childAttendanceReportData) return;

    // Safe access with optional chaining + fallback
    setAttendancePercentage(
      childAttendanceReportData.attendancePercentage ?? null
    );

    const group =
      childAttendanceReportData.classGroupAttendance?.find(
        (x) => x?.classroomGroupId === classroomGroupId
      ) ?? undefined;

    setClassroomGroup(group);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childAttendanceReportData, classroomGroupId]);

  const attendancePerMonthArray =
    childAttendanceReportData?.classGroupAttendance?.map((item) => ({
      monthlyAttendance: item?.monthlyAttendance,
      classroomGroup: item?.classroomGroupName,
    })) ?? [];

  const attendanceArrayPerMonthSortedAndFiltered = attendancePerMonthArray
    .flatMap((group) =>
      group.monthlyAttendance.map((attendance) => ({
        ...attendance,
        classroomGroup: group.classroomGroup,
      }))
    )
    .sort((a, b) => {
      if (b.monthNumber !== a.monthNumber) {
        return b.monthNumber - a.monthNumber;
      }
      return a.classroomGroup.localeCompare(b.classroomGroup);
    })
    .filter((item) => item.expectedAttendance > 0);

  const contactCaregiver = () => {
    history.push('/child-caregivers', { childId });
  };

  const goBack = () => {
    state?.selectedMonth
      ? history.push(ROUTES.CLASSROOM.ATTENDANCE.MONTHLY_REPORT, {
          selectedMonth: state?.selectedMonth,
        } as MonthlyAttendanceReportRouteState)
      : childId
      ? history.push(ROUTES.CHILD_PROFILE, { childId })
      : history.goBack();
  };

  if (!isOnline && attendanceArrayPerMonthSortedAndFiltered.length === 0) {
    return (
      <Dialog visible={!isOnline} position={DialogPosition.Middle}>
        <OnlineOnlyModal
          overrideText={'You need to go online to use this feature.'}
          onSubmit={() => {
            goBack();
            // childUserId
            //   ? history.push(ROUTES.CLASSROOM.ROOT, {
            //       activeTabIndex: TabsItems.ATTENDANCE,
            //     })
            //   : childId
            //   ? history.push(ROUTES.CHILD_PROFILE, { childId })
            //   : history.goBack();
          }}
        ></OnlineOnlyModal>
      </Dialog>
    );
  }

  return (
    <BannerWrapper
      isLoading={isLoading}
      className="h-full overflow-y-auto"
      onBack={() => {
        if (isCoach) {
          history.goBack();
        } else {
          goBack();
        }
      }}
      size={'small'}
      title={`${child?.user?.firstName}'s attendance`}
      displayOffline={!isOnline}
    >
      <div className={'flex h-full w-full flex-col p-4'}>
        <Typography
          type="h1"
          color={'primary'}
          text={`Attendance ${currentYear}`}
        />

        {childAttendanceReportData?.totalExpectedAttendance !== 0 && (
          <>
            <div className={'flex w-full flex-row pt-4'}>
              <StatusChip
                backgroundColour={getColor(attendancePercentage)}
                text={`${
                  childAttendanceReportData?.totalActualAttendance ?? 0
                }/${childAttendanceReportData?.totalExpectedAttendance ?? 0}`}
                textColour={'white'}
                borderColour={getColor(attendancePercentage)}
              />
              <Typography
                className={'ml-2'}
                type="body"
                color={getColor(attendancePercentage)}
                text={`days attended so far this year.`}
              />
            </div>
            <Typography
              className={'mt-2 mb-4'}
              type="body"
              color={'textMid'}
              text={getAttendanceText(attendancePercentage)}
            />
          </>
        )}
        <table className="text-textDark text-left">
          <thead>
            <tr className="bg-uiBg border-quatenary border-b">
              <th className="w-1/2 py-3 pl-4">CLASS</th>
              <th className="py-3 pl-4">MONTH</th>
              <th>DAYS PRESENT</th>
            </tr>
          </thead>
          <tbody>
            {attendanceArrayPerMonthSortedAndFiltered?.map((report, idx) => {
              const reportItemColor = getColor(report.attendancePercentage);
              const reportItemShape = getShape(report.attendancePercentage);
              if (!report?.expectedAttendance) return null;

              return (
                <tr
                  key={`group-${report.classroomGroup}-month-${report.monthNumber}`}
                  className={`${idx % 2 === 0 ? 'bg-uiBg' : 'bg-white'}`}
                >
                  <td className="py-3 pl-4">{report.classroomGroup} </td>
                  <td className="py-3 pl-4">{report.month} </td>
                  <td className="flex items-center gap-2 py-3">
                    <div
                      className={getShapeClass(
                        reportItemShape,
                        reportItemColor
                      )}
                    />
                    <Typography
                      type="body"
                      color={reportItemColor}
                      text={`${report.actualAttendance} out of ${report.expectedAttendance}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button
          color="quatenary"
          type="filled"
          onClick={contactCaregiver}
          className="mt-auto w-full"
          icon="ChatAlt2Icon"
          text="Contact caregiver"
          textColor="white"
        />
      </div>
    </BannerWrapper>
  );
};
