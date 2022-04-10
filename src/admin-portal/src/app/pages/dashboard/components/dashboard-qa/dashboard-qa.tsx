import { useQuery } from '@apollo/client';
import { settingGoogleReport } from '@ecdlink/graphql';
import { DocumentReportIcon } from '@heroicons/react/outline';
import { useHistory } from 'react-router';

export default function GADashboard() {
  const history = useHistory();
  const { data } = useQuery(settingGoogleReport, {
    fetchPolicy: 'cache-and-network',
  });

  const goToSettings = () => {
    history.push('/settings/general', {
      overrideDefaultUrl: '/settings/general',
    });
  };

  return (
    <div className="h-full">
      {data &&
      data.settings &&
      data.settings.Google &&
      data.settings.Google.DashboardGoogleReport ? (
        <div className="hidden sm:block">
          <iframe
            title="Google Analytics Dashboard"
            className="w-full dashboard-container"
            src={data.settings.Google.DashboardGoogleReport}
          ></iframe>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <DocumentReportIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No dashboard report setup</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a report in your settings area.
            </p>
            <div className="mt-6">
              <button
                onClick={goToSettings}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
