import { useLazyQuery, useQuery } from '@apollo/client';
import {
  ChildrenMetricReport,
  MetricReportStatItem,
  useDialog,
} from '@ecdlink/core';
import {
  childrenAttendedVsAbsentMetrics,
  childrenMetrics,
} from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import {
  DocumentReportIcon,
  ExclamationIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { CogIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import ContentLoader from '../../../../components/content-loader/content-loader';
import DateRangeModal from '../../../../components/dialog-date-range/dialog-date-range';
import DoughnutChart from '../doughnut-chart/doughnut-chart';
import HorizontalBarChart from '../horizontal-bar-chart/horizontal-bar-chart';
import StatsBar from '../stats-bar/stats-bar';
import VerticalBarChart from '../vertical-bar-chart/vertical-bar-chart';

export default function ChildrenDashboard() {
  const dialog = useDialog();

  const { data } = useQuery(childrenMetrics, {
    fetchPolicy: 'cache-and-network',
  });
  const [getChildrenAttendedVsAbsentMetrics, { data: attendedAbsentData }] =
    useLazyQuery(childrenAttendedVsAbsentMetrics, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fromDate: new Date(),
        toDate: new Date(),
      },
    });
  const [childstats, setChildstats] = useState([]);
  const [childStatusdata, setChildStatusdata] = useState<any>();
  const [childAttendacedata, setChildAttendacedata] = useState<any>();
  const [childAttendancePerMonthdata, setChildAttendancePerMonthdata] =
    useState<any>();
  const [attendedAbsentDate, setAttendedAbsentDate] = useState<string>();

  useEffect(() => {
    if (data && data.childrenMetrics) {
      const reportData: ChildrenMetricReport = data.childrenMetrics;
      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);

      getChildrenAttendedVsAbsentMetrics({
        variables: {
          fromDate: pastDate,
          toDate: today,
        },
      });

      setAttendedAbsentDate(
        `${new Date(pastDate).toDateString()} - ${new Date(
          today
        ).toDateString()}`
      );

      setupChildstats(reportData);
      setupChildStatusdata(reportData);
      setupChildAttendancePerMonthdata(reportData);
    }
  }, [data]);

  useEffect(() => {
    if (
      attendedAbsentData &&
      attendedAbsentData.childrenAttendedVsAbsentMetrics
    ) {
      const reportData: MetricReportStatItem[] =
        attendedAbsentData.childrenAttendedVsAbsentMetrics;
      setupChildAttendacedata(reportData);
    }
  }, [attendedAbsentData]);

  const setupChildstats = (reportData: ChildrenMetricReport) => {
    setChildstats([
      {
        id: 1,
        color: 'bg-errorMain',
        name: 'Unverified Documents',
        stat: reportData.unverifiedDocuments,
        icon: ExclamationIcon,
      },
      {
        id: 2,
        color: 'bg-primary',
        name: 'Total Children Progress reports',
        stat: reportData.totalChildProgressReports,
        icon: DocumentReportIcon,
      },
      {
        id: 3,
        color: 'bg-primary',
        name: 'Total Children',
        stat: reportData.totalChildren,
        icon: UsersIcon,
      },
    ]);
  };

  const setupChildStatusdata = (reportData: ChildrenMetricReport) => {
    const labels = reportData.statusData?.map((x) => x.name);
    const labelValues = reportData.statusData?.map((x) => x.value);
    setChildStatusdata({
      labels: labels,
      datasets: [
        {
          label: '',
          data: labelValues,
          backgroundColor: ['#50b848', '#ff8a1d', '#e74035', '#1d67d5'],
          borderColor: ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 1,
        },
      ],
    });
  };

  const setupChildAttendacedata = (reportData: MetricReportStatItem[]) => {
    const attendedData = reportData?.find((x) => x.name === 'Attended')?.value;
    const absentData = reportData?.find((x) => x.name === 'Absent')?.value;

    const PractProgramdata = {
      labels: [''],
      datasets: [
        {
          label: 'Attended',
          data: [attendedData],
          backgroundColor: '#50b848',
        },
        {
          label: 'Absent',
          data: [absentData],
          backgroundColor: '#e74035',
        },
      ],
    };

    setChildAttendacedata(PractProgramdata);
  };

  const setupChildAttendancePerMonthdata = (
    reportData: ChildrenMetricReport
  ) => {
    const labelMap = reportData.childAttendacePerMonthData.map((x) => x.name);
    const dataMap = reportData.childAttendacePerMonthData.map((x) => x.value);
    const childAttendancePerMonthdata = {
      labels: labelMap,
      datasets: [
        {
          label: '',
          data: dataMap,
          backgroundColor: '#d3276c',
        },
      ],
    };

    setChildAttendancePerMonthdata(childAttendancePerMonthdata);
  };

  const showAttendAbsentDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <DateRangeModal
          title="Filter Attendance (Attended vs Absent)"
          onCancel={onCancel}
          onSubmit={(body) => {
            setAttendedAbsentDate(
              `${new Date(body.startMonth).toDateString()} - ${new Date(
                body.endMonth
              ).toDateString()}`
            );

            getChildrenAttendedVsAbsentMetrics({
              variables: {
                fromDate: body.startMonth,
                toDate: body.endMonth,
              },
            });

            onSubmit();
          }}
        />
      ),
    });
  };

  if (data && data.childrenMetrics) {
    return (
      <div className="h-full">
        {childstats && (
          <StatsBar stats={childstats} gridClass={'grid-cols-3'} />
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-uiBg overflow-hidden rounded-lg px-4 pt-5 pb-12 sm:px-6 sm:pt-6">
            {childStatusdata && (
              <DoughnutChart
                data={childStatusdata}
                graphTitle={'Children Status'}
              />
            )}
          </div>
          <div className="bg-uiBg relative overflow-hidden rounded-lg px-4 pt-5 pb-12 sm:px-6 sm:pt-6">
            <CogIcon
              className="text-primary absolute right-5 h-8 w-8 cursor-pointer"
              onClick={showAttendAbsentDialog}
            />
            {childAttendacedata && (
              <HorizontalBarChart
                data={childAttendacedata}
                graphTitle={`Attendance (Attended vs Absent) - ${attendedAbsentDate}`}
              />
            )}
          </div>
        </div>
        <div className="bg-uiBg mt-4 overflow-hidden rounded-lg px-4 pt-5 pb-12 sm:px-6 sm:pt-6">
          {childAttendancePerMonthdata && (
            <VerticalBarChart
              data={childAttendancePerMonthdata}
              graphTitle={'Average Attendance per month'}
            />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full">
        <ContentLoader />
      </div>
    );
  }
}
