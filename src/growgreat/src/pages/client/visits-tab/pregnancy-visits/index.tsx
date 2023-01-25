import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getMothers } from '@/store/mother/mother.selectors';
import { BannerWrapper, StackedList, UserAlertListDataItem } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import Pregnant from '@/assets/pregnant.svg';
import { getAvatarColor } from '@ecdlink/core';
import SearchHeader from '@/components/search-header/search-header';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';

export const PregnancyVisits: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [mothersList, setMothersList] = useState<UserAlertListDataItem[]>([]);

  const mothers = useSelector(getMothers); // TODO: replace mothers selector to visits selector

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
        // TODO: add correct subTitle (alert status)
        subTitle: mother?.expectedDateOfDelivery
          ? `Expected delivery date: ${format(
              new Date(mother?.expectedDateOfDelivery!),
              'PP'
            )}`
          : `Expected delivery date: -`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () => {},
      };
    });

    setMothersList(mothersList);
  }, [mothers]);

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
