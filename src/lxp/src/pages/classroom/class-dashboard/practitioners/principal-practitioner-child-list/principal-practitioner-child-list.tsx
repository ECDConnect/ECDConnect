import { ChildDto, LearnerDto, getAvatarColor } from '@ecdlink/core';
import {
  SearchDropDown,
  StackedList,
  BannerWrapper,
  AlertSeverityType,
  ComponentBaseProps,
  FilterInfo,
  SearchDropDownOption,
  SearchSortOptions,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { getChildAlertModel } from '@utils/child/child-alert-message-util';
import { PractitionerProfileRouteState } from './principal-practitioner-child-list.types';
import SearchHeader from '../../../../../components/search-header/search-header';
import * as styles from './principal-practitioner-child-list.styles';
import { attendanceSelectors } from '@store/attendance';
import { documentSelectors } from '@store/document';
import { contentReportSelectors } from '@store/content/report';
import { useStaticData } from '@hooks/useStaticData';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { practitionerSelectors } from '@/store/practitioner';
import { IconInformationIndicator } from '../../../../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import ROUTES from '@/routes/routes';

export const PrincipalPractitionerChildList: React.FC<
  ComponentBaseProps
> = () => {
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerUserId = location.state.practitionerUserId;
  const classroomGroup = location?.state?.classroomGroup;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );

  const { isOnline } = useOnlineStatus();
  const { getWorkflowStatusIdByEnum } = useStaticData();
  const pendingStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildPending
  );
  const history = useHistory();
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const children = useSelector(childrenSelectors.getChildren);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerClassroomGroups = classroomGroups?.filter((item) => {
    return item?.userId === practitionerUserId;
  });
  const classroomGroupProgrammes = useSelector(
    classroomsSelectors.getClassProgrammes
  );
  const childUsers = useSelector(childrenSelectors.getChildUsers);
  const documents = useSelector(documentSelectors.getDocuments);
  const childReportSummaries = useSelector(
    contentReportSelectors.getChildLatestCompletedReports()
  );
  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  const learnersForPractitioner = classroomGroupLearners.filter((el) => {
    return practitionerClassroomGroups.some((f) => {
      return f.id === el.classroomGroupId;
    });
  });
  const childrenForPractitioner = children?.filter((el) => {
    return learnersForPractitioner?.some((f) => {
      return f.userId === el.userId;
    });
  });

  const [searchTextActive, setSearchTextActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [activeSort, setActiveSort] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem[]>();
  const [filteredChildData, setFilteredChildData] = useState<
    UserAlertListDataItem[]
  >([]);
  const [updatedPlaygroups, setUpdatedPlaygroups] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const filterInfo: FilterInfo = {
    filterName: 'Class',
    filterHint: 'You can select multiple classes',
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
      {
        id: '4',
        label: 'Age',
        value: 'age',
      },
      {
        id: '5',
        label: 'Attendance',
        value: 'attendance',
      },
    ],
    defaultSort: {
      column: 'priority',
      dir: 'asc',
    },
  };

  useEffect(() => {
    if (practitionerClassroomGroups && classroomGroupLearners) {
      const groupedItems: SearchDropDownOption<string>[] =
        practitionerClassroomGroups.map((groupedItem, idx) => ({
          id: idx.toString(),
          label: groupedItem.name,
          value: groupedItem.id ?? '',
        }));

      setUpdatedPlaygroups(groupedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroupLearners]);

  useEffect(() => {
    if (classroomGroupLearners && childrenForPractitioner && pendingStatusId) {
      const childListItem: UserAlertListDataItem[] = [];

      for (const child of childrenForPractitioner) {
        const learner = classroomGroupLearners.find(
          (x) => x.userId === child.userId
        );
        childListItem.push(mapUserListDataItem(child, learner));
      }

      setChildUserListData(childListItem);
      setFilteredChildData(childListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroupLearners, pendingStatusId]);

  const onChildListItemAction = (childId: string) => {
    history.push(ROUTES.CHILD_PROFILE, {
      childId,
    });
  };

  const onFilterItemsChanges = (value: SearchDropDownOption<string>[]) => {
    setActiveFilters(value);
    const selectedClassrooms = value.map((x) => x.value);
    const childListItem: UserAlertListDataItem[] = [];
    if (childrenForPractitioner && classroomGroupLearners) {
      if (value && value.length > 0) {
        for (const child of childrenForPractitioner) {
          const learner = classroomGroupLearners.find(
            (x) =>
              x.userId === child.userId &&
              selectedClassrooms.some((sc) => sc === x.classroomGroupId)
          );
          if (learner) {
            childListItem.push(mapUserListDataItem(child, learner));
          }
        }
      } else {
        for (const child of childrenForPractitioner) {
          const learner = classroomGroupLearners.find(
            (x) => x.userId === child.userId
          );
          if (learner) {
            childListItem.push(mapUserListDataItem(child, learner));
          }
        }
      }
    }
    setChildUserListData(childListItem || []);
    setActiveSort([]);
  };

  useEffect(() => {
    if (classroomGroup) {
      const filteredClassroomGroup = updatedPlaygroups?.filter(
        (item) => item?.value === classroomGroup?.id
      );
      onFilterItemsChanges(filteredClassroomGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroup, updatedPlaygroups]);

  const onSortItemsChanges = (column: string) => {
    if (childrenForPractitioner && classroomGroupLearners) {
      const filteredChildren = childrenForPractitioner.filter((child) =>
        childUserListData?.some((x) => x.id === child.id)
      );
      const sorted = [...filteredChildren].sort((a: ChildDto, b: ChildDto) => {
        const childUserOne = childUsers?.find((x) => x.id === a.userId);
        const childUserTwo = childUsers?.find((x) => x.id === b.userId);
        const childLearnerOne = classroomGroupLearners?.find(
          (x) => x.userId === a.userId
        );
        const childLearnerTwo = classroomGroupLearners?.find(
          (x) => x.userId === a.userId
        );

        switch (column) {
          case 'priority': {
            const childUserDocumentsOne = documents?.filter(
              (x) => x.userId === a.userId
            );
            const childReportsOne = childReportSummaries?.filter(
              (x) => x.childId === a?.id
            );
            const childAlertOne = getChildAlertModel(
              childLearnerOne,
              pendingStatusId,
              childUserOne,
              a,
              childUserDocumentsOne,
              attendanceData,
              classroomGroups,
              classroomGroupProgrammes,
              childReportsOne,
              practitioner?.attendedChildProgress || false
            );
            const childUserDocumentsTwo = documents?.filter(
              (x) => x.userId === b.userId
            );
            const childReportsTwo = childReportSummaries?.filter(
              (x) => x.childId === b?.id
            );
            const childAlertTwo = getChildAlertModel(
              childLearnerTwo,
              pendingStatusId,
              childUserTwo,
              b,
              childUserDocumentsTwo,
              attendanceData,
              classroomGroups,
              classroomGroupProgrammes,
              childReportsTwo,
              practitioner?.attendedChildProgress || false
            );
            return childAlertOne.severity > childAlertTwo.severity ? 1 : -1;
          }
          case 'surname':
            return (childUserOne !== undefined && childUserOne?.surname!) >
              (childUserTwo !== undefined && childUserTwo.surname!)
              ? 1
              : -1;
          case 'age':
            return (childUserOne !== undefined &&
              childUserOne?.dateOfBirth !== undefined) >
              (childUserTwo !== undefined &&
                childUserTwo?.dateOfBirth !== undefined)
              ? 1
              : -1;
          case 'firstName':
          default:
            return (childUserOne !== undefined && childUserOne.firstName!) >
              (childUserTwo !== undefined && childUserTwo.firstName!)
              ? 1
              : -1;
        }
      });

      const childListItem: UserAlertListDataItem[] = [];
      for (const child of sorted) {
        const learner = classroomGroupLearners.find(
          (x) => x.userId === child.userId
        );
        childListItem.push(mapUserListDataItem(child, learner));
      }
      setChildUserListData(childListItem || []);
    }
  };

  const mapUserListDataItem = (
    childRecord: ChildDto,
    childLearner?: LearnerDto
  ): UserAlertListDataItem => {
    const childUser = childUsers?.find((x) => x.id === childRecord.userId);
    const childDocuments = documents?.filter(
      (x) => x.userId === childRecord.userId
    );
    const reports = childReportSummaries?.filter(
      (x) => x.childId === childRecord?.id
    );

    const childAlert = getChildAlertModel(
      childLearner,
      pendingStatusId,
      childUser,
      childRecord,
      childDocuments,
      attendanceData,
      classroomGroups,
      classroomGroupProgrammes,
      reports,
      practitioner?.attendedChildProgress || false
    );

    return {
      id: childRecord.id,
      profileDataUrl: childUser?.profileImageUrl,
      title: `${childUser?.firstName} ${childUser?.surname}`,
      subTitle: childAlert?.message ?? '',
      profileText: `${childUser?.firstName && childUser?.firstName[0]}${
        childUser?.surname && childUser?.surname[0]
      }`,
      alertSeverity: childAlert.status as AlertSeverityType,
      avatarColor: getAvatarColor() || '',
      onActionClick: () => {
        onChildListItemAction(String(childRecord.id));
      },
    };
  };

  const onSearchChange = (value: string) => {
    setFilteredChildData(
      childUserListData?.filter((x) =>
        x.title.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  return (
    <>
      <BannerWrapper
        title={`Classroom`}
        subTitle={`${practitioner?.user?.firstName}`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <SearchHeader<UserAlertListDataItem>
        searchItems={filteredChildData || []}
        onSearchChange={onSearchChange}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
      >
        <SearchDropDown<string>
          displayMenuOverlay={true}
          menuItemClassName={styles.dropdownStyles}
          className={'mr-1'}
          options={updatedPlaygroups}
          selectedOptions={activeFilters}
          onChange={onFilterItemsChanges}
          placeholder={'Classes'}
          pluralSelectionText={'Classes'}
          multiple
          color={'secondary'}
          info={{
            name: `Filter by: ${filterInfo?.filterName}`,
            hint: filterInfo?.filterHint || '',
          }}
        />

        <SearchDropDown<string>
          displayMenuOverlay={true}
          menuItemClassName={styles.dropdownStyles}
          options={sortOptions.columns}
          selectedOptions={activeSort}
          onChange={(selectedColumns) => {
            setActiveSort(selectedColumns);
            onSortItemsChanges(selectedColumns[0].value);
          }}
          placeholder={'Sort By'}
          multiple={false}
          color={'secondary'}
          info={{
            name: `Sort By:`,
          }}
        />
      </SearchHeader>

      <div className={styles.overlay}>
        {(!childrenForPractitioner ||
          childrenForPractitioner?.length === 0) && (
          <IconInformationIndicator
            title="This practitioner doesn't have any children yet!"
            subTitle="Check with the practitioner!"
          />
        )}
        {childUserListData ? (
          <StackedList
            className={styles.stackedList}
            listItems={childUserListData}
            type={'UserAlertList'}
          ></StackedList>
        ) : null}
      </div>
    </>
  );
};

export default PrincipalPractitionerChildList;
