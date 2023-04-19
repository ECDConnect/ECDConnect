import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';
import { InfantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { getInfantById } from '@/store/infant/infant.selectors';
import { VisitsTab } from './visits-tab';
import { Contact } from './contact';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import { Tooltip } from '@/components/walkthrough/tooltip';
import Joyride, { Step } from 'react-joyride';
import { useWalkthrough } from '@/context/walkthroughContext';
import {
  WalkthroughInfoPage,
  WalkthroughInfoPageProps,
} from '@/components/walkthrough/info-page';
import { contactSteps } from './contact/walkthrough/steps';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const InfantProfile: React.FC = () => {
  const [isInfoPage, setIsInfoPage] = useState(false);

  const {
    handleCallback,
    walkthroughDispatch,
    walkthroughState,
    walkthroughStepIndex,
  } = useWalkthrough();

  const { state } = useLocation<InfantProfileRouteState>();

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
      index: INFANT_PROFILE_TABS.VISITS,
      child: <VisitsTab />,
    },
    {
      title: 'Progress',
      initActive: false,
      index: INFANT_PROFILE_TABS.PROGRESS,
      child: <ProgressTab />,
    },
    {
      title: 'Referrals',
      initActive: false,
      index: INFANT_PROFILE_TABS.REFERRALS,
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
      index: INFANT_PROFILE_TABS.CONTACT,
      initActive: false,
      child: <Contact />,
    },
  ];

  const { steps, infoPageSection, hideJoyRideBorders, infoPageTitle } =
    useMemo((): {
      steps: Step[];
      infoPageTitle: string;
      infoPageSection: WalkthroughInfoPageProps['sectionName'];
      hideJoyRideBorders?: boolean;
    } => {
      switch (state?.activeTabIndex ?? 0) {
        case INFANT_PROFILE_TABS.CONTACT:
          return {
            steps: contactSteps,
            infoPageTitle: 'Contact',
            infoPageSection: 'contact tab',
            hideJoyRideBorders: walkthroughStepIndex === 3,
          };
        default:
          return {
            steps: [],
            infoPageSection: 'visit',
            infoPageTitle: 'Visit',
          };
      }
    }, [state?.activeTabIndex, walkthroughStepIndex]);

  const onHelp = useCallback(() => {
    setIsInfoPage(false);
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  }, [walkthroughDispatch]);

  const goBack = useCallback(() => {
    if (isInfoPage) {
      return setIsInfoPage(false);
    }

    return history.push(ROUTES.CLIENTS.ROOT);
  }, [history, isInfoPage]);

  return (
    <>
      <Joyride
        steps={steps}
        run={walkthroughState?.isTourActive}
        stepIndex={walkthroughStepIndex}
        callback={handleCallback}
        continuous={true}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            pollyInformationalSteps={[0, 2]}
            pollyNeutralSteps={[1]}
            pollyImpressedSteps={[3]}
            displayCloseButton={props.index < props.size - 1}
          />
        )}
        styles={getJoyrideStyles(hideJoyRideBorders)}
      />
      <BannerWrapper
        size="medium"
        renderBorder
        onBack={goBack}
        title={
          isInfoPage
            ? infoPageTitle
            : `${!!caregiverName ? caregiverName + ' &' : ''} ${infantName}`
        }
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp
        onHelp={() => setIsInfoPage(true)}
      >
        {isInfoPage ? (
          <WalkthroughInfoPage
            sectionName={infoPageSection}
            onHelp={onHelp}
            onClose={goBack}
          />
        ) : (
          <TabList
            tabClassName="min-w-0 w-24"
            className="bg-uiBg border-uiLight fixed z-20 w-full border-b"
            tabItems={tabItems}
            setSelectedIndex={state?.activeTabIndex ?? 0}
            tabSelected={(tab) =>
              history.push(location.pathname, { activeTabIndex: tab.index })
            }
          />
        )}
        <div id="walkthrough-last-step" className="w-full"></div>
      </BannerWrapper>
    </>
  );
};
