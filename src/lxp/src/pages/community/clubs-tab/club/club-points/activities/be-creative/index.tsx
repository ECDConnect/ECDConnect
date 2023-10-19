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
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';

export const BeCreative: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const activityId = 'be-creative';

  const mockedPoints = 140;

  const items: Item[] = [
    {
      title: 'July',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e',
      alert: {
        title: 'Image uploaded, waiting for verification',
        type: 'info',
      },
    },
    {
      title: 'June',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e',
      rightChip: '+ 100',
      alert: {
        title: 'Image verified',
        type: 'success',
      },
    },
    {
      title: 'May',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e',
      rightChip: '+ 40',
      alert: {
        title: 'Image incomplete',
        type: 'warning',
      },
    },
    {
      title: 'April',
      rightChip: '+ 0',
      alert: {
        title: 'Not completed',
        type: 'error',
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
        imageUrl={paintPaletteIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        className="mt-5"
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
          title="This club has not submitted any be creative items yet this year!"
          subTitle=""
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
