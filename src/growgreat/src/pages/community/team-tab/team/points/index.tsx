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

export const TeamPoints = () => {
  const history = useHistory();

  const today = new Date();

  const activities = activityConstants.map(
    (activity): MenuListDataItem => ({
      showIcon: true,
      title: activity.name,
      titleStyle: 'text-textDark',
      menuIconUrl: activity.iconUrl,
      menuIconClassName: 'border-0',
      iconHexBackgroundColor: activity.iconHexBgColor,
      ...(activity.color
        ? { backgroundColor: activity.color }
        : { hexBackgroundColor: activity.hexColor }),
      subItem: '{points}',
      onActionClick: () => {},
    })
  );

  return (
    <BannerWrapper
      title="Points"
      subTitle="{clinicName}"
      renderBorder
      displayHelp
      onHelp={() => {}}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
      className="p-4 pt-6"
    >
      <Typography
        type="h2"
        text={`{clinicName} - points earned`}
        color="textDark"
      />
      <Typography
        type="h4"
        color="textMid"
        text={getCommunityQuarterDescription(today)}
      />
      <ScoreCard
        className="my-4"
        mainText={String(0)}
        hint="points"
        currentPoints={600}
        maxPoints={1000}
        barBgColour="uiLight"
        barColour="successMain"
        bgColour="uiBg"
        barSize="medium"
        barDivides={[
          { widthPercentage: 40 },
          { widthPercentage: 40 },
          { widthPercentage: 20 },
        ]}
        barStatusChip={{
          backgroundColour: 'primary',
          borderColour: 'primary',
          textColour: 'white',
          text: '{pointsBadge}',
        }}
        textColour="black"
      />
      <Alert
        type="info"
        message="Earn {points} more points to get to gold!"
        className="mb-4"
      />
      <Typography
        className="my-4"
        type="h3"
        text="Activities"
        color="textDark"
      />
      <StackedList
        className="flex flex-col gap-2"
        type={'MenuList' as StackedListType}
        listItems={activities}
      />
    </BannerWrapper>
  );
};
