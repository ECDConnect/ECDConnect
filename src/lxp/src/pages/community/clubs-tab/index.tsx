import AlienImage from '@/assets/ECD_Connect_alien.svg';
import ROUTES from '@/routes/routes';
import {
  AlertSeverityType,
  EmptyPage,
  FADButton,
  LoadingSpinner,
  SearchDropDown,
  SearchDropDownOption,
  StackedList,
  StackedListType,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useAppDispatch } from '@/store';
import { useEffect, useMemo, useState } from 'react';
import {
  ClubActions,
  getAllClubsDetailsForCoach,
  getAllClubsForCoach,
} from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { clubSelectors } from '@/store/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSnackbar } from '@ecdlink/core';
import SearchHeader from '@/components/search-header/search-header';
import {
  filterClubsByLeagueType,
  searchList,
  sortByOptions,
  sortClubBy,
  typeFilterOptions,
} from './index.filters';
import { CommunityRouteState } from '../community.types';

export const ClubsTab = () => {
  const [type, setType] = useState<SearchDropDownOption<string>[]>([]);
  const [sortBy, setSortBy] = useState<SearchDropDownOption<string>[]>([]);
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);

  const history = useHistory();
  const location = useLocation<CommunityRouteState>();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);
  const clubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ALL_CLUBS_FOR_COACH
  );
  const { showMessage } = useSnackbar();

  const filteredList = useMemo(() => {
    let list = clubs ?? [];

    list = filterClubsByLeagueType(list, type?.[0]?.value);
    list = sortClubBy(list, sortBy?.[0]?.value);

    if (searchTextActive) {
      list = searchList(clubs ?? [], search);
    }

    return list;
  }, [clubs, search, searchTextActive, sortBy, type]);

  const listItems: UserAlertListDataItem[] =
    filteredList?.map((club) => ({
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
        appDispatch(
          getAllClubsDetailsForCoach({
            userId: user?.id ?? '',
            clubId: club?.id,
          })
        ).unwrap();
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', club?.id));
      },
    })) ?? [];

  const isEmptyState = !clubs?.length;

  useEffect(() => {
    if (user?.id && location?.state?.isFromDashboard) {
      appDispatch(getAllClubsForCoach({ userId: user?.id }));
    }
  }, [appDispatch, location?.state?.isFromDashboard, user?.id]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      }

      // Clear the state to avoid dispatching the query to get clubs all the time
      history.replace(location.pathname, null);
    }
  }, [
    error,
    history,
    isLoading,
    isRejected,
    location.pathname,
    showMessage,
    wasLoading,
  ]);

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
    <>
      {!isEmptyState && (
        <SearchHeader<UserAlertListDataItem>
          searchItems={listItems}
          onSearchChange={setSearch}
          isTextSearchActive={searchTextActive}
          onBack={() => setSearchTextActive(false)}
          onSearchButtonClick={() => setSearchTextActive(true)}
        >
          <SearchDropDown<string>
            displayMenuOverlay
            menuItemClassName="w-11/12 left-4"
            className="mr-1"
            options={typeFilterOptions}
            selectedOptions={type}
            onChange={setType}
            placeholder="Type"
            color="secondary"
            info={{
              name: 'Filter by: Type',
            }}
          />
          <SearchDropDown<string>
            displayMenuOverlay
            menuItemClassName="w-11/12 left-4"
            className={'mr-1'}
            options={sortByOptions}
            selectedOptions={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            color="secondary"
            info={{
              name: 'Sort by',
            }}
          />
        </SearchHeader>
      )}
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
            history.push(ROUTES.COMMUNITY.CLUB.ADD.replace(':clubId', 'new'))
          }
        />
      </div>
    </>
  );
};
