import { Notification, NOTIFICATION, useNotifications } from '@ecdlink/core';
import { Transition } from '@headlessui/react';
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid';
import * as React from 'react';

export default function Notifications() {
  const { notifications, clearNotification } = useNotifications();

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.variant) {
      case NOTIFICATION.ERROR:
        return (
          <ExclamationCircleIcon
            className="h-6 w-6 text-errorMain"
            aria-hidden="true"
          />
        );
      case NOTIFICATION.SUCCESS:
        return (
          <CheckCircleIcon
            className="h-6 w-6 text-successMain"
            aria-hidden="true"
          />
        );
      default:
        return (
          <InformationCircleIcon
            className="h-6 w-6 text-alertMain"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <>
      {notifications &&
        notifications.map((item) => (
          <div
            key={item.id}
            aria-live="assertive"
            className="z-50 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
          >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
              {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
              <Transition
                show={true}
                as={React.Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(item)}
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.message}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <button
                          className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => {
                            clearNotification(item.id);
                          }}
                        >
                          <span className="sr-only">Close</span>
                          <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        ))}
    </>
  );
}
