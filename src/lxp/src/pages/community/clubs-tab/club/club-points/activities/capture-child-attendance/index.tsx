import { BannerWrapper, Button, EmptyPage, ScoreCard } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../../../individual-club-view';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';

export const CaptureChildAttendance: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const activityId = 'capture-child-attendance';

  const mockedPoints = 240;

  const items: Item[] = [
    {
      title: 'June',
      rightChip: '+ 60',
      alert: {
        title: 'club members submitted all registers',
        type: 'warning',
      },
    },
    {
      title: 'May',
      rightChip: '+ 80',
      alert: {
        title: 'club members submitted all registers',
        type: 'success',
      },
    },
    {
      title: 'April',
      rightChip: '+ 100',
      alert: {
        title: 'club members submitted all registers',
        type: 'success',
      },
    },
  ];

  // TODO: add real value
  const hasItems = true;

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayHelp
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP.replace(':clubId', clubId).replace(
            ':activityId',
            activityId
          )
        )
      }
    >
      <Header
        // TODO: change to activity date
        date={new Date()}
        icon="ClipboardCheckIcon"
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        mainText={String(mockedPoints)}
        hint="points"
        currentPoints={mockedPoints}
        maxPoints={800}
        barBgColour="uiLight"
        barColour={
          isCurrentPointsAtLeast80PercentOfTotal(
            club?.totalClubPoints || 0,
            club?.maxClubPoints || 0
          )
            ? 'successMain'
            : 'secondary'
        }
        bgColour="uiBg"
        textColour="black"
      />
      {hasItems ? (
        <div className="mt-5">
          {items.map((item) => (
            <AlertCard item={item} />
          ))}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="No attendance items to show yet this year."
          subTitle="You will be able to see the April summary by 1 May."
        />
      )}
      <Button
        className="mt-auto"
        icon="ArrowCircleLeftIcon"
        type="outlined"
        textColor="primary"
        color="primary"
        text="Back to club"
        onClick={() =>
          history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId))
        }
      />
    </BannerWrapper>
  );
};
