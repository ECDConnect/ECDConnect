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
    console.log(data);
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === 'GrowGreat'
    ) {
      return [
        {
          name: 'All Roles',
          href: '/users/roles',
        },
        {
          name: 'Clinics',
          href: '/users/clinics',
        },
        {
          name: 'Team Leads',
          href: '/users/team-leads',
        },
        {
          name: 'Health Care Worker',
          href: '/users/health-care-worker',
        },
        {
          name: 'Mothers',
          href: '/users/mother',
        },
        {
          name: 'Children',
          href: '/users/infant',
        },
        {
          name: 'Administrators',
          href: '/users/application',
        },
      ];
    } else {
      return [
        {
          name: 'All Roles',
          href: '/users/all-roles',
        },
        {
          name: 'Franchisors',
          href: '/users/franchisors',
        },
        {
          name: 'Coaches',
          href: '/users/coaches',
        },
        {
          name: 'Practitioners',
          href: '/users/practitioners',
        },
        {
          name: 'Children',
          href: '/users/children',
        },
        {
          name: 'Administrators',
          href: '/users/application',
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

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <div className="flex justify-center bg-white ">
        {navigation.map((item) => (
          <div className="w-3/12 ">
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
