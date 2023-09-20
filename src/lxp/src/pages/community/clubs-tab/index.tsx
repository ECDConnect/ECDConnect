import AlienImage from '@/assets/ECD_Connect_alien.svg';
import ROUTES from '@/routes/routes';
import {
  AlertSeverityType,
  EmptyPage,
  FADButton,
  LoadingSpinner,
  StackedList,
  StackedListType,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { mockedClub } from './club/individual-club-view';
import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { ClubActions, getAllClubsForCoach } from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { clubSelectors } from '@/store/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSnackbar } from '@ecdlink/core';

export const ClubsTab = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);
  const clubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ALL_CLUBS_FOR_COACH
  );
  const { showMessage } = useSnackbar();

  const listItems: UserAlertListDataItem[] =
    clubs?.map((club) => ({
      id: club?.id ?? '',
      avatarColor: 'var(--primaryAccent2)',
      iconColor: 'primary',
      alertSeverity:
        (club?.secondaryTextColor?.toLocaleLowerCase() as AlertSeverityType) ??
        'none',
      title: club?.name ?? '',
      profileText: club?.name ?? '',
      subTitle: club?.secondaryText ?? '',
      onActionClick() {
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', club?.id));
      },
    })) ?? [];

  const isEmptyState = !clubs?.length;

  useEffect(() => {
    if (user?.id) {
      appDispatch(getAllClubsForCoach({ userId: user?.id }));
    }
  }, [appDispatch, user?.id]);

  useEffect(() => {
    if (wasLoading && isRejected) {
      showMessage({ message: error, type: 'error' });
    }
  }, [error, isRejected, showMessage, wasLoading]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-6"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  return (
    <div className="p-4 text-black">
      {isEmptyState ? (
        <EmptyPage
          image={AlienImage}
          title="You don’t have any clubs yet!"
          subTitle="Add a new club or, if you already have clubs, please reach out to your franchisor to make sure they have been assigned to you on Funda App."
        />
      ) : (
        <StackedList
          type={'UserAlertList' as StackedListType}
          listItems={listItems}
          className="flex flex-col gap-2"
        />
      )}
      <FADButton
        title="Add a new club"
        icon="PlusIcon"
        iconDirection="left"
        textToggle
        type="filled"
        color="primary"
        shape="round"
        className="absolute bottom-1 right-1 z-10 m-3 px-3.5 py-2.5"
        click={() =>
          history.push(
            ROUTES.COMMUNITY.CLUB.ADD.replace(':clubId', mockedClub.id)
          )
        }
      />
    </div>
  );
};
