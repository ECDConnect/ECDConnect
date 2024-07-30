import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { userSelectors } from '@/store/user';
import { PractitionerDto, getNextBusinessDay, useDialog } from '@ecdlink/core';
import {
  Button,
  Card,
  classNames,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { LeaveCardMenu } from './components/menu';
import { ReassignClassPageState } from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';

interface LeaveCardProps {
  practitioner: PractitionerDto;
  absentee: AbsenteeDto;
  reassignClassRouteState?: Partial<ReassignClassPageState>;
  className?: string;
}
export const LeaveCard = ({
  absentee,
  practitioner,
  reassignClassRouteState,
  className,
}: LeaveCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const user = useSelector(userSelectors.getUser);

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const { getAbsenteeDetails } = usePractitionerAbsentees(practitioner);

  const {
    practitionerIsOnLeave,
    isMultiDayLeave,
    isScheduledLeave,
    currentClassesReassigned,
    currentAbsentee,
  } = getAbsenteeDetails(absentee);

  const isLoggedInUser = user?.id === practitioner?.userId;

  const title = useMemo(() => {
    if (practitionerIsOnLeave && isMultiDayLeave) {
      return `${
        isLoggedInUser
          ? 'You are'
          : `${practitioner?.firstName || practitioner?.user?.firstName} is`
      } on leave`;
    }
    if (practitionerIsOnLeave && !isMultiDayLeave) {
      return `${
        isLoggedInUser
          ? 'You are'
          : `${practitioner?.firstName || practitioner?.user?.firstName} is`
      } absent today`;
    }

    if (isScheduledLeave && isMultiDayLeave) {
      return `${
        isLoggedInUser
          ? 'You'
          : `${practitioner?.firstName || practitioner?.user?.firstName}`
      } will be on leave`;
    }

    if (isScheduledLeave && !isMultiDayLeave) {
      return `${
        isLoggedInUser
          ? 'You'
          : `${practitioner?.firstName || practitioner?.user?.firstName}`
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
    practitioner,
    practitionerIsOnLeave,
  ]);

  const onClick = () => {
    if (!isOnline) {
      return dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onClose) => {
          return <OnlineOnlyModal onSubmit={onClose} />;
        },
      });
    }

    setShowMenu(true);
  };

  if (!currentAbsentee) {
    return <></>;
  }

  return (
    <Card className={classNames(className, 'bg-uiBg rounded-xl p-4')}>
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
            isLoggedInUser
              ? 'You'
              : practitioner?.firstName || practitioner?.user?.firstName
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
        onClick={onClick}
      />
      {showMenu && (
        <LeaveCardMenu
          absentee={currentAbsentee}
          practitioner={practitioner}
          reassignClassRouteState={reassignClassRouteState}
          onClose={() => setShowMenu(false)}
        />
      )}
    </Card>
  );
};
