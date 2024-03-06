import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ClinicsRoutes, UserRoutes } from '../../app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';

export function ClinicsMainPage() {
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
          name: 'Clinics',
          href: '/clinics/clinics',
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
        {window.location.pathname !== '/users/view-user' &&
          navigation?.map((item) => (
            <div
              key={item?.href}
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

export default ClinicsMainPage;
