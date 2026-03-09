import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import ROUTES from '@/routes/routes';
import { getAvatarColor } from '@ecdlink/core';
import { Button, StackedList, Typography } from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router';

export const ProgressTabReportSummary: React.FC = () => {
  const history = useHistory();

  const [showDetails, setShowDetails] = useState(false);

  const { childReports } = useProgressForChildren();

  const { hasPermissionToCreateProgressReports } = useUserPermissions();

  const incompleteReportsList = useMemo(() => {
    return childReports
      .filter((x) => !x.report || !x.report.dateCompleted)
      .map((childReport) => ({
        id: childReport.childId,
        profileDataUrl: childReport.childProfileImageUrl,
        profileText: childReport.childFullName,
        avatarColor: getAvatarColor() || '',
        title: childReport?.childFullName || childReport.childFirstName,
        subTitle: childReport.isObservationsComplete
          ? 'Observations complete'
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
  }, [childReports, history]);

  const completeReportsList = useMemo(() => {
    return childReports
      .filter((x) => !!x.report && !!x.report.dateCompleted)
      .map((childReport) => ({
        id: childReport.childId,
        profileDataUrl: childReport.childProfileImageUrl,
        profileText: childReport.childFirstName,
        avatarColor: getAvatarColor() || '',
        title: childReport.childFirstName,
        subTitle: 'Report complete',
        alertSeverity: 'success',
        onActionClick: () =>
          history.push(ROUTES.PROGRESS_REPORT_LIST, {
            childId: childReport.childId,
          }),
      }));
  }, [childReports, history]);

  return (
    <>
      {incompleteReportsList.length != 0 &&
        hasPermissionToCreateProgressReports && (
          <Typography
            className="mt-4"
            color="textDark"
            text={'You still need to create progress reports for:'}
            type={'h3'}
          />
        )}
      <StackedList
        className={'mt-4 flex flex-col gap-1'}
        listItems={incompleteReportsList}
        type={'UserAlertList'}
      />
      {!!completeReportsList.length && (
        <Button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full"
          size="normal"
          color="quatenary"
          type="outlined"
          icon={showDetails ? 'EyeOffIcon' : 'EyeIcon'}
          text={
            showDetails ? 'Hide completed reports' : 'Show completed reports'
          }
          textColor="quatenary"
        />
      )}
      {showDetails && !!completeReportsList.length && (
        <>
          <Typography
            className="mt-4"
            color="textDark"
            text={'You completed reports for:'}
            type={'h3'}
          />
          <StackedList
            className={'mt-4 flex flex-col gap-1'}
            listItems={completeReportsList}
            type={'UserAlertList'}
          />
        </>
      )}
    </>
  );
};
