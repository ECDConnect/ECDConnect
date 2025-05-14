import { classroomsSelectors } from '@/store/classroom';
import {
  Alert,
  BannerWrapper,
  Dropdown,
  RoundIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getAvatarColor } from '@ecdlink/core';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';

export const SelectChildToTrack: React.FC = () => {
  const history = useHistory();

  const { currentReportingPeriod, childReports, children } =
    useProgressForChildren();

  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const [selectClassroomGroupIds, setSelectedClassroomGroupIds] = useState<
    string[]
  >(classroomGroups.map((x) => x.id));

  const filteredChildren = useSelector(
    classroomsSelectors.getLearnersForClassroomGroups(
      selectClassroomGroupIds,
      new Date(currentReportingPeriod!.startDate),
      new Date(currentReportingPeriod!.endDate)
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
      subTitle: childReport.isObservationsComplete
        ? 'Completed'
        : childReport.isInProgress
        ? 'In progress'
        : 'Not started',
      alertSeverity: childReport.isObservationsComplete
        ? 'success'
        : childReport.isInProgress
        ? 'warning'
        : 'error',
      onActionClick: () =>
        history.push(ROUTES.PROGRESS_REPORT_LIST, {
          childId: childReport.childId,
        }),
    }));
  }, [filteredReports]);

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
        {/* Classroom group filter */}
        <div className="mt-4 flex flex-row">
          <RoundIcon
            backgroundColor="secondary"
            iconColor="white"
            icon="SearchIcon"
            className="mr-4"
          />
          <Dropdown
            placeholder="Class"
            selectedValue={
              selectClassroomGroupIds.length > 1
                ? undefined
                : selectClassroomGroupIds[0]
            }
            list={classroomGroups.map((x) => ({
              label: x.name,
              value: x.id,
            }))}
            onChange={(item) => {
              setSelectedClassroomGroupIds([item]);
            }}
          />
        </div>
        <StackedList
          className={'mt-4 flex flex-col gap-1'}
          listItems={childList}
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
