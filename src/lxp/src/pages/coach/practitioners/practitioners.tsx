import { useState, useEffect } from 'react';
import {
  StackedList,
  BannerWrapper,
  SearchSortOptions,
  UserAlertListDataItem,
  SearchDropDown,
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

  useEffect(() => {
    if (practitionersList && practitionersList?.length > 0) {
      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of practitionersList) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setChildUserListData(practitionerListItem);
      setFilteredChildData(practitionerListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onSortItemsChanges = (column: string) => {
    if (practitionersList && practitionersList.length > 0) {
      // const filteredPractitioners = practitionersList.filter((practitioner) =>
      //   childUserListData?.some((x) => x.id === practitioner.id)
      // );
      const sorted = [...practitionersList].sort(
        (a: PractitionerDto, b: PractitionerDto) => {
          const practitionerOne = practitioners?.find(
            (x) => x.userId === a.userId
          );
          const practitionerTwo = practitioners?.find(
            (x) => x.userId === b.userId
          );

          switch (column) {
            // case 'priority': {
            //   const childUserDocumentsOne = documents?.filter(
            //     (x) => x.userId === a.userId
            //   );
            //   const childReportsOne = childReportSummaries?.filter(
            //     (x) => x.childId === a?.id
            //   );
            //   const childAlertOne = getChildAlertModel(
            //     childLearnerOne,
            //     pendingStatusId,
            //     childUserOne,
            //     a,
            //     childUserDocumentsOne,
            //     attendanceData,
            //     classroomGroups,
            //     classroomGroupProgrammes,
            //     childReportsOne
            //   );
            //   const childUserDocumentsTwo = documents?.filter(
            //     (x) => x.userId === b.userId
            //   );
            //   const childReportsTwo = childReportSummaries?.filter(
            //     (x) => x.childId === b?.id
            //   );
            //   const childAlertTwo = getChildAlertModel(
            //     childLearnerTwo,
            //     pendingStatusId,
            //     childUserTwo,
            //     b,
            //     childUserDocumentsTwo,
            //     attendanceData,
            //     classroomGroups,
            //     classroomGroupProgrammes,
            //     childReportsTwo
            //   );
            //   return childAlertOne.severity > childAlertTwo.severity ? 1 : -1;
            // }
            case 'surname':
              return (practitionerOne !== undefined &&
                practitionerOne?.user?.surname!) >
                (practitionerTwo !== undefined &&
                  practitionerTwo?.user?.surname!)
                ? 1
                : -1;
            case 'firstName':
            default:
              return (practitionerOne !== undefined &&
                practitionerOne.user?.firstName!) >
                (practitionerTwo !== undefined &&
                  practitionerTwo.user?.firstName!)
                ? 1
                : -1;
          }
        }
      );

      const practitionerListItem: UserAlertListDataItem[] = [];
      for (const practitioner of sorted) {
        practitionerListItem.push(mapUserListDataItem(practitioner));
      }
      setChildUserListData(practitionerListItem || []);
    }
  };

  const mapUserListDataItem = (
    practitionerRecord: PractitionerDto
  ): UserAlertListDataItem => {
    const practitioner = practitionersList?.find(
      (x) => x.userId === practitionerRecord.userId
    );

    // const childAlert = getChildAlertModel(
    //   childLearner,
    //   pendingStatusId,
    //   childUser,
    //   childRecord,
    //   childDocuments,
    //   attendanceData,
    //   classroomGroups,
    //   classroomGroupProgrammes,
    //   reports
    // );

    return {
      id: practitioner?.id,
      profileDataUrl: practitioner?.user?.profileImageUrl,
      title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
      subTitle: '',
      profileText: `${
        practitioner?.user?.firstName && practitioner?.user?.firstName[0]
      }${practitioner?.user?.surname && practitioner?.user?.surname[0]}`,
      alertSeverity: 'none',
      avatarColor: getAvatarColor() || '',
      onActionClick: () => handleClick(practitioner?.userId!),
    };
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
              onSortItemsChanges(selectedColumns[0].value);
            }}
            placeholder={'Sort'}
            multiple={false}
            color={'secondary'}
            info={{
              name: `Sort`,
            }}
          />
        </SearchHeader>
        {practitionersList?.length! > 0 || practitionersList !== undefined ? (
          <div className="flex justify-center">
            <div className="w-11/12">
              <StackedList
                className={styles.stackedList}
                listItems={childUserListData ? childUserListData : []}
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
