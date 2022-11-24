import { classNames, Colours, ComponentBaseProps } from '../..';

interface BadgeProps extends ComponentBaseProps {
  color?: Colours;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  color = 'errorMain',
}) => {
  return (
    <span
      className={classNames(
        className,
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold leading-none',
        `bg-${color}`
      )}
    >
      {children}
    </span>
  );
};
