import { BannerWrapper, Button, Divider, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { EditRegistersRouteState } from './edit-registers.types';
import { useSelector } from 'react-redux';
import { format, subDays } from 'date-fns';
import { classroomsSelectors } from '@/store/classroom';
import { ChildAttendanceOverallReportModel } from '@ecdlink/core';
import { Fragment, useState } from 'react';
import { EditRegistersAttendanceList } from './attendance-list/attendance-list';
import { EditRegistersAttendanceListProps } from './attendance-list/attendance-list.types';
import { attendanceSelectors } from '@/store/attendance';
import ROUTES from '@/routes/routes';
import { MonthlyAttendanceReportRouteState } from '../components/attendance-report/components/attendance-monthly-report/attendance-report.types';

export const EditRegisters = () => {
  const [selectedRegister, setSelectedRegister] =
    useState<EditRegistersAttendanceListProps['selectedRegister']>();

  const location = useLocation<EditRegistersRouteState>();

  const startDate = location.state.startDate;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const monthlyReport = useSelector(
    attendanceSelectors.getClassroomAttendanceOverviewReportByPeriod(
      location.state.startDate,
      location.state.endDate
    )
  );

  const monthName = format(startDate ?? new Date(), 'MMM');

  const history = useHistory();

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === startDate.getMonth() &&
    today.getFullYear() === startDate.getFullYear();
  const thirtyDaysAgoDate = subDays(today, 30);
  const thirtyDaysAgoDay = thirtyDaysAgoDate.getDate();

  const daysWithAttendance = monthlyReport?.totalAttendance?.filter((day) =>
    isCurrentMonth
      ? day.value !== null
      : day.key >= thirtyDaysAgoDay && day.value > 0
  );
  const reportPerDay = daysWithAttendance?.map((day) => {
    const itemsPerDay = monthlyReport?.classroomAttendanceReport?.filter(
      (child) =>
        child?.attendance?.some(
          (item) => item.key === day.key && item.value !== null
        )
    );

    const reportsGroupedByClassroomGroupId = itemsPerDay?.reduce(
      (acc, record) => {
        const classId = record.classgroupId;
        acc[classId] = (acc[classId] || []).concat(record);
        return acc;
      },
      {} as Record<string, ChildAttendanceOverallReportModel[]>
    );

    return {
      day: day.key,
      reportsGroupedByClassroomGroupId,
    };
  });

  return (
    <BannerWrapper
      title="Edit registers"
      subTitle={`${monthName} attendance registers`}
      size="small"
      className="p-4 pt-6"
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ATTENDANCE.MONTHLY_REPORT, {
          selectedMonth: location.state.selectedMonth,
        } as MonthlyAttendanceReportRouteState)
      }
    >
      <Typography
        type="h2"
        text={`${monthName} attendance registers`}
        className="mb-8"
        color="textDark"
      />
      {reportPerDay?.map((dayReport, index) => {
        const date = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          dayReport.day
        );
        const formattedDate = format(date, 'EEEE, dd MMMM yyyy');
        const reportsGroupedByClassroomGroupId =
          dayReport.reportsGroupedByClassroomGroupId;

        if (!reportsGroupedByClassroomGroupId) return null;

        return Object.values(reportsGroupedByClassroomGroupId).map((item) => {
          const classroomGroupId = item[0].classgroupId;

          const classroomGroup = classroomGroups?.find(
            (c) => c.id === classroomGroupId
          );
          return (
            <Fragment key={dayReport.day + index}>
              <div className="flex items-center justify-between">
                <div>
                  <Typography
                    type="h3"
                    color="textDark"
                    text={`${classroomGroup?.name}`}
                  />
                  <Typography color="textMid" type="h4" text={formattedDate} />
                </div>
                <Button
                  iconPosition="end"
                  icon="PencilIcon"
                  type="filled"
                  text="Edit"
                  color="secondaryAccent2"
                  textColor="secondary"
                  onClick={() => setSelectedRegister({ date, register: item })}
                />
              </div>
              <Divider dividerType="dashed" className="py-4" />
            </Fragment>
          );
        });
      })}
      {selectedRegister && (
        <EditRegistersAttendanceList
          onBack={() => setSelectedRegister(undefined)}
          selectedRegister={selectedRegister}
        />
      )}
    </BannerWrapper>
  );
};
