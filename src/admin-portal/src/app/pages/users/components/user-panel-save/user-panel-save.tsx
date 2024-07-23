import { getAvatarColor } from '@ecdlink/core';
import { Button, UserAvatar } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { UserPanelSaveProps } from '../users';

export default function UserPanelSave(props: UserPanelSaveProps) {
  const emitSave = () => {
    props.onSave();
  };

  const [userAvatar, setUserAvatar] = useState<string>();
  // const disablebutton = props?.disabled?.

  useEffect(() => {
    if (props.user) {
      const avatar = getAvatarColor();

      setUserAvatar(avatar);
    }
  }, [props.user]);

  return (
    <article>
      {/* Profile header */}
      <div>
        <div className="h-12 w-full rounded-lg bg-white object-cover"></div>
        <div className="w-full">
          <div className="-mt-12 w-full">
            <div className="flex w-full">
              {/* {props.user ? (
                <UserAvatar
                  className="ring-4 ring-white"
                  size={'header'}
                  avatarColor={userAvatar}
                  text={`${props.user?.firstName[0]}${props.user?.surname[0]}`}
                  displayBorder
                />
              ) : (
                <span className="h-120 w-120 inline-block overflow-hidden rounded-full bg-gray-100 ring-4 ring-white">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )} */}
            </div>
            <div className="W-full mt-6">
              <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {props.user?.firstName} {props.user?.surname}
                </h1>
              </div>
              <div className="justify-stretch bg-quatenary mt-6 flex w-full flex-col">
                <Button
                  color="quatenary"
                  onClick={() => emitSave()}
                  type="filled"
                  buttonType="submit"
                  className="bg-secondary hover:bg-uiLight focus:outline-none focus:ring-primary-dark inline-flex justify-center rounded-xl border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                  disabled={props?.disabled || props?.isLoading}
                  isLoading={props?.isLoading}
                >
                  Save
                </Button>

                {/* <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className=" inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary-dark">
                          Extend User
                          <ChevronDownIcon
                            className="-mr-1 ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
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
                          className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="py-1">
                            {data &&
                              data.GetAllUserType.map((userType: UserType) => (
                                <Menu.Item key={userType.name}>
                                  {({ active }) => (
                                    <div
                                      onClick={() => addUserType(userType)}
                                      className={classNames(
                                        active
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                      )}
                                    >
                                      {userType.normalizedName}
                                    </div>
                                  )}
                                </Menu.Item>
                              ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu> */}
              </div>
            </div>
          </div>
          <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
            <h1 className="truncate text-2xl font-bold text-gray-900">
              {props.user?.firstName} {props.user?.surname}
            </h1>
          </div>
        </div>
      </div>
    </article>
  );
}
