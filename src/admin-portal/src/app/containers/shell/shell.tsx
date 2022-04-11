import { useQuery } from '@apollo/client';
import {
  getAvatarColor,
  NavigationDto,
  usePanel,
  useTheme,
} from '@ecdlink/core';
import { GetAllNavigation } from '@ecdlink/graphql';
import { UserAvatar } from '@ecdlink/ui';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  InformationCircleIcon,
  MenuAlt2Icon,
  XIcon,
} from '@heroicons/react/outline';
import { Fragment, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { AuthRoutes } from '../../app.routes';
import Icon from '../../components/icon';
import InformationPanel from '../../components/information-panel/information-panel';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

type menuItemProps = {
  item: NavigationDto;
};
const MenuItem: React.FC<menuItemProps> = ({ item }) => {
  const routeMatch = useRouteMatch(item.route);

  return (
    <Link
      to={item.route}
      className={classNames(
        routeMatch
          ? 'bg-white text-textMid'
          : 'hover:bg-white hover:text-textMid',
        'text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md'
      )}
    >
      <Icon
        icon={item.icon}
        className={classNames(
          routeMatch
            ? 'text-gray-500'
            : 'text-gray-400 group-hover:text-gray-500',
          'mr-3 flex-shrink-0 h-6 w-6'
        )}
        color="transparent"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [avatarColor, setAvatarColor] = useState<string>();
  const [navigation, setNavigation] = useState<NavigationDto[]>();
  const [activeNavigation, setActiveNavigation] = useState<NavigationDto>();

  const { data: navigationData } = useQuery(GetAllNavigation, {
    fetchPolicy: 'cache-and-network',
  });

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
    if (user && navigationData && navigationData.GetAllNavigation) {
      const navigationList: NavigationDto[] = navigationData.GetAllNavigation;
      const userRolePermissions = user.roles.map((x) => x.permissions).flat();
      const userPermissionIds = userRolePermissions.map((x) => x.id);
      if (user.roles.some((x) => x.name === 'Administrator')) {
        const sorted = navigationList
          .slice()
          .sort((a, b) => a.sequence - b.sequence);
        setNavigation(sorted);
      } else {
        const filtered = navigationList.filter((x) =>
          x.permissions.some((z) => userPermissionIds.includes(z.id))
        );
        setNavigation(filtered.slice().sort((a, b) => a.sequence - b.sequence));
      }
    }
  }, [user, navigationData]);

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return theme.images.logoUrl;
    } else {
      return '';
    }
  };

  const signOutClick = () => {
    logout();
    history.push('/');
  };

  const userNavigation = [{ name: 'Sign out', onClick: signOutClick }];

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
    <div className="h-full flex overflow-hidden bg-gray-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary">
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
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex items-center justify-center flex-shrink-0 px-4">
                <img
                  className="h-20 w-auto"
                  src={getLogoUrl()}
                  alt="Workflow"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
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
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>

      <div className="hidden bg-primary md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <img className="h-20 w-auto" src={getLogoUrl()} alt="Workflow" />
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation?.map((item) => (
                  <MenuItem
                    key={`${item.name}-${new Date().getTime()}`}
                    item={item}
                  ></MenuItem>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 pl-4 flex cursor-pointer">
              {activeNavigation && (
                <InformationCircleIcon
                  onClick={() => displayInformationPanel()}
                  className="text-infoMain ml-2"
                  height="25"
                  width="25"
                />
              )}

              <span className="pl-2 text-black font-semibold">
                {activeNavigation?.name}
              </span>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>

                        {user ? (
                          <UserAvatar
                            size={'md'}
                            avatarColor={avatarColor}
                            text={`${user.firstName[0]}${user.surname[0]}`}
                            displayBorder
                          />
                        ) : null}
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        {userNavigation.map((item: any) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <div
                                onClick={item.onClick}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                )}
                              >
                                {item.name}
                              </div>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 h-full">
            <div className="mx-auto px-4 sm:px-6 md:px-8 h-full">
              <AuthRoutes />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
