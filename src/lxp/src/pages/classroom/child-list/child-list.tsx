import { ChildDto, LearnerDto, useDialog, getAvatarColor } from '@ecdlink/core';
import {
  DialogPosition,
  FADButton,
  SearchDropDown,
  StackedList,
  AlertSeverityType,
  ComponentBaseProps,
  FilterInfo,
  SearchDropDownOption,
  SearchSortOptions,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { isBefore } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { getChildAlertModel } from '@utils/child/child-alert-message-util';
import SearchHeader from '../../../components/search-header/search-header';
import * as styles from './child-list.styles';
import { attendanceSelectors } from '@store/attendance';
import { documentSelectors } from '@store/document';
import { contentReportSelectors } from '@store/content/report';
import { useStaticData } from '@hooks/useStaticData';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import ROUTES from '@/routes/routes';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import { childrenForPractitionerSelectors } from '@/store/childrenForPractitioner';

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

export const ChildList: React.FC<ComponentBaseProps> = () => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const { getWorkflowStatusIdByEnum } = useStaticData();
  const pendingStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildPending
  );
  const history = useHistory();
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const children = useSelector(childrenSelectors.getChildren);
  const childrenForPrincipal = useSelector(
    childrenForPractitionerSelectors?.getChildrenForPractitioner
  );

  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const getAllClassroomGroups = useSelector(
    classroomsSelectors?.getAllClassroomGroups
  );
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

  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState<any[]>([]);
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem[]>();
  const [filteredChildData, setFilteredChildData] = useState<
    UserAlertListDataItem[]
  >([]);
  const [updatedPlaygroups, setUpdatedPlaygroups] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitionerId = practitioner?.id;
  const isPrincipal = practitioner?.isPrincipal === true;
  const principalClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === practitioner?.userId
  );

  const principalLearners = classroomGroupLearners.filter((el) => {
    return principalClassroomGroups.some((f) => {
      return f.id === el.classroomGroupId; // filter only principal learners
    });
  });

  const principalChildren = children?.filter((el) => {
    return principalLearners.some((f) => {
      return f.userId === el.userId; // filter only principal learners
    });
  });

  useEffect(() => {
    if (classroomGroups && classroomGroupLearners) {
      const groupedItems: SearchDropDownOption<string>[] = isPrincipal
        ? classroomGroups?.map((groupedItem, idx) =>
            groupedItem.name === NoPlaygroupClassroomType.name
              ? {
                  id: idx.toString(),
                  label: NoPlaygroupClassroomType.title,
                  value: groupedItem.id ?? '',
                }
              : {
                  id: idx.toString(),
                  label: groupedItem.name,
                  value: groupedItem.id ?? '',
                }
          )
        : classroomGroups?.map((groupedItem, idx) =>
            groupedItem.name === NoPlaygroupClassroomType.name
              ? {
                  id: idx.toString(),
                  label: NoPlaygroupClassroomType.title,
                  value: groupedItem.id ?? '',
                }
              : {
                  id: idx.toString(),
                  label: groupedItem.name,
                  value: groupedItem.id ?? '',
                }
          );

      setUpdatedPlaygroups(groupedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllClassroomGroups, classroomGroupLearners]);

  useEffect(() => {
    if (!isPrincipal) {
      if (principalLearners && children && pendingStatusId) {
        const childListItem: UserAlertListDataItem[] = [];

        for (const child of children) {
          const learner = principalLearners.find(
            (x) => x.userId === child.userId && x.stoppedAttendance == null
          );
          childListItem.push(mapUserListDataItem(child, learner));
        }

        setChildUserListData(childListItem);
        setFilteredChildData(childListItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroupLearners, children, pendingStatusId]);

  useEffect(() => {
    if (isPrincipal) {
      if (classroomGroupLearners && children && pendingStatusId) {
        const childListItem: UserAlertListDataItem[] = [];

        for (const child of children) {
          const learner = classroomGroupLearners.find(
            (x) => x.userId === child.userId && x.stoppedAttendance == null
          );
          childListItem.push(mapUserListDataItem(child, learner));
        }
        setChildUserListData(childListItem);
        setFilteredChildData(childListItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    classroomGroupLearners,
    childrenForPrincipal,
    pendingStatusId,
    isPrincipal,
  ]);

  const onChildListItemAction = (childId: string) => {
    history.push(ROUTES.CHILD_PROFILE, {
      childId,
    });
  };

  const onFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setActiveFilters(value);
    const selectedClassrooms = value.map((x) => x.value);
    if (!isPrincipal) {
      const childListItem: UserAlertListDataItem[] = [];
      if (principalChildren && principalLearners) {
        if (value && value.length > 0) {
          for (const child of principalChildren) {
            const learner = principalLearners.find(
              (x) =>
                x.userId === child.userId &&
                /* ensures only children in a playgroup are shown and not those who stopped attending or changed playgroups */
                x.stoppedAttendance == null &&
                selectedClassrooms.some((sc) => sc === x.classroomGroupId)
            );
            if (learner) {
              childListItem.push(mapUserListDataItem(child, learner));
            }
          }
        } else {
          for (const child of principalChildren) {
            const learner = principalLearners.find(
              (x) => x.userId === child.userId && x.stoppedAttendance == null
            );
            if (learner) {
              childListItem.push(mapUserListDataItem(child, learner));
            }
          }
        }
      }
      setChildUserListData(childListItem || []);
      setActiveSort([]);
    } else {
      const childListItem: UserAlertListDataItem[] = [];
      if (children && classroomGroupLearners) {
        if (value && value.length > 0) {
          for (const child of children) {
            const learner = classroomGroupLearners.find(
              (x) =>
                x.userId === child.userId &&
                /* ensures only children in a playgroup are shown and not those who stopped attending or changed playgroups */
                x.stoppedAttendance == null &&
                selectedClassrooms.some((sc) => sc === x.classroomGroupId)
            );
            if (learner) {
              childListItem.push(mapUserListDataItem(child, learner));
            }
          }
        } else {
          for (const child of children) {
            const learner = classroomGroupLearners.find(
              (x) => x.userId === child.userId && x.stoppedAttendance == null
            );
            if (learner) {
              childListItem.push(mapUserListDataItem(child, learner));
            }
          }
        }
      }
      setChildUserListData(childListItem || []);
      setActiveSort([]);
    }
  };

  const onSortItemsChanges = (column: string) => {
    if (children && classroomGroupLearners) {
      const filteredChildren = children?.filter((child) =>
        childUserListData?.some((x) => x.id === child.id)
      );
      const sorted = [...(filteredChildren || [])].sort(
        (a: ChildDto, b: ChildDto) => {
          const childUserOne = childUsers?.find((x) => x.id === a.userId);
          const childUserTwo = childUsers?.find((x) => x.id === b.userId);
          const childLearnerOne = classroomGroupLearners?.find(
            (x) => x.userId === a.userId
          );
          const childLearnerTwo = classroomGroupLearners?.find(
            (x) => x.userId === b.userId
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
                getAllClassroomGroups,
                classroomGroupProgrammes,
                childReportsOne
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
                getAllClassroomGroups,
                classroomGroupProgrammes,
                childReportsTwo
              );
              return childAlertOne.severity > childAlertTwo.severity ? 1 : -1;
            }
            case 'surname':
              return (childUserOne !== undefined &&
                childUserOne?.surname?.toUpperCase()!) >
                (childUserTwo !== undefined &&
                  childUserTwo.surname?.toUpperCase()!)
                ? 1
                : -1;
            case 'age':
              if (
                childUserOne !== undefined &&
                childUserOne?.dateOfBirth !== undefined &&
                childUserTwo !== undefined &&
                childUserTwo?.dateOfBirth !== undefined
              ) {
                return isBefore(
                  new Date(childUserOne.dateOfBirth),
                  new Date(childUserTwo.dateOfBirth)
                )
                  ? 1
                  : -1;
              } else return 1;
            case 'firstName':
            default:
              return (childUserOne !== undefined &&
                childUserOne.firstName?.toUpperCase()!) >
                (childUserTwo !== undefined &&
                  childUserTwo.firstName?.toUpperCase()!)
                ? 1
                : -1;
          }
        }
      );

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
      getAllClassroomGroups,
      classroomGroupProgrammes,
      reports
    );

    return {
      id: childRecord.id,
      profileDataUrl: childUser?.profileImageUrl,
      title: `${childUser?.firstName} ${childUser?.surname}`,
      subTitle: childAlert?.message ?? '',
      profileText: `${
        childUser?.firstName && childUser?.firstName[0]?.toUpperCase()
      }${childUser?.surname && childUser?.surname[0]?.toUpperCase()}`,
      alertSeverity: childAlert.status as AlertSeverityType,
      avatarColor: getAvatarColor() || '',
      onActionClick: () => {
        onChildListItemAction(String(childRecord.id));
      },
    };
  };

  const handleListScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const registerNewChild = () => {
    if (isOnline) {
      history.push(ROUTES.CHILD_REGISTRATION_LANDING, { practitionerId });
    } else {
      showOnlineOnly();
    }
  };

  const onSearchChange = (value: string) => {
    setFilteredChildData(
      childUserListData?.filter((x) =>
        x.title.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <>
      {children && children.length > 0 && (
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
              onSortItemsChanges(selectedColumns[0]?.value);
            }}
            placeholder={'Sort By'}
            multiple={false}
            color={'secondary'}
            info={{
              name: `Sort By:`,
            }}
          />
        </SearchHeader>
      )}

      <div className={styles.overlay}>
        {(!children || children.length === 0) && (
          <IconInformationIndicator
            title="You don't have any children yet!"
            subTitle="Tap the add a child button below to start"
          />
        )}
        {childUserListData ? (
          <StackedList
            className={styles.stackedList}
            listItems={childUserListData}
            type={'UserAlertList'}
            onScroll={(scrollTop: number) => handleListScroll(scrollTop)}
          />
        ) : null}
        <FADButton
          title={'Add a child'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle={addChildButtonExpanded}
          type={'filled'}
          color={'primary'}
          shape={'round'}
          className={styles.fadButton}
          click={registerNewChild}
        />
      </div>
    </>
  );
};

export default ChildList;
