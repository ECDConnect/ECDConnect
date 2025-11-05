import { useAppDispatch } from '@/store';
import {
  getJourneyAssessmentReport,
  getJourneyTimeline,
} from '@/store/pqa/pqa.actions';
import {
  getJourneyAssessmentReportByIdSelector,
  getJourneyTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { getUser } from '@/store/user/user.selectors';
import { Alert, Button, LoadingSpinner, Steps } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RoleSystemNameEnum } from '@ecdlink/core';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { journeyTimelineSteps } from './timeline/journey-timeline-steps';
import { PractitionerProfileRouteState } from '../practitioner-profile.types';

interface PractitionerJourneyProps {
  onIsDisplayFormChange: (value: boolean) => void;
  onIsDisplayReportChange: (value: boolean) => void;
}

export const JourneyTimeline = ({
  onIsDisplayFormChange,
  onIsDisplayReportChange,
}: PractitionerJourneyProps) => {
  const [visitId, setVisitId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  const history = useHistory();
  const appDispatch = useAppDispatch();
  const location = useLocation<PractitionerProfileRouteState>();

  const user = useSelector(getUser);
  const userId = user?.id || '';
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const timelineItems = useSelector(getJourneyTimelineByIdSelector(userId));
  const timelineReport = useSelector(
    getJourneyAssessmentReportByIdSelector(visitId)
  );

  // Fetch journey timeline
  useEffect(() => {
    const fetchTimeline = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        await appDispatch(getJourneyTimeline({ userId })).unwrap();
      } catch (error) {
        console.error('Failed to fetch journey timeline:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, [appDispatch, userId]);

  // Fetch report when visitId changes
  useEffect(() => {
    const fetchReport = async () => {
      if (!visitId || !userId) return;
      if (timelineReport?.visitId === visitId) {
        onIsDisplayReportChange(true);
        return;
      }
      setIsFetchingReport(true);
      try {
        await appDispatch(getJourneyAssessmentReport({ visitId })).unwrap();
      } catch (error) {
        console.error('Failed to fetch journey report:', error);
      } finally {
        setIsFetchingReport(false);
        onIsDisplayReportChange(true);
      }
    };
    fetchReport();
  }, [visitId, userId, appDispatch]);

  // Handle view button click
  const onView = (newVisitId: string) => {
    setVisitId(newVisitId);
    history.replace({
      ...location,
      state: { ...location.state, visitId: newVisitId },
    });
  };

  const renderAlert = () =>
    !!practitioner?.coachHierarchy && (
      <Alert
        className="mt-2"
        type="info"
        variant="flat"
        title={`Need help? Contact your ${RoleSystemNameEnum.Coach} or ask for a visit.`}
        customMessage={
          <div className="mt-4">
            <Button
              onClick={() => history.push(ROUTES.COACH.ROOT)}
              icon="UserIcon"
              text={`See ${RoleSystemNameEnum.Coach}`}
              size="normal"
              color="quatenary"
              textColor="white"
              type="filled"
            />
          </div>
        }
      />
    );

  if (isLoading || isFetchingReport) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="pt-4"
      />
    );
  }

  return (
    <div className="p-4">
      {renderAlert()}
      <Button
        className="mb-4 w-full"
        color="quatenary"
        type="outlined"
        textColor="quatenary"
        icon="ClipboardListIcon"
        text="Fill in a form"
        onClick={() => onIsDisplayFormChange(true)}
      />
      {!!timelineItems && (
        <Steps
          items={journeyTimelineSteps({
            timelineItems: timelineItems ?? [],
            isLoading: isLoading,
            onView: onView,
          })}
          typeColor={{ completed: 'successMain' }}
        />
      )}
    </div>
  );
};
