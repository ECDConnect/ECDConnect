import { MaxIndividualPoints } from '@/constants/Community';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { getIndividualPointsUIDetails } from '@/utils/community/individual-points';
import { BannerWrapper, Button, ScoreCard, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { ComparativeMessage } from '../components/comparative-message';
import { PointsMonthSummary } from '../components/points-month-summary';
import { useSelector } from 'react-redux';
import {
  getHealthCareWorkerAllPointsDetailsSplittedPerMonthSelector,
  getHealthCareWorkerTotalPointsSelector,
} from '@/store/healthCareWorker/healthCareWorker.selectors';
import { useState } from 'react';
import { communitySelectors } from '@/store/community';
import { useSnackbar } from '@ecdlink/core';
import { LeaderProfileRouteState } from '@/pages/community/team-tab/team/members/leader-profile/types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CommunityActions } from '@/store/community/community.actions';
import { PointsShare } from '../components/points-share';

export const IndividualPointsYearView = () => {
  const [isDownloadPointsShare, setIsDownloadPointsShare] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(1);

  const history = useHistory();

  const today = new Date();

  const { isOnline } = useOnlineStatus();

  const { showMessage } = useSnackbar();

  const { isLoading } = useThunkFetchCall(
    'community',
    CommunityActions.GET_CLINIC_BY_ID
  );

  const clinicDetails = useSelector(communitySelectors.getClinicSelector);
  const pointsDetailsPerMonth = useSelector(
    getHealthCareWorkerAllPointsDetailsSplittedPerMonthSelector()
  );
  const totalPoints = useSelector(getHealthCareWorkerTotalPointsSelector);

  const individualPointsUIDetails = getIndividualPointsUIDetails(
    totalPoints,
    'year'
  );

  const onSeeMonths = () => {
    if (monthsToShow < pointsDetailsPerMonth.length) {
      setMonthsToShow(monthsToShow + 1);
    } else {
      setMonthsToShow(monthsToShow - 1);
    }
  };

  const onTeamLeader = () => {
    if (clinicDetails?.teamLeads?.length) {
      history.push(
        ROUTES.COMMUNITY.TEAM.MEMBERS.LEADER_PROFILE.replace(
          ':leaderId',
          clinicDetails?.teamLeads?.[0]?.id
        ),
        { isFromIndividualPointsYearView: true } as LeaderProfileRouteState
      );
    } else {
      showMessage({ message: 'No team leader found', type: 'error' });
    }
  };

  const onShare = () => {
    setIsDownloadPointsShare(true);
    setTimeout(() => {
      setIsDownloadPointsShare(false);
    }, 1000);
  };

  return (
    <>
      <BannerWrapper
        displayOffline={!isOnline}
        renderBorder
        size="small"
        title="Points"
        subTitle={today.getFullYear().toString()}
        onBack={() => history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.ROOT)}
        className="flex flex-col p-4 pt-6"
      >
        <Typography type="h2" text={`Points ${today.getFullYear()}`} />
        <ScoreCard
          className="my-4"
          mainText={String(totalPoints ?? 0)}
          hint="points"
          currentPoints={totalPoints}
          maxPoints={MaxIndividualPoints.PerYear}
          barBgColour="uiLight"
          barColour={individualPointsUIDetails.mainColour}
          bgColour="uiBg"
          barSize="medium"
          textColour="black"
        />
        <ComparativeMessage viewMode="year" />
        {!!pointsDetailsPerMonth?.length && (
          <Typography
            className="mt-6"
            type="h3"
            text="What you earned points for:"
          />
        )}
        {pointsDetailsPerMonth?.slice(0, monthsToShow)?.map((points, index) => (
          <PointsMonthSummary key={index} points={points} />
        ))}
        {pointsDetailsPerMonth?.length > 1 && (
          <Button
            className="mt-4"
            icon="EyeIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text={`See ${
              monthsToShow === pointsDetailsPerMonth?.length ? 'fewer' : 'more'
            } months`}
            onClick={onSeeMonths}
          />
        )}

        <div className={`mt-auto flex flex-col gap-4 pt-8`}>
          {pointsDetailsPerMonth?.length ? (
            <Button
              icon="ShareIcon"
              type="filled"
              textColor="white"
              color="primary"
              text="Share"
              isLoading={isDownloadPointsShare}
              disabled={isDownloadPointsShare}
              onClick={onShare}
            />
          ) : (
            <>
              <Button
                icon="LightBulbIcon"
                type="filled"
                textColor="white"
                color="primary"
                text="Find out how you can earn points"
                onClick={() =>
                  history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.INFO_PAGE)
                }
              />
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                icon="ChatAltIcon"
                type="outlined"
                textColor="primary"
                color="primary"
                text="Ask your team leader for help"
                onClick={onTeamLeader}
              />
            </>
          )}
        </div>
      </BannerWrapper>
      {isDownloadPointsShare && <PointsShare viewMode="year" />}
    </>
  );
};
