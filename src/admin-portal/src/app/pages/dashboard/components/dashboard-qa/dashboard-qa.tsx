import { useTenant } from '../../../../hooks/useTenant';

export default function GADashboard() {
  const tenant = useTenant();

  const generalURL = tenant.isOpenAccess
    ? 'https://dashboard.ecdconnect.co.za/d/DQVvi-rIk/oa-general?from=1704052800000&to=1733083199000&orgId=1'
    : 'https://dashboard.ecdconnect.co.za/d/jYvjqbrSk/wl-general?orgId=1&from=1704060000000&to=1735682399999';

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
