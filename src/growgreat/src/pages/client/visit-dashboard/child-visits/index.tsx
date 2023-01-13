import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { BannerWrapper, StackedList, UserAlertListDataItem } from '@ecdlink/ui';
import ROUTES from '@/routes/routes';
import Infant from '@/assets/infant.svg';
import { getAvatarColor } from '@ecdlink/core';
import SearchHeader from '@/components/search-header/search-header';

import { CLIENT_TABS } from '../../class-dashboard/class-dashboard';

export const ChildVisits: React.FC = () => {
  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [infantsList, setInfantsList] = useState<UserAlertListDataItem[]>([]);

  const infants = useSelector(getInfants); // TODO: replace infants selector to visits selector

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const lowerSearch = search.toLowerCase();

  const filteredList = useMemo(
    () =>
      infantsList.filter((item) =>
        item.title?.toLowerCase().includes(lowerSearch)
      ),
    [infantsList, lowerSearch]
  );

  const goBack = () => {
    history.push(ROUTES.CLIENT.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  useEffect(() => {
    const infantsList: UserAlertListDataItem[] = infants.map((infant) => {
      return {
        icon: Infant,
        title: infant?.firstName ?? infant?.user?.firstName!,
        // TODO: add correct subTitle (alert status)
        subTitle: infant?.user?.dateOfBirth
          ? `Birth date: ${format(new Date(infant?.user?.dateOfBirth!), 'PP')}`
          : `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () => {},
      };
    });

    setInfantsList(infantsList);
  }, [infants]);

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
        {/* TODO: add filters */}
      </SearchHeader>
      <StackedList
        className="flex flex-col gap-1 px-4 pb-2 pt-4"
        listItems={infantsList}
        type={'UserAlertList'}
      />
    </BannerWrapper>
  );
};
export default ChildVisits;
