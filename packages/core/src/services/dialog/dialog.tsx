import { Dialog, Transition } from '@headlessui/react';
import * as React from 'react';
import { Fragment } from 'react';
import { DialogModalOptions } from './DialogService';
import * as styles from './dialog.styles';
import { classNames, DialogPosition } from '@ecdlink/ui';

interface DialogModalProps extends DialogModalOptions {
  open: boolean;
  color?: string;
  transitionClassName?: string;
  onSubmit: () => void;
  onClose: () => void;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  open,
  render,
  onSubmit,
  onClose,
  position = DialogPosition.Full,
  transitionClassName,
  color = 'bg-uiBg ',
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className={classNames(transitionClassName, styles.transitionRoot)}
        open={open}
        onClose={onClose}
      >
        <div className={styles.transitionChildWrapper(position)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className={styles.overlay} />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents.
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-full"
            aria-hidden="true"
          >
            &#8203;
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={classNames(styles.contentWrapper(position), color)}>
              {render(onSubmit, onClose)}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
