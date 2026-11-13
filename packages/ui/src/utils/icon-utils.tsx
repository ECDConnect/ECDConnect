import * as heroIconsSolid from '@heroicons/react/solid';

// An imported image is a data: URI when the bundler inlines it, otherwise a
// URL (always the case on the Vite dev server). Heroicon names are neither.
const isImageSource = (icon?: string) =>
  !!icon && (icon.startsWith('data:image/') || /[/.]/.test(icon));

const renderIcon = (
  iconName: string,
  className: string = '',
  iconType?: string
) => {
  if (iconType === 'img') {
    return <img src={iconName} alt="" className={className} />;
  }
  // undefined or hero
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const SelectedIcon: JSX.Element = heroIconsSolid[iconName];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <SelectedIcon className={className} />;
};

export { isImageSource, renderIcon };
