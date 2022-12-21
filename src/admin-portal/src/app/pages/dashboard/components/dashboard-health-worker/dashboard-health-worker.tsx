import { useQuery } from '@apollo/client';
import { PractitionerMetricReport } from '@ecdlink/core';
import { practitionerMetrics } from '@ecdlink/graphql';
import { BadgeCheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import ContentLoader from '../../../../components/content-loader/content-loader';
import StatsBar from '../stats-bar/stats-bar';

export default function HealthWorkerDashboard() {
  const { data } = useQuery(practitionerMetrics, {
    fetchPolicy: 'cache-and-network',
  });

  const [practstats, setPractstats] = useState([]);

  useEffect(() => {
    if (data && data.practitionerMetrics) {
      const reportData: PractitionerMetricReport = data.practitionerMetrics;
      setupPractStats(reportData);
    }
  }, [data]);

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
    ];

    setPractstats(tempStats);
  };

  if (data && data.practitionerMetrics) {
    return (
      <div className="h-full">
        {practstats && (
          <StatsBar stats={practstats} gridClass={'grid-cols-4'} />
        )}
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
