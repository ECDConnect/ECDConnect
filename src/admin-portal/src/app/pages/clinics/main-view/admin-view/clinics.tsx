import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ClinicsRoutes } from '../../../../routes/app.routes';
import SubNavigationLink from '../../../../components/sub-navigation-link/sub-navigation-link';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';
import { TenantContext } from '../../../../utils/constants';
import ROUTES from '../../../../routes/app.routes-constants';

export function ClinicsAdminView() {
  const location = useLocation();

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
          name: 'Clinics',
          href: ROUTES.CLINICS.ALL_CLINICS,
        },
        {
          name: 'Districts',
          href: '/clinics/districts',
        },
        {
          name: 'Sub-districts',
          href: '/clinics/sub-districts',
        },
      ];
    }
  };

  const navigation = getNavigationItems();

  const history = useHistory();

  useEffect(() => {
    // GO TO DEFAULT ROUTE
    async function init() {
      history.push(navigation[0].href);
    }

    init()?.catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex justify-center bg-white">
        {location?.pathname?.includes(ROUTES.CLINICS.ROOT) &&
          navigation?.map((item) => (
            <div
              key={item?.href}
              className={
                data?.tenantContext.applicationName === TenantContext.GrowGreat
                  ? 'w-3/12 '
                  : 'w-full'
              }
            >
              <SubNavigationLink
                key={`${item.name}-${new Date().getTime()}`}
                item={item}
              ></SubNavigationLink>
            </div>
          ))}
      </div>

      <div className=" lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div
            className="bg-adminPortalBg relative h-full rounded-xl p-12"
            style={{ minHeight: '36rem' }}
          >
            <ClinicsRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicsAdminView;
