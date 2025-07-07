import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import * as React from 'react';
import { Fragment } from 'react';

export interface SharedPanelOptions {
  onCancelCallback?: (onCancel: () => void) => void;
  catchOnCancel?: boolean;
  title?: string;
  presentationStyle?:
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'overFullScreen';
  render?: (onSubmit: () => void, onCancel: () => void) => React.ReactNode;
  noPadding?: boolean;
  overlay?: boolean;
}

interface SharedPanelProps extends SharedPanelOptions {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const SharedPanel: React.FC<SharedPanelProps> = ({
  open,
  title,
  render,
  presentationStyle,
  onSubmit,
  onClose,
  onCancelCallback,
  noPadding,
  overlay,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={() =>
          !!onCancelCallback ? onCancelCallback(onClose) : onClose()
        }
      >
        {overlay && (
          <div
            className={`${
              overlay ? 'bg-textLight opacity-70' : ''
            } absolute inset-0 overflow-hidden`}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className={
                  presentationStyle === 'fullScreen'
                    ? 'max-w-12xl w-screen'
                    : 'w-screen max-w-2xl'
                }
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {title}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
                          onClick={() =>
                            !!onCancelCallback
                              ? onCancelCallback(onClose)
                              : onClose()
                          }
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {render && render(onSubmit, onClose)}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
