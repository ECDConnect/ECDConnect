import { useLazyQuery, useQuery } from '@apollo/client';
import { PractitionerMetricReport, useDialog } from '@ecdlink/core';
import {
  practitionerMetrics,
  practitionerNewSignupMetric,
} from '@ecdlink/graphql';
import { DialogPosition } from '@ecdlink/ui';
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  ExclamationIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import ContentLoader from '../../../../components/content-loader/content-loader';
import DateRangeModal from '../../../../components/dialog-date-range/dialog-date-range';
import DoughnutChart from '../doughnut-chart/doughnut-chart';
import HorizontalBarChart from '../horizontal-bar-chart/horizontal-bar-chart';
import StatsBar from '../stats-bar/stats-bar';

export default function PractitionerDashboard() {
  const dialog = useDialog();

  const { data } = useQuery(practitionerMetrics, {
    fetchPolicy: 'cache-and-network',
  });
  const [getPractitionerNewSignupMetric] = useLazyQuery(
    practitionerNewSignupMetric,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        fromDate: new Date(),
        toDate: new Date(),
      },
    }
  );

  const [practstats, setPractstats] = useState([]);
  const [practStatusdata, setPractStatusdata] = useState<any>();
  const [practProgramdata, setPractProgramdata] = useState<any>();

  useEffect(() => {
    if (data && data.practitionerMetrics) {
      const reportData: PractitionerMetricReport = data.practitionerMetrics;

      setupPractStats(reportData);
      setupPractStatusdata(reportData);
      setupPractProgramdata(reportData);
    }
  }, [data]);

  const setupPractitionerNewSignUp = (newSignUp: number, dateRange: string) => {
    const copy = Object.assign([], practstats);
    if (copy) {
      for (let i = 0; i < copy.length; i++) {
        if (copy[i].id === 4) {
          copy[i] = {
            id: 4,
            color: 'bg-primary',
            name: 'New Practitioner Signups',
            miniText: dateRange,
            stat: newSignUp,
            showDateRange: true,
            icon: UsersIcon,
          };
        }
      }

      setPractstats(copy);
    }
  };

  const setupPractStats = (reportData: PractitionerMetricReport) => {
    const tempStats = [
      {
        id: 1,
        color: 'bg-errorMain',
        name: 'Outstanding Syncs',
        miniText: '',
        stat: reportData.outstandingSyncs,
        showDateRange: false,
        icon: ExclamationIcon,
      },
      {
        id: 2,
        color: 'bg-successMain',
        name: 'Completed Profile setup',
        miniText: '',
        stat: reportData.completedProfiles,
        showDateRange: false,
        icon: BadgeCheckIcon,
      },
      {
        id: 3,
        color: 'bg-primary',
        miniText: '',
        name: 'Average No. of children per practitioner',
        stat: reportData.avgChildren,
        showDateRange: false,
        icon: AcademicCapIcon,
      },
    ];

    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const dateRange = `${format(pastDate, 'd MMM yyyy')} - ${format(
      today,
      'd MMM yyyy'
    )}`;

    getPractitionerNewSignupMetric({
      variables: {
        fromDate: pastDate,
        toDate: today,
      },
    }).then((response) => {
      if (response.data) {
        tempStats.push({
          id: 4,
          color: 'bg-primary',
          name: 'New Practitioner Signups',
          miniText: dateRange,
          showDateRange: true,
          stat: response.data.practitionerNewSignupMetric,
          icon: UsersIcon,
        });

        setPractstats(tempStats);
      }
    });
  };

  const setupPractStatusdata = (reportData: PractitionerMetricReport) => {
    const labels = reportData.statusData?.map((x) => x.name);
    const labelValues = reportData.statusData?.map((x) => x.value);
    setPractStatusdata({
      labels: labels,
      datasets: [
        {
          label: '',
          data: labelValues,
          backgroundColor: ['#50b848', '#e74035'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 1,
        },
      ],
    });
  };

  const setupPractProgramdata = (reportData: PractitionerMetricReport) => {
    const playgroupData = reportData.programTypesData?.find(
      (x) => x.name === 'Playgroup'
    )?.value;
    const preschoolData = reportData.programTypesData?.find(
      (x) => x.name === 'Preschool'
    )?.value;
    const dayMotherData = reportData.programTypesData?.find(
      (x) => x.name === 'Day Mother'
    )?.value;

    const PractProgramdata = {
      labels: ['Program Types'],
      datasets: [
        {
          label: 'Playgroup',
          data: [playgroupData],
          backgroundColor: '#d3276c',
        },
        {
          label: 'Preschool',
          data: [preschoolData],
          backgroundColor: '#4f87c0',
        },
        {
          label: 'Day Mother',
          data: [dayMotherData],
          backgroundColor: '#84609f',
        },
      ],
    };

    setPractProgramdata(PractProgramdata);
  };

  const showDialog = (statItem) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <DateRangeModal
          title={statItem.name}
          onCancel={onCancel}
          onSubmit={(body) => {
            switch (statItem.id) {
              case 4:
                {
                  getPractitionerNewSignupMetric({
                    variables: {
                      fromDate: body.startMonth,
                      toDate: body.endMonth,
                    },
                  }).then((response) => {
                    if (response.data) {
                      setupPractitionerNewSignUp(
                        response.data.practitionerNewSignupMetric,
                        `${format(body.startMonth, 'd MMM yyyy')} - ${format(
                          body.endMonth,
                          'd MMM yyyy'
                        )}`
                      );
                    }
                  });
                }
                break;
            }

            onSubmit();
          }}
        />
      ),
    });
  };

  if (data && data.practitionerMetrics) {
    return (
      <div className="h-full">
        {practstats && (
          <StatsBar
            stats={practstats}
            gridClass={'grid-cols-4'}
            showDialog={(item) => showDialog(item)}
          />
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-uiBg overflow-hidden rounded-lg px-4 pt-5 pb-12 sm:px-6 sm:pt-6">
            {practStatusdata && (
              <DoughnutChart
                data={practStatusdata}
                graphTitle={"Practitioner's Status"}
              />
            )}
          </div>
          <div className="bg-uiBg overflow-hidden rounded-lg px-4 pt-5 pb-12 sm:px-6 sm:pt-6">
            {practProgramdata && (
              <HorizontalBarChart
                data={practProgramdata}
                graphTitle={
                  'Number of practitioners with Program / Classroom types'
                }
              />
            )}
          </div>
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
