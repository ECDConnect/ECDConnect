import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getMotherById } from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import { Visits } from './visits';
import { PregnantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';

export const PREGNANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const PregnantProfile: React.FC = () => {
  const { state } = useLocation<PregnantProfileRouteState>();

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(
    state?.activeTabIndex !== undefined ? state?.activeTabIndex : 0
  );

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const isLargeName =
    (mother?.user?.firstName || '').length +
      (mother?.user?.surname || '').length >
    22;

  const tabItems: TabItem[] = [
    {
      title: 'Visits',
      initActive: true,
      child: <Visits />,
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
      title={`${mother?.user?.firstName || ''} ${
        !isLargeName ? mother?.user?.surname || '' : ''
      }'s profile`}
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
