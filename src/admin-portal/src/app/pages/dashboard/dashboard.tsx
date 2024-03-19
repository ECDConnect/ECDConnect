import { classNames, TabItem } from '@ecdlink/ui';
import { useState } from 'react';
import GADashboard from './components/dashboard-qa/dashboard-qa';
import PractitionerDashboard from './components/dashboard-practitioner/dashboard-practitioner';
import ChildrenDashboard from './components/dashboard-children/dashboard-children';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';
import MotherDashboard from './components/dashboard-mother/dashboard-mother';
import HealthWorkerDashboard from './components/dashboard-health-worker/dashboard-health-worker';
import { TenantContext } from '../../utils/constants';

// TODO: (Tenancy) This can't be hardcoded as it will be different for each tenant
export default function Dashboard() {
  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const getNavigationItems = () => {
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === TenantContext.GrowGreat
    ) {
      return [
        {
          title: 'Analytics',
          initActive: true,
          child: <GADashboard />,
        },
        {
          title: 'Health Workers',
          initActive: false,
          child: <HealthWorkerDashboard />,
        },
        {
          title: 'Mothers',
          initActive: false,
          child: <MotherDashboard />,
        },
      ];
    } else {
      return [
        {
          title: 'Analytics',
          initActive: true,
          child: <GADashboard />,
        },
        {
          title: 'Practitioners',
          initActive: false,
          child: <PractitionerDashboard />,
        },
        {
          title: 'Children',
          initActive: false,
          child: <ChildrenDashboard />,
        },
      ];
    }
  };

  const tabItems = getNavigationItems();

  const [currentTab, setCurrentTab] = useState<TabItem>(tabItems[0]);

  return (
    <div className="dashboard-container h-full max-h-full w-full overflow-auto rounded-lg border-b border-gray-200 bg-white px-4 py-5 shadow sm:px-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabItems.map((tab) => (
            <div
              key={tab.title}
              onClick={() => setCurrentTab(tab)}
              className={classNames(
                currentTab?.title === tab.title
                  ? 'border-primary text-primary'
                  : 'cursor-pointer border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
              aria-current={
                currentTab?.title === tab.title ? 'page' : undefined
              }
            >
              {tab.title}
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-4">{currentTab && currentTab.child}</div>
    </div>
  );
}
