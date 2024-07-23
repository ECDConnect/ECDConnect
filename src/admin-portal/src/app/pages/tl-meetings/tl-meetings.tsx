import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ROUTES from '../../routes/app.routes-constants';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { TlMeetingsRoutes } from '../../routes/app.routes';
import { useTenant } from '../../hooks/useTenant';

export function TLMeetings() {
  const location = useLocation();
  const tenant = useTenant();

  const getNavigationItems = () => {
    if (tenant.isCHWConnect) {
      return [
        {
          name: 'See reports',
          href: ROUTES.TL_MEETINGS.REPORTS.SEE_REPORTS,
        },
        {
          name: 'Edit topics',
          href: ROUTES.TL_MEETINGS.EDIT_TOPICS,
        },
      ];
    }
  };

  const navigation = getNavigationItems();
  const url = window.location.pathname;

  const isViewReportPath = url === ROUTES.TL_MEETINGS.REPORTS.VIEW_REPORT;

  const history = useHistory();

  useEffect(() => {
    // GO TO DEFAULT ROUTE
    async function init() {
      const isValidRoute = getNavigationItems()?.some(
        (route) => route.href === location.pathname
      );

      if (!isValidRoute) {
        history.push(navigation?.[0]?.href);
      }
    }

    init()?.catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-center bg-white">
        {!isViewReportPath &&
          navigation?.map((item) => (
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
