import { ChildAttendanceOverallReportModel } from '@ecdlink/core';
import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  Divider,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
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
import { UserOptions } from 'jspdf-autotable';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import ROUTES from '@routes/routes';
import { useHistory } from 'react-router';
import { classroomsSelectors } from '@/store/classroom';
import { childrenSelectors } from '@/store/children';

export interface ChildAttendanceReportState {
  childId: string;
  classroomGroupId: string;
}

interface ReportDetailsForPractitionerData {
  classroomGroupName: string;
  name: string;
  principalName: string;
  classroomGroupId: string;
  programmeTypeName: string;
  idNumber: string;
  insertedDate: string;
  programmeDays: string;
  phone: string;
  classSiteAddress: null | string;
}

export interface MonthlyAttendanceReportProps extends ComponentBaseProps {
  reportMonth: string;
  onDownloadReport: (date: Date) => void;
  onBack: () => void;
  classroomGroupId: string;
  reportData: ChildAttendanceOverallReportModel[];
  totalAttendance: any[];
  totalAttendanceStatsReport:
    | {
        totalSessions: number;
        totalMonthlyAttendance: number;
        totalChildrenAttendedAllSessions: number;
      }
    | undefined;
}

export const MonthlyAttendanceReport = ({
  reportMonth,
  onBack,
  reportData,
  totalAttendance,
  totalAttendanceStatsReport,
}: MonthlyAttendanceReportProps) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const today = new Date().toDateString();
  const history = useHistory();
  const { errorDialog } = useRequestResponseDialog();

  const numDays = totalAttendance.length;
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const children = useSelector(childrenSelectors.getChildren);

  const [reportDetails, setReportDetails] =
    useState<ReportDetailsForPractitionerData>();

  const reportDataWithClassroomGroup = useMemo(
    () =>
      mergeMonthlyAttendanceReportWithSameClassroomGroupId(
        reportData,
        classroomGroups
      ),
    [reportData, classroomGroups]
  );

  // TODO: check if this endpoint is needed (w7)
  useEffect(() => {
    const getClassroomDetails = async () => {
      const res = await new PractitionerService(
        userAuth?.auth_token || ''
      ).getReportDetailsForPractitioner(userAuth?.id || '');
      return res;
    };

    getClassroomDetails()
      .then((data) => {
        setReportDetails(data);
      })
      .catch((err) => {
        errorDialog(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: `View ${reportMonth} Report `,
        })
      );
    }
  }, [appDispatch, isOnline, reportMonth]);

  const tableBody = reportData.map(
    (item: {
      attendance?: any;
      childFullName?: any;
      childIdNumber?: string;
    }) => {
      const { childFullName, childIdNumber } = item;
      const attendance = item.attendance.reduce(
        (obj: { [x: string]: any }, { key, value }: any, i: number) => {
          obj[`day${key}`] = value !== null ? value : '*';
          return obj;
        },
        {}
      );
      return { child: childFullName, id: childIdNumber, ...attendance };
    }
  );

  const tableHeaders = [
    { header: 'Child', dataKey: 'child' },
    { header: 'ID/Passport', dataKey: 'id' },
    ...totalAttendance.slice(0, numDays).map(({ key }) => ({
      header: `${key}`,
      dataKey: `day${key}`, // using key value as dataKey
    })),
  ];

  const finalTableData = [
    {
      tableName: '',
      type: '',
      total: '',
      headers: tableHeaders,
      data: tableBody,
    },
  ];

  const footer = [
    'Child Attendance per Day',
    '', // Placeholder for ID/Passport column
  ];

  totalAttendance.forEach((obj) => {
    footer.push(obj.value.toString());
  });

  let attendanceSum = 0;

  for (let i = 0; i < totalAttendance.length; i++) {
    attendanceSum += totalAttendance[i].value;
  }

  const tableTopContent = {
    pageTitle: `${reportMonth} Attendance Report`,
    subtitle: '',
    text_coulumn_one_row_one: `Name: ${practitioner?.user?.fullName}`,
    text_coulumn_one_row_two: `ID: ${
      reportDetails?.idNumber === null ? '' : reportDetails?.idNumber
    }`,
    text_coulumn_one_row_three: `Phone: ${
      reportDetails?.phone === null ? '' : reportDetails?.phone
    }`,
    //column2 with 3 rows of text
    text_column_two_row_one: `Programme Type: ${
      reportDetails?.programmeTypeName === null
        ? ''
        : reportDetails?.programmeTypeName
    } `,
    text_column_two_row_two: `Programme Days: ${
      reportDetails?.programmeDays === null ? '' : reportDetails?.programmeDays
    } `,
    text_column_two_row_three: `Site: ${
      reportDetails?.classSiteAddress === null
        ? ''
        : reportDetails?.classSiteAddress
    }`,
  };

  const tableBottomContent = [
    `Total monthly attendance: ${attendanceSum}`,
    `Total number of sessions: ${totalAttendanceStatsReport?.totalSessions}`,
    `Number of children who attended all sessions: ${
      attendanceSum === 0
        ? '0'
        : totalAttendanceStatsReport?.totalChildrenAttendedAllSessions
    }`,
    '* = child was not registered yet OR practitioner did not take attendance',
  ];

  const tableHeadStyles: UserOptions['headStyles'] = {
    fillColor: [211, 211, 211], // Light grey
    textColor: [0, 0, 0],
    fontSize: 10,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableStyles: UserOptions['styles'] = {
    lineWidth: 0.1,
    lineColor: 0x000000,
    fontSize: 8,
  };
  const tableFootStyles: UserOptions['footStyles'] = {
    textColor: [0, 0, 0],
    fillColor: [211, 211, 211], // Light grey
    fontSize: 8,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };

  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={onBack}
      title={`View ${reportMonth} Report `}
      subTitle={''}
      className={'flex h-full flex-col p-4'}
    >
      <Typography
        type="h1"
        color="textDark"
        text={` ${reportMonth} attendance register`}
      />

      <Typography
        type="body"
        color="textMid"
        text={`Tap a child’s name to see their attendance record.`}
      />
      <Divider className="mt-4" dividerType="dashed" />
      {reportDataWithClassroomGroup?.map((classroomGroupReport) => (
        <>
          <Typography
            type="h2"
            color="textDark"
            text={classroomGroupReport.classroomGroup?.name ?? ''}
            className="mt-6 mb-5"
          />
          <table className="text-textDark text-left">
            <tr className="bg-uiBg border-quatenary border-b">
              <th className="py-3 pl-4">CHILD</th>
              <th>% PRESENT</th>
            </tr>
            {classroomGroupReport.items?.map((report, idx) => {
              const reportItemColor = getColor(report?.attendancePercentage);
              const reportItemShape = getShape(report?.attendancePercentage);

              return (
                <tr
                  className={`${(idx + 1) % 2 === 0 ? 'bg-uiBg' : 'bg-white'}`}
                  key={`child-attendance-report-month-${idx}`}
                  onClick={() => {
                    history.push(ROUTES.CHILD_ATTENDANCE_REPORT, {
                      childUserId: report?.childUserId,
                      classroomGroupId: classroomGroupReport.classroomGroupId,
                      childId:
                        children?.find(
                          (child) => child.user?.id === report?.childUserId
                        )?.id ?? '',
                    } as ChildAttendanceReportState);
                  }}
                >
                  <td className="py-3 pl-4">{report.childFullName}</td>
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
                      text={`${report?.attendancePercentage} %`}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        </>
      ))}

      <div className={'mt-auto w-full py-4'}>
        <GeneratePdfReportButton
          title="Download Register"
          outputName={`${reportMonth}-attandance-report.pdf`}
          tableData={finalTableData}
          tableFooter={footer}
          content={tableTopContent}
          tableBottomContent={tableBottomContent}
          tableHeadStyles={tableHeadStyles}
          tableFootStyles={tableFootStyles}
          tableStyles={tableStyles}
          signature={practitioner?.signingSignature ?? ''}
          downloadDate={today}
          numberOfChildren={attendanceSum}
        />
      </div>
    </BannerWrapper>
  );
};

export default MonthlyAttendanceReport;
