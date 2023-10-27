import { BannerWrapper, Button, EmptyPage, ScoreCard } from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { AlertCard, Item } from '../0-components/alert-card';
import { Header } from '../0-components/header';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import {
  formatStringWithFirstLetterCapitalized,
  useSnackbar,
} from '@ecdlink/core';
import { BeCreativeRouteState } from './index.types';
import { userSelectors } from '@/store/user';
import { Roles } from '@/constants/roles';
import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import {
  ClubActions,
  getActivityBeCreativeDetails,
} from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { getScoreBarColor } from '@/pages/community/clubs-tab/index.filters';

export const BeCreative: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityBeCreativeDetailsSelector
  );

  const history = useHistory();

  const location = useLocation<BeCreativeRouteState>();

  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_BE_CREATIVE_DETAILS
  );

  const isPractitioner = user?.roles?.some(
    (item) => item?.name === Roles.PRACTITIONER
  );
  const isFromAddCollageEvent = location?.state?.isFromAddCollageEvent;

  const activityId = 'be-creative';

  // TODO: add real value (waiting for backend)
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

  useEffect(() => {
    appDispatch(
      getActivityBeCreativeDetails({
        clubId,
      })
    );
  }, [appDispatch, clubId]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage(error);
    }
  }, [error, isRejected, showMessage, isLoading, wasLoading]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() =>
        isFromAddCollageEvent
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
        imageUrl={paintPaletteIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
      />
      <ScoreCard
        className="mt-5"
        mainText={String(details?.points ?? 0)}
        hint="points"
        currentPoints={details?.points || 18}
        maxPoints={800}
        barBgColour="uiLight"
        barColour={getScoreBarColor(details?.points ?? 0, 600, 599)}
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
      {isFromAddCollageEvent && (
        <Button
          className="mt-auto mb-4"
          icon="PlusCircleIcon"
          type="filled"
          textColor="white"
          color="primary"
          text="Add image to {month}"
          onClick={() =>
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.COLLAGE_EVENT.ADD_EVENT
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
