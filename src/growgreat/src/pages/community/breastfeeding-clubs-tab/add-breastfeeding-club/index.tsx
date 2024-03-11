import ROUTES from '@/routes/routes';
import {
  AttendanceListDataItem,
  AttendanceStackedList,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Checkbox,
  DatePicker,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useHistory, useLocation } from 'react-router';
import { AddBreastFeedingClubRouteState } from './types';
import { COMMUNITY_TABS } from '../../community';
import { CommunityRouteState } from '../../community.types';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { AddBreastFeedingClubInputModelInput } from '@ecdlink/graphql';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CommunityActions } from '@/store/community/community.actions';
import { useSnackbar } from '@ecdlink/core';

export const AddBreastfeedingClub: React.FC = () => {
  const [date, setDate] = useState<Date | null>();
  const [attendance, setAttendance] = useState<AttendanceListDataItem[]>([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const clinic = useAppSelector(communitySelectors.getClinicSelector);
  const availableCaregivers = useAppSelector(
    communitySelectors.getAvailableCaregiversForBreastFeedingClubSelector
  );
  const healthCareWorker = useAppSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const appDispatch = useAppDispatch();

  const history = useHistory();

  const { state } = useLocation<AddBreastFeedingClubRouteState>();

  const { showMessage } = useSnackbar();

  const {
    isLoading: isAddingBreastfeedingClub,
    wasLoading: wasAddingBreastfeedingClub,
    isRejected: isRejectedAddingBreastfeedingClub,
    error: errorAddingBreastfeedingClub,
  } = useThunkFetchCall('community', CommunityActions.ADD_BREAST_FEEDING_CLUB);
  const {
    isLoading: isLoadingAvailableCaregivers,
    wasLoading: wasLoadingAvailableCaregivers,
    isRejected: isRejectedAvailableCaregivers,
    error: errorAvailableCaregivers,
  } = useThunkFetchCall(
    'community',
    CommunityActions.GET_AVAILABLE_CAREGIVERS_FOR_BREAST_FEEDING_CLUB
  );

  const isLoading = isAddingBreastfeedingClub || isLoadingAvailableCaregivers;
  const wasLoading =
    wasAddingBreastfeedingClub || wasLoadingAvailableCaregivers;
  const isRejected =
    isRejectedAddingBreastfeedingClub || isRejectedAvailableCaregivers;
  const error = errorAddingBreastfeedingClub || errorAvailableCaregivers;

  const today = new Date();
  const month = format(today, 'MMMM');
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const uniqueCaregivers = availableCaregivers
    ?.filter(
      (caregiver, index, self) =>
        index === self.findIndex((t) => t.caregiverId === caregiver.caregiverId)
    )
    ?.sort((a, b) =>
      `${a.firstName}${b.firstName}`?.toLowerCase() >
      `${b.firstName}${b.surname}`?.toLowerCase()
        ? 1
        : -1
    );

  const count = attendance?.filter(
    (item) => item.status === AttendanceStatus.Present
  )?.length;

  const initialAttendance = uniqueCaregivers?.map(
    (member): AttendanceListDataItem => ({
      title: `${member.firstName ?? ''} ${member.surname ?? ''}`,
      profileText:
        member.firstName?.charAt(0) ?? '' + member.surname?.charAt(0) ?? '',
      attenendeeId: member.caregiverId ?? '',
      profileDataUrl: '',
      avatarColor: '',
      status: AttendanceStatus.Absent,
    })
  );

  const onSubmit = async () => {
    const input: AddBreastFeedingClubInputModelInput = {
      clinicId: clinic?.id,
      meetingDate: date,
      healthCareWorkerId: healthCareWorker?.id,
      clientsAttendedConfirmed: true,
      clients: attendance
        .filter((caregiver) => caregiver.status === AttendanceStatus.Present)
        .map((caregiver) => caregiver.attenendeeId),
    };

    await appDispatch(communityThunkActions.addBreastFeedingClub(input));
  };

  const onBack = () => {
    if (state?.isFromPointsScreen) {
      return history.push(ROUTES.COMMUNITY.TEAM.POINTS.ROOT);
    }

    return history.push(ROUTES.COMMUNITY.ROOT, {
      activeTabIndex: COMMUNITY_TABS.BREASTFEEDING_CLUBS,
    } as CommunityRouteState);
  };

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({
        message: error,
        type: 'error',
      });
    }
  }, [error, isLoading, isRejected, showMessage, wasLoading]);

  useEffect(() => {
    if (wasAddingBreastfeedingClub && !isLoading && !isRejected) {
      showMessage({
        message: 'Breastfeeding club added',
        type: 'success',
      });
      history.push(ROUTES.COMMUNITY.ROOT, {
        activeTabIndex: COMMUNITY_TABS.BREASTFEEDING_CLUBS,
      } as CommunityRouteState);
    }
  }, [isLoading, isRejected, history, showMessage, wasAddingBreastfeedingClub]);

  useEffect(() => {
    if (clinic?.id) {
      appDispatch(
        communityThunkActions.getAvailableCaregiversForBreastFeedingClub({
          clinicId: clinic.id,
        })
      );
    }
  }, [appDispatch, clinic?.id]);

  return (
    <BannerWrapper
      isLoading={isLoadingAvailableCaregivers}
      title="Add a breastfeeding club"
      onBack={onBack}
      renderBorder
      renderOverflow
      className="p-4 pt-6"
    >
      <form className="flex h-full flex-col">
        <Typography type="h2" text="Add a breastfeeding club" />
        <Typography type="h4" text={month} color="textMid" className="mb-4" />
        <DatePicker
          label="What day was the breastfeeding club held?"
          hint="You can only add breastfeeding clubs for the current month."
          placeholderText="Tap to choose a date"
          selected={date}
          onChange={setDate}
          minDate={firstDayOfMonth}
          maxDate={today}
        />
        <Typography
          type="h3"
          text="Take attendance for this meeting"
          color="textDark"
          className="mt-4"
        />
        <Typography
          type="body"
          text="Tap a name to mark a client present"
          color="textMid"
          className="mb-4"
        />
        <div>
          <AttendanceStackedList
            scroll={false}
            listItems={attendance.length ? attendance : initialAttendance ?? []}
            onChange={setAttendance}
            type="light"
          />
        </div>
        <Checkbox
          className="my-4"
          description={`I confirm that ${count} client${
            count > 1 ? 's' : ''
          } attended`}
          checked={checkboxChecked}
          onCheckboxChange={() => setCheckboxChecked(!checkboxChecked)}
        />
        <div className="mt-auto w-full pb-4">
          <Button
            className="w-full"
            type="filled"
            textColor="white"
            color="primary"
            text="Save"
            icon="SaveIcon"
            disabled={!date || !checkboxChecked || isAddingBreastfeedingClub}
            isLoading={isAddingBreastfeedingClub}
            onClick={onSubmit}
          />
        </div>
      </form>
    </BannerWrapper>
  );
};
