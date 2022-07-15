import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames, renderIcon } from '../..';
import { Divider, Typography } from '..';
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
  const [openSub, setOpenSub] = useState(false);
  const openFolder = () => {
    setOpenSub(!openSub);
  };

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40"
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
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
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
                    className="cursor-pointer bg-white flex place-items-center z-10 rounded-10 h-9 w-9 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" // TODO: fix this to be generic
                    onClick={() => setSidebarOpen(false)}
                  >
                    <XIcon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="px-18 flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src={logoUrl} />
              </div>
              <div className="flex flex-col mt-5 flex-1 h-0 overflow-y-auto justify-between">
                <nav className="px-18 space-y-1.5">
                  {navigation.map((item) => (
                    <Fragment key={item.name}>
                      <div className={`group items-center w-full`}>
                        {item.showDivider && (
                          <Divider
                            className="bg-primaryAccent1"
                            dividerType="dashed"
                          />
                        )}
                        <div
                          onClick={() => {
                            item.nestedChildren
                              ? openFolder()
                              : onNavigation(item);
                          }}
                          className={classNames(
                            item.nestedChildren && openSub
                              ? 'bg-secondaryAccent2 text-primary'
                              : item.current
                              ? 'text-white bg-primary'
                              : 'text-primary',
                            'h-full flex flex-row items-center p-2.5 text-base font-medium rounded-lg cursor-pointer'
                          )}
                        >
                          <div
                            className={
                              'w-1/12 items-center justify-center mr-4 '
                            }
                          >
                            {item.icon &&
                              renderIcon(item.icon, 'flex-shrink-0 h-6 w-6')}
                          </div>
                          <Typography
                            type={'h4'}
                            color={
                              item.nestedChildren && openSub
                                ? 'primary'
                                : item.current
                                ? 'white'
                                : 'textDark'
                            }
                            text={item.name}
                          />
                          {item.nestedChildren &&
                            openSub &&
                            renderIcon(
                              'ChevronUpIcon',
                              'flex-shrink-0 h-6 w-6 ml-auto'
                            )}
                          {item.nestedChildren &&
                            !openSub &&
                            renderIcon(
                              'ChevronDownIcon',
                              'flex-shrink-0 h-6 w-6 ml-auto'
                            )}
                          {item.getNotificationCount && (
                            <div className="ml-auto">
                              {item.getNotificationCount() > 0 && (
                                <Badge className="text-white">
                                  {item.getNotificationCount()}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {openSub &&
                          item.nestedChildren?.map((nested) => (
                            <div
                              key={nested.name}
                              onClick={() => onNavigation(nested)}
                              className="h-full flex flex-row items-center p-2.5 text-base font-medium rounded-lg cursor-pointer"
                            >
                              <div
                                className={
                                  'w-1/12 items-center justify-center mr-4 '
                                }
                              />
                              <Typography
                                type={'help'}
                                color={'textDark'}
                                text={nested.name}
                              />
                            </div>
                          ))}
                      </div>
                    </Fragment>
                  ))}
                </nav>
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
