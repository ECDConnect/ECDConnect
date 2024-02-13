import { useState, useEffect } from 'react';
import {
  StackedList,
  BannerWrapper,
  SearchSortOptions,
  UserAlertListDataItem,
  SearchDropDown,
  LoadingSpinner,
  SearchDropDownOption,
} from '@ecdlink/ui';
import { getAvatarColor } from '@ecdlink/core';
import SearchHeader from '../../../components/search-header/search-header';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioners.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { EmptyPractitioners } from './components/empty-practitioners/empty-practitioners';
import { PractitionerDto } from '@/../../../packages/core/lib';
import { userSelectors } from '@store/user';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { getClubsForCoach } from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PractitionerActions } from '@/store/practitioner/practitioner.actions';

type ListDataItem = UserAlertListDataItem<{
  firstName: string;
  surname: string;
  area: string;
  groupingName: string;
}>;

const AlertSeverityMapping = {
  error: 0,
  warning: 1,
  success: 2,
  none: 3,
};

const sortOptions: SearchSortOptions = {
  columns: [
    {
      id: '1',
      label: 'Due date',
      value: 'due date',
    },
    {
      id: '2',
      label: 'First Name',
      value: 'firstName',
    },
    {
      id: '3',
      label: 'Surname',
      value: 'surname',
    },
  ],
  defaultSort: {
    column: 'due date',
    dir: 'asc',
  },
};

