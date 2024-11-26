import { Alert, BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { ReactComponent as NoProgressEmoticon } from '../../../../assets/ECD_Connect_emoji4.svg';
import { ReactComponent as ComingSoonIcon } from '../../../../assets/icon/coming_soon.svg';
import ROUTES from '@/routes/routes';
import { useProgressForChild } from '@/hooks/useProgressForChild';
import { ProgressReportsList } from './reports-list';
import ProgressWalkthroughWrapper from '../walkthrough/progress-walkthrough-wrapper';
import { useAppContext } from '@/walkthrougContext';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';

export type ChildProgressReportsListRouteState = {
  childId: string;
};

export const ChildProgressReportsList: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { state: routeState } =
    useLocation<ChildProgressReportsListRouteState>();
  const {
    state: { run: isWalkthrough },
  } = useAppContext();
  const planActivitiesPermission = practitioner?.permissions?.find(
    (item) => item?.permissionName === PermissionsNames.create_progress_reports
  );

  const { childId } = routeState;
  const {
    child,
    currentAgeGroup,
    currentReportingPeriod,
    detailedReports,
    ageInMonths,
  } = useProgressForChild(childId);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Progress Observation Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const trackProgress = () => {
    history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
      childId: routeState?.childId,
    });
  };

  const walkthroughReports = [
    {
      id: 'walkthrough',
      childId: 'walkthrough',
      childProgressReportPeriodId: 'walkthrough',
      reportingPeriodNumber: 2,
      reportingPeriodStartDate: new Date(new Date().getFullYear(), 8, 1),
      reportingPeriodEndDate: new Date(new Date().getFullYear(), 8, 31),
      skillsToWorkOn: [],
      unknownPercentage: 0,
      unknownCount: 0,
      skillObservations: [],
      ageInMonthsAtReport: 3,
    },
    {
      id: 'walkthrough',
      childId: 'walkthrough',
      childProgressReportPeriodId: 'walkthrough',
      reportingPeriodNumber: 1,
      reportingPeriodStartDate: new Date(new Date().getFullYear(), 6, 1),
      reportingPeriodEndDate: new Date(new Date().getFullYear(), 6, 30),
      skillsToWorkOn: [],
      unknownPercentage: 0,
      unknownCount: 0,
      skillObservations: [],
      ageInMonthsAtReport: 3,
    },
    {
      id: 'walkthrough',
      childId: 'walkthrough',
      childProgressReportPeriodId: 'walkthrough',
      reportingPeriodNumber: 2,
      reportingPeriodStartDate: new Date(new Date().getFullYear() - 1, 8, 1),
      reportingPeriodEndDate: new Date(new Date().getFullYear() - 1, 8, 31),
      skillsToWorkOn: [],
      unknownPercentage: 0,
      unknownCount: 0,
      skillObservations: [],
      ageInMonthsAtReport: 3,
    },
  ];

  const reports = isWalkthrough ? walkthroughReports : detailedReports;

  return (
    <BannerWrapper
      size={'small'}
      title={`${child?.user?.firstName}'s progress`}
      onBack={() =>
        history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
      }
      renderBorder={true}
      displayOffline={!isOnline}
    >
      <ProgressWalkthroughWrapper />
      <div className={'flex h-full flex-col px-4 pb-4'}>
        {/* No reports and no age group for child */}
        {!isWalkthrough &&
          !currentAgeGroup &&
          !!currentReportingPeriod &&
          (!reports || reports.length === 0) && (
            <div className="mt-2 flex flex-col justify-center p-8">
              <div>
                <Typography
                  className="mt-4 text-center"
                  color="textDark"
                  text="Progress tracking for older children coming soon!"
                  type={'h2'}
                />
              </div>
              <div className="mt-6 flex w-full justify-center">
                <ComingSoonIcon className="h-40 w-40" />
              </div>
              <div>
                <Typography
                  className="mt-6 text-center"
                  color="textMid"
                  text="We don't have a progress tracker for children over 5 years old yet!"
                  type={'body'}
                />
              </div>
            </div>
          )}
        {/* NO REPORTS */}
        {!isWalkthrough &&
          !!ageInMonths &&
          ageInMonths <= 60 &&
          (!reports || reports.length === 0) && (
            <div className="flex h-full w-full flex-col">
              <Typography
                className={'mt-4'}
                type="h2"
                color={'textDark'}
                text={`${child?.user?.firstName}'s reports`}
              />
              <div className="mt-2 flex flex-col justify-center p-8">
                <div className="mt-10 flex justify-center">
                  <NoProgressEmoticon className="h-40 w-40" />
                </div>
                <div>
                  <Typography
                    className="mt-4 text-center"
                    color="textDark"
                    text={`${child?.user?.firstName} doesn't have any progress reports yet!`}
                    type={'h2'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2 text-center"
                    color="textMid"
                    text="Tap the button below to start"
                    type={'body'}
                  />
                </div>
              </div>
              <div className="mt-auto">
                {!currentReportingPeriod && (
                  <Alert
                    type="info"
                    title="All reporting periods for the year are closed. You can keep tracking progress next year."
                  />
                )}
                {!!currentReportingPeriod && (
                  <Button
                    onClick={() => trackProgress()}
                    className="w-full"
                    size="small"
                    color="quatenary"
                    type="filled"
                    icon="PencilIcon"
                    text="Start tracking progress"
                    textColor="white"
                  />
                )}
              </div>
            </div>
          )}

        {/* REPORTS LIST */}
        {(isWalkthrough || (!!reports && !!reports.length)) && (
          <div className="flex h-full w-full flex-col">
            <Typography
              className={'mt-4 mb-4'}
              type="h2"
              color={'textDark'}
              text={`${child?.user?.firstName}'s reports`}
            />
            <div id="pastReports">
              <ProgressReportsList childId={childId} reports={reports} />
            </div>

            <div className="mt-auto">
              {!isWalkthrough && !currentReportingPeriod && (
                <Alert
                  type="info"
                  title="All reporting periods for the year are closed. You can keep tracking progress next year."
                />
              )}
              {!!reports && !!reports.length && (
                <Button
                  onClick={() =>
                    history.push(ROUTES.PROGRESS_SHARE_REPORT, {
                      childId: routeState.childId,
                    })
                  }
                  className="w-full"
                  size="small"
                  color="quatenary"
                  type={'filled'}
                  textColor={'white'}
                  icon="ShareIcon"
                  text="Share a report"
                />
              )}
              {!!currentReportingPeriod &&
                planActivitiesPermission?.isActive && (
                  <Button
                    onClick={() => trackProgress()}
                    className="mt-4 w-full"
                    size="small"
                    color="quatenary"
                    type={!!reports && !!reports.length ? 'outlined' : 'filled'}
                    textColor={
                      !!reports && !!reports.length ? 'quatenary' : 'white'
                    }
                    icon="ArrowCircleRightIcon"
                    text="Track progress"
                  />
                )}
            </div>
          </div>
        )}
        <div id="progressEnd" />
      </div>
    </BannerWrapper>
  );
};
