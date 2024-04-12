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
          name: 'Leagues',
          href: ROUTES.CLINICS.LEAGUES.ROOT,
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

  const routesToHideSubNavigation = [
    ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
  ];

  const isToHideSubNavigation = routesToHideSubNavigation.some((route) =>
    location.pathname.includes(route)
  );

  useEffect(() => {
    // GO TO DEFAULT ROUTE
    async function init() {
      history.push(navigation[0].href);
    }

    init()?.catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {location?.pathname?.includes(ROUTES.CLINICS.ROOT) &&
        !isToHideSubNavigation && (
          <div className="flex justify-center bg-white">
            {navigation?.map((item) => (
              <div
                key={item?.href}
                className={
                  data?.tenantContext.applicationName ===
                  TenantContext.GrowGreat
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
        )}
      <div className={`${isToHideSubNavigation ? 'py-4 px-8' : 'p-8'}`}>
        <ClinicsRoutes />
      </div>
    </>
  );
}

export default ClinicsAdminView;
