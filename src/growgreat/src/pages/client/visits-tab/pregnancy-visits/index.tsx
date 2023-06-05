import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  AlertSeverityType,
  BannerWrapper,
  StackedList,
  UserAlertListDataItem,
  SearchDropDown,
  SearchDropDownOption,
} from '@ecdlink/ui';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import Pregnant from '@/assets/pregnant.svg';
import { getAvatarColor } from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import { ReactComponent as BinocularsIcon } from '@/assets/binocularsIcon.svg';
import SearchHeader from '@/components/search-header/search-header';
import { useAppDispatch } from '@/store';
import { getMothersWeeklyVisits } from '@/store/mother/mother.actions';
import { getMothersWeeklyVisitsSelector } from '@/store/mother/mother.selectors';
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

export const PregnancyVisits: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [infantsList, setInfantsList] = useState<
    UserAlertListDataItem<ExtraInfantData>[]
  >([]);
  const [mothersList, setMothersList] = useState<
    UserAlertListDataItem<ExtraMotherData>[]
  >([]);

  const appDispatch = useAppDispatch();

  const mothers = useSelector(getMothersWeeklyVisitsSelector);
  const isEmptyState = useMemo(
    () => !mothers || mothers.length === 0,
    [mothers]
  );

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const lowerSearch = search.toLowerCase();
  const [age, setAge] = useState<SearchDropDownOption<string>[]>([]);
  const [sortBy, setSortBy] = useState<SearchDropDownOption<SortBy>[]>([]);

  const filteredList = useMemo(() => {
    let list = [...mothersList, ...infantsList];

    list = filterByAge(list, age);
    list = filterBySort(list, sortBy);
    list = searchList(list, lowerSearch);

    return list;
  }, [mothersList, infantsList, age, sortBy, lowerSearch]);

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  useEffect(() => {
    const mothersList: UserAlertListDataItem<ExtraMotherData>[] = mothers.map(
      (mother) => {
        return {
          icon: Pregnant,
          title: mother?.firstName || mother?.user?.firstName!,
          subTitle: mother.statusInfo?.subject,
          switchTextStyles: true,
          alertSeverity:
            (mother.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
            'none',
          alertSeverityNoneIcon: 'CalendarIcon',
          alertSeverityNoneColor: 'black',
          avatarColor: getAvatarColor('growgreat') || '',
          onActionClick: () => {
            history.push(
              `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${mother?.user?.id}`
            );
          },
        };
      }
    );

    setMothersList(mothersList);
  }, [history, mothers]);

  useLayoutEffect(() => {
    appDispatch(getMothersWeeklyVisits()).unwrap();
  }, [appDispatch]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Pregnancy visits'}
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
            isEmptyState ? "You don't have any pregnancy visits" : 'No results'
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
export default PregnancyVisits;
