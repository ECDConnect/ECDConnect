import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';
import { InfantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { getInfantById } from '@/store/infant/infant.selectors';
import { VisitsTab } from './visits-tab';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import { Tooltip } from '@/components/walkthrough/tooltip';
import Joyride, { Step } from 'react-joyride';
import { useWalkthrough } from '@/context/walkthroughContext';
import {
  WalkthroughInfoPage,
  WalkthroughInfoPageProps,
} from '@/components/walkthrough/info-page';
import { contactSteps } from './contact-tab/walkthrough/steps';
import { ReferralsTab } from './referrals-tab';
import { ContactTab } from './contact-tab';
import { visitSteps } from './visits-tab/walkthrough/steps';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as AwardIcon } from '@/assets/awardIcon.svg';
import { getStringFromClassNameOrId, replaceBraces } from '@ecdlink/core';
import { progressSteps } from './progress-tab/walkthrough/steps';
import { infantThunkActions } from '@/store/infant';
import { useAppDispatch } from '@/store';
import { referralsSteps } from './referrals-tab/walkthrough/steps';

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
    setIsWalkthroughSession,
  } = useWalkthrough();

  const appDispatch = useAppDispatch();

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
      child: <ReferralsTab />,
    },
    {
      title: 'Contact',
      index: INFANT_PROFILE_TABS.CONTACT,
      initActive: false,
      child: <ContactTab />,
    },
  ];

  const {
    steps,
    infoPageSection,
    hideJoyRideBorders,
    infoPageTitle,
    displayExtraComponent,
  } = useMemo((): {
    steps: Step[];
    infoPageTitle: string;
    infoPageSection: WalkthroughInfoPageProps['sectionName'];
    hideJoyRideBorders?: boolean;
    displayExtraComponent?: boolean;
  } => {
    switch (state?.activeTabIndex ?? 0) {
      case INFANT_PROFILE_TABS.CONTACT:
        return {
          steps: contactSteps,
          infoPageTitle: 'Contact',
          infoPageSection: 'contact tab',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      case INFANT_PROFILE_TABS.PROGRESS:
        return {
          steps: progressSteps,
          infoPageTitle: 'Client progress summary',
          infoPageSection: 'progress tab',
          hideJoyRideBorders: walkthroughStepIndex === 2,
        };
      case INFANT_PROFILE_TABS.REFERRALS:
        return {
          steps: referralsSteps,
          infoPageTitle: 'Referrals',
          infoPageSection: 'referrals tab',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      default:
        return {
          steps: visitSteps,
          infoPageSection: 'child visit tab',
          infoPageTitle: 'Child client visits',
          hideJoyRideBorders: walkthroughStepIndex === 3,
          displayExtraComponent: true,
        };
    }
  }, [state?.activeTabIndex, walkthroughStepIndex]);

  const onHelp = useCallback(() => {
    setIsInfoPage(false);
    setIsWalkthroughSession('true');
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  }, [setIsWalkthroughSession, walkthroughDispatch]);

  const goBack = useCallback(() => {
    if (isInfoPage) {
      return setIsInfoPage(false);
    }

    return history.push(ROUTES.CLIENTS.ROOT);
  }, [history, isInfoPage]);

  useLayoutEffect(() => {
    (async () =>
      appDispatch(infantThunkActions.getInfantVisits({ infantId })).unwrap())();
  }, [appDispatch, infantId]);

  return (
    <>
      <Joyride
        steps={steps.map((item) => ({
          ...item,
          content: replaceBraces(String(item?.content), infantName || ''),
        }))}
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
            extraElement={
              displayExtraComponent ? (
                <SuccessCard
                  className="my-4"
                  customIcon={<AwardIcon className="h-14	w-14" />}
                  text={`You can earn points with every visit!`}
                  textColour="successDark"
                  color="successBg"
                />
              ) : (
                <></>
              )
            }
          />
        ) : (
          <TabList
            id={getStringFromClassNameOrId(visitSteps[0].target)}
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
