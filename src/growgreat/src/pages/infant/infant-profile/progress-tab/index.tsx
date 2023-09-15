import {
  getInfantById,
  getInfantNearestPreviousVisitByOrderDate,
} from '@/store/infant/infant.selectors';
import { Button, LoadingSpinner } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { IntroScreen } from './activity-list/intro-screen';
import { useLayoutEffect, useMemo, useState } from 'react';
import { InfantProfileParams } from '../infant-profile.types';
import { RootState } from '@/store/types';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { useAppDispatch } from '@/store';
import { useWindowSize } from '@reach/window-size';
import { INFANT_PROFILE_TABS } from '..';
import { activitiesTypes } from './activity-list/activities-list';
import { FollowUpWalkthroughData } from './activity-list/forms/components/follow-up';
import { useWalkthrough } from '@/context/walkthroughContext';
import {
  VisitActions,
  getPreviousVisitInformationForInfant,
} from '@/store/visit/visit.actions';
import { visitThunkActions } from '@/store/visit';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

const HEADER_HEIGHT = 540;

export const ProgressTab = () => {
  const { walkthroughState, isWalkthroughSession } = useWalkthrough();

  const { height } = useWindowSize();

  const { id: infantId } = useParams<InfantProfileParams>();

  const { isLoading: isLoadingPreviousVisitData } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_INFANT_SUMMARY_BY_PRIORITY
  );

  const isLoading = isLoadingPreviousVisitData || isLoadingSummary;

  const appDispatch = useAppDispatch();

  const [isPrint, setIsPrint] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );
  const previousVisitData = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const previousVisitByOrderDate = useSelector(
    getInfantNearestPreviousVisitByOrderDate
  );

  const infantName = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const walkthroughData: FollowUpWalkthroughData = {
    progressBar: {
      message: `${infantName} need urgent support`,
      label: '3/7',
      value: 0,
      primaryColour: 'errorMain',
      secondaryColour: 'errorBg',
    },
    growCard: {
      comment: `${infantName} is not growing well`,
      color: 'error',
    },
    weightCard: {
      value: '4.2',
      color: 'Error',
      comment: 'Severely underweight',
    },
    infoCard: {
      error: [
        {
          comment: `${infantName} has a fever and is not feeding`,
          visitData: { visitName: activitiesTypes.pillar4 },
        },
      ],
    },
  };

  const handleCaptureClick = () => {
    setIsPrint((isPrint) => true);
  };

  useLayoutEffect(() => {
    if (isWalkthroughSession) {
      window.sessionStorage.clear();
      return;
    }
  }, [isWalkthroughSession]);

  useLayoutEffect(() => {
    history.push(location.pathname, {
      activeTabIndex: INFANT_PROFILE_TABS.PROGRESS,
    });
  }, [history, location.pathname]);

  useLayoutEffect(() => {
    if (previousVisitByOrderDate?.id && previousVisitByOrderDate?.attended) {
      appDispatch(
        getPreviousVisitInformationForInfant({
          visitId: previousVisitByOrderDate?.id,
        })
      );
      appDispatch(
        visitThunkActions.GetInfantSummaryByPriority({
          visitId: previousVisitByOrderDate?.id || '',
        })
      );
    } else {
    }
  }, [appDispatch, previousVisitByOrderDate]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="p-20"
      />
    );
  }

  return (
    <div
      className="pt-14"
      style={
        walkthroughState?.isTourActive ? {} : { height: height - HEADER_HEIGHT }
      }
    >
      <div>
        <IntroScreen
          infant={infant}
          walkthroughData={
            walkthroughState?.isTourActive ? walkthroughData : undefined
          }
          headerText={`${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${infantName}`}
          isPrint={isPrint}
          isFromProgressTab
        />
      </div>
      <div className="flex h-full flex-col gap-4 px-4">
        {!!previousVisitData?.visitDataStatus?.length ? (
          <>
            <Button
              className="mt-auto"
              type="filled"
              color="primary"
              textColor="white"
              text="Download client copy"
              icon="SaveIcon"
              onClick={handleCaptureClick}
            />
            <Button
              type="outlined"
              color="primary"
              textColor="primary"
              text="Manage referrals"
              icon="ClipboardListIcon"
              onClick={() =>
                history.push(location.pathname, {
                  activeTabIndex: INFANT_PROFILE_TABS.REFERRALS,
                })
              }
            />
          </>
        ) : (
          <Button
            className="mt-auto"
            type="filled"
            color="primary"
            textColor="white"
            text="See upcoming visits"
            icon="HomeIcon"
            onClick={() =>
              history.push(location.pathname, {
                activeTabIndex: INFANT_PROFILE_TABS.VISITS,
              })
            }
          />
        )}
      </div>
    </div>
  );
};
