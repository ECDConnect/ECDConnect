import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SettingsRoutes } from '../../app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';

const navigation = [
  {
    name: 'Theme',
    href: '/settings/theme',
  },
  {
    name: 'General',
    href: '/settings/general',
  },
  {
    name: 'Portal Navigation Setup',
    href: '/settings/navigation',
  },
];

export interface SettingsRouteState {
  overrideDefaultUrl?: string;
}

export function Settings() {
  const location = useLocation<SettingsRouteState>();
  const overrideDefaultUrl = location?.state?.overrideDefaultUrl;

  const history = useHistory();
  useEffect(() => {
    async function init() {
      if (!overrideDefaultUrl) history.push(navigation[0].href);
      else history.push(overrideDefaultUrl);
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
            <SettingsRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
