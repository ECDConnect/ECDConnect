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
          ? 'bg-infoBb text-secondary border-b-secondary border-b-2  bg-white '
          : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
        'users-tabs flex h-14 items-center text-lg font-medium'
      )}
    >
      {item.name}
    </Link>
  );
};

export default SubNavigationLink;
