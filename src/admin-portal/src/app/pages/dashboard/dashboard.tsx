import { classNames, TabItem } from '@ecdlink/ui';
import { useState } from 'react';
import GeneralDashboard from './components/dashboard-general/dashboard-general';

// TODO: (Tenancy) This can't be hardcoded as it will be different for each tenant
export default function Dashboard() {
  const getNavigationItems = () => {
    return [
      {
        title: 'General',
        initActive: true,
        child: <GeneralDashboard />,
      },
    ];
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
