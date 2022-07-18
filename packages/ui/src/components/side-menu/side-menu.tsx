import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { SideMenuProps } from './side-menu.types';
import NestedSubMenu from './nested-submenu';
import SideMenuItem from './side-menu-item';

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
                  {navigation.map((item) =>
                    item.nestedChildren ? (
                      <NestedSubMenu
                        key={item.name}
                        item={item}
                        onNavigation={onNavigation}
                      />
                    ) : (
                      <SideMenuItem
                        key={item.name}
                        item={item}
                        onNavigation={onNavigation}
                      />
                    )
                  )}
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
