import { BannerWrapper, Button, CoreRadioGroup, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useProgressForChildrenCoach } from '@/hooks/useProgressForChildrenCoach';
import { PractitionerProfileRouteState } from '../../coach-practitioner-classroom.types';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { useAppDispatch } from '@/store';
import { progressTrackingThunkActions } from '@/store/progress-tracking';
import { format } from 'date-fns';

export const CoachProgressViewReportsSummarySelectClassroomGroupAndAgeGroup: React.FC =
  () => {
    const history = useHistory();
    const appDispatch = useAppDispatch();
    const location = useLocation<PractitionerProfileRouteState>();
    const practitionerUserId = location.state.practitionerId;

    const practitionerClassroomGroups = useSelector(
      classroomsForCoachSelectors.getClassroomGroupsForPractitioner(
        practitionerUserId
      )
    );

    const { children, currentReportingPeriodForSummary } =
      useProgressForChildrenCoach(practitionerUserId, true);

    const [selectedAgeGroup, setSelectedAgeGroup] = useState<
      number | undefined
    >();

    const availableAgeGroups = useMemo(() => {
      const childrenForClassroomGroup = children.filter((x) =>
        practitionerClassroomGroups?.filter((y) =>
          y.learners.some((y) => y.childUserId === x.childUserId)
        )
      );

      const ageGroups = childrenForClassroomGroup
        .map((x) => x.ageGroup)
        .filter((x) => !!x);

      return ageGroups.filter(
        (x, index) => ageGroups.findIndex((y) => x!.id === y!.id) === index
      );
    }, [children, practitionerClassroomGroups]);

    const fetchProgressReports = useCallback(async () => {
      appDispatch(
        progressTrackingThunkActions.getChildProgressReportsForPractitioner({
          id: practitionerUserId,
        })
      ).unwrap();
    }, [appDispatch, practitionerUserId]);

    useEffect(() => {
      fetchProgressReports();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <BannerWrapper
        size={'small'}
        title={`Child progress summary`}
        onBack={() => history.goBack()}
      >
        <div className={'flex h-full flex-col px-4 pb-4 pt-4'}>
          <Typography
            color="textDark"
            text={'Choose an age range to view'}
            type={'h2'}
            className="mb-4"
          />
          <Typography
            className="mb-2"
            type="h4"
            color="textMid"
            text={`Report ${
              currentReportingPeriodForSummary?.reportNumber
            } - ${format(
              new Date(
                currentReportingPeriodForSummary?.startDate || new Date()
              ),
              'd MMM'
            )} to ${format(
              new Date(currentReportingPeriodForSummary?.endDate || new Date()),
              'd MMM yyyy'
            )}`}
          />
          <CoreRadioGroup
            options={availableAgeGroups.map((x, index) => ({
              id: index,
              label: x!.name,
              value: x!.id,
            }))}
            currentValue={selectedAgeGroup}
            colour={'quatenary'}
            selectedOptionBackgroundColor="uiBg"
            onChange={(val: number) => {
              setSelectedAgeGroup(val);
            }}
          />
          <Button
            onClick={() => {
              history.replace(
                ROUTES.COACH.COACH_PROGRESS_VIEW_REPORTS_SUMMARY,
                {
                  ageGroupId: selectedAgeGroup,
                  practitionerId: practitionerUserId,
                }
              );
            }}
            className="mt-4 mb-4 w-full"
            size="normal"
            color="quatenary"
            type="filled"
            text={'Next'}
            icon={'ArrowCircleRightIcon'}
            textColor="white"
            disabled={!selectedAgeGroup}
          />
        </div>
      </BannerWrapper>
    );
  };
