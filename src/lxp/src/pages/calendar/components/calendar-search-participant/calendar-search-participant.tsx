import {
  BannerWrapper,
  Button,
  StackedList,
  Typography,
  UserAlertListDataItem,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { CalendarSearchParticipantProps } from './calendar-search-partiticpant.types';
import SearchHeader from '@/components/search-header/search-header';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';
import { UserDto } from '@ecdlink/core';
import * as styles from './calendar-search-participant.styles';
import { ListDataItem } from '../calendar.types';
import {
  mapClubToListDataItem,
  mapPractitionerToListDataItem,
  mapUserToListDataItem,
  sortListDataItems,
} from '../calendar.utils';
import { CalendarAddEventParticipantFormModel } from '../calendar-add-event/calendar-add-event.types';
import { coachSelectors } from '@/store/coach';

export const CalendarSearchParticipant: React.FC<
  CalendarSearchParticipantProps
> = ({ currentParticipantUsers, customList, onBack, onDone }) => {
  const [filteredData, setFilteredData] = useState<ListDataItem[]>(
    customList || []
  );
  const [selectedData, setSelectedData] = useState<ListDataItem[]>([]);
  const [unselectedData, setUnselectedData] = useState<ListDataItem[]>(
    customList || []
  );
  const [, setAddChildButtonExpanded] = useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState<boolean>(false);
  const [busySaving, setBusySaving] = useState<boolean>(false);

  const currentUser = useSelector(userSelectors.getUser) as UserDto;
  const isCoach = currentUser?.roles?.some((role) => role.name === 'Coach');
  // const currentUserIsPrincipal = currentUser?.roles?.some((role) => role.name === 'Principal');
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const clubs = useSelector(coachSelectors.getCoachClubs);

  const handleListScroll = useCallback((scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  }, []);

  const onSearchChange = useCallback(
    (value: string) => {
      setFilteredData(
        unselectedData.filter((x) =>
          x.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    },
    [unselectedData]
  );

  const onSearchDone = useCallback(() => {
    setSearchTextActive(false);
  }, []);

  const onSearch = useCallback(() => {
    setFilteredData(unselectedData);
    setSearchTextActive(true);
  }, [unselectedData]);

  const onPractitionerAdd = useCallback(
    (item: any) => {
      const practitionerUserId = (item as UserAlertListDataItem).id;
      if (practitionerUserId === currentUser.id) return;
      const unselected = [...unselectedData];
      const index = unselected.findIndex((x) => x.id === practitionerUserId);
      if (index === -1) return;
      const practitionerItem = unselected[index];
      practitionerItem.rightIcon = 'XIcon';
      unselected.splice(index, 1);
      const selected = [...selectedData.slice(1), practitionerItem];
      sortListDataItems(selected);
      const filtered = [...filteredData];
      const filteredIndex = filtered.findIndex(
        (x) => x.id === practitionerUserId
      );
      if (filteredIndex !== -1) filtered.splice(filteredIndex, 1);
      setUnselectedData(unselected);
      setSelectedData(
        !!selectedData?.[0] ? [selectedData[0], ...selected] : selected
      );
      setFilteredData(filtered);
    },
    [unselectedData, selectedData, filteredData, currentUser.id]
  );

  const onPractitionerRemove = useCallback(
    (item: any) => {
      const practitionerUserId = (item as UserAlertListDataItem).id;
      if (practitionerUserId === currentUser.id) return;
      const selected = [...selectedData];
      const index = selected.findIndex((x) => x.id === practitionerUserId);
      if (index === -1) return;
      const practitionerItem = selected[index];
      practitionerItem.rightIcon = 'PlusCircleIcon';
      selected.splice(index, 1);
      const unselected = [...unselectedData, practitionerItem];
      sortListDataItems(unselected);
      setSelectedData(selected);
      setUnselectedData(unselected);
    },
    [unselectedData, selectedData, currentUser.id]
  );

  const onClickDone = useCallback(() => {
    setBusySaving(true);
    const participantUsers: CalendarAddEventParticipantFormModel[] = (
      !!customList ? selectedData : selectedData.slice(1)
    ).map((x) => ({
      userId: x.id || '',
      firstName: x.extraData?.firstName || '',
      surname: x.extraData?.surname || '',
      isClub: x.extraData?.isClub || false,
    }));

    onDone(participantUsers);
  }, [customList, selectedData, onDone]);

  useEffect(() => {
    if (customList) return;

    if (
      !!practitioners &&
      practitioners.length > 0 &&
      (!isCoach || (isCoach && !!clubs))
    ) {
      const list = practitioners.map((p) => mapPractitionerToListDataItem(p));
      const clubList =
        isCoach && !!clubs ? clubs.map((c) => mapClubToListDataItem(c)) : [];

      const unselected: ListDataItem[] = clubList;

      unselected.push(
        ...list.filter(
          (p) =>
            currentParticipantUsers.findIndex((c) => c.userId === p.id) < 0 &&
            p.id !== currentUser.id
        )
      );

      unselected.forEach((p) => {
        p.rightIcon = 'PlusCircleIcon';
      });
      sortListDataItems(unselected);
      setUnselectedData(unselected);
      setFilteredData(unselected);

      const selected = [mapUserToListDataItem(currentUser)];
      selected.push(
        ...list.filter(
          (p) =>
            currentParticipantUsers.findIndex((c) => c.userId === p.id) >= 0 &&
            p.id !== currentUser.id
        )
      );
      selected.forEach((p) => {
        p.rightIcon = 'XIcon';
      });
      setSelectedData(selected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioners, clubs, customList]);

  return (
    <BannerWrapper
      size={'small'}
      renderBorder={true}
      title={'Search for participants...'}
      color={'primary'}
      onBack={onBack}
    >
      <SearchHeader<ListDataItem>
        searchItems={filteredData || []}
        onScroll={handleListScroll}
        onSearchChange={onSearchChange}
        isTextSearchActive={searchTextActive}
        onBack={onSearchDone}
        onSearchButtonClick={onSearch}
        onClickItem={onPractitionerAdd}
      >
        <div></div>
      </SearchHeader>
      <div className="flex justify-center">
        <div className="w-11/12">
          <StackedList
            className={styles.stackedList}
            listItems={selectedData}
            type={'UserAlertList'}
            onClickItem={onPractitionerRemove}
          />
          <Button
            onClick={onClickDone}
            className="mb-4 mt-6 w-full"
            size="normal"
            color="primary"
            type="filled"
            isLoading={busySaving}
            disabled={busySaving}
          >
            {renderIcon('CheckCircleIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text={'Done'}
              color="white"
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default CalendarSearchParticipant;
