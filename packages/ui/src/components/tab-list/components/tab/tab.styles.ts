import { classNames } from '../../../../utils/style-class.utils';

export const tabInactive = (isOnlyTab: boolean) =>
	`border-transparent hover:text-uiLight hover:border-uiLight whitespace-nowrap py-4 px-1 text-${isOnlyTab ? 'start' : 'center'} border-b-2 min-w-120 items-${isOnlyTab ? 'start' : 'center'}`;
export const tabActive = (isOnlyTab: boolean) =>
	`border-primary whitespace-nowrap py-4 px-1 border-b-2 min-w-120 items-${isOnlyTab ? 'start' : 'center'} text-${isOnlyTab ? 'start' : 'center'}`;

export const getTabClass = (
	activeTab: boolean,
	className: string,
	isOnlyTab: boolean = false
) => {
	let tabClassName = isOnlyTab ? 'pl-4 ' : ' ';
	tabClassName += activeTab ? tabActive(isOnlyTab) : tabInactive(isOnlyTab);

	if (className !== '') {
		tabClassName = classNames(tabClassName, className);
	}

	if (isOnlyTab) {
		tabClassName = tabClassName.replace('border-primary', 'border-uiLight');
	}

	return tabClassName;
};
