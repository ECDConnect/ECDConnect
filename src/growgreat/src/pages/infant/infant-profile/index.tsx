import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ActionModal,
  BannerWrapper,
  DialogPosition,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';

import { InfantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { getInfantById } from '@/store/infant/infant.selectors';
import { VisitsTab } from './visits-tab';
import { useDialog } from '@ecdlink/core';
import { ReferralsTab } from './referrals-tab';
import { ContactTab } from './contact-tab';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const InfantProfile: React.FC = () => {
  const { state } = useLocation<InfantProfileRouteState>();

  const dialog = useDialog();

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const infantName = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const tabItems: TabItem[] = [
    {
      title: 'Visits',
      initActive: true,
      child: <VisitsTab />,
    },
    {
      title: 'Progress',
      initActive: false,
      child: <ProgressTab />,
    },
    {
      title: 'Referrals',
      initActive: false,
      child: <ReferralsTab />,
    },
    {
      title: 'Contact',
      initActive: false,
      child: <ContactTab />,
    },
  ];

  const onWalkThrough = (detailText?: string) => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            title="Hello!"
            detailText="Coming soon"
            customIcon={<PollyNeutral className="mb-3 h-24 w-24" />}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Ok',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'CheckCircleIcon',
                onClick: () => {
                  onClose();
                },
              },
            ]}
          />
        );
      },
    });
  };

  const goBack = useCallback(
    () => history.push(ROUTES.CLIENTS.ROOT),
    [history]
  );

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${!!caregiverName ? caregiverName + ' &' : ''} ${infantName}`}
      backgroundColour="white"
      displayOffline={!isOnline}
      displayHelp
      onHelp={onWalkThrough}
    >
      <TabList
        tabClassName="min-w-0 w-24"
        className="bg-uiBg border-uiLight fixed z-20 w-full border-b"
        tabItems={tabItems}
        setSelectedIndex={state?.activeTabIndex ?? 0}
      />
    </BannerWrapper>
  );
};
