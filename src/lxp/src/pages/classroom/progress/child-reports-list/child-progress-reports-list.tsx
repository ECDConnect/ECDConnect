import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
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

export type ChildProgressReportsList = {
  childId: string;
};

export const ChildProgressReportsList: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { state: routeState } = useLocation<ChildProgressReportsList>();

  const { childId } = routeState;
  const { child, currentAgeGroup, currentReportingPeriod, detailedReports } =
    useProgressForChild(childId);

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

  return (
    <BannerWrapper
      size={'small'}
      title={`${child?.user?.firstName}'s progress`}
      onBack={() =>
        history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
      }
    >
      <div className={'flex h-full flex-col px-4 pb-4'}>
        {/* No reports and no age group for child */}
        {!currentAgeGroup &&
          !!currentReportingPeriod &&
          (!detailedReports || detailedReports.length === 0) && (
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
        {!!currentReportingPeriod &&
          !!currentAgeGroup &&
          (!detailedReports || detailedReports.length === 0) && (
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
              <Button
                onClick={() => trackProgress()}
                className="mt-auto w-full"
                size="small"
                color="quatenary"
                type="filled"
                icon="PencilIcon"
                text="Start tracking progress"
                textColor="white"
              />
            </div>
          )}

        {/* REPORTS LIST */}
        {!!detailedReports && !!detailedReports.length && (
          <div className="flex h-full w-full flex-col">
            <Typography
              className={'mt-4 mb-4'}
              type="h2"
              color={'textDark'}
              text={`${child?.user?.firstName}'s reports`}
            />
            <ProgressReportsList childId={childId} reports={detailedReports} />
            {!!detailedReports && !!detailedReports.length && (
              <Button
                onClick={() =>
                  history.push(ROUTES.PROGRESS_SHARE_REPORT, {
                    childId: routeState.childId,
                  })
                }
                className="mt-auto w-full"
                size="small"
                color="quatenary"
                type={'filled'}
                textColor={'white'}
                icon="ShareIcon"
                text="Share a report"
              />
            )}
            {!!detailedReports && (
              <Button
                onClick={() => trackProgress()}
                className="mt-4 w-full"
                size="small"
                color="quatenary"
                type={
                  !!detailedReports && !!detailedReports.length
                    ? 'outlined'
                    : 'filled'
                }
                textColor={
                  !!detailedReports && !!detailedReports.length
                    ? 'quatenary'
                    : 'white'
                }
                icon="ArrowCircleRightIcon"
                text="Track progress"
              />
            )}
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
