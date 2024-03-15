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
import { motherSelectors } from '@/store/mother';
import { UserDto } from '@ecdlink/core';
import * as styles from './calendar-search-participant.styles';
import { ListDataItem } from '../calendar.types';
import {
  mapClinicMembersToListDataItemList,
  mapClinicTeamLeadsToListDataItemList,
  mapClinicToListDataItem,
  mapMotherToListDataItem,
  mapUserToListDataItem,
  sortListDataItems,
} from '../calendar.utils';
import { CalendarAddEventParticipantFormModel } from '../calendar-add-event/calendar-add-event.types';
import { communitySelectors } from '@/store/community';

export const CalendarSearchParticipant: React.FC<
  CalendarSearchParticipantProps
> = ({ currentParticipantUsers, onBack, onDone }) => {
  const [filteredData, setFilteredData] = useState<ListDataItem[]>([]);
  const [selectedData, setSelectedData] = useState<ListDataItem[]>([]);
  const [unselectedData, setUnselectedData] = useState<ListDataItem[]>([]);
  const [, setAddChildButtonExpanded] = useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState<boolean>(false);
  const [busySaving, setBusySaving] = useState<boolean>(false);

  const currentUser = useSelector(userSelectors.getUser) as UserDto;
  const mothers = useSelector(motherSelectors.getMothers);
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

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

  const onParticipantAdd = useCallback(
    (item: any) => {
      const itemUserId = (item as UserAlertListDataItem).id;
      if (itemUserId === currentUser.id) return;
      const unselected = [...unselectedData];
      const index = unselected.findIndex((x) => x.id === itemUserId);
      if (index === -1) return;
      const uitem = unselected[index];
      uitem.rightIcon = 'XIcon';
      unselected.splice(index, 1);
      const selected = [...selectedData.slice(1), uitem];
      sortListDataItems(selected);
      const filtered = [...filteredData];
      const filteredIndex = filtered.findIndex((x) => x.id === itemUserId);
      if (filteredIndex !== -1) filtered.splice(filteredIndex, 1);
      setUnselectedData(unselected);
      setSelectedData([selectedData[0], ...selected]);
      setFilteredData(filtered);
    },
    [unselectedData, selectedData, filteredData, currentUser.id]
  );

  const onParticipantRemove = useCallback(
    (item: any) => {
      const itemUserId = (item as UserAlertListDataItem).id;
      if (itemUserId === currentUser.id) return;
      const selected = [...selectedData];
      const index = selected.findIndex((x) => x.id === itemUserId);
      if (index === -1) return;
      const sitem = selected[index];
      sitem.rightIcon = 'PlusCircleIcon';
      selected.splice(index, 1);
      const unselected = [...unselectedData, sitem];
      sortListDataItems(unselected);
      setSelectedData(selected);
      setUnselectedData(unselected);
    },
    [unselectedData, selectedData, currentUser.id]
  );

  const onClickDone = useCallback(() => {
    setBusySaving(true);
    const participantUsers: CalendarAddEventParticipantFormModel[] =
      selectedData.slice(1).map((x) => ({
        userId: x.id || '',
        firstName: x.extraData?.firstName || '',
        surname: x.extraData?.surname || '',
        type: x.extraData?.type || 'mother',
      }));
    onDone(participantUsers);
  }, [selectedData, onDone]);

  useEffect(() => {
    if (!!mothers && mothers.length > 0 && !!clinicDetails) {
      const list = mothers.map((p) => mapMotherToListDataItem(p));
      list.push(
        ...mapClinicTeamLeadsToListDataItemList(clinicDetails.teamLeads)
      );
      list.push(
        ...mapClinicMembersToListDataItemList(clinicDetails.clinicMembers)
      );

      const clinic = mapClinicToListDataItem(clinicDetails);

      const unselected: ListDataItem[] = [clinic];

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
  }, [mothers, clinicDetails]);

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
        onClickItem={onParticipantAdd}
      >
        <div></div>
      </SearchHeader>
      <div className="flex justify-center">
        <div className="w-11/12">
          <StackedList
            className={styles.stackedList}
            listItems={selectedData}
            type={'UserAlertList'}
            onClickItem={onParticipantRemove}
          />
          <div>
            <Button
              onClick={onClickDone}
              className="w-full"
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
      </div>
    </BannerWrapper>
  );
};

export default CalendarSearchParticipant;
