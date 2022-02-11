import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames, renderIcon } from '../..';
import { Typography } from '..';
import { SideMenuProps } from './side-menu.types';
import { Badge } from '../badge/badge';

export const SideMenu: React.FC<SideMenuProps> = ({
  sidebarOpen,
  logoUrl,
  children,
  onNavigation,
  navigation,
  setSidebarOpen,
  version,
}) => {
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setSidebarOpen}>
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-textDark">
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
                    className="ml-1 flex items-center justify-center h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {/* <span className="sr-only">Close sidebar</span> */}
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <img className="h-8 w-auto" src={logoUrl} />
              </div>
              <div className="flex flex-col mt-5 flex-1 h-0 overflow-y-auto justify-between">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => onNavigation(item)}
                      className={classNames(
                        item.current ? 'text-white bg-primary' : 'text-white bg-textDark',
                        'group flex flex-row items-center px-2 py-2 text-base font-medium rounded-md'
                      )}
                    >
                      <div className={'w-2/3 h-full flex flex-row items-center'}>
                        <div className={'w-1/12 items-center justify-center mr-4 '}>
                          {item.icon && renderIcon(item.icon, 'flex-shrink-0 h-6 w-6 text-white')}
                        </div>
                        <Typography type={'body'} color={'white'} text={item.name} />
                      </div>

                      <div className={'w-1/3 flex flex-row justify-end'}>
                        {item.getNotificationCount && item.getNotificationCount() > 0 && (
                          <Badge>{item.getNotificationCount()}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </nav>
                {version && (
                  <Typography align="center" type={'body'} color="white" text={version} />
                )}
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex flex-col flex-1">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default SideMenu;
