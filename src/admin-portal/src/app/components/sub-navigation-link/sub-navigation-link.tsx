import { classNames } from '@ecdlink/ui';
import { Link, useRouteMatch } from 'react-router-dom';

type menuItemProps = {
  item: any;
};
const SubNavigationLink: React.FC<menuItemProps> = ({ item }) => {
  const routeMatch = useRouteMatch(item.href);

  return (
    <Link
      to={item.href}
      className={classNames(
        routeMatch
          ? 'bg-uiMidDark text-white'
          : 'text-textMid hover:bg-uiMidDark hover:text-white',
        'group flex items-center px-4 text-sm font-medium h-14'
      )}
    >
      {item.name}
    </Link>
  );
};

export default SubNavigationLink;
