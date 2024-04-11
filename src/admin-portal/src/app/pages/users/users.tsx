import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserRoutes } from '../../routes/app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';
import { TenantContext } from '../../utils/constants';
import ROUTES from '../../routes/app.routes-constants';
import { useUserRole } from '../../hooks/useUserRole';

export function Users() {
  const location = useLocation();

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });
  const { isTeamLead, isAdministrator } = useUserRole();

  const getNavigationItems = () => {
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === TenantContext.GrowGreat
    ) {
      if (isTeamLead && !isAdministrator) {
        return [
          {
            name: 'CHWs',
            href: ROUTES.USERS.HEALTH_CARE_WORKERS,
          },
        ];
      }

      return [
        {
          name: 'All Roles',
          href: '/users/all-roles',
        },
        {
          name: 'CHWs',
          href: ROUTES.USERS.HEALTH_CARE_WORKERS,
        },
        {
          name: 'Team Leads',
          href: '/users/team-leads',
        },
        {
          name: 'Administrators',
          href: '/users/admins',
        },
      ];
    } else {
      return [
        {
          name: 'Administrators',
          href: '/users/admins',
        },
        {
          name: 'Practitioners',
          href: '/users/practitioners',
        },
        {
          name: 'Children',
          href: '/users/children',
        },
      ];
    }
  };

  const navigation = getNavigationItems();

  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem('selectedUser');

    // GO TO DEFAULT ROUTE
    async function init() {
      history.push(navigation[0].href);
    }

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="flex bg-white">
        {window.location.pathname !== '/users/view-user' &&
          navigation.map((item) => (
            <div
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

      <div className=" bg-adminPortalBg rounded-xl rounded-t-none lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div
            className={` relative h-full  ${
              location?.pathname?.includes(ROUTES.USERS.HEALTH_CARE_WORKERS)
                ? ''
                : 'p-12'
            }  `}
            style={{ minHeight: '36rem' }}
          >
            <UserRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
