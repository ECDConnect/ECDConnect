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
import {
  Alert,
  Button,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  Steps,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RoleSystemNameEnum, useDialog } from '@ecdlink/core';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { PublishedFormCertificate } from './published-forms/published-form-certificate';
import { journeyTimelineSteps } from './timeline/journey-timeline-steps';
import { PractitionerProfileRouteState } from '../practitioner-profile.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { format } from 'date-fns';

interface PractitionerJourneyProps {
  onIsDisplayFormChange: (value: boolean) => void;
  onIsDisplayReportChange: (value: boolean) => void;
  tenantName: string;
}

export const JourneyTimeline = ({
  onIsDisplayFormChange,
  onIsDisplayReportChange,
  tenantName,
}: PractitionerJourneyProps) => {
  const [visitId, setVisitId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedCourseCompletedDate, setSelectedCourseCompletedDate] =
    useState('');

  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
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
      if (!userId || !isOnline) return;
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
  }, [appDispatch, userId, isOnline]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!visitId || !userId || !isOnline) {
        onIsDisplayReportChange(false);
        setIsLoading(false);
        return;
      }

      // If we already have the report for this visitId, skip fetch
      if (timelineReport?.visitId === visitId) {
        onIsDisplayReportChange(true);
        setIsLoading(false); // Ensure loader is off
        return;
      }

      setIsLoading(true);
      onIsDisplayReportChange(false); // Hide report until we have data

      try {
        await appDispatch(getJourneyAssessmentReport({ visitId })).unwrap();

        // After successful fetch, check if report actually has data
        const hasReport =
          !!timelineReport && timelineReport.visitId === visitId;
        onIsDisplayReportChange(hasReport);
      } catch (error) {
        console.error('Failed to fetch journey report:', error);
        onIsDisplayReportChange(false); // No report on error
      } finally {
        setIsLoading(false); // Always stop loader
      }
    };

    fetchReport();
  }, [visitId, userId, isOnline, appDispatch, timelineReport]);

  const onCertificate = (courseName: string, completedDate: string) => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }
    setSelectedCourseName(courseName);
    setSelectedCourseCompletedDate(completedDate);
    setShowCertificateDialog(true);
  };

  // Handle view button click
  const onView = (newVisitId: string) => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }
    setVisitId(newVisitId);
    history.replace({
      ...location,
      state: { ...location.state, visitId: newVisitId },
    });
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  };

  const renderAlert = () =>
    !!practitioner?.coachHierarchy && (
      <Alert
        className="mb-4"
        type="info"
        variant="flat"
        title={`Need help? Contact your ${RoleSystemNameEnum.Coach} or ask for a visit.`}
        customMessage={
          <div className="mt-4">
            <Button
              onClick={() =>
                history.push(ROUTES.PRACTITIONER.CONTACT_COACH, {
                  comingFromJourneyTab: true,
                })
              }
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

  return (
    <>
      <Dialog
        visible={showCertificateDialog}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <PublishedFormCertificate
          courseName={selectedCourseName}
          courseCompletedDate={selectedCourseCompletedDate}
          onBack={setShowCertificateDialog}
        />
      </Dialog>
      <div className="p-4">
        {isLoading ? (
          <LoadingSpinner
            size="medium"
            spinnerColor="primary"
            backgroundColor="uiLight"
            className="pt-4"
          />
        ) : (
          <>
            {renderAlert()}
            <Button
              className="mb-4 w-full"
              color="quatenary"
              type="outlined"
              textColor="quatenary"
              icon="ClipboardListIcon"
              text="Fill in a form"
              onClick={() =>
                isOnline ? onIsDisplayFormChange(true) : showOnlineOnly()
              }
            />
            <Steps
              items={journeyTimelineSteps({
                timelineItems: timelineItems ?? [],
                isLoading: isLoading,
                onView: onView,
                onCertificate: onCertificate,
                tenantName: tenantName,
                startDate:
                  format(new Date(practitioner?.startDate!), 'dd MMMM yyyy') ??
                  '',
              })}
              typeColor={{ completed: 'successMain' }}
            />
          </>
        )}
      </div>
    </>
  );
};
