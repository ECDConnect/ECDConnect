import * as HIcons from '@heroicons/react/solid';

const { ...icons } = HIcons;

const Icon = (props: IconProps) => {
  const DynaHeroIcon = icons[props.icon];
  return (
    <DynaHeroIcon
      icon={props.icon}
      height={props.height || '16px'}
      style={
        props.style || {
          fill: props.color || 'black',
        }
      }
      className={props.className}
      aria-hidden="true"
      onClick={(e: Event) => (props.onClick ? props.onClick(e) : false)}
    />
  );
};

export default Icon;
