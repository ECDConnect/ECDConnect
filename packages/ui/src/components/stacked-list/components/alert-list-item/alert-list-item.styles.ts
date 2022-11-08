import { Colours } from '../../../../models/Colours';
import { AlertSeverityType } from '../../models/UserAlertListDataItem';

export const contentWrapper =
  'flex flex-row items-center px-4 py-4 sm:px-6 justify-between';
export const menuItemIconContainer =
  'flex-shrink-0 h-12  w-12 rounded-full flex justify-center items-center ';
export const menuItemIconContainerDefault = 'bg-primary text-white';
export const menuItemIcon = 'flex-shrink-0 h-6 w-6 ';
export const menuTitle = 'text-sm font-medium text-primary truncate';
export const menuSubTitle = 'flex pl-0.5 items-center text-sm text-textLight';
export const menuChevron = 'h-5 w-5 text-textLight';
export const menulistItemContainer =
  'block border border-r-0 border-l-0 border-solid border-color-textLight block hover:bg-uiLight cursor-pointer';

export const getColourByAlertSeverity = (type: AlertSeverityType): Colours => {
  switch (type) {
    case 'error':
      return 'errorMain';
    case 'warning':
      return 'alertMain';
    case 'success':
      return 'successMain';
    case 'none':
    default:
      return 'textLight';
  }
};

export const getShapeClassByAlertSeverity = (type: AlertSeverityType) => {
  switch (type) {
    case 'error':
      return 'h-2.5 w-2.5 bg-errorMain';
    case 'warning':
      return 'h-0 w-0 border-opacity-0 border-t-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-b-10 border-b-alertMain shadow-none';
    case 'success':
      return 'h-2.5 w-2.5 rounded-full bg-successMain';
    default:
      return 'h-2.5 w-2.5 rounded-full bg-successMain';
  }
};
