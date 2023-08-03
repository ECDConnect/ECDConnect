import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserRoutes } from '../../app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';

export function Users() {
  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const getNavigationItems = () => {
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === 'GrowGreat'
    ) {
      return [
        {
          name: 'All Roles',
          href: '/users/all-roles',
        },
        {
          name: 'CHWs',
          href: '/users/health-care-worker',
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
  const userSelected = localStorage.getItem('selectedUser');
  console.log(window.location.pathname)
  return (
    <div className="">
      <div className="flex justify-center bg-white ">
        {window.location.pathname !== '/users/view-user' &&
          navigation.map((item) => (
            <div
              className={
                data?.tenantContext.applicationName === 'GrowGreat'
                  ? 'w-3/12 '
                  : 'w-full'
              }
            >
              <SubNavigationLink
                key={`${item.name}-${new Date().getTime()}`}
                item={item}
               
              ></SubNavigationLink>
            </div>
          ))
        }
      </div>

      <div className=" lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div
            className="relative h-full rounded-xl bg-white p-12"
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
