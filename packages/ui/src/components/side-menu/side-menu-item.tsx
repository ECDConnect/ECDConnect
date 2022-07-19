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
      <div className={`group items-center w-full`}>
        {item.showDivider && (
          <Divider className="bg-primaryAccent1" dividerType="dashed" />
        )}
        <div
          onClick={() => onNavigation(item)}
          className={classNames(
            item.current ? 'text-white bg-primary' : 'text-primary',
            'h-full flex flex-row items-center p-2.5 text-base font-medium rounded-lg cursor-pointer'
          )}
        >
          <div className={'w-1/12 items-center justify-center mr-4 '}>
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
