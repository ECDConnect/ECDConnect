import { renderIcon } from '../../utils';
import { AlertProps, AlertVariant } from './alert.types';
export const wrapper = `rounded-10 p-4 `;
export const innerWrapper = 'flex flex-row ';
export const extendedContentWrapper = 'pl-3 mt-2 ';
export const iconWrapper = 'flex-shrink-0';
export const contentWrapper = 'flex flex-col justify-start items-start ';
export const icon = 'h-5 w-5 ';
export const messageWrapper = 'ml-3 ';
export const message = (hasTitle: boolean) =>
  `text-sm font-normal ${hasTitle && 'mt-2 '}`;
export const title = 'text-sm ';
export const list = 'list-disc pl-4 mt-2 ';

export const alertColor = (type: string, style: AlertVariant) => {
  switch (type) {
    case 'info':
      return ` text-infoDark ${
        style !== 'flat' && 'border-infoDark'
      } bg-infoBb`;
    case 'success':
      return `text-successDark ${
        style !== 'flat' && 'border-successDark'
      } bg-successBg`;
    case 'warning':
      return `text-alertDark ${
        style !== 'flat' && 'border-alertDark'
      } bg-alertBg`;
    case 'error':
      return `text-errorDark ${
        style !== 'flat' && 'border-errorDark'
      } bg-errorBg`;
    default:
      return `text-infoDark ${style !== 'flat' && 'border-infoDark'} bg-infoBb`;
  }
};

export const alertTextColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'infoDark';
    case 'success':
      return 'successDark';
    case 'warning':
      return 'alertDark';
    case 'error':
      return 'errorDark';
    default:
      return 'infoDark';
  }
};

const getIcon = (iconName: string, colorType: string) => {
  return renderIcon(iconName, icon + alertIconColor(colorType));
};

export const alertIconColor = (type: string) => {
  switch (type) {
    case 'info':
      return ` text-infoMain`;
    case 'success':
      return `text-successMain `;
    case 'warning':
      return `text-alertMain `;
    case 'error':
      return `text-errorMain `;
    default:
      return `text-infoMain `;
  }
};

export const alertIcon = (type: string): JSX.Element => {
  switch (type) {
    case 'info':
      return getIcon('InformationCircleIcon', 'info');
    case 'success':
      return getIcon('CheckCircleIcon', 'success');
    case 'warning':
      return getIcon('ExclamationIcon', 'warning');
    case 'error':
      return getIcon('XCircleIcon', 'error');
    default:
      return getIcon('information-circle', 'info');
  }
};
