import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { GetTenantContext } from '@ecdlink/graphql';
import { TenantContext } from '../../utils/constants';
import ROUTES from '../../routes/app.routes-constants';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { TlMeetingsRoutes } from '../../routes/app.routes';

export function TLMeetings() {
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
          name: 'Edit topics',
          href: ROUTES.TL_MEETINGS.SEE_REPORTS,
        },
        {
          name: 'See reports',
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
      history.push(navigation?.[0]?.href);
    }

    init()?.catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ navigation });

  return (
    <>
      <div className="flex justify-center bg-white">
        {navigation?.map((item) => (
          <div key={item?.href} className={'w-full'}>
            <SubNavigationLink
              key={`${item.name}-${new Date().getTime()}`}
              item={item}
            ></SubNavigationLink>
          </div>
        ))}
      </div>
      <div className="p-8">
        <TlMeetingsRoutes />
      </div>
    </>
  );
}

export default TLMeetings;
