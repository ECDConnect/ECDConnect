import { useState, Fragment } from 'react';
import { classNames, renderIcon } from '../../utils';
import { Badge } from '../badge/badge';
import Divider from '../divider/divider';
import Typography from '../typography/typography';
import { NavigationDropdown, NavigationItem } from './side-menu.types';

export type NestedSubMenuProps = {
  item: NavigationDropdown;
  onNavigation: (item: NavigationItem) => void;
};

export default function NestedSubMenu({ item, onNavigation }) {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const handleOpenSubMenu = (v: any) => {
    setOpenSubMenu(!openSubMenu);
  };
  return (
    <div className="group items-center w-full">
      <Fragment key={item.name}>
        <div className={`group items-center w-full`}>
          {item.showDivider && (
            <Divider className="bg-primaryAccent1" dividerType="dashed" />
          )}
          <div
            onClick={handleOpenSubMenu}
            className={classNames(
              openSubMenu ? 'bg-secondaryAccent2 text-primary' : 'text-primary',
              'h-full flex flex-row items-center p-2.5 text-base font-medium rounded-lg cursor-pointer'
            )}
          >
            <div className={'w-1/12 items-center justify-center mr-4 '}>
              {item.icon && renderIcon(item.icon, 'flex-shrink-0 h-6 w-6')}
            </div>
            <Typography
              type={'h4'}
              color={openSubMenu ? 'primary' : 'textDark'}
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
      {openSubMenu &&
        item.nestedChildren.map((nested) => (
          <div
            key={nested.name}
            onClick={() => onNavigation(nested)}
            className="h-full flex flex-row items-center p-2.5 text-base font-medium rounded-lg cursor-pointer"
          >
            <div className={'w-1/12 items-center justify-center mr-4 '} />
            <Typography type={'help'} color={'textDark'} text={nested.name} />
          </div>
        ))}
    </div>
  );
}
