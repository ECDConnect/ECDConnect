import * as styles from './banner-wrapper.styles';
import { ArrowLeftIcon, XIcon, MenuIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { Colours, ComponentBaseProps } from '../../models';
import Typography from '../typography/typography';
import { classNames } from '../../utils/style-class.utils';
import { BannerHeaderSizes } from './models';
import { StatusChip } from '../../components/status-chip/status-chip';
import SideMenu from '../side-menu/side-menu';
import React, { useState } from 'react';

export interface BannerWrapperProps extends ComponentBaseProps {
  title?: string;
  subTitle?: string;
  avatar?: JSX.Element;
  color?: Colours;
  showBackground?: boolean;
  backgroundColour?: Colours;
  backgroundUrl?: string;
  backgroundImageColour?: Colours;
  size?: BannerHeaderSizes;
  renderBorder?: boolean;
  renderOverflow?: boolean;
  displayHelp?: boolean;
  displayOffline?: boolean;
  menuItems?: any[];
  menuLogoUrl?: string;
  titleOverrideRender?: () => React.ReactNode;
  notificationRender?: () => React.ReactNode;
  onNavigation?: (navItem: any) => void;
  onAvatarSelect?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  onHelp?: () => void;
  version?: string;
}

export const BannerWrapper: React.FC<BannerWrapperProps> = ({
  title,
  subTitle,
  avatar,
  showBackground = false,
  color = 'primary',
  size = 'normal',
  children,
  backgroundUrl,
  backgroundColour = 'transparent',
  className,
  renderBorder = false,
  renderOverflow = true,
  displayHelp = false,
  displayOffline = false,
  menuItems,
  menuLogoUrl = '',
  onAvatarSelect,
  notificationRender,
  titleOverrideRender,
  onNavigation = () => {},
  onBack,
  onClose,
  onHelp,
  version,
}) => {
  const showMenu = (menuItems?.length || 0) > 0;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={classNames(
        styles.backgroundWrapper,
        `bg-${backgroundColour}`,
        renderOverflow ? 'h-full' : ''
      )}
    >
      {showBackground && (
        <div className={styles.backgroundImageWrapper(size, color)}>
          <img className={styles.overlayImage} src={backgroundUrl} />
        </div>
      )}

      <div className={styles.header(showBackground, color, size, renderBorder)}>
        <div className={styles.iconWrapperLeft}>
          {onBack && (
            <ArrowLeftIcon className={styles.icons} width={25} height={30} onClick={onBack} />
          )}
          {showMenu && (
            <MenuIcon
              className={styles.icons}
              width={25}
              height={30}
              onClick={() => setSidebarOpen(true)}
            />
          )}
        </div>
        <div className={styles.titleWrapper}>
          {titleOverrideRender && titleOverrideRender()}
          {!titleOverrideRender &&
            (title ? (
              subTitle ? (
                <div className={styles.titleSubWrapper}>
                  <Typography
                    type="help"
                    text={title}
                    color={'white'}
                    className="overflow-auto w-full truncate"
                  />
                  <Typography type="small" text={subTitle} color={'white'} />
                </div>
              ) : (
                <Typography
                  type="body"
                  text={title}
                  color={'white'}
                  className="overflow-auto w-full truncate"
                />
              )
            ) : (
              <div className={styles.logo}></div>
            ))}
        </div>
        <div className={styles.iconWrapperRight}>
          {onClose && <XIcon className={styles.icons} width={25} height={30} onClick={onClose} />}
          {onHelp && displayHelp && (
            <QuestionMarkCircleIcon
              className={styles.icons}
              width={25}
              height={30}
              onClick={onHelp}
            />
          )}
          {notificationRender && (
            <div className={'flex items-center mr-5'}>{notificationRender()}</div>
          )}
          <div className="flex-shrink-0" onClick={onAvatarSelect && onAvatarSelect}>
            {avatar}
          </div>
        </div>
      </div>
      {displayOffline && (
        <StatusChip
          className={styles.backgroundWrapperOfflineBadge(renderBorder)}
          padding={'px-1 py-0'}
          textColour="alertMain"
          borderColour="uiMidDark"
          textType="small"
          backgroundColour="uiMidDark"
          text={'offline'}
        />
      )}
      <div className={classNames(styles.content(renderOverflow), className)}>
        {showMenu ? (
          <SideMenu
            version={version}
            logoUrl={menuLogoUrl}
            navigation={menuItems || []}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onNavigation={onNavigation}
          >
            {children}
          </SideMenu>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default BannerWrapper;
