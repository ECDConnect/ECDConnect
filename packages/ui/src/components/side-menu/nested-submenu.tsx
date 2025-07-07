import { useState, Fragment } from 'react';
import { classNames, renderIcon } from '../../utils';
import { Badge } from '../badge/badge';
import Divider from '../divider/divider';
import Typography from '../typography/typography';
import { NavigationDropdown, NavigationItem } from './side-menu.types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

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
    <div className="group w-full items-center">
      <Fragment key={item.name}>
        <div className={`group w-full items-center`}>
          {item.showDivider && <Divider dividerType="dashed" />}
          <div
            onClick={handleOpenSubMenu}
            className={classNames(
              openSubMenu ? 'bg-quatenaryBg text-primary' : 'text-primary',
              'flex h-full cursor-pointer flex-row items-center rounded-lg p-2.5 text-base font-medium'
            )}
          >
            <div className={'mr-4 w-1/12 items-center justify-center '}>
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
            {openSubMenu ? (
              <ChevronUpIcon className="ml-auto h-6 w-6" />
            ) : (
              <ChevronDownIcon className="ml-auto h-6 w-6" />
            )}
          </div>
        </div>
      </Fragment>
      {openSubMenu &&
        item.nestedChildren.map((nested) => {
          if (nested?.hideItem) {
            return null;
          } else
            return (
              <div
                key={nested.name}
                onClick={() => onNavigation(nested)}
                className="flex h-full cursor-pointer flex-row items-center rounded-lg p-2.5 text-base font-medium"
              >
                <div className={'mr-4 w-1/12 items-center justify-center '} />
                <Typography
                  type={'help'}
                  color={'textDark'}
                  text={nested.name}
                />
              </div>
            );
        })}
    </div>
  );
}
