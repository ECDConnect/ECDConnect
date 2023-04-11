import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import { InfantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { getInfantById } from '@/store/infant/infant.selectors';
import { MomActivityList } from '@/pages/mom/pregnant-profile/progress-tab/activity-list';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const InfantProfile: React.FC = () => {
  const { state } = useLocation<InfantProfileRouteState>();

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const isLargeName =
    (infant?.user?.firstName || '').length +
      (infant?.user?.surname || '').length >
    22;

  const tabItems: TabItem[] = [
    {
      title: 'Visits',
      initActive: true,
      child: (
        <Typography
          className={'mt-16 p-4'}
          type={'body'}
          color="textDark"
          text={'Coming soon'}
        />
      ),
    },
    {
      title: 'Progress',
      initActive: false,
      child: <ProgressTab />,
    },
    {
      title: 'Referrals',
      initActive: false,
      child: (
        <Typography
          className={'mt-16 p-4'}
          type={'body'}
          color="textDark"
          text={'Coming soon'}
        />
      ),
    },
    {
      title: 'Contact',
      initActive: false,
      child: (
        <Typography
          className={'mt-16 p-4'}
          type={'body'}
          color="textDark"
          text={'Coming soon'}
        />
      ),
    },
  ];

  const goBack = useCallback(
    () => history.push(ROUTES.CLIENTS.ROOT),
    [history]
  );

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${infant?.user?.firstName || ''} ${
        !isLargeName ? infant?.user?.surname || '' : ''
      }`}
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <TabList
        tabClassName="min-w-0 w-24"
        className="bg-uiBg border-uiLight fixed z-20 w-full border-b"
        tabItems={tabItems}
        setSelectedIndex={selectedTabIndex}
        tabSelected={(tab: TabItem, tabIndex: number) =>
          setSelectedTabIndex(tabIndex)
        }
      />
    </BannerWrapper>
  );
};
