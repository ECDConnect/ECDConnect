import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { UserRoutes } from '../../routes/app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import ROUTES from '../../routes/app.routes-constants';
import { useTenant } from '../../hooks/useTenant';
import { UserTypes } from './user.types';
import { pluralize } from '../pages.utils';

export function Users() {
  const location = useLocation();
  const tenant = useTenant();

  const userTabs = [
    {
      name: 'All Roles',
      href: ROUTES.USERS.ALL_ROLES,
    },
    {
      name: UserTypes.Practitioners,
      href: ROUTES.USERS.PRACTITIONERS,
    },
    {
      name: UserTypes.Administrators,
      href: ROUTES.USERS.ADMINS,
    },
  ];

  const getNavigationItems = () => {
    if (tenant.isWhiteLabel) {
      if (tenant.modules && tenant.modules.coachRoleEnabled) {
        userTabs.splice(2, 0, {
          name: pluralize(tenant.modules.coachRoleName),
          href: ROUTES.USERS.COACHES,
        });
      }
    }
    return userTabs;
  };

  const navigation = getNavigationItems();
  const childrenRoutes = [ROUTES.USERS.VIEW_USER];

  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem('selectedUser');

    // GO TO DEFAULT ROUTE
    async function init() {
      const isValidRoute =
        getNavigationItems()?.some(
          (route) => route.href === location.pathname
        ) || childrenRoutes.some((route) => location.pathname.includes(route));

      if (!isValidRoute) {
        history.push(navigation?.[0]?.href);
      }
    }

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="flex bg-white">
        {window.location.pathname !== ROUTES.USERS.VIEW_USER &&
          navigation.map((item) => (
            <div
              className={'w-full'}
              key={`${item.name}-${new Date().getTime()}`}
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
          <UserRoutes />
        </div>
      </div>
    </div>
  );
}

export default Users;
