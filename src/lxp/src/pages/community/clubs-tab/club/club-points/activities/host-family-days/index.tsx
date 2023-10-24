import {
  BannerWrapper,
  Button,
  Divider,
  EmptyPage,
  ScoreCard,
} from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { isCurrentPointsAtLeast80PercentOfTotal } from '../../../individual-club-view';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import familyIcon from '@/assets/icon/family.svg';
import { formatStringWithFirstLetterCapitalized } from '@ecdlink/core';
import { HostFamilyDaysRouteState } from './index.types';
import { userSelectors } from '@/store/user';
import { Roles } from '@/constants/roles';

export const HostFamilyDays: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const history = useHistory();
  const location = useLocation<HostFamilyDaysRouteState>();

  const isFromAddFamilyDayEvent = location?.state?.isFromAddFamilyDayEvent;
  const isPractitioner = user?.roles?.some(
    (item) => item?.name === Roles.PRACTITIONER
  );

  const activityId = 'host-family-days';

  const mockedPoints = 200;

  const items: Item[] = [
    {
      title: 'Term 3: August to October',
      subTitle: 'Open Day',
      descriptionLabel: 'Description',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e',
      rightChip: '+ 100',
      alert: {
        title: 'Attendance register uploaded',
        type: 'success',
      },
    },
    {
      title: 'Term 2: May to July',
      rightChip: '+ 0',
      alert: {
        title: 'Not completed',
        type: 'error',
      },
    },
    {
      title: 'Term 1: January to April',
      subTitle: 'Open Day',
      descriptionLabel: 'Description',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore e',
      rightChip: '+ 100',
      alert: {
        title: 'Attendance register uploaded',
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
      onBack={() =>
        isFromAddFamilyDayEvent
          ? history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT)
          : history.goBack()
      }
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
        imageUrl={familyIcon}
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
          {items.map((item, index) => (
            <>
              {index !== 0 && <Divider dividerType="dashed" className="mb-4" />}
              <AlertCard item={item} />
            </>
          ))}
        </div>
      ) : (
        <EmptyPage
          image={AlienImage}
          title="This club has not submitted any family days yet this year!"
          subTitle=""
        />
      )}
      {/* TODO: check real rule to show this button */}
      {isFromAddFamilyDayEvent && (
        <Button
          className="mt-auto mb-4"
          icon="PlusCircleIcon"
          type="filled"
          textColor="white"
          color="primary"
          text="Add an event"
          onClick={() =>
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.FAMILY_DAY_EVENT.ADD_EVENT
            )
          }
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
