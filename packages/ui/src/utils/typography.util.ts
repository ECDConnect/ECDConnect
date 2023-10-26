import { AlertSeverityType } from '../components/stacked-list/models/AlertListDataItem';
import { Colours } from '../models';

/**
 * Method to strip default <p>...</p> in string from CMS text.
 * This should be done in the CMS
 * #TODO remove <p></p> tag from string
 **/
export const stripPTag = (taggedString?: string) => {
  return taggedString
    ? taggedString.replaceAll('<p>', '').replaceAll('</p>', '')
    : '';
};

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
