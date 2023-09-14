import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerDto, getAvatarColor } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStackedList,
  Button,
  Checkbox,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CoachingCirclesAttendanceProps } from '../add-coaching-circle';

interface Step2Props {
  setCoachingCircleAttendance: (item: CoachingCirclesAttendanceProps[]) => void;
  addCoachingCircle: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  setCoachingCircleAttendance,
  addCoachingCircle,
}) => {
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const [confirmAttendance, setConfirmAttendance] = useState(false);
  console.log({ practitioners });
  const [attendanceList, setAttendanceList] = useState<
    AttendanceListDataItem[]
  >([]);
  const [coachingCiclesPractitionersList, setCoachingCiclesPractitionersList] =
    useState<AttendanceListDataItem[]>();
  console.log({ coachingCiclesPractitionersList });
  const coachingCiclesPractitionersListFormatted = useMemo(
    () =>
      coachingCiclesPractitionersList?.map((item) => {
        return {
          practitionerId: item?.attenendeeId,
          attended: item?.status === 1 ? true : false,
        };
      }),
    [coachingCiclesPractitionersList]
  );
  const coachingCircleMeetingAttendes =
    coachingCiclesPractitionersListFormatted?.filter(
      (item) => item?.attended === true
    )?.length;

  const getAttendanceCircleMeeting = useCallback(
    (practitioners?: PractitionerDto[]) => {
      if (!practitioners || practitioners.length === 0) return;
      const attendanceStackList: AttendanceListDataItem[] = practitioners?.map(
        (practitioner, index) => {
          const profileTextString =
            practitioner?.user?.firstName![0] ??
            '' + practitioner?.user?.surname![0] ??
            '';

          return {
            title: `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`,
            profileText: profileTextString.toLocaleUpperCase(),
            attenendeeId: practitioner?.id || index.toString(),
            avatarColor: getAvatarColor(),
            status: 1,
          };
        }
      );
      setAttendanceList(attendanceStackList);
      onAttendanceListUpdated(attendanceStackList);
    },
    []
  );

  useEffect(() => {
    getAttendanceCircleMeeting(practitioners);
  }, [getAttendanceCircleMeeting, practitioners]);

  useEffect(() => {
    if (coachingCiclesPractitionersListFormatted) {
      setCoachingCircleAttendance(coachingCiclesPractitionersListFormatted);
    }
  }, [coachingCiclesPractitionersListFormatted, setCoachingCircleAttendance]);

  const onAttendanceListUpdated = (
    updatedAttendanceList: AttendanceListDataItem[]
  ) => {
    setCoachingCiclesPractitionersList(updatedAttendanceList);
  };

  return (
    <div className="flex flex-col p-4">
      <Typography
        type="h2"
        color="textDark"
        text={'Add a coaching circle'}
        className="mt-4"
      />
      <Typography
        type="h3"
        color="textDark"
        text={'Take attendance for this meeting'}
        className="mt-4"
      />
      <Typography
        type="help"
        color="textMid"
        text={'Take attendance for this meeting'}
        className="mt-2"
      />

      <AttendanceStackedList
        className={'ml-4 w-11/12'}
        scroll={false}
        listItems={attendanceList || []}
        onChange={(updateList: AttendanceListDataItem[]) => {
          onAttendanceListUpdated(updateList);
        }}
      />
      <div
        className="mt-4 mb-20 flex items-start gap-2"
        onClick={() => setConfirmAttendance(!confirmAttendance)}
      >
        <Checkbox checked={confirmAttendance} />
        <Typography
          text={`Check to confirm that you have accurately captured practitioner attendance for the event (${coachingCircleMeetingAttendes} practitioners attended).`}
          type="body"
          color={'textMid'}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-white p-4">
        <Button
          onClick={() => addCoachingCircle()}
          className="mb-4 w-full rounded-2xl"
          size="small"
          color="primary"
          type="filled"
          disabled={!confirmAttendance}
        >
          {renderIcon('SaveIcon', classNames('h-5 w-5 text-white'))}
          <Typography type="help" className="ml-2" text="Save" color="white" />
        </Button>
      </div>
    </div>
  );
};
