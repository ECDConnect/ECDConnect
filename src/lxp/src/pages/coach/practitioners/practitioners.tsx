import { useState } from 'react';
import {
  StackedList,
  BannerWrapper,
  SearchSortOptions,
  UserAlertListDataItem,
  SearchDropDown,
} from '@ecdlink/ui';
import SearchHeader from '../../../components/search-header/search-header';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import * as styles from './practitioners.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { practitionerSelectors } from '@/store/practitioner';
import { EmptyPractitioners } from './components/empty-practitioners/empty-practitioners';

// const mockedData = [
//   {
//     title: 'John Buffalo',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Jb',
//     alertSeverity: 'error',
//     onActionClick: () handleClick => {}
//   },
//   {
//     title: 'Pedro Machado',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Pm',
//     alertSeverity: 'error',
//   },
//   {
//     title: 'Carlos Vieira',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Cv',
//     alertSeverity: 'error',
//   },
// ];

export const Practitioners: React.FC = () => {
  const history = useHistory();
  const isCoach = true;
  const practitionersForCoach = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter((item) =>
    practitionersForCoach?.find((item2) => item.id === item2.id)
  );
  const practitionersForCoachListItems = practitionersList?.map((item) => {
    return {
      title: item.user?.firstName + ' ' + item?.user?.surname,
      subtitle: 'Progress report overdue',
      avatarColor: '#6974af',
      alertSeverity: 'none',
      profileText:
        item?.user?.firstName.substring(0, 1)! +
        item?.user?.surname.substring(0, 1),
      onActionClick: () => handleClick(item.userId!),
    };
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  // const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState<any[]>([]);
  const [filteredChildData, setFilteredChildData] = useState<
    UserAlertListDataItem[]
  >([]);

  const handleClick = (practitionerId: string) => {
    if (isCoach) {
      history.push('practitioner-profile-info', {
        practitionerId,
      });
    } else {
      history.push('practitioner-info-dashboard', {
        practitionerId,
      });
    }
  };

  const sortOptions: SearchSortOptions = {
    columns: [
      {
        id: '1',
        label: 'task 1',
        value: 'task 1',
      },
      {
        id: '2',
        label: 'task 2',
        value: 'task 2',
      },
      {
        id: '3',
        label: 'task 4',
        value: 'task 4',
      },
    ],
    defaultSort: {
      column: 'priority',
      dir: 'asc',
    },
  };

  const handleListScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const onSearchChange = (value: string) => {
    setFilteredChildData(
      childUserListData?.filter((x) =>
        x.title.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  // const mockedData = [
  //   {
  //     id: 1,
  //     title: 'John Buffalo',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Jb',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(1),
  //   },
  //   {
  //     id: 2,
  //     title: 'Pedro Machado',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Pm',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(2),
  //   },
  //   {
  //     id: 3,
  //     title: 'Carlos Vieira',
  //     subTitle: 'Progress report overdue',
  //     avatarColor: '#6974af',
  //     profileText: 'Cv',
  //     alertSeverity: 'error',
  //     onActionClick: () => handleClick(3),
  //   },
  // ];

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`SmartStarters`}
        subTitle={format(new Date(), 'dd MMM yyyy')}
        color={'primary'}
        onBack={() => history.push(ROUTES.DASHBOARD)}
        // displayOffline={!isOnline}
      >
        <SearchHeader<UserAlertListDataItem>
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
            options={sortOptions.columns}
            selectedOptions={activeSort}
            onChange={(selectedColumns) => {
              setActiveSort(selectedColumns);
              // onSortItemsChanges(selectedColumns[0].value);
            }}
            placeholder={'Task'}
            multiple={false}
            color={'secondary'}
            info={{
              name: `Task`,
            }}
          />
        </SearchHeader>
        {practitionersForCoachListItems?.length! > 0 ||
        practitionersForCoachListItems !== undefined ? (
          <div className="flex justify-center">
            <div className="w-11/12">
              <StackedList
                className={styles.stackedList}
                listItems={practitionersForCoachListItems!}
                type={'UserAlertList'}
              ></StackedList>
            </div>
          </div>
        ) : (
          <EmptyPractitioners />
        )}
      </BannerWrapper>
    </>
  );
};

export default Practitioners;
