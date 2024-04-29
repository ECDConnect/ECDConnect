import { LoadingSpinner, Typography } from '@ecdlink/ui';
import { useUser } from '../hooks/useUser';
import { useQuery } from '@apollo/client';
import { GetAllNotifications, Notification } from '@ecdlink/graphql';
import { NotificationsMessages } from '../components/notifications-messages/notifications-messages';
import { format } from 'date-fns';

export const NotificationsView = () => {
  const { user } = useUser();
  const {
    data: notificationsData,
    refetch: refetchNotification,
    loading,
  } = useQuery<{ allNotifications: Notification[] }>(GetAllNotifications, {
    variables: {
      userId: user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  // const notifications = notificationsData?.allNotifications;
  const notifications = [
    {
      __typename: 'Notification',
      id: 'id-1',
      fromUserId: '702b289d-6686-4c29-8652-8000faf9dacb',
      messageProtocol: 'push',
      message: '{ # } CHWs opted out in { Month YYYY}',
      messageTemplateType: 'gg-portal-tl-missing-monthly-report',
      subject: 'Remember to submit the report for KT-points-clinic!',
      sentByUserId: '702b289d-6686-4c29-8652-8000faf9dacb',
      from: '702b289d-6686-4c29-8652-8000faf9dacb',
      relatedToUserId: 'f1dd570b-41f8-4135-9306-8c67f507f151',
      messageDate: '2024-04-23T00:00:00.000Z',
      messageEndDate: '2024-04-09T00:00:00.000Z',
      readDate: '2024-04-23T18:17:26.522Z',
      status: 'amber',
      cTA: '[[See CHWs]]',
      cTAText: 'See CHWs',
      ordering: 0,
      messageTemplate: {
        __typename: 'MessageTemplate',
        id: '393d088e-feb5-4d74-ac06-32536c75c032',
        ordering: 0,
        templateType: 'gg-portal-tl-missing-monthly-report',
        subject: 'Remember to submit the report for [[ClinicName]]!',
        message:
          "You haven't added the [[PreviousMonthName]] report yet! Make sure you submit the report before 7 [[PreviousMonthName]].",
        cTA: '[[See CHWs]]',
        cTAText: 'See CHWs',
        typeCode: null,
      },
      action: '{"url":"/team-meetings", "state":{"month":"02", "year":"2024"}}',
    },
    {
      __typename: 'Notification',
      id: 'id-2',
      fromUserId: '702b289d-6686-4c29-8652-8000faf9dacb',
      messageProtocol: 'push',
      message:
        "You haven't added the March 2024 report yet! Make sure you submit the report before 7 March 2024.",
      messageTemplateType: 'gg-portal-tl-missing-monthly-report',
      subject: 'Remember to submit the report for KT-points-clinic!',
      sentByUserId: '702b289d-6686-4c29-8652-8000faf9dacb',
      from: '702b289d-6686-4c29-8652-8000faf9dacb',
      relatedToUserId: 'f1dd570b-41f8-4135-9306-8c67f507f151',
      messageDate: '2024-04-23T00:00:00.000Z',
      messageEndDate: '2024-04-09T00:00:00.000Z',
      readDate: '2024-04-23T18:17:26.522Z',
      status: 'amber',
      cTA: '[[Contact [[TeamLeadName]]]]',
      cTAText: '[[Contact [[TeamLeadName]]]]',
      ordering: 0,
      messageTemplate: {
        __typename: 'MessageTemplate',
        id: '393d088e-feb5-4d74-ac06-32536c75c032',
        ordering: 0,
        templateType: 'gg-portal-tl-missing-monthly-report',
        subject: 'Remember to submit the report for [[ClinicName]]!',
        message:
          "You haven't added the [[PreviousMonthName]] report yet! Make sure you submit the report before 7 [[PreviousMonthName]].",
        cTA: '[[NumberOptedOut]]',
        cTAText: 'Add meeting report',
        typeCode: null,
      },
      action:
        '{"url":"/clinics/view-clinics", "state":{"clinicId":"15fafe8e-0c99-433d-988a-719228824c07"}}',
    },
  ] as Notification[];

  if (loading) {
    return (
      <LoadingSpinner
        className="p-8"
        size="medium"
        spinnerColor="adminPortalBg"
        backgroundColor="secondary"
      />
    );
  }

  return (
    <div className="p-4">
      {notifications?.length === 0 && (
        <div className="h-100vh flex items-center justify-center">
          <Typography
            type={'h4'}
            color={'textDark'}
            text={'There are not notifications'}
            className="p-12"
          />
        </div>
      )}
      {notifications?.length > 0 &&
        notifications?.map((item) => (
          <NotificationsMessages
            className="mb-4"
            refetchNotification={refetchNotification}
            ctaText={item?.cTAText}
            date={format(new Date(item?.messageDate), 'd MMMM y')}
            statusColor={item?.status}
            subject={item?.subject}
            title={item?.message}
            action={item?.action}
            cTA={item?.cTA}
            id={item?.id}
            relatedToUserId={item?.relatedToUserId}
            readDate={item?.readDate}
          />
        ))}
    </div>
  );
};
