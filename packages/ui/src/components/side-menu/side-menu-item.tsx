import { Fragment } from 'react';
import { classNames, renderIcon } from '../../utils';
import { Badge } from '../badge/badge';
import Divider from '../divider/divider';
import Typography from '../typography/typography';
import { NavigationItem, NavigationRouteItem } from './side-menu.types';

export type SideMenuItemProps = {
  item: NavigationRouteItem;
  onNavigation: (item: NavigationItem) => void;
};

export default function SideMenuItem({ item, onNavigation }) {
  return (
    <Fragment key={item.name}>
      <div className={`group w-full items-center`}>
        {item.showDivider && <Divider dividerType="dashed" />}
        <div
          onClick={() => onNavigation(item)}
          className={classNames(
            item.current ? 'bg-primary text-white' : 'text-primary',
            'flex h-full cursor-pointer flex-row items-center rounded-lg p-2.5 text-base font-medium'
          )}
        >
          <div className={'mr-4 w-1/12 items-center justify-center '}>
            {item.icon && renderIcon(item.icon, 'flex-shrink-0 h-6 w-6')}
          </div>
          <Typography
            type={'h4'}
            color={item.current ? 'white' : 'textDark'}
            text={item.name}
          />
          {item.getNotificationCount && (
            <div className="ml-auto">
              {item.getNotificationCount() > 0 && (
                <Badge className="text-white">
                  {item.getNotificationCount()}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
