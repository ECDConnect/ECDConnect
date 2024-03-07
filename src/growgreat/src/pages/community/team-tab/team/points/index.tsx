import ROUTES from '@/routes/routes';
import { getCommunityQuarterDescription } from '@/utils/community/community-quartes.utils';
import {
  Alert,
  BannerWrapper,
  MenuListDataItem,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { activities as activityConstants } from './constants';
import { formatTextToSlug } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { communitySelectors } from '@/store/community';
import {
  calculateTierPercentages,
  getTierDetails,
} from '@/utils/community/league-position';
import { LeagueType } from '@/constants/Community';
import { ActivityDetailsState } from './activity-details/index.types';
import { TeamTabState } from '../../types';

export const TeamPoints = () => {
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const history = useHistory();

  const today = new Date();

  const { quarterDescription } = getCommunityQuarterDescription(today);

  const { tierName, tierColor, pointsToNextTier, nextTier } = getTierDetails(
    (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League,
    clinicDetails?.points?.pointsTotal ?? 0
  );

  const { bronzePercentage, silverPercentage, goldPercentage } =
    calculateTierPercentages(
      (clinicDetails?.league?.leagueTypeName as LeagueType) ?? LeagueType.League
    );

  const activities = activityConstants.map((activity): MenuListDataItem => {
    const points =
      clinicDetails?.points?.points?.find(
        (point) => point.pointsCategoryId === activity.id
      )?.pointsTotal ?? 0;

    return {
      showIcon: true,
      title: activity.name,
      titleStyle: 'text-textDark',
      menuIconUrl: activity.iconUrl,
      menuIconClassName: 'border-0',
      iconHexBackgroundColor: activity.iconHexBgColor,
      ...(activity.color
        ? { backgroundColor: activity.color }
        : { hexBackgroundColor: activity.hexColor }),
      subItem: String(points),
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.TEAM.POINTS.ACTIVITY_DETAILS.replace(
            ':activitySlug',
            formatTextToSlug(activity.name)
          ),
          { currentPoints: points } as ActivityDetailsState
        ),
    };
  });

  return (
    <BannerWrapper
      title="Points"
      subTitle={clinicDetails?.name}
      renderBorder
      displayHelp
      onHelp={() => history.push(ROUTES.COMMUNITY.TEAM.INFO_PAGE)}
      onBack={() =>
        history.push(ROUTES.COMMUNITY.ROOT, {
          forceReload: false,
        } as TeamTabState)
      }
      className="p-4 pt-6"
    >
      <Typography
        type="h2"
        text={`${clinicDetails?.name} - points earned`}
        color="textDark"
      />
      <Typography type="h4" color="textMid" text={quarterDescription} />
      <ScoreCard
        className="my-4"
        mainText={String(clinicDetails?.points?.pointsTotal ?? 0)}
        hint="points"
        currentPoints={clinicDetails?.points?.pointsTotal ?? 0}
        maxPoints={clinicDetails?.points?.maxPointsTotal ?? 0}
        barBgColour="uiLight"
        barColour={tierColor}
        bgColour="uiBg"
        barSize="medium"
        barDivides={[
          { widthPercentage: bronzePercentage },
          { widthPercentage: silverPercentage },
          { widthPercentage: goldPercentage },
        ]}
        barStatusChip={{
          backgroundColour: 'primary',
          borderColour: 'primary',
          textColour: 'white',
          text: tierName,
        }}
        textColour="black"
      />
      {!!nextTier && (
        <Alert
          type="info"
          message={`Earn ${pointsToNextTier} more points to get to ${nextTier.toLowerCase()}!`}
          className="mb-4"
        />
      )}
      <Typography
        className="my-4"
        type="h3"
        text="Activities"
        color="textDark"
      />
      <StackedList
        isFullHeight={false}
        className="flex flex-col gap-2"
        type={'MenuList' as StackedListType}
        listItems={activities}
      />
    </BannerWrapper>
  );
};
