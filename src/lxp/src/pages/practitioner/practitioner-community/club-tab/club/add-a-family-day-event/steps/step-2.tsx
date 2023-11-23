import {
  AttendanceListDataItem,
  AttendanceStackedList,
  AttendanceStatus,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { usePrevious } from '@ecdlink/core';

export const Step2 = ({
  termConfig,
  setIsEnabledButton,
  setStep2,
}: AddMeetingProps) => {
  const [attendance, setAttendance] = useState<AttendanceListDataItem[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

  const initialAttendance = club?.clubMembers?.map(
    (member): AttendanceListDataItem => ({
      title: `${member.firstName ?? ''} ${member.surname ?? ''}`,
      profileText: member.firstName.charAt(0) + member.surname.charAt(0),
      profileDataUrl: member.profileImageUrl,
      attenendeeId: member.practitionerId,
      avatarColor: '#D7D1E6',
      status: AttendanceStatus.Present,
    })
  );

  const presentList = useMemo(() => {
    if (!attendance.length) {
      return initialAttendance;
    }

    return attendance?.filter(
      (item) => item.status === AttendanceStatus.Present
    );
  }, [attendance, initialAttendance]);
  const previousPresentList = usePrevious(presentList) as
    | AttendanceListDataItem[]
    | undefined;

  const updatedList = useMemo(
    () => (attendance.length ? attendance : initialAttendance ?? []),
    [attendance, initialAttendance]
  );

  useEffect(() => {
    setIsEnabledButton(isChecked);
  }, [setIsEnabledButton, isChecked]);

  useEffect(() => {
    if (presentList?.length !== previousPresentList?.length) {
      setStep2?.({
        participants: updatedList?.map((item) => ({
          practitionerId: item.attenendeeId,
          attended: item.status === AttendanceStatus.Present,
        })),
      });
    }
  }, [presentList?.length, previousPresentList?.length, setStep2, updatedList]);

  return (
    <>
      <Typography
        type="h2"
        text={`Add a family day event for ${termConfig?.term}`}
      />
      <Typography
        className="mb-5"
        type="body"
        color="textMid"
        text={`${termConfig?.initialMonth} to ${
          termConfig?.lastMonth
        } ${new Date().getFullYear()}`}
      />
      <Typography
        type="h4"
        color="textDark"
        className="mb-2"
        text="Take practitioner attendance for the event"
      />
      <Typography
        type="body"
        color="textMid"
        className="mb-2"
        text="Tap a name to mark a practitioner absent"
      />
      <div className="mb-4">
        <AttendanceStackedList
          scroll={false}
          listItems={attendance.length ? attendance : initialAttendance ?? []}
          onChange={setAttendance}
        />
      </div>
      <Checkbox
        description={`Check to confirm that you have accurately captured practitioner attendance for the event (${
          presentList?.length
        } practitioner${
          presentList && presentList?.length > 1 ? 's' : ''
        } attended).`}
        descriptionColor="textMid"
        checked={isChecked}
        onCheckboxChange={(event) => setIsChecked(event.checked)}
      />
    </>
  );
};
