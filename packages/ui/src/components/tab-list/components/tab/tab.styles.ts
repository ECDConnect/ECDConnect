import { Colours } from '../../../../models';
import { classNames } from '../../../../utils/style-class.utils';

export const tabInactive = (isOnlyTab: boolean) =>
  `border-transparent hover:text-uiLight hover:border-uiLight whitespace-nowrap p-4 text-${
    isOnlyTab ? 'start' : 'center'
  } border-b-4 items-${isOnlyTab ? 'start' : 'center'}`;
export const tabActive = (isOnlyTab: boolean, colour: Colours) =>
  `border-${colour} whitespace-nowrap p-4 border-b-4 items-${
    isOnlyTab ? 'start' : 'center'
  } text-${isOnlyTab ? 'start' : 'center'}`;

export const getTabClass = (
  activeTab: boolean,
  className: string,
  isOnlyTab: boolean = false,
  activeTabColour: Colours = 'quatenary',
  activeTabClassName?: string
) => {
  let tabClassName = isOnlyTab ? 'pl-4 ' : ' ';
  tabClassName += activeTab
    ? tabActive(isOnlyTab, activeTabColour)
    : tabInactive(isOnlyTab);

  if (className !== '') {
    tabClassName = classNames(tabClassName, className);
  }

  if (isOnlyTab) {
    tabClassName = tabClassName
      .replace('border-primary', '')
      .replace('border-b-4', '');
  }

  return activeTab && activeTabClassName ? activeTabClassName : tabClassName;
};
