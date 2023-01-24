import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  AlertSeverityType,
  BannerWrapper,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import Pregnant from '@/assets/pregnant.svg';
import { getAvatarColor } from '@ecdlink/core';
import SearchHeader from '@/components/search-header/search-header';
import { useAppDispatch } from '@/store';
import { getMothersWeeklyVisits } from '@/store/mother/mother.actions';
import { getMothersWeeklyVisitsSelector } from '@/store/mother/mother.selectors';

import { CLIENT_TABS } from '../../class-dashboard/class-dashboard';

export const PregnancyVisits: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [mothersList, setMothersList] = useState<UserAlertListDataItem[]>([]);

  const appDispatch = useAppDispatch();

  const mothers = useSelector(getMothersWeeklyVisitsSelector);

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const lowerSearch = search.toLowerCase();

  const filteredList = useMemo(
    () =>
      mothersList.filter((item) =>
        item.title?.toLowerCase().includes(lowerSearch)
      ),
    [mothersList, lowerSearch]
  );

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  useEffect(() => {
    const mothersList: UserAlertListDataItem[] = mothers.map((mother) => {
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
        onActionClick: () => {},
      };
    });

    setMothersList(mothersList);
  }, [mothers]);

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
        {/* TODO: add filters */}
      </SearchHeader>
      <StackedList
        className="flex flex-col gap-1 px-4 pb-2 pt-4"
        listItems={mothersList}
        type={'UserAlertList'}
      />
    </BannerWrapper>
  );
};
export default PregnancyVisits;