export const Practitioners: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const userData = useSelector(userSelectors.getUser);
  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');
  const practitionersForCoach = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter((item) =>
    practitionersForCoach?.find((item2) => item.id === item2.id)
  );
  const practitionersMessages = useSelector(
    practitionerSelectors.getPractitionersMetrics
  );

  const [practitionerUserListData, setPractitionerUserListData] =
    useState<ListDataItem[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [areaFilterOptions, setAreaFilterOptions] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [filterByArea, setFilterByArea] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [taskFilterOptions, setTaskFilterOptions] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [filterByTask, setFilterByTask] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [activeSort, setActiveSort] = useState<any[]>([sortOptions.columns[0]]);
  const [filteredChildData, setFilteredChildData] = useState<ListDataItem[]>(
    []
  );

  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'practitioner',
    PractitionerActions.GET_PRACTITIONERS_DISPLAY_METRICS
  );

  const handleClick = (practitionerId: string) => {
    if (isCoach) {
      history.push('practitioner-profile-info', {
        practitionerId: practitionerId,
      });
    } else {
      history.push('practitioner-info-dashboard', {
        practitionerId: practitionerId,
      });
    }
  };

  // Need to load clubs so we have the names when viewing each practitioner
  useEffect(() => {
    if (userData?.id && isOnline) {
      appDispatch(getClubsForCoach({ userId: userData?.id }));
    }
  }, [appDispatch, isOnline, userData?.id]);

  useEffect(() => {
    if (
      (isOnline &&
        !!practitionersList?.length &&
        !!practitionersMessages?.length) ||
      (!isOnline && !!practitionersList?.length)
    ) {
      const practitionerListItem: ListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }

      setPractitionerUserListData(practitionerListItem);
      setFilteredChildData(practitionerListItem);
      setTaskFilterOptions(getTaskFilterOptions(practitionerListItem));
      setAreaFilterOptions(getAreaFilterOptions(practitionerListItem));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersList?.length, practitionersMessages]);

  const handleListScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const onSearchChange = (value: string) => {
    setFilteredChildData(
      practitionerUserListData?.filter((x) =>
        x.title.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  const mapUserListDataItem = (
    practitionerRecord: PractitionerDto
  ): ListDataItem => {
    const practitioner = practitionersList?.find(
      (x) => x.userId === practitionerRecord.userId
    );

    const currentPractitionerMessage = practitionersMessages?.find((item) => {
      return item?.userId === practitionerRecord?.userId;
    });

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl,
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      subTitle: `${currentPractitionerMessage?.subject}`,
      hideAlertSeverity: !currentPractitionerMessage?.subject,
      alertSeverity:
        currentPractitionerMessage?.color === 'Success'
          ? 'success'
          : currentPractitionerMessage?.color === 'Warning'
          ? 'warning'
          : 'error',
      avatarColor: getAvatarColor() || '',
      onActionClick: () => handleClick(practitioner?.userId!),
      extraData: {
        firstName: practitioner?.user?.firstName || '',
        surname: practitioner?.user?.surname || '',
        area: practitioner?.siteAddress?.addressLine2 || '',
        groupingName: currentPractitionerMessage?.groupingName || '',
      },
    };
  };

  const getAreaFilterOptions = (
    items: ListDataItem[]
  ): SearchDropDownOption<string>[] => {
    const options: SearchDropDownOption<string>[] = [];

    items.forEach((item) => {
      if (
        item.extraData &&
        item.extraData.area &&
        options.findIndex((o) => o.id === item.extraData?.area) < 0
      ) {
        options.push({
          id: item.extraData.area,
          label: item.extraData.area,
          value: item.extraData.area,
        });
      }
    });

    return options;
  };

  const getTaskFilterOptions = (
    items: ListDataItem[]
  ): SearchDropDownOption<string>[] => {
    const options: SearchDropDownOption<string>[] = [];

    items.forEach((item) => {
      if (
        !!item.extraData?.groupingName &&
        options.findIndex((o) => o.id === item.extraData?.groupingName) < 0
      ) {
        options.push({
          id: item.extraData?.groupingName,
          label: item.extraData?.groupingName,
          value: item.extraData?.groupingName,
        });
      }
    });

    return options;
  };

  const filterAndSort = (list: ListDataItem[]): ListDataItem[] => {
    const result: ListDataItem[] = [];

    list.forEach((item) => {
      if (filterByArea.length === 0 && filterByTask.length === 0) {
        result.push(item);
      } else {
        let add = 0;
        if (filterByArea.length > 0) {
          if (
            item.extraData &&
            item.extraData.area &&
            filterByArea.findIndex((o) => o.id === item.extraData?.area) >= 0
          )
            add++;
        } else {
          add++;
        }
        if (filterByTask.length > 0) {
          if (
            item.subTitle &&
            filterByTask.findIndex((o) => o.id === item.subTitle) >= 0
          )
            add++;
        } else {
          add++;
        }
        if (add === 2) result.push(item);
      }
    });

    if (activeSort.length > 0) {
      const sortBy = activeSort[0].value;
      result.sort((a, b) => {
        switch (sortBy) {
          case 'due date':
            const as = AlertSeverityMapping[a.alertSeverity] || 4;
            const bs = AlertSeverityMapping[b.alertSeverity] || 4;
            if (as > bs) return 1;
            if (bs < as) return -1;
            return (a.extraData?.firstName || '') >
              (b.extraData?.firstName || '')
              ? 1
              : -1;
          case 'surname':
            return (a.extraData?.surname || '') > (b.extraData?.surname || '')
              ? 1
              : -1;
          case 'firstName':
          default:
            return (a.extraData?.firstName || '') >
              (b.extraData?.firstName || '')
              ? 1
              : -1;
        }
      });
    }

    return result;
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`SmartStarters`}
        subTitle={format(new Date(), 'dd MMM yyyy')}
        color={'primary'}
        onBack={() => history.push(ROUTES.DASHBOARD)}
        displayOffline={!isOnline}
      >
        <SearchHeader<ListDataItem>
          searchItems={filteredChildData || []}
          onScroll={handleListScroll}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          onBack={() => setSearchTextActive(false)}
          onSearchButtonClick={() => setSearchTextActive(true)}
        >
          <SearchDropDown<string>
            displayMenuOverlay={true}
            menuItemClassName={styles.dropdownStyles}
            className={'mr-1'}
            options={taskFilterOptions}
            selectedOptions={filterByTask}
            onChange={(value) => {
              setFilterByTask(value);
            }}
            multiple
            placeholder={'Task'}
            pluralSelectionText={'Tasks'}
            color={'secondary'}
            info={{
              name: 'Task',
              hint: 'You can select multiple tasks',
            }}
          />
          <SearchDropDown<string>
            displayMenuOverlay={true}
            menuItemClassName={styles.dropdownStyles}
            className={'mr-1'}
            options={areaFilterOptions}
            selectedOptions={filterByArea}
            onChange={(value) => {
              setFilterByArea(value);
            }}
            multiple
            placeholder={'Area'}
            pluralSelectionText={'Areas'}
            color={'secondary'}
            info={{
              name: 'Area',
              hint: 'You can select multiple areas',
            }}
          />
          <SearchDropDown<string>
            displayMenuOverlay={true}
            menuItemClassName={styles.dropdownStyles}
            options={sortOptions.columns}
            selectedOptions={activeSort}
            onChange={(selectedColumns) => {
              if (selectedColumns.length > 0) {
                setActiveSort(selectedColumns);
              }
            }}
            placeholder={'Sort by'}
            multiple={false}
            color={'secondary'}
            info={{
              name: `Sort by`,
            }}
          />
        </SearchHeader>
        {practitionersList !== undefined && practitionersList?.length > 0 ? (
          <div className="flex justify-center">
            {isLoading && isOnline ? (
              <LoadingSpinner
                className="mt-6"
                size={'medium'}
                spinnerColor={'primary'}
                backgroundColor={'uiLight'}
              />
            ) : (
              <div className="w-11/12">
                <StackedList
                  className={styles.stackedList}
                  listItems={
                    practitionerUserListData
                      ? filterAndSort(practitionerUserListData)
                      : []
                  }
                  type={'UserAlertList'}
                ></StackedList>
              </div>
            )}
          </div>
        ) : (
          <EmptyPractitioners />
        )}
      </BannerWrapper>
    </>
  );
};

export default Practitioners;
