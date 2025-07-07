import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import ROUTES from '@/routes/routes';
import { getAvatarColor } from '@ecdlink/core';
import { StackedList, Typography } from '@ecdlink/ui';
import { useMemo } from 'react';
import { useHistory } from 'react-router';

export const ProgressTabObservationsSummary: React.FC = () => {
  const history = useHistory();

  const { childReports } = useProgressForChildren();

  const incompleteObservationsList = useMemo(() => {
    return childReports
      .filter((x) => !x.isObservationsComplete)
      .map((childReport) => ({
        id: childReport.childId,
        profileDataUrl: childReport.childProfileImageUrl,
        profileText: childReport.childFullName,
        avatarColor: getAvatarColor() || '',
        title: childReport.childFirstName,
        subTitle: childReport.isInProgress ? 'In progress' : 'Not started',
        alertSeverity: childReport.isInProgress ? 'warning' : 'error',
        onActionClick: () =>
          history.push(ROUTES.PROGRESS_REPORT_LIST, {
            childId: childReport.childId,
          }),
      }));
  }, [childReports, history]);

  return (
    <>
      <Typography
        className="mt-4"
        color="textDark"
        text={'You still need to complete observations for:'}
        type={'h3'}
      />
      <StackedList
        className={'mt-4 flex flex-col gap-1'}
        listItems={incompleteObservationsList}
        type={'UserAlertList'}
      />
    </>
  );
};
