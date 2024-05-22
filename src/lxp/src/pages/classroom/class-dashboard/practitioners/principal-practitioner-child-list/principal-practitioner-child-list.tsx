import { ChildDto, getAvatarColor } from '@ecdlink/core';
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
import { useStaticData } from '@hooks/useStaticData';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { practitionerSelectors } from '@/store/practitioner';
import { IconInformationIndicator } from '../../../../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import ROUTES from '@/routes/routes';
import { LearnerDto } from '@/models/classroom/classroom-group.dto';

// TODO: Remove this page and use the one from src/lxp/src/pages/classroom/child-list/child-list.tsx
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
  const childExternalWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildExternalLink
  );

  const history = useHistory();
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const children = useSelector(childrenSelectors.getChildren);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerClassroomGroups = classroomGroups?.filter((item) => {
    return item?.userId === practitionerUserId;
  });
  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

  const learnersForPractitioner = practitionerClassroomGroups.flatMap(
    (x) => x.learners
  );
  const childrenForPractitioner = children?.filter((el) => {
    return learnersForPractitioner?.some((f) => {
      return f.childUserId === el.userId;
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
        childListItem.push(mapUserListDataItem(child));
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
          const learner = classroomGroups
            .filter((x) => selectedClassrooms.some((sc) => sc === x.id))
            .flatMap((cg) => cg.learners)
            .find((x) => x.childUserId === child.userId);
          if (learner) {
            childListItem.push(mapUserListDataItem(child));
          }
        }
      } else {
        for (const child of childrenForPractitioner) {
          const learner = classroomGroupLearners.find(
            (x) => x.childUserId === child.userId
          );
          if (learner) {
            childListItem.push(mapUserListDataItem(child));
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
        const childUserOne = children?.find((x) => x.userId === a.userId);
        const childUserTwo = children?.find((x) => x.userId === b.userId);
        const childLearnerOne = classroomGroupLearners?.find(
          (x) => x.childUserId === a.userId
        );
        const childLearnerTwo = classroomGroupLearners?.find(
          (x) => x.childUserId === a.userId
        );

        switch (column) {
          case 'priority': {
            const childAlertOne = getChildAlertModel({
              attendance: attendanceData,
              child: childUserOne,
              classroomGroups,
              childExternalWorkflowStatusId,
              childPendingWorkflowStatusId: pendingStatusId,
            });

            const childAlertTwo = getChildAlertModel({
              child: childUserTwo,
              attendance: attendanceData,
              classroomGroups,
            });
            return childAlertOne.severity > childAlertTwo.severity ? 1 : -1;
          }
          case 'surname':
            return (childUserOne !== undefined && childUserOne.user?.surname!) >
              (childUserTwo !== undefined && childUserTwo.user?.surname!)
              ? 1
              : -1;
          case 'age':
            return (childUserOne !== undefined &&
              childUserOne.user?.dateOfBirth !== undefined) >
              (childUserTwo !== undefined &&
                childUserTwo.user?.dateOfBirth !== undefined)
              ? 1
              : -1;
          case 'firstName':
          default:
            return (childUserOne !== undefined &&
              childUserOne.user?.firstName!) >
              (childUserTwo !== undefined && childUserTwo.user?.firstName!)
              ? 1
              : -1;
        }
      });

      const childListItem: UserAlertListDataItem[] = [];
      for (const child of sorted) {
        childListItem.push(mapUserListDataItem(child));
      }
      setChildUserListData(childListItem || []);
    }
  };

  const mapUserListDataItem = (
    childRecord: ChildDto
  ): UserAlertListDataItem => {
    const child = children?.find((x) => x.userId === childRecord.userId);

    const childAlert = getChildAlertModel({
      attendance: attendanceData,
      child: child,
      classroomGroups,
      childExternalWorkflowStatusId,
      childPendingWorkflowStatusId: pendingStatusId,
    });

    return {
      id: childRecord.id,
      profileDataUrl: child?.user?.profileImageUrl,
      title: `${child?.user?.firstName} ${child?.user?.surname}`,
      subTitle: childAlert?.message ?? '',
      profileText: `${child?.user?.firstName && child?.user?.firstName[0]}${
        child?.user?.surname && child?.user?.surname[0]
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
