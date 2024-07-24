import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { userSelectors } from '@/store/user';
import { PractitionerDto, getNextBusinessDay } from '@ecdlink/core';
import { Button, Card, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { LeaveCardMenu } from './components/menu';

interface LeaveCardProps {
  practitioner: PractitionerDto;
}
export const LeaveCard = ({ practitioner }: LeaveCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const user = useSelector(userSelectors.getUser);

  const {
    practitionerIsOnLeave,
    isMultiDayLeave,
    isScheduledLeave,
    currentClassesReassigned,
    currentAbsentee,
  } = usePractitionerAbsentees(practitioner);

  const isLoggedInUser = user?.id === practitioner?.userId;

  const title = useMemo(() => {
    if (practitionerIsOnLeave && isMultiDayLeave) {
      return `${
        isLoggedInUser ? 'You are' : `${practitioner?.firstName} is`
      } on leave`;
    }
    if (practitionerIsOnLeave && !isMultiDayLeave) {
      return `${
        isLoggedInUser ? 'You are' : `${practitioner?.firstName} is`
      } absent today`;
    }

    if (isScheduledLeave && isMultiDayLeave) {
      return `${
        isLoggedInUser ? 'You' : `${practitioner?.firstName}`
      } will be on leave`;
    }

    if (isScheduledLeave && !isMultiDayLeave) {
      return `${
        isLoggedInUser ? 'You' : `${practitioner?.firstName}`
      } will be on leave on ${format(
        new Date(currentAbsentee?.absentDate!),
        'EEEE, dd MMM'
      )}`;
    }
  }, [
    currentAbsentee?.absentDate,
    isLoggedInUser,
    isMultiDayLeave,
    isScheduledLeave,
    practitioner?.firstName,
    practitionerIsOnLeave,
  ]);

  if (!currentAbsentee) {
    return <></>;
  }

  return (
    <Card className={'bg-uiBg mx-4 mt-4 rounded-xl p-4'}>
      <Typography type="h2" text={title} color="textDark" />
      <Typography
        type={'markdown'}
        text={`<b>Reason:</b> ${currentAbsentee?.reason}`}
        className="text-textMid text-"
      />
      {isMultiDayLeave ? (
        <>
          <Typography
            type={'markdown'}
            className="text-textMid"
            text={`<b>Start date:</b> ${format(
              new Date(currentAbsentee?.absentDate!),
              'd MMM yyyy'
            )}`}
          />
          <Typography
            type={'markdown'}
            className="text-textMid"
            text={`<b>End date:</b> ${format(
              getNextBusinessDay(new Date(currentAbsentee?.absentDateEnd!)),
              'd MMM yyyy'
            )}`}
          />
        </>
      ) : (
        <Typography
          type={'markdown'}
          className="text-textMid"
          text={`<b>${
            isLoggedInUser ? 'You' : practitioner?.firstName
          } will be back on:</b> ${format(
            getNextBusinessDay(new Date(currentAbsentee?.absentDateEnd!)),
            'd MMM yyyy'
          )}`}
        />
      )}
      {currentClassesReassigned?.map((item, index) =>
        item.className ? (
          <Typography
            key={`${item.className}-${index}`}
            type={'markdown'}
            className="text-textMid"
            text={`<b>${item.className} class reassigned to:</b> ${item.reassignedToPerson}`}
          />
        ) : null
      )}
      <Button
        type="filled"
        color="quatenary"
        className={'mt-6 w-full rounded-2xl'}
        icon="PencilAltIcon"
        text="Edit"
        textColor="white"
        onClick={() => setShowMenu(true)}
      />
      {showMenu && (
        <LeaveCardMenu
          practitioner={practitioner}
          onClose={() => setShowMenu(false)}
        />
      )}
    </Card>
  );
};
