import { classroomsSelectors } from '@/store/classroom';
import {
  Alert,
  AlertSeverityType,
  BannerWrapper,
  SearchDropDown,
  SearchDropDownOption,
  StackedList,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ClassroomGroupDto, getAvatarColor } from '@ecdlink/core';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';
import SearchHeader from '@/components/search-header/search-header';
import { ChildData } from '../../child-list/child-list.types';

export const SelectChildToTrack: React.FC = () => {
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<
    SearchDropDownOption<ClassroomGroupDto>[]
  >([]);

  const history = useHistory();

  const { currentReportingPeriod, childReports, children } =
    useProgressForChildren();

  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const [selectClassroomGroupIds, setSelectedClassroomGroupIds] = useState<
    string[]
  >(classroomGroups.map((x) => x.id));

  const startDate = useMemo(
    () => new Date(currentReportingPeriod!.startDate),
    [currentReportingPeriod]
  );
  const endDate = useMemo(
    () => new Date(currentReportingPeriod!.endDate),
    [currentReportingPeriod]
  );

  const filteredChildren = useSelector(
    classroomsSelectors.getLearnersForClassroomGroups(
      selectClassroomGroupIds,
      startDate,
      endDate
    )
  );

  const filteredReports = useMemo(() => {
    const filteredChildIds = filteredChildren
      .flatMap((x) => x.learners)
      .map((x) => x.childUserId);

    return childReports.filter((x) =>
      filteredChildIds.some((y) => y === x.childUserId)
    );
  }, [filteredChildren, childReports]);

  const childList = useMemo(() => {
    return filteredReports.map((childReport) => ({
      id: childReport.childId,
      profileDataUrl: childReport.childProfileImageUrl,
      profileText: childReport.childFirstName,
      avatarColor: getAvatarColor() || '',
      title: childReport.childFirstName,
      extraData: { userId: childReport.childUserId } as ChildData,
      subTitle: childReport.isObservationsComplete
        ? 'Completed'
        : childReport.isInProgress
        ? 'In progress'
        : 'Not started',
      alertSeverity: childReport.isObservationsComplete
        ? ('success' as AlertSeverityType)
        : childReport.isInProgress
        ? ('warning' as AlertSeverityType)
        : ('error' as AlertSeverityType),
      onActionClick: () =>
        history.push(ROUTES.PROGRESS_REPORT_LIST, {
          childId: childReport.childId,
        }),
    }));
  }, [filteredReports]);

  const childListWithoutReport = useMemo(() => {
    return children
      .filter((child) => (child.ageInMonths ?? 0) < 61)
      .map((child) => ({
        id: child.childId,
        profileDataUrl: child.childProfileImageUrl,
        profileText: child.childFirstName,
        extraData: { userId: child.childUserId } as ChildData,
        avatarColor: getAvatarColor() || '',
        title: child.childFirstName,
        subTitle: 'Not started',
        alertSeverity: 'error' as AlertSeverityType,
        onActionClick: () =>
          history.push(ROUTES.PROGRESS_REPORT_LIST, {
            childId: child.childId,
          }),
      }));
  }, [children, history]);

  const classOptions = useMemo(
    () =>
      classroomGroups?.map((currentClass) => ({
        id: currentClass.id,
        label: currentClass.name,
        value: currentClass,
      })) || [],
    [classroomGroups]
  );

  const childUserListData = useMemo(() => {
    return childList.length !== 0 ? childList : childListWithoutReport;
  }, [childList, childListWithoutReport]);

  const onSearchChange = (value: string) => {
    const filtered =
      childUserListData?.filter((child) =>
        child.title.toLowerCase()?.includes(value.toLowerCase())
      ) || [];
    setFilteredChildData(filtered);
  };

  const [filteredChildData, setFilteredChildData] = useState(childUserListData);

  const onFilterClasses = (
    value: SearchDropDownOption<ClassroomGroupDto>[]
  ) => {
    setSelectedClasses(value);
    setSelectedClassroomGroupIds(value.map((x) => x.id));
  };

  // we need to find the children over 5 from the original list and not filtered
  const anyChildrenOver5 = children.some(
    (x) => x.ageInMonths && x.ageInMonths > 60
  );

  return (
    <BannerWrapper
      size={'small'}
      title={`Track progress - report ${currentReportingPeriod?.reportNumber}`}
      subTitle="Step 1 of 1"
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.PROGRESS,
        })
      }
    >
      <div className="mt-2 flex flex-col p-4">
        <Typography
          color="textDark"
          text={'Choose a child below to track progress'}
          type={'h2'}
        />
        <SearchHeader<UserAlertListDataItem>
          searchItems={filteredChildData || []}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          onBack={() => setSearchTextActive(false)}
          onSearchButtonClick={() => setSearchTextActive(true)}
          className={
            'flex w-full flex-row items-center overflow-x-auto bg-transparent px-5 py-1'
          }
        >
          <SearchDropDown<ClassroomGroupDto>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4 -mt-10'}
            overlayTopOffset="0"
            className="mr-1"
            options={classOptions}
            selectedOptions={selectedClasses}
            onChange={onFilterClasses}
            placeholder="Class"
            multiple={true}
            pluralSelectionText="Classes"
            color="quatenary"
            info={{
              name: 'Filter by: Class',
            }}
          />
        </SearchHeader>
        <StackedList
          className={'mt-4 flex flex-col gap-1'}
          listItems={
            childList.length !== 0 ? childList : childListWithoutReport
          }
          type={'UserAlertList'}
        />
        {anyChildrenOver5 && (
          <Alert
            className="mt-4"
            type={'warning'}
            messageColor="textDark"
            title={'Some children are older than 5 years old!'}
            list={[
              'Our progress trackers are only for children 5 years old and younger',
              "Stay tuned, tools for tracking older children's progress are coming soon!",
            ]}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
