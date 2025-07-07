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
      // var url =
      //   data.settings.Grafana.GeneralDashboard +
      //   '&from=now-6M&to=now&orgId=1&kiosk&var-TenantId=' +
      //   tenant.tenant.id;

      // True North https://dashboard.ecdconnect.co.za/d/kMj9EdANk/tn-connect?orgId=1&from=1728308374810&to=1744033174810
      // Khululeka https://dashboard.ecdconnect.co.za/d/5-J1edANz/khuluconnect-dashboard?orgId=1&from=1728308270035&to=1744033070035
      // Ntataise https://dashboard.ecdconnect.co.za/d/yp6I3OAHz/ntataise-dashboard?orgId=1&from=1728308322310&to=1744033122310
      // ECD Connect (OA) https://dashboard.ecdconnect.co.za/d/VtBXEOANk/ecd-connect-oa?orgId=1&from=1728308390696&to=1744033190696
      const url = 'https://dashboard.ecdconnect.co.za/login';

      setGeneratlURL(url);
    }
  }, [data, tenant.tenant.id]);

  const goToDashboard = () => {
    window.open(generalURL, '_blank').focus();
  };

  return (
    <div className="mt-20 h-full">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mt-1 text-sm text-gray-500">
            As an interim solution, the dashboard link can be found by clicking
            the button below
          </p>
          <div className="mt-6">
            <button
              onClick={goToDashboard}
              type="button"
              className="focus:outline-none inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              See dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// return (
//   <div className="h-full">
//     <div className="hidden sm:block">
//       <iframe
//         title="General Dashboard"
//         className="dashboard-container w-full"
//         src={generalURL}
//         width={`100%`}
//         height={`100%`}
//       ></iframe>
//     </div>
//   </div>
// );
