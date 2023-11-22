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
import { userSelectors } from '@/store/user';
import { Roles } from '@/constants/roles';

export const CompleteChildProgressReports: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();

  const isPractitioner = user?.roles?.some(
    (item) => item?.name === Roles.PRACTITIONER
  );
  const activityId = 'complete-child-progress-reports';

  const mockedPoints = 110;

  const items: Item[] = [
    {
      title: 'June',
      leftChip: '60%',
      rightChip: '+ 30',
      alert: {
        title: 'club members created progress reports for all children',
        type: 'warning',
      },
    },
    {
      title: 'May',
      leftChip: '100%',
      rightChip: '+ 80',
      alert: {
        title: 'club members met with caregivers to discuss child progress',
        type: 'success',
      },
    },
    {
      title: 'April',
      leftChip: '0%',
      rightChip: '+ 0',
      alert: {
        title: 'club members met with caregivers to discuss child progress',
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
        icon="DocumentReportIcon"
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
            club?.pointsTotal ? club?.pointsTotal : 0,
            club?.maxPointsTotal ? club?.maxPointsTotal : 0
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
          title="Points will become available from 1 August."
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
          history.push(
            isPractitioner
              ? ROUTES.PRACTITIONER.COMMUNITY.ROOT
              : ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
          )
        }
      />
    </BannerWrapper>
  );
};
