import * as heroIconsSolid from '@heroicons/react/solid';

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

export { renderIcon };
