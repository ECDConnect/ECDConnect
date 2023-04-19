import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, TabItem, TabList, Typography } from '@ecdlink/ui';
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
import { capitalizeFirstLetter } from '@ecdlink/core';

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
      child: <Contact />,
    },
  ];

  const { steps, infoPageSection, hideJoyRideBorders } = useMemo((): {
    steps: Step[];
    infoPageSection: WalkthroughInfoPageProps['sectionName'];
    hideJoyRideBorders?: boolean;
  } => {
    switch (state?.activeTabIndex ?? 0) {
      case PREGNANT_PROFILE_TABS.CONTACT:
        return {
          steps: contactSteps,
          infoPageSection: 'contact',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      default:
        return { steps: [], infoPageSection: 'visit' };
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
            pollySteps={[0, 2]}
            pollyNeutralSteps={[1]}
            pollyImpressedSteps={[3]}
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
            ? capitalizeFirstLetter(infoPageSection)
            : `${mother?.user?.firstName || ''} ${
                !isLargeName ? mother?.user?.surname || '' : ''
              }'s profile`
        }
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp
        onHelp={() => setIsInfoPage(true)}
      >
        {isInfoPage ? (
          <WalkthroughInfoPage sectionName={infoPageSection} onHelp={onHelp} />
        ) : (
          <TabList
            tabClassName="min-w-0 w-24"
            className="bg-uiBg border-uiLight fixed z-20 w-full border-b"
            tabItems={tabItems}
            setSelectedIndex={state?.activeTabIndex ?? 0}
          />
        )}
        <div id="walkthrough-last-step" className="w-full"></div>
      </BannerWrapper>
    </>
  );
};
