import { useQuery } from '@apollo/client';
import { getAvatarColor, usePanel, useTheme } from '@ecdlink/core';
import {
  GetAllNavigation,
  GetAllNotifications,
  GetTenantContext,
} from '@ecdlink/graphql';
import { Avatar, Button, IconBadge, Typography, UserAvatar } from '@ecdlink/ui';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  InformationCircleIcon,
  MenuAlt2Icon,
  XIcon,
} from '@heroicons/react/outline';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { AuthRoutes } from '../../routes/app.routes';
import Icon from '../../components/icon';
import InformationPanel from '../../components/information-panel/information-panel';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import ggLogo from '../../../assets/gg-logo.svg';
import logo from '../../../assets/Logo-ECDConnect-white.svg';
import { TenantContext } from '../../utils/constants';
import {
  INavigation,
  NavbarTypes,
  NotificationNavigationModel,
} from './shell.types';
import { useUserRole } from '../../hooks/useUserRole';
import ROUTES from '../../routes/app.routes-constants';
import { navigationFromFrontend } from './shell.constants';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

type menuItemProps = {
  item: INavigation;
};

export const tlMeetings = {
  description: 'Team meetings',
  icon: 'PresentationChartBarIcon',
  id: '96d4070a-e5a6-4148-961b-20d9c05dje41',
  isActive: true,
  name: 'Team meetings',
  permissions: [],
  route: '/team-meetings',
  sequence: 8,
};

const MenuItem: React.FC<menuItemProps> = ({ item }) => {
  const routeMatch = useRouteMatch(item.route);

  return (
    <Link
      to={item.route}
      className={classNames(
        routeMatch
          ? 'bg-tertiary text-white'
          : 'hover:bg-white hover:text-black',
        'group my-2 mx-1 flex items-center rounded-md px-2 py-2 text-sm font-medium text-white'
      )}
    >
      <Icon
        icon={item.icon}
        className={classNames(
          routeMatch ? 'text-white' : 'text-white group-hover:text-gray-500',
          'mr-3 h-6 w-6 flex-shrink-0'
        )}
        color="white"
      />
      {item.name}
    </Link>
  );
};

