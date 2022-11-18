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
          name: 'Application Users',
          href: '/users/application',
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
      ];
    } else {
      return [
        {
          name: 'Application Users',
          href: '/users/application',
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
    <div className="shadow flex-1 min-w-0 bg-white xl:flex rounded bg-white">
      <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-uiMidDark ">
        {navigation.map((item) => (
          <SubNavigationLink
            key={`${item.name}-${new Date().getTime()}`}
            item={item}
          ></SubNavigationLink>
        ))}
      </div>

      <div className="bg-uiMidDark lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="relative h-full" style={{ minHeight: '36rem' }}>
            <UserRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
