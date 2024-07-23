import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ClinicsRoutes } from '../../../../routes/app.routes';
import SubNavigationLink from '../../../../components/sub-navigation-link/sub-navigation-link';
import ROUTES from '../../../../routes/app.routes-constants';
import { useTenant } from '../../../../hooks/useTenant';

export function ClinicsAdminView() {
  const location = useLocation();
  const tenant = useTenant();

  const getNavigationItems = () => {
    if (tenant.isCHWConnect) {
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
          href: ROUTES.CLINICS.DISTRICTS,
        },
        {
          name: 'Sub-districts',
          href: ROUTES.CLINICS.SUB_DISTRICTS,
        },
      ];
    }
  };

  const navigation = getNavigationItems();

  const history = useHistory();

  const routesToHideSubNavigation = [
    ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
    ROUTES.CLINICS.LEAGUES.LEAGUE_MANAGEMENT.ROOT,
    ROUTES.CLINICS.VIEW_CLINICS,
  ];

  const isToHideSubNavigation = routesToHideSubNavigation.some((route) =>
    location.pathname.includes(route)
  );

  useEffect(() => {
    // GO TO DEFAULT ROUTE
    async function init() {
      const isValidRoute =
        getNavigationItems()?.some(
          (route) => route.href === location.pathname
        ) || location.pathname === ROUTES.CLINICS.VIEW_CLINICS;

      if (!isValidRoute) {
        history.push(navigation?.[0]?.href);
      }
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
                className={tenant.isCHWConnect ? 'w-3/12 ' : 'w-full'}
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
