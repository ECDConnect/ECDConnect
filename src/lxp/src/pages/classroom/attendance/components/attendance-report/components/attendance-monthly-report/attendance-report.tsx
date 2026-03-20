import { BannerWrapper, Typography, Divider, Button } from '@ecdlink/ui';
import { Fragment, useEffect, useMemo } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import {
  getColor,
  getShape,
  getShapeClass,
  mergeMonthlyAttendanceReportWithSameClassroomGroupId,
} from '@utils/classroom/attendance/track-attendance-utils';
import GeneratePdfReportButton from '../../../../../../../../src/components/download-pdf-button/download-pdf-button';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import ROUTES from '@routes/routes';
import { useHistory, useLocation } from 'react-router';
import { classroomsSelectors } from '@/store/classroom';
import { childrenSelectors } from '@/store/children';
import { endOfMonth, startOfMonth, subDays, isAfter } from 'date-fns';
import {
  attendanceSelectors,
  attendanceThunkActions,
} from '@/store/attendance';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { AttendanceActions } from '@/store/attendance/attendance.actions';
import { EditRegistersRouteState } from '@/pages/classroom/attendance/edit-registers/edit-registers.types';
import { getTableData } from './table-data';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { MonthlyAttendanceReportRouteState } from './attendance-report.types';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { useMonthlyAttendanceReport } from '@/hooks/useMonthlyAttendanceReport';
import { useHolidays } from '@/hooks/useHolidays';
import { usePractitionerReportDetails } from '@/hooks/usePractitionerReportDetails';

export interface ChildAttendanceReportState {
  childId: string;
  classroomGroupId: string;
}

