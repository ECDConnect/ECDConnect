import { classNames, Colours, ComponentBaseProps, renderIcon } from '../..';
import { Badge } from '../badge/badge';

interface IconBadgeProps extends ComponentBaseProps {
  icon: string;
  badgeText?: string;
  iconColor: Colours;
  badgeColor: Colours;
  badgeTextColor: Colours;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  badgeText,
  icon,
  className,
  iconColor,
  badgeColor,
  badgeTextColor,
  onClick,
}) => {
  return (
    <span
      className={classNames(className, 'relative inline-block')}
      onClick={onClick}
    >
      {renderIcon(icon, `w-6 h-6 text-${iconColor}`)}
      {badgeText && (
        <span
          className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-${badgeTextColor} transform translate-x-1/2 -translate-y-1/2 bg-${badgeColor} rounded-full`}
        >
          {badgeText}
        </span>
      )}
    </span>
  );
};
