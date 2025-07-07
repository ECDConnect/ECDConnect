import { Colours, classNames } from '@ecdlink/ui';

export const wrapper =
  'w-full rounded-lg flex-col justify-between items-start bg-uiBg';
export const content = 'flex flex-row p-4';

export const checkboxInput = 'h-4 w-4 rounded focus:ring-primary';
export const container = 'relative flex items-start';
export const inputContainer = 'flex items-center h-5 self-center outline-none';
export const textContainer = 'ml-2';

export const getCheckboxCardStyle = (
  checked: boolean | undefined,
  checkedBackgroundColour: Colours,
  checkedFocusColour: Colours
) => {
  const backgroundColour = checked
    ? `bg-${checkedBackgroundColour}`
    : ' bg-white';

  const focusColour = checked
    ? `border-2 border-${checkedFocusColour}`
    : ' bg-white border-2 border-white';

  return classNames(focusColour, backgroundColour);
};
