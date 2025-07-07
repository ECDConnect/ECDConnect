import { Colours } from '../../models';
import { renderIcon } from '../../utils';
import { AlertType, AlertVariant } from './alert.types';
export const wrapper = `rounded-10 p-4 relative`;
export const innerWrapper = 'flex flex-row ';
export const extendedContentWrapper = 'pl-3 mt-2 ';
export const iconWrapper = 'flex-shrink-0';
export const contentWrapper = (isOnlyTitle: boolean) =>
  `flex flex-col ${
    isOnlyTitle ? 'justify-center' : 'justify-start'
  } items-start mr-auto`;
export const icon = 'h-5 w-5 ';
export const messageWrapper = 'ml-3 ';
export const message = (hasTitle: boolean) =>
  `text-sm font-normal ${hasTitle && 'mt-2 '}`;
export const title = 'text-sm ';
export const list = 'list-disc pl-4 mt-2 ';

export const alertColor = (type: AlertType, style: AlertVariant) => {
  switch (type) {
    case 'infoDark':
      return `text-white ${style !== 'flat' && 'border-infoDark'} bg-infoMain`;
    case 'info':
      return `text-infoDark ${style !== 'flat' && 'border-infoDark'} bg-infoBb`;
    case 'success':
      return `text-successDark ${
        style === 'flat'
          ? 'border-successDark bg-successBg'
          : 'border-successMain bg-successMain'
      }`;
    case 'successLight':
      return `text-successDark ${
        style === 'flat'
          ? 'border-successDark bg-successBg'
          : 'border-successMain bg-successMain'
      }`;
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

export const alertTextColor = (type: AlertType, variant?: AlertVariant) => {
  switch (type) {
    case 'infoDark':
      return 'white';
    case 'info':
      return 'infoDark';
    case 'success':
      return variant === 'outlined' ? 'white' : 'successDark';
    case 'successLight':
      return variant === 'outlined' ? 'white' : 'successDark';
    case 'warning':
      return 'alertDark';
    case 'error':
      return 'errorDark';
    default:
      return 'infoDark';
  }
};

const getIcon = (
  iconName: string,
  colorType: AlertType,
  variant?: AlertVariant
) => {
  return renderIcon(iconName, icon + alertIconColor(colorType, variant));
};

export const alertIconColor = (type: string, variant?: AlertVariant) => {
  switch (type) {
    case 'successLight':
      return variant === 'outlined' ? 'text-white' : `text-successMain `;
    case 'infoDark':
      return `text-white`;
    case 'info':
      return `text-infoMain`;
    case 'success':
      return variant === 'outlined' ? 'text-white' : `text-successMain `;
    case 'warning':
      return `text-alertMain `;
    case 'error':
      return `text-errorMain `;
    default:
      return ``;
  }
};

export const alertIcon = (
  type: string,
  variant?: AlertVariant
): JSX.Element => {
  switch (type) {
    case 'infoDark':
      return getIcon('InformationCircleIcon', 'infoDark');
    case 'info':
      return getIcon('InformationCircleIcon', 'info');
    case 'success':
      return getIcon('CheckCircleIcon', 'success', variant);
    case 'successLight':
      return getIcon('CheckCircleIcon', 'successLight', variant);
    case 'warning':
      return getIcon('ExclamationIcon', 'warning');
    case 'error':
      return getIcon('XCircleIcon', 'error');
    default:
      return getIcon('information-circle', 'info');
  }
};
