export const wrapper = 'relative';
export const icon = ' transition-all h-6 w-6 text-white';
export const text = 'px-2';

export const iconToggle = (isScrolling: boolean) => {
  const show = ' opacity-100 w-5 h-5 mx-1';
  const hide = ' opacity-0 w-0 h-0 mx-0';
  return icon + (isScrolling ? show : hide);
};
export const textToggle = (isScrolling: boolean) => {
  const show = ' opacity-100 w-full h-5 mx-1';
  const hide = ' opacity-0 w-0 h-0 mx-0';
  return icon + (isScrolling ? hide : show);
};
