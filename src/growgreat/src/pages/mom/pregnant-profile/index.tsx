import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getMotherById } from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import { PregnantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { Contact } from './contact';
import { useAppDispatch } from '@/store';
import { motherThunkActions } from '@/store/mother';
import { Visits } from './visits';
import { useWalkthrough } from '@/context/walkthroughContext';
import Joyride, { Step } from 'react-joyride';
import { contactSteps } from './contact/walkthrough/steps';
import { Tooltip } from '@/components/walkthrough/tooltip';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import {
  WalkthroughInfoPage,
  WalkthroughInfoPageProps,
} from '@/components/walkthrough/info-page';
import { visitSteps } from './visits/walkthrough/steps';
import { getStringFromClassNameOrId } from '@ecdlink/core';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as AwardIcon } from '@/assets/awardIcon.svg';
import { progressSteps } from './progress-tab/walkthrough/steps';
import { ReferralsTab } from './referrals-tab';

export const PREGNANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const PregnantProfile: React.FC = () => {
  const [isInfoPage, setIsInfoPage] = useState(false);

  const {
    handleCallback,
    walkthroughDispatch,
    walkthroughState,
    walkthroughStepIndex,
  } = useWalkthrough();

  const { state } = useLocation<PregnantProfileRouteState>();

  const appDispatch = useAppDispatch();

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
      index: PREGNANT_PROFILE_TABS.VISITS,
      initActive: true,
      child: <Visits />,
    },
    {
      title: 'Progress',
      index: PREGNANT_PROFILE_TABS.PROGRESS,
      initActive: false,
      child: <ProgressTab />,
    },
    {
      title: 'Referrals',
      initActive: false,
      child: <ReferralsTab />,
      index: PREGNANT_PROFILE_TABS.REFERRALS,
    },
    {
      title: 'Contact',
      index: PREGNANT_PROFILE_TABS.CONTACT,
      initActive: false,
      child: <Contact />,
    },
  ];

  const {
    steps,
    infoPageSection,
    infoPageTitle,
    hideJoyRideBorders,
    displayExtraComponent,
  } = useMemo((): {
    steps: Step[];
    infoPageTitle: string;
    infoPageSection: WalkthroughInfoPageProps['sectionName'];
    hideJoyRideBorders?: boolean;
    displayExtraComponent?: boolean;
  } => {
    switch (state?.activeTabIndex ?? 0) {
      case PREGNANT_PROFILE_TABS.CONTACT:
        return {
          steps: contactSteps,
          infoPageTitle: 'Contact',
          infoPageSection: 'contact tab',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      case PREGNANT_PROFILE_TABS.PROGRESS:
        return {
          steps: progressSteps,
          infoPageTitle: 'Client progress summary',
          infoPageSection: 'progress tab',
          hideJoyRideBorders: walkthroughStepIndex === 2,
        };
      default:
        return {
          steps: visitSteps,
          infoPageSection: 'mom visit tab',
          infoPageTitle: 'Pregnant mom client visits',
          hideJoyRideBorders: walkthroughStepIndex === 3,
          displayExtraComponent: true,
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

  useLayoutEffect(() => {
    (async () =>
      appDispatch(motherThunkActions.getMotherVisits({ motherId })).unwrap())();
  }, [appDispatch, motherId]);

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
            : `${mother?.user?.firstName || ''} ${
                !isLargeName ? mother?.user?.surname || '' : ''
              }'s profile`
        }
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp={!isInfoPage}
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
