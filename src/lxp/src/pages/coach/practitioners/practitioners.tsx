import { useState, useEffect, useCallback } from 'react';
import {
  StackedList,
  BannerWrapper,
  SearchSortOptions,
  UserAlertListDataItem,
  SearchDropDown,
  LoadingSpinner,
  SearchDropDownOption,
} from '@ecdlink/ui';
import { RoleSystemNameEnum, getAvatarColor } from '@ecdlink/core';
import SearchHeader from '../../../components/search-header/search-header';
import { format } from 'date-fns';
import { useHistory, useLocation } from 'react-router-dom';
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
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { PractitionerActions } from '@/store/practitioner/practitioner.actions';
import { PractitionersRouteState } from './practitioners-types';

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
      label: 'Priority',
      value: 'priority',
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
    column: 'priority',
    dir: 'asc',
  },
};

export const Practitioners: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const userData = useSelector(userSelectors.getUser);
  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const location = useLocation<PractitionersRouteState>();
  const stateFilter = location.state?.filter;
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

  const { isLoading: isLoadingMetrics } = useThunkFetchCall(
    'practitioner',
    PractitionerActions.GET_PRACTITIONERS_DISPLAY_METRICS
  );

  const { isLoading: isLoadingPractitioners } = useThunkFetchCall(
    'practitioner',
    PractitionerActions.GET_ALL_PRACTITIONERS
  );

  const { isLoading: isLoadingPractitionersForCoach } = useThunkFetchCall(
    'practitionerForCoach',
    PractitionerActions.GET_PRACTITIONERS_FOR_COACH
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

  const applyFilter = useCallback(() => {
    if (stateFilter && taskFilterOptions.length > 0) {
      const newFilter = taskFilterOptions.filter((o) => o.id === stateFilter);
      setFilterByTask(newFilter);
    }
  }, [stateFilter, taskFilterOptions]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter, taskFilterOptions]);

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
          : currentPractitionerMessage?.color === 'None'
          ? 'none'
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
          case 'priority':
            return AlertSeverityMapping[a.alertSeverity] >
              AlertSeverityMapping[b.alertSeverity]
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
        title={`Practitioners`}
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
            overlayTopOffset={'5'}
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
            color={'quatenary'}
            info={{
              name: `Sort by`,
            }}
          />
        </SearchHeader>
        {practitionersList !== undefined && practitionersList?.length > 0 ? (
          <div className="flex justify-center">
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
          </div>
        ) : (
          <>
            {(isLoadingMetrics ||
              isLoadingPractitioners ||
              isLoadingPractitionersForCoach) &&
            isOnline ? (
              <LoadingSpinner
                className="mt-6"
                size={'medium'}
                spinnerColor={'primary'}
                backgroundColor={'uiLight'}
              />
            ) : (
              <EmptyPractitioners />
            )}
          </>
        )}
      </BannerWrapper>
    </>
  );
};

export default Practitioners;
