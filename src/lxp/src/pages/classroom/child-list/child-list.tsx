import {
  ChildDto,
  useDialog,
  getAvatarColor,
  usePrevious,
} from '@ecdlink/core';
import {
  DialogPosition,
  FADButton,
  SearchDropDown,
  StackedList,
  AlertSeverityType,
  ComponentBaseProps,
  SearchDropDownOption,
  SearchSortOptions,
  UserAlertListDataItem,
  BannerWrapper,
} from '@ecdlink/ui';
import { format, isBefore } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { childrenSelectors, childrenThunkActions } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { getChildAlertModel } from '@utils/child/child-alert-message-util';
import SearchHeader from '../../../components/search-header/search-header';
import * as styles from './child-list.styles';
import { attendanceSelectors } from '@store/attendance';
import { useStaticData } from '@hooks/useStaticData';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '../class-dashboard/class-dashboard.types';
import { ChildData, ChildListRouteState } from './child-list.types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { ChildProfileRouteState } from '@/pages/child/child-profile/child-profile.types';
import { useTenantModules } from '@/hooks/useTenantModules';
import { useTenant } from '@/hooks/useTenant';
import { AnyAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/store';

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
  const childPendingWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildPending
  );
  const childExternalWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildExternalLink
  );

  const { state } = useLocation<ChildListRouteState>();

  const classroomGroupId = state?.classroomGroupId;

  const dispatch = useAppDispatch();

  const previousChildrenClassroomGroupId = usePrevious(state?.classroomGroupId);

  const history = useHistory();
  const isTrialPeriod = useIsTrialPeriod();
  const attendanceData = useSelector(attendanceSelectors.getAttendance);

  const children = useSelector(childrenSelectors.getChildren);
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(state?.classroomGroupId)
  );
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { hasPermissionToManageChildren } = useUserPermissions();
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const { attendanceEnabled } = useTenantModules();

  const hasPermissionToEdit =
    hasPermissionToManageChildren || practitioner?.isPrincipal || isTrialPeriod;
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<
    SearchDropDownOption<ClassroomGroupDto>[]
  >([]);
  const [activeSort, setActiveSort] = useState<any[]>([]);
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem<ChildData>[]>();
  const [filteredChildData, setFilteredChildData] = useState<
    UserAlertListDataItem<ChildData>[]
  >([]);
  const [classOptions, setClassOptions] = useState<
    SearchDropDownOption<ClassroomGroupDto>[]
  >([]);

  const [learners, setLearners] = useState<ChildDto[]>([]);

  const today = new Date();

  const { practitionerIsOnLeave } = usePractitionerAbsentees(practitioner!);

  const onChildListItemAction = useCallback(
    (childId: string) => {
      history.push(ROUTES.CHILD_PROFILE, {
        childId,
        practitionerIsOnLeave,
        classroomGroupIdFromRedirect: state?.classroomGroupId,
      } as ChildProfileRouteState);
    },
    [history, practitionerIsOnLeave, state]
  );

  const onFilterClasses = (
    value: SearchDropDownOption<ClassroomGroupDto>[]
  ) => {
    setSelectedClasses(value);

    if (!value.length) {
      return setFilteredChildData(childUserListData ?? []);
    }

    const filteredChildren =
      childUserListData?.filter((child) =>
        value.some((x) =>
          x.value?.learners?.some(
            (learner) =>
              learner.childUserId &&
              learner.childUserId === child.extraData?.userId
          )
        )
      ) || [];

    setFilteredChildData(filteredChildren);
  };

  const onSortItemsChanges = (column: string) => {
    if (filteredChildData?.length) {
      const sorted = [...filteredChildData].sort((dataA, dataB) => {
        const childA = dataA.extraData;
        const childB = dataB.extraData;

        switch (column) {
          case 'attendance':
            return childA?.attendancePercentage! > childB?.attendancePercentage!
              ? 1
              : -1;
          case 'priority': {
            return childA?.alertSeverity! > childB?.alertSeverity! ? 1 : -1;
          }
          case 'surname':
            return (childA !== undefined &&
              childA?.user?.surname?.toUpperCase()!) >
              (childB !== undefined && childB?.user?.surname?.toUpperCase()!)
              ? 1
              : -1;
          case 'age':
            if (
              childA !== undefined &&
              childA?.user?.dateOfBirth !== undefined &&
              childB !== undefined &&
              childB?.user?.dateOfBirth !== undefined
            ) {
              return isBefore(
                new Date(childA?.user?.dateOfBirth),
                new Date(childB?.user?.dateOfBirth)
              )
                ? 1
                : -1;
            } else return 1;
          case 'firstName':
          default:
            return (childA !== undefined &&
              childA?.user?.firstName?.toUpperCase()!) >
              (childB !== undefined && childB?.user?.firstName?.toUpperCase()!)
              ? 1
              : -1;
        }
      });

      return setFilteredChildData(sorted);
    }
  };

  const mapUserListDataItem = useCallback(
    (child: ChildDto): UserAlertListDataItem<ChildData> => {
      const childAttendance = attendanceData?.filter(
        (attendance) => attendance.userId === child.userId
      );

      const childAlert = getChildAlertModel({
        attendance: isWhiteLabel && !attendanceEnabled ? [] : childAttendance,
        child,
        classroomGroups,
        childExternalWorkflowStatusId,
        childPendingWorkflowStatusId,
      });

      return {
        id: child.id,
        profileDataUrl: child?.user?.profileImageUrl,
        title: `${child?.user?.firstName} ${child?.user?.surname}`,
        subTitle: childAlert?.message ?? '',
        profileText: `${
          child?.user?.firstName && child?.user?.firstName[0]?.toUpperCase()
        }${child?.user?.surname && child?.user?.surname[0]?.toUpperCase()}`,
        alertSeverity: childAlert.status as AlertSeverityType,
        avatarColor: getAvatarColor() || '',
        extraData: {
          ...child,
          alertSeverity: childAlert.severity,
          attendancePercentage: childAlert.attendancePercentage,
        },
        hideAlertSeverity: childAlert.status === 'none',
        onActionClick: () => {
          onChildListItemAction(String(child.id));
        },
      };
    },
    [
      attendanceData,
      childExternalWorkflowStatusId,
      childPendingWorkflowStatusId,
      classroomGroups,
      onChildListItemAction,
    ]
  );

  const handleListScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setAddChildButtonExpanded(true);
    } else {
      setAddChildButtonExpanded(false);
    }
  };

  const registerNewChild = () => {
    if (isOnline) {
      history.push(ROUTES.CHILD_REGISTRATION_LANDING);
    } else {
      showOnlineOnly();
    }
  };

  const onSearchChange = (value: string) => {
    setFilteredChildData(
      childUserListData?.filter((x) =>
        x.title.toLowerCase()?.includes(value.toLowerCase())
      ) || []
    );
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const populateClassOptions = useCallback(() => {
    const classOptions = classroomGroups?.map((currentClass) => ({
      id: currentClass.id,
      label: currentClass.name,
      value: currentClass,
    }));
    const selectedClassForRedirectedClass = classOptions.filter(
      (currentClass) => currentClass.value?.id === state?.classroomGroupId
    );

    setClassOptions(classOptions);
    setSelectedClasses(selectedClassForRedirectedClass);
  }, [classroomGroups, state?.classroomGroupId]);

  const populateStackedList = useCallback(() => {
    const mappedChildren = children?.map((child) => mapUserListDataItem(child));
    const mappedChildrenForRedirectedClass =
      mappedChildren?.filter((child) =>
        classroomGroup?.learners?.some(
          (learner) =>
            (learner.childUserId === child.extraData?.userId ||
              learner.childUserId === child.extraData?.user?.id) &&
            learner.isActive
        )
      ) ?? [];

    setChildUserListData(mappedChildren);
    setFilteredChildData(mappedChildrenForRedirectedClass);
  }, [children, classroomGroup?.learners, mapUserListDataItem]);

  const populateInitialState = useCallback(() => {
    if (
      !children?.length ||
      state?.classroomGroupId === previousChildrenClassroomGroupId
    )
      return;

    populateStackedList();
    populateClassOptions();
  }, [
    children?.length,
    populateClassOptions,
    populateStackedList,
    previousChildrenClassroomGroupId,
    state?.classroomGroupId,
  ]);

  useEffect(() => {
    populateInitialState();
  }, [populateInitialState]);

  useEffect(() => {
    if (classroomGroupId) {
      dispatch(
        childrenThunkActions.getChildrenForClassroomGroup({
          classroomGroupId,
        }) as unknown as AnyAction
      )
        .unwrap()
        .then((response: any) => {
          setLearners(response.childrenTest);
        })
        .catch((error: unknown) => {
          console.error('Failed to fetch children:', error);
        });
    }
  }, [classroomGroupId, dispatch]);

  return (
    <BannerWrapper
      title="Children"
      subTitle={format(today, 'EEEE, dd MMMM')}
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.CLASSES,
        } as ClassDashboardRouteState)
      }
      size="small"
    >
      {children &&
        children.length > 0 &&
        learners &&
        learners.length > 0 &&
        filteredChildData &&
        filteredChildData.length > 0 && (
          <SearchHeader<UserAlertListDataItem>
            searchItems={filteredChildData || []}
            onScroll={handleListScroll}
            onSearchChange={onSearchChange}
            isTextSearchActive={searchTextActive}
            onBack={() => setSearchTextActive(false)}
            onSearchButtonClick={() => setSearchTextActive(true)}
          >
            <SearchDropDown<ClassroomGroupDto>
              displayMenuOverlay={true}
              menuItemClassName={styles.dropdownStyles}
              overlayTopOffset="0"
              className="mr-1"
              options={classOptions}
              selectedOptions={selectedClasses}
              onChange={onFilterClasses}
              placeholder="Classes"
              pluralSelectionText="Classes"
              multiple
              color="quatenary"
              info={{
                name: 'Filter by: Class',
                hint: 'You can select multiple classes',
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
              color={'quatenary'}
              info={{
                name: `Sort By:`,
              }}
            />
          </SearchHeader>
        )}
      <div className={styles.overlay}>
        {!childUserListData?.length && !learners.length && (
          <IconInformationIndicator
            title="You don't have any children yet!"
            subTitle="Tap the add a child button below to start"
          />
        )}
        {!!childUserListData?.length &&
          !filteredChildData?.length &&
          !learners.length && (
            <IconInformationIndicator
              title="You don't have any children in this class yet!"
              subTitle=""
            />
          )}
        {filteredChildData?.length > 0 && learners && learners.length > 0 && (
          <StackedList
            className={styles.stackedList}
            listItems={filteredChildData || []}
            type={'UserAlertList'}
            onScroll={(scrollTop: number) => handleListScroll(scrollTop)}
          />
        )}
        {hasPermissionToEdit && (
          <FADButton
            title={'Add a child'}
            icon={'PlusIcon'}
            iconDirection={'left'}
            textToggle={addChildButtonExpanded}
            type={'filled'}
            color={'quatenary'}
            shape={'round'}
            className={styles.fadButton}
            click={registerNewChild}
          />
        )}
      </div>
    </BannerWrapper>
  );
};

export default ChildList;
