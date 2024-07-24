import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { childrenSelectors } from '@store/children';
import { contentReportSelectors } from '@store/content/report';
import { analyticsActions } from '@store/analytics';
import { ChildCompletedObservsationReportsState } from '../progress-observation/child-completed-observation-reports/child-completed-observation-reports.types';
import NoProgressEmoticon from '../../../assets/no-progress-emoticon.png';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { classroomsSelectors } from '@/store/classroom';

export const ChildProgressReportsList: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { state: routeState } =
    useLocation<ChildCompletedObservsationReportsState>();

  const childId = routeState?.childId;
  const currentChild = useSelector(childrenSelectors.getChildById(childId));

  const childProgressReports = useSelector(
    contentReportSelectors.getChildProgressObservationReports(
      routeState?.childId
    )
  );
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(currentChild?.userId!)
  );
  const childPractioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(classroomGroup?.userId || '')
  );

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
    history.push(ROUTES.PROGRESS_OBSERVATIONS, {
      childId: routeState?.childId,
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${currentChild?.user?.firstName}'s progress`}
      onBack={() =>
        history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
      }
    >
      <div className={'flex flex-col px-4 pb-4'}>
        <Typography
          className={'mt-4'}
          type="h2"
          color={'textDark'}
          text={`${currentChild?.user?.firstName}'s reports`}
        />
        {/* NO REPORTS (TODO - NEED TO HANDLE CHILD TOO OLD)*/}
        {(!childProgressReports || childProgressReports.length === 0) && (
          <div className={'border-uiLight mt-4 flex flex-col items-stretch'}>
            <div className="grid grid-cols-1 justify-center gap-4">
              <div className="flex justify-center">
                <img
                  width={'30%'}
                  src={NoProgressEmoticon}
                  alt="No progress reports"
                />
              </div>
              <div className="flex justify-center">
                <div className="flex w-8/12 justify-center">
                  <Typography
                    type="h3"
                    color="textDark"
                    text={`${currentChild?.user?.firstName} doesn't have any progress reports yet!`}
                    className={'text-center'}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex w-8/12 justify-center">
                  <Typography
                    type="body"
                    color="textMid"
                    text={`Encourage ${
                      childPractioner?.user?.firstName || 'the practioner'
                    } to start observing ${
                      currentChild?.user?.firstName
                    } & track progress on Funda App.`}
                    className={'text-center'}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Typography
                  type="body"
                  color="textMid"
                  text={'Tap the button below to start'}
                  className={'mb-4'}
                />
              </div>
            </div>
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
          </div>
        )}

        {/* REPORTS LIST */}
      </div>
    </BannerWrapper>
  );
};
