import { useQuery } from '@apollo/client';
import { settingGrafanaReport } from '@ecdlink/graphql';
import { useEffect, useState } from 'react';
import { useTenant } from '../../../../hooks/useTenant';

export default function GeneralDashboard() {
  const tenant = useTenant();
  const [generalURL, setGeneratlURL] = useState('');
  const { data } = useQuery(settingGrafanaReport, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      var url =
        data.settings.Grafana.GeneralDashboard +
        '?from=now-6M&to=now&orgId=1&var-TenantId=' +
        tenant.tenant.id;
      setGeneratlURL(url);
    }
  }, [data, tenant.tenant.id]);

  return (
    <div className="h-full">
      <div className="hidden sm:block">
        <iframe
          title="General Dashboard"
          className="dashboard-container w-full"
          src={generalURL}
          width={`100%`}
          height={`100%`}
        ></iframe>
      </div>
    </div>
  );
}
