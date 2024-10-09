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
import { RoleSystemNameEnum, UserDto } from '@ecdlink/core';
import * as styles from './calendar-search-participant.styles';
import { ListDataItem } from '../calendar.types';
import {
  mapChildToListDataItem,
  mapCurrentUserToListDataItem,
  mapPractitionerToListDataItem,
  mapUserToListDataItem,
  sortListDataItems,
} from '../calendar.utils';
import { CalendarAddEventParticipantFormModel } from '../calendar-add-event/calendar-add-event.types';
import { useWindowSize } from '@reach/window-size';
import { childrenSelectors } from '@/store/children';
import { useTenant } from '@/hooks/useTenant';
import { classroomsSelectors } from '@/store/classroom';

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
  const tenant = useTenant();

  const { height } = useWindowSize();

  const currentUser = useSelector(userSelectors.getUser) as UserDto;
  const isCoach = currentUser?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const children = useSelector(childrenSelectors.getChildren);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const principal = useSelector(classroomsSelectors.getPrincipal);

  const isPrincipal = practitioner?.isPrincipal;

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
      const participantUserId = (item as UserAlertListDataItem).id;
      if (participantUserId === currentUser.id) return;
      const unselected = [...unselectedData];
      const index = unselected.findIndex((x) => x.id === participantUserId);
      if (index === -1) return;
      const practitionerItem = unselected[index];
      practitionerItem.rightIcon = 'XIcon';
      unselected.splice(index, 1);
      const selected = [...selectedData.slice(1), practitionerItem];
      sortListDataItems(selected);
      const filtered = [...filteredData];
      const filteredIndex = filtered.findIndex(
        (x) => x.id === participantUserId
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

  const onParticipantRemove = useCallback(
    (item: any) => {
      const participantUserId = (item as UserAlertListDataItem).id;
      if (participantUserId === currentUser.id) return;
      const selected = [...selectedData];
      const index = selected.findIndex((x) => x.id === participantUserId);
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
      userRole: x.extraData?.userRole || '',
      profileImage: x.extraData?.profileImage || '',
    }));
    onDone(participantUsers);
  }, [customList, selectedData, onDone]);

  useEffect(() => {
    if (customList?.length) return;

    if (
      practitioner ||
      (!!practitioners && practitioners.length > 0) ||
      (!!children && children.length > 0)
    ) {
      const list = !!practitioners
        ? practitioners.map((p) => mapPractitionerToListDataItem(p))
        : [];

      const childList =
        !isCoach && !!children
          ? children.map((p) => mapChildToListDataItem(p))
          : [];

      const unselected: ListDataItem[] = childList;

      if (practitioner) {
        if (practitioner.coachHierarchy) {
          let coachFirstName = '';
          let coachSurname = '';
          if (practitioner.coachName) {
            const coachNameItems = practitioner?.coachName.split(' ');
            coachFirstName = coachNameItems[0];
            coachSurname = coachNameItems[1];
          }
          const coachListItem = mapUserToListDataItem(
            coachFirstName,
            coachSurname,
            practitioner?.coachHierarchy || '',
            practitioner?.coachProfilePic || '',
            tenant.tenant?.modules?.coachRoleName || ''
          );
          unselected.push(coachListItem);
        }
        if (!isPrincipal && currentUser.id !== principal.userId) {
          const principalListItem = mapUserToListDataItem(
            principal.firstName,
            principal.surname,
            principal.userId,
            principal.profileImageUrl,
            'Principal'
          );
          unselected.push(principalListItem);
        }
      }

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

      const selected = [mapCurrentUserToListDataItem(currentUser)];
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
  }, [practitioners, children, customList]);

  return (
    <div className="overflow-auto" style={{ height }}>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={'Search for participants...'}
        color={'primary'}
        onBack={onBack}
        renderOverflow
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
        <div className="w-full p-4">
          <div className="flex justify-center">
            <StackedList
              className={styles.stackedList}
              listItems={selectedData}
              type={'UserAlertList'}
              onClickItem={onParticipantRemove}
            />
          </div>
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
      </BannerWrapper>
    </div>
  );
};

export default CalendarSearchParticipant;
