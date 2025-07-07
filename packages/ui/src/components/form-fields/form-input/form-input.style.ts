export const checkboxStyle = 'h-4 w-4 text-primary border-gray-300 rounded';
export const errorStyle =
  'block w-full py-3 pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
export const defaultInputStyle =
  'font-h1 bg-uiBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textDark py-3 placeholder-textLight font-h1';
export const readonlyInputStyle =
  'text-textDark font-semibold border-none bg-transparent p-0 text-16';
export const portalDdefaultInputStyle =
  'font-h1 bg-adminPortalBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textDark py-3 placeholder-textLight font-h1';
export const adminPortalInputStyle =
  'font-h1 bg-adminPortalBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textDark py-3 placeholder-textLight font-h1';
export const disabledInputStyle =
  'font-h1 bg-uiBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textLight py-3 placeholder-textLight font-h1';
export const portalDisabledInputStyle =
  'bg-adminPortalBg focus:outline-none sm:text-md block w-full rounded-lg py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white';
export const defaultMoneyInputStyle =
  'font-h1 bg-uiBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textDark items-center py-3 pl-5 placeholder-textLight font-h1';
export const disabledMoneyInputStyle =
  'font-h1 bg-uiBg focus:bg-white focus:ring-uiMidDark border border-transparent focus:border focus:border-uiMidDark block w-full sm:text-sm rounded-md text-textLight items-center py-3 pl-5 placeholder-textLight font-h1';
export const label =
  'block text-base leading-snug font-body font-semibold text-textDark';
export const adminPortalLabel =
  'block text-base leading-snug font-medium text-gray-800';
export const disabledLabel =
  'block text-base leading-snug font-body font-semibold text-textLight';
export const subLabel =
  'block text-sm font-body leading-snug text-textMid self-stretch';
export const navStyle = '-mb-px flex flex-1 space-x-8';
export const inputValid =
  'focus:ring-textLight focus:border-textLight block w-full text-textDark sm:text-sm border-uiLight rounded-md';
export const inputInvalid =
  'block w-full pr-10 border-errorMain text-errorMain placeholder-errorMain focus:outline-none focus:ring-errorMain focus:border-errorMain sm:text-sm rounded-md';
export const inputWrapper = 'mt-1 relative rounded-md';
export const iconWrapper =
  'absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer';
export const iconWrapperLeft =
  'absolute inset-y-0 left-1 pr-3 flex items-center cursor-pointer';
export const icon = 'h-5 w-5';
export const iconError = 'h-5 w-5 text-errorMain';
export const descriptionParagraph = 'text-sm text-uiLight';
export const descriptionList = 'list-disc md:list-disc px-4';
export const descriptionListItem = 'mt-2 text-sm text-uiLight';
export const errorListItem = 'mt-2 text-sm text-errorMain';
export const hintStyle = 'block mt-1 text-sm font-h1 font-normal text-textMid';

export function getBorderClass(
  value?: string | number,
  maxCharacters?: number
): string {
  if (!maxCharacters) return '';

  if (value && value.toString().length > maxCharacters) {
    return 'border-errorMain';
  } else {
    return '';
  }
}
