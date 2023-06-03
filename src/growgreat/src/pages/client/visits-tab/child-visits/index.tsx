import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfantsWeeklyVisitsSelector } from '@/store/infant/infant.selectors';
import {
  BannerWrapper,
  StackedList,
  UserAlertListDataItem,
  SearchDropDown,
  SearchDropDownOption,
} from '@ecdlink/ui';
import ROUTES from '@/routes/routes';
import Infant from '@/assets/infant.svg';
import { getAvatarColor } from '@ecdlink/core';
import SearchHeader from '@/components/search-header/search-header';
import { useAppDispatch } from '@/store';
import { getInfantsWeeklyVisits } from '@/store/infant/infant.actions';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import { ReactComponent as BinocularsIcon } from '@/assets/binocularsIcon.svg';
import {
  ageOptions,
  SortBy,
  sortOptions,
  filterByAge,
  filterBySort,
  searchList,
  ExtraMotherData,
  ExtraInfantData,
} from '../../clients-tab/filters';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';

export const ChildVisits: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [infantsList, setInfantsList] = useState<
    UserAlertListDataItem<ExtraInfantData>[]
  >([]);
  const [mothersList, setMothersList] = useState<
    UserAlertListDataItem<ExtraMotherData>[]
  >([]);

  const appDispatch = useAppDispatch();

  const infants = useSelector(getInfantsWeeklyVisitsSelector);
  const isEmptyState = useMemo(
    () => !infants || infants.length === 0,
    [infants]
  );

  const { isOnline } = useOnlineStatus();

  const history = useHistory();
  const [age, setAge] = useState<SearchDropDownOption<string>[]>([]);
  const [sortBy, setSortBy] = useState<SearchDropDownOption<SortBy>[]>([]);

  const filteredList = useMemo(() => {
    let list = [...mothersList, ...infantsList];

    list = filterByAge(list, age);
    list = filterBySort(list, sortBy);
    list = searchList(list, search.toLowerCase());

    return list;
  }, [mothersList, infantsList, age, sortBy, search]);
  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  useEffect(() => {
    const infantsList: UserAlertListDataItem<ExtraInfantData>[] = infants.map(
      (infant) => {
        return {
          icon: Infant,
          title: infant?.firstName ?? infant?.user?.firstName!,
          // TODO: add correct subTitle (alert status)
          subTitle: infant?.user?.dateOfBirth
            ? `Birth date: ${format(
                new Date(infant?.user?.dateOfBirth!),
                'PP'
              )}`
            : `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
          switchTextStyles: true,
          alertSeverity: 'none',
          avatarColor: getAvatarColor('growgreat') || '',
          onActionClick: () => {
            history.push(
              `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infant?.user?.id}`
            );
          },
        };
      }
    );

    setInfantsList(infantsList);
  }, [history, infants]);

  useLayoutEffect(() => {
    appDispatch(getInfantsWeeklyVisits()).unwrap();
  }, [appDispatch]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Child visits'}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <SearchHeader<UserAlertListDataItem>
        searchItems={filteredList}
        onSearchChange={setSearch}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
      >
        <SearchDropDown<string>
          displayMenuOverlay={true}
          menuItemClassName={'w-11/12 left-4 '}
          overlayTopOffset={'120'}
          options={ageOptions}
          selectedOptions={age}
          onChange={setAge}
          placeholder={'Age'}
          color={'secondary'}
          info={{
            name: `Filter by: Age`,
          }}
        />
        <SearchDropDown<SortBy>
          displayMenuOverlay={true}
          menuItemClassName={'w-11/12 left-4 '}
          overlayTopOffset={'120'}
          options={sortOptions}
          selectedOptions={sortBy}
          onChange={setSortBy}
          placeholder={'Sort by'}
          color={'secondary'}
          info={{
            name: `Sort by:`,
          }}
        />
      </SearchHeader>
      {!filteredList.length && (
        <IconInformationIndicator
          className="px-10 pt-28"
          title={
            isEmptyState ? "You don't have any child visits" : 'No results'
          }
          subTitle=""
          renderCustomIcon={<BinocularsIcon />}
        />
      )}
      <StackedList
        className="flex flex-col gap-1 px-4 pb-2 pt-4"
        listItems={filteredList}
        type={'UserAlertList'}
      />
    </BannerWrapper>
  );
};
export default ChildVisits;