export default function Shell() {
  const { theme } = useTheme();
  const panel = usePanel();
  const { logout } = useAuth();
  const { user } = useUser();
  const { isTeamLead, isAdministrator, isSuperAdmin } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [avatarColor, setAvatarColor] = useState<string>();
  const [navigation, setNavigation] = useState<INavigation[]>();
  const [activeNavigation, setActiveNavigation] = useState<INavigation>();

  const { data: navigationData } = useQuery(GetAllNavigation, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: notificationsData } = useQuery(GetAllNotifications, {
    variables: {
      userId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const notifications = notificationsData?.allNotifications;
  const notReadNotifications = useMemo(
    () => notifications?.filter((item) => !item?.readDate),
    [notifications]
  );

  useEffect(() => {
    if (navigation && location && location.pathname) {
      const current = navigation.find((x) =>
        location.pathname.includes(x.route)
      );
      if (current) setActiveNavigation(current);
    }
  }, [navigation, location]);

  useEffect(() => {
    setAvatarColor(getAvatarColor());
  }, []);

  useEffect(() => {
    if (navigationData?.GetAllNavigation) {
      const teamLeadNavigationItems = [
        NavbarTypes.Users,
        NavbarTypes.Clinics,
        NavbarTypes.League,
        NavbarTypes.Referrals,
        NavbarTypes.TeamMeetings,
      ];

      const adminNavigationItems = [
        NavbarTypes.Dashboard,
        NavbarTypes.Users,
        NavbarTypes.Clinics,
        NavbarTypes.RolesPermissions,
        NavbarTypes.Referrals,
        NavbarTypes.TLMeetings,
        NavbarTypes.Documents,
        NavbarTypes.CMS,
        NavbarTypes.Reporting,
        NavbarTypes.Messaging,
        NavbarTypes.SiteData,
        NavbarTypes.Settings,
        NavbarTypes.Notifications,
        NavbarTypes.CHWsOptedOut,
      ];

      const navigationList = [
        ...navigationData?.GetAllNavigation,
        tlMeetings,
        ...navigationFromFrontend,
      ];

      const teamLeadNavigationList: INavigation[] = navigationList?.filter(
        (item) => teamLeadNavigationItems?.includes(item?.name)
      );
      const adminNavigationList: INavigation[] = navigationList?.filter(
        (item) =>
          adminNavigationItems?.some((adminItem) =>
            item?.name?.includes(adminItem)
          )
      );

      const userRolePermissions = user?.roles
        ?.map((x) => x?.permissions)
        .flat();
      const userPermissionIds = userRolePermissions?.map((x) => x.id);
      if (isAdministrator || isSuperAdmin) {
        setNavigation(
          adminNavigationList.slice().sort((a, b) => a.sequence - b.sequence)
        );
      } else if (isTeamLead) {
        setNavigation(
          teamLeadNavigationList.slice().sort((a, b) => a.sequence - b.sequence)
        );
      } else {
        const filtered = navigationList.filter((x) =>
          x.permissions.some((z) => userPermissionIds.includes(z.id))
        );
        setNavigation(filtered.slice().sort((a, b) => a.sequence - b.sequence));
      }
    }
  }, [user, navigationData, isAdministrator, isSuperAdmin, isTeamLead]);

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const getLogoUrl = () => {
    if (
      theme &&
      theme.images &&
      data?.tenantContext.applicationName !== TenantContext.GrowGreat
    ) {
      return theme.images.logoUrl;
    } else {
      return ggLogo;
    }
  };

  const signOutClick = () => {
    logout();

    if (isTeamLead) {
      history.push(ROUTES.ROOT_TEAM_LEAD);
      return;
    }
    history.push('/');
  };

  const gotToProfile = () => {
    history.push(ROUTES.PROFILE);
  };

  const displayInformationPanel = () => {
    panel({
      noPadding: true,
      title: 'Information',
      render: (onSubmit: any) => (
        <InformationPanel siteInformation={activeNavigation} />
      ),
    });
  };

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 z-40 flex md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="darkBackground relative flex w-full max-w-xs flex-1 flex-col pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="focus:outline-none ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-shrink-0 flex-col items-center justify-center px-4">
                <img className="h-100 mb-8" src={logo} alt="Login Logo" />

                <img
                  className="h-16 w-8/12"
                  src={getLogoUrl()}
                  alt="Workflow"
                />
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {navigation?.map((item) => (
                    <MenuItem
                      key={`${item.name}-${new Date().getTime()}`}
                      item={item}
                    ></MenuItem>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>

      <div className="darkBackground hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 flex-col items-center justify-center px-4">
              <div></div>
              <img className="h-100 mb-8" src={logo} alt="Login Logo" />

              <img className="h-16 w-8/12" src={getLogoUrl()} alt="Workflow" />
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2">
                {navigation
                  ?.filter((item) => !item.hide)
                  ?.map((item) => (
                    <div key={`${item} + ${Math.random()}`}>
                      <MenuItem
                        key={`${item.name}-${new Date().getTime()}`}
                        item={item}
                      ></MenuItem>

                      <hr className=" border-b-uiLight mx-2 border-dashed" />
                    </div>
                  ))}
              </nav>
              <div className="mb-2 flex flex-col px-4 md:py-4">
                <Button
                  className={
                    'hover:bg-secondary mb-2 w-full rounded-xl hover:text-white'
                  }
                  type="filled"
                  // isLoading={isLoading}
                  color="uiMid"
                  // disabled={!isValid}
                  // onClick={signIn}
                  icon="InformationCircleIcon"
                >
                  <Typography
                    type="body"
                    color="white"
                    text={'Help'}
                    fontSize={'24'}
                  ></Typography>
                </Button>
                <Button
                  className={
                    'hover:bg-secondary w-full justify-self-start rounded-xl hover:text-white '
                  }
                  type="filled"
                  color="uiMid"
                  onClick={signOutClick}
                  icon="ArrowLeftIcon"
                >
                  <Typography
                    type="body"
                    color="white"
                    text={'Logout'}
                    fontSize={'24'}
                  ></Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="focus:outline-none border-r border-gray-200 px-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex flex-1 cursor-pointer pl-4">
              {activeNavigation && (
                <InformationCircleIcon
                  onClick={() => displayInformationPanel()}
                  className="text-infoMain ml-2"
                  height="25"
                  width="25"
                />
              )}
              <span className="pl-2 font-semibold text-black">
                {activeNavigation?.name}
              </span>
            </div>
            <div className="ml-4 flex items-center gap-2 md:ml-6">
              <div className="cursor-pointer">
                <IconBadge
                  onClick={() => {
                    history.push(ROUTES.NOTIFICATIONS_VIEW);
                    setActiveNavigation(
                      NotificationNavigationModel?.name as any
                    );
                  }}
                  badgeColor={'errorMain'}
                  badgeTextColor={'white'}
                  icon={'BellIcon'}
                  iconColor={'darkBackground'}
                  badgeText={
                    !!notReadNotifications?.length
                      ? `${notReadNotifications?.length}`
                      : ''
                  }
                  className="mt-4"
                />
              </div>
              <Menu as="div" className="relative ml-3">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button
                        onClick={gotToProfile}
                        className="focus:outline-none flex max-w-xs items-center rounded-full bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Open user menu</span>

                        {user?.profileImageUrl ? (
                          <Avatar
                            size={'md'}
                            displayBorder
                            dataUrl={`${user?.profileImageUrl}`}
                            borderColor="secondary"
                          />
                        ) : (
                          <UserAvatar
                            size={'md'}
                            avatarColor={avatarColor}
                            text={`${user?.firstName[0]}${user?.surname[0]}`}
                            displayBorder
                          />
                        )}
                      </Menu.Button>
                    </div>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>

        <main className="focus:outline-none bg-adminPortalBg relative flex-1 overflow-y-auto">
          <div className="bg-adminPortalBg h-full">
            <AuthRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}
