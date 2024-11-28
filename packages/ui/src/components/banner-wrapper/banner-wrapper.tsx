import * as styles from './banner-wrapper.styles';
import {
  ArrowLeftIcon,
  XIcon,
  MenuAlt2Icon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import { Colours, ComponentBaseProps } from '../../models';
import Typography from '../typography/typography';
import { classNames } from '../../utils/style-class.utils';
import { BannerHeaderSizes } from './models';
import { StatusChip } from '../../components/status-chip/status-chip';
import SideMenu from '../side-menu/side-menu';
import React, { useState } from 'react';
import LoadingSpinner from '../loading-spinner/loading-spinner';

export interface BannerWrapperProps extends ComponentBaseProps {
  contentRef?: React.RefObject<HTMLDivElement>;
  title?: string;
  subTitle?: string;
  avatar?: JSX.Element;
  color?: Colours;
  isLoading?: boolean;
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
  calendarRender?: () => React.ReactNode;
  onNavigation?: (navItem: any) => void;
  onAvatarSelect?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  onHelp?: () => void;
  version?: string;
  helpId?: string;
  hasDecoratedBackButton?: boolean;
  children?: any;
}

export const BannerWrapper = React.forwardRef<
  HTMLDivElement,
  BannerWrapperProps
>((props, ref) => {
  const {
    contentRef,
    title,
    subTitle,
    avatar,
    isLoading,
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
    calendarRender,
    titleOverrideRender,
    onNavigation = () => {},
    onBack,
    onClose,
    onHelp,
    version,
    id,
    helpId,
    style,
    hasDecoratedBackButton,
  } = props;

  const showMenu = (menuItems?.length || 0) > 0;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      id={id}
      className={classNames(
        styles.backgroundWrapper,
        `bg-${backgroundColour}`,
        renderOverflow ? 'h-full' : ''
      )}
      style={style}
    >
      {showBackground && (
        <div className={styles.backgroundImageWrapper(size, color)}>
          <img className={styles.overlayImage} src={backgroundUrl} />
        </div>
      )}

      <div className={styles.header(showBackground, color, size, renderBorder)}>
        <div className={styles.iconWrapperLeft}>
          {onBack && !hasDecoratedBackButton && (
            <ArrowLeftIcon
              className={styles.icons}
              width={25}
              height={30}
              onClick={onBack}
            />
          )}
          {onBack && hasDecoratedBackButton && (
            <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
              <ArrowLeftIcon
                className={styles.icons}
                width={25}
                height={30}
                onClick={onBack}
              />
            </div>
          )}
          {showMenu && (
            <MenuAlt2Icon
              className={classNames(styles.menuIcons)}
              width={25}
              height={30}
              onClick={() => setSidebarOpen(true)}
            />
          )}
        </div>

        {titleOverrideRender && titleOverrideRender()}
        {!titleOverrideRender &&
          (title ? (
            subTitle ? (
              <div className={styles.titleWrapper}>
                <div className={styles.titleSubWrapper}>
                  <Typography
                    type="h4"
                    text={title}
                    color={'white'}
                    className="w-full overflow-auto truncate"
                  />
                  <Typography
                    type="help"
                    text={subTitle}
                    color={'primaryAccent2'}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.titleWrapper}>
                <Typography
                  type="h4"
                  text={title}
                  color={'white'}
                  className="w-full overflow-auto truncate"
                />
              </div>
            )
          ) : (
            <div className={styles.logo}></div>
          ))}
        <div className={styles.iconWrapperRight}>
          {onClose && (
            <XIcon
              className={styles.icons}
              width={25}
              height={30}
              onClick={onClose}
            />
          )}
          {onHelp && displayHelp && (
            <QuestionMarkCircleIcon
              id={helpId}
              className={styles.icons}
              width={25}
              height={30}
              onClick={onHelp}
            />
          )}
          {calendarRender && (
            <div className={'mr-5 flex items-center'}>{calendarRender()}</div>
          )}
          {notificationRender && (
            <div className={'mr-5 flex items-center'}>
              {notificationRender()}
            </div>
          )}
          <div className="flex-shrink-0" onClick={onAvatarSelect}>
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
      {isLoading ? (
        <LoadingSpinner
          size="medium"
          className="mt-4"
          spinnerColor="quatenary"
          backgroundColor="uiBg"
        />
      ) : (
        <div
          ref={contentRef}
          className={classNames(styles.content(renderOverflow), className)}
        >
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
      )}
    </div>
  );
});

export default BannerWrapper;
