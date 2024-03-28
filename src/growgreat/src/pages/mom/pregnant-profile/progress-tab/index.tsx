import { motherSelectors } from '@/store/mother';
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { PregnantProfileParams } from '../index.types';
import { IntroScreen } from './activity-list/intro-screen';
import { RootState } from '@/store/types';
import { PREGNANT_PROFILE_TABS } from '..';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { Button, LoadingSpinner } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { activitiesTypes } from './activity-list/activities-list';
import { FollowUpWalkthroughData } from './activity-list/forms/components/follow-up';
import { useWalkthrough } from '@/context/walkthroughContext';
import { visitThunkActions } from '@/store/visit';
import {
  getMotherNearestPreviousVisitByOrderDate,
  getMotherCurrentVisitSelector,
} from '@/store/mother/mother.selectors';

const HEADER_HEIGHT = { filled: 470, empty: 540 };

export const ProgressTab = () => {
  const { walkthroughState, isWalkthroughSession } = useWalkthrough();

  const { height } = useWindowSize();

  const appDispatch = useAppDispatch();

  const [isPrint, setIsPrint] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const { id: pregnantId } = useParams<PregnantProfileParams>();

  const { isLoading: isLoadingPreviousVisitData } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MOTHER_SUMMARY_BY_PRIORITY
  );

  const isLoading = isLoadingPreviousVisitData || isLoadingSummary;

  const mother = useSelector((state: RootState) =>
    motherSelectors.getMotherById(state, pregnantId)
  );

  const currentVisit = useSelector((state: RootState) =>
    getMotherCurrentVisitSelector(state, '')
  );

  const previousVisitData = useSelector(
    getPreviousVisitInformationForMotherSelector
  );

  const previousVisitByOrderDate = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const walkthroughData: FollowUpWalkthroughData = {
    progressBar: {
      message: `${mother?.user?.firstName} is doing well!`,
      label: '6/6',
      value: 100,
      primaryColour: 'successMain',
      secondaryColour: 'successBg',
    },
    infoCard: {
      success: [
        {
          comment: `No danger signs for ${mother?.user?.firstName}`,
          visitData: { visitName: activitiesTypes.dangerSigns },
        },
      ],
    },
  };

  const handleCaptureClick = () => {
    setIsPrint(true);
  };

  useLayoutEffect(() => {
    if (isWalkthroughSession) {
      window.sessionStorage.clear();
      return;
    }
  }, [appDispatch, isWalkthroughSession]);

  useLayoutEffect(() => {
    history.push(location.pathname, {
      activeTabIndex: PREGNANT_PROFILE_TABS.PROGRESS,
    });
  }, [history, location.pathname]);

  useLayoutEffect(() => {
    if (previousVisitByOrderDate?.id && previousVisitByOrderDate?.attended) {
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForMother({
          visitId: previousVisitByOrderDate.id,
        })
      );
      appDispatch(
        visitThunkActions.GetMotherSummaryByPriority({
          visitId: previousVisitByOrderDate.id,
        })
      );
    }
  }, [appDispatch, previousVisitByOrderDate]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="pt-20"
        size="medium"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
      />
    );
  }

  return (
    <div
      className="pt-14"
      style={
        walkthroughState?.isTourActive
          ? {}
          : {
              height:
                height -
                (!!previousVisitData?.visitDataStatus?.length
                  ? HEADER_HEIGHT.filled
                  : HEADER_HEIGHT.empty),
            }
      }
    >
      <div>
        <IntroScreen
          mother={mother}
          walkthroughData={
            walkthroughState?.isTourActive ? walkthroughData : undefined
          }
          headerText={mother?.user?.firstName}
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
                  activeTabIndex: PREGNANT_PROFILE_TABS.REFERRALS,
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
                activeTabIndex: PREGNANT_PROFILE_TABS.VISITS,
              })
            }
          />
        )}
      </div>
    </div>
  );
};
