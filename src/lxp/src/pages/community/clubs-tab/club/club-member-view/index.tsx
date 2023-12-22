import {
  BannerWrapper,
  Card,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { clubSelectors } from '@/store/club';
import { useAppDispatch } from '@/store';
import { useEffect, useState } from 'react';
import { attendanceThunkActions } from '@/store/attendance';
import { classroomsSelectors } from '@/store/classroom';
import { practitionerForCoachThunkActions } from '@/store/practitionerForCoach';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { AttendanceActions } from '@/store/attendance/attendance.actions';
import { PractitionersForCoachActions } from '@/store/practitionerForCoach/practitionerForCoach.actions';
import { ContactDialog } from '@/components/contact-dialog/contact-dialog';
import {
  ActionItem,
  ActionItemAcceptLeaderRoleDetails,
  HostFamilyDaysDetails,
} from '@/models/club/actionItem';
import { AcceptLeaderDetails } from './components/accept-leader-details';
import { HostFamilyDayDetails } from './components/host-family-day-details';
import { MeetRegularlyDetails } from './components/meet-regularly-details';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiOrangeSurprise } from '@/assets/ECD_Connect_emoji11.svg';

export const ClubMemberView: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { practitionerId } = useParams<ClubsRouteState>();
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId ?? '')
  );
  const firstName = practitioner?.user?.firstName ?? '';

  const practitionerClub = useSelector(
    clubSelectors.getClubByIdSelector(practitioner?.clubId || '')
  );
  const classroomGroups = useSelector(
    classroomsSelectors.getClassroomGroupsForUser(practitionerId || '')
  );
  const classroomId = classroomGroups[0]?.classroomId;

  const [showActionItemContactDialog, setShowActionItemContactDialog] =
    useState<boolean>(false);
  const [actionItemSelected, setActionItemSelected] = useState<
    ActionItem | undefined
  >(undefined);

  // Start load of all required club data
  useEffect(() => {
    if (!!practitioner && !!practitioner.userId) {
      if (!!classroomId) {
        appDispatch(
          attendanceThunkActions.getMonthlyAttendanceReport({
            userId: practitioner.userId,
            classroomId: classroomId,
            startDate: new Date(new Date().getFullYear(), 1, 1),
            endDate: new Date(),
          })
        );
      }
      appDispatch(
        practitionerForCoachThunkActions.getChildProgressReportsStatusForUser({
          userId: practitioner.userId,
        })
      );
    }
  }, [appDispatch, practitioner?.userId, classroomId]);

  // Make sure we have loading spinner if we are still fetching all the club data
  const { isLoading: isLoadingFamilyDays } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_HOST_FAMILY_DETAILS
  );
  const { isLoading: isLoadingMeetRegular } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  );
  const { isLoading: isLoadingAttendance } = useThunkFetchCall(
    'attendanceData',
    AttendanceActions.GET_MONTHLY_ATTENDANCE_REPORT
  );
  const { isLoading: isLoadingChildProgress } = useThunkFetchCall(
    'practitionerForCoach',
    PractitionersForCoachActions.GET_CHILD_PROGRESS_REPORTS_STATUS
  );

  // Action items
  const actionItemList = useSelector(
    clubSelectors.getClubActionItemsForPractitionerSelector(
      practitionerId || '',
      practitioner?.clubId || ''
    )
  );

  const contributions = useSelector(
    clubSelectors.getClubContributionsForPractitionerSelector(
      practitionerId || '',
      practitioner?.clubId || ''
    )
  );

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={practitionerClub?.name}
      subTitle={`${practitioner?.user?.firstName} ${practitioner?.user?.surname}`}
      onBack={() => history.goBack()}
    >
      {isLoadingFamilyDays ||
      isLoadingMeetRegular ||
      isLoadingAttendance ||
      isLoadingChildProgress ? (
        <LoadingSpinner
          className="mt-6"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          {/* Action item list */}
          {!!actionItemList && !!actionItemList.length && (
            <div className="mt-4 flex justify-center">
              <StackedList
                className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                type="MenuList"
                listItems={actionItemList.map((item) => {
                  return {
                    title: item.title,
                    titleStyle: 'text-textDark font-semibold',
                    subTitle: item.subTitle,
                    subTitleStyle: 'text-textMid',
                    menuIcon: 'ExclamationIcon',
                    menuIconClassName: 'text-white',
                    showIcon: true,
                    iconBackgroundColor: 'alertMain',
                    onActionClick: () => {
                      setActionItemSelected(item);
                      setShowActionItemContactDialog(true);
                    },
                    classNames: 'bg-uiBg',
                  };
                })}
              />
            </div>
          )}
          <Typography
            type="h2"
            className="mt-6"
            text={`${firstName}'s contributions to the club`}
          />
          {/* Contributions list */}
          {!!contributions && !!contributions.length && (
            <div className="mt-4 flex-col ">
              {contributions.map((item, index) => {
                return (
                  <Card
                    key={index}
                    className={`mt-2 px-4 py-4 bg-${
                      item.positiveStatus ? 'successBg' : 'alertBg'
                    }`}
                    shadowSize={'lg'}
                    borderRaduis="lg"
                  >
                    <div className="flex flex-row items-center">
                      {item.positiveStatus ? (
                        <EmojiGreenSmile className="mr-4 h-12 w-12" />
                      ) : (
                        <EmojiOrangeSurprise className="mr-4 h-12 w-12" />
                      )}

                      <div className="flex-col">
                        <Typography
                          type="h4"
                          className="text-textDark font-semibold"
                          text={item.title}
                        />
                        <Typography
                          type="h6"
                          className="text-textMid text-sm"
                          text={item.subTitle}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
      {!!actionItemSelected && (
        <Dialog
          fullScreen
          visible={showActionItemContactDialog}
          position={DialogPosition.Top}
        >
          <ContactDialog
            firstName={firstName}
            phoneNumber={practitioner?.user?.phoneNumber || ''}
            whatsAppNumber={practitioner?.user?.whatsappNumber || ''}
            title={`${firstName} ${practitioner?.user?.surname || ''}`}
            subTitle={
              actionItemSelected.type === 'AcceptLeaderRole'
                ? 'Club leader agreement missing'
                : actionItemSelected.type === 'HostFamilyDays'
                ? 'Events missed'
                : 'Club meetings missed'
            }
            onClose={() => {
              setShowActionItemContactDialog(false);
              setActionItemSelected(undefined);
            }}
          >
            {actionItemSelected.type === 'AcceptLeaderRole' && (
              <AcceptLeaderDetails
                firstName={firstName}
                dateAssigned={
                  (
                    actionItemSelected.details as ActionItemAcceptLeaderRoleDetails
                  ).dateAssigned
                }
              />
            )}
            {actionItemSelected.type === 'HostFamilyDays' && (
              <HostFamilyDayDetails
                firstName={firstName}
                meetingsAttended={
                  (actionItemSelected.details as HostFamilyDaysDetails)
                    .meetingsAttended
                }
                meetingsTotal={
                  (actionItemSelected.details as HostFamilyDaysDetails)
                    .meetingsTotal
                }
              />
            )}
            {actionItemSelected.type === 'MeetRegularly' && (
              <MeetRegularlyDetails
                firstName={firstName}
                meetingsAttended={
                  (actionItemSelected.details as HostFamilyDaysDetails)
                    .meetingsAttended
                }
                meetingsTotal={
                  (actionItemSelected.details as HostFamilyDaysDetails)
                    .meetingsTotal
                }
              />
            )}
          </ContactDialog>
        </Dialog>
      )}
    </BannerWrapper>
  );
};