export const MonthlyAttendanceReport = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const today = new Date();
  const history = useHistory();

  const location = useLocation<MonthlyAttendanceReportRouteState>();
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const selectedMonth = location.state?.selectedMonth;

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const children = useSelector(childrenSelectors.getChildren);
  const holiday = useHolidays();

  const { classHeaders } = usePractitionerReportDetails();

  // for offline purposes, get the attendance data for current month
  const attendanceData = useSelector(attendanceSelectors.getAttendance);

  const { currentMonthAttendanceReport } = useMonthlyAttendanceReport(
    attendanceData ?? [],
    classroomGroups,
    children ?? [],
    holiday.holidays
  );

  const { hasPermissionToTakeAttendance } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();

  const hasPermissionToEdit =
    practitioner?.isPrincipal || hasPermissionToTakeAttendance || isTrialPeriod;

  const { isLoading } = useThunkFetchCall(
    'attendanceData',
    AttendanceActions.GET_CLASSROOM_ATTENDANCE_REPORT
  );

  const { startDate, endDate } = useMemo(() => {
    const date = new Date(
      Number(selectedMonth.year),
      Number(selectedMonth.monthOfYear) - 1,
      1
    );

    const firstDayOfMonth = new Date(startOfMonth(date).setHours(23, 59, 59));
    const lastDayOfMonth = endOfMonth(date);

    return { startDate: firstDayOfMonth, endDate: lastDayOfMonth };
  }, [selectedMonth.monthOfYear, selectedMonth.year]);

  const isCurrentMonth =
    today.getMonth() === startDate.getMonth() &&
    today.getFullYear() === startDate.getFullYear();
  const is30DaysWindow =
    isCurrentMonth || (!isCurrentMonth && isAfter(endDate, subDays(today, 31)));

  const monthlyReport = useSelector(
    attendanceSelectors.getClassroomAttendanceOverviewReportByPeriod(
      startDate,
      endDate
    )
  );

  const reportData = monthlyReport?.classroomAttendanceReport ?? [];

  const reportDataWithClassroomGroup =
    mergeMonthlyAttendanceReportWithSameClassroomGroupId(
      reportData,
      classroomGroups
    );

  const tableData =
    Number(selectedMonth.monthOfYear) === today.getUTCMonth() + 1
      ? currentMonthAttendanceReport
      : reportDataWithClassroomGroup;

  const {
    attendanceSum,
    tableBottomContent,
    tableFootStyles,
    tableHeadStyles,
    tableStyles,
    tableTopContent,
    footer,
    tableHeaders,
  } = getTableData({
    selectedMonth,
    monthlyReport,
    practitioner,
  });

  useEffect(() => {
    if (isOnline)
      appDispatch(
        attendanceThunkActions.getClassroomAttendanceReport({
          startDate: startDate,
          endDate: endDate,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: `View ${selectedMonth.month} Report `,
        })
      );
    }
  }, [appDispatch, isOnline, selectedMonth]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.ATTENDANCE,
          fromChildAttendanceReport: true,
        } as ClassDashboardRouteState)
      }
      title={`View ${selectedMonth.month} Report `}
      subTitle={''}
      className={'flex h-full flex-col p-4'}
      displayOffline={!isOnline}
    >
      <Typography
        type="h1"
        color="textDark"
        text={` ${selectedMonth.month} attendance register`}
      />

      <Typography
        type="body"
        color="textMid"
        text={`Tap a child’s name to see their attendance record.`}
      />
      <Divider className="mt-4" dividerType="dashed" />
      {tableData?.map((classroomGroupReport) => (
        <Fragment key={classroomGroupReport.classroomGroupId}>
          <Typography
            type="h2"
            color="textDark"
            text={classroomGroupReport.classroomGroup?.name ?? ''}
            className="mt-6 mb-5"
          />
          <table className="text-textDark w-full table-fixed text-left">
            <colgroup>
              <col style={{ width: '80%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="bg-uiBg border-quatenary border-b">
                <th className="py-3 pl-4">CHILD</th>
                <th>% PRESENT</th>
              </tr>
            </thead>
            <tbody>
              {classroomGroupReport.items?.map((report, idx) => {
                const reportItemColor = getColor(report?.attendancePercentage);
                const reportItemShape = getShape(report?.attendancePercentage);

                return (
                  <tr
                    className={`${
                      (idx + 1) % 2 === 0 ? 'bg-uiBg' : 'bg-white'
                    } cursor-pointer`}
                    key={`child-attendance-report-month-${idx}`}
                    onClick={() => {
                      history.push(ROUTES.CHILD_ATTENDANCE_REPORT, {
                        childUserId: report?.childUserId,
                        classroomGroupId: classroomGroupReport.classroomGroupId,
                        childId:
                          children?.find(
                            (child) => child.user?.id === report?.childUserId
                          )?.id ?? '',
                        selectedMonth,
                      } as ChildAttendanceReportState);
                    }}
                  >
                    <td className="py-3 pl-4">
                      {report?.childFullName ?? 'N/A'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={getShapeClass(
                            reportItemShape,
                            reportItemColor
                          )}
                        />
                        <Typography
                          type="body"
                          color={reportItemColor}
                          text={
                            report?.attendancePercentage != null
                              ? `${report.attendancePercentage} %`
                              : 'N/A'
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Fragment>
      ))}

      <div className={'mt-auto w-full py-4'}>
        {is30DaysWindow && !!hasPermissionToEdit && (
          <Button
            className="mb-4 w-full"
            type="outlined"
            color="quatenary"
            textColor="quatenary"
            text="Edit registers"
            icon="PencilIcon"
            onClick={() =>
              history.push(ROUTES.CLASSROOM.ATTENDANCE.EDIT_REGISTERS, {
                startDate,
                endDate,
                selectedMonth,
              } as EditRegistersRouteState)
            }
          />
        )}
        <GeneratePdfReportButton
          title="Download Register"
          outputName={`${selectedMonth.month}-attendance-report.pdf`}
          tableData={reportDataWithClassroomGroup}
          tableFooter={footer}
          content={tableTopContent}
          tableBottomContent={tableBottomContent}
          tableHeadStyles={tableHeadStyles}
          tableFootStyles={tableFootStyles}
          tableStyles={tableStyles}
          signature={practitioner?.signingSignature ?? ''}
          downloadDate={today.toDateString()}
          numberOfChildren={attendanceSum}
          tableHeaders={tableHeaders}
          logo={classroom?.classroomImageUrl}
          classHeaders={classHeaders}
        />
      </div>
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
