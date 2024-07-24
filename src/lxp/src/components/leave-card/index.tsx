import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { ReassignClassPageState } from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class.types';
import ROUTES from '@/routes/routes';
import { userSelectors } from '@/store/user';
import { PractitionerDto, getNextBusinessDay, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Button,
  Card,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface LeaveCardProps {
  practitioner: PractitionerDto;
}
export const LeaveCard = ({ practitioner }: LeaveCardProps) => {
  const user = useSelector(userSelectors.getUser);

  const history = useHistory();
  const dialog = useDialog();
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

  const onEdit = () => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: () => (
        <ActionModal
          icon="QuestionMarkCircleIcon"
          iconColor="infoMain"
          iconSize={24}
          title="What would you like to edit?"
          actionButtons={[
            {
              type: 'filled',
              colour: 'quatenary',
              text: 'Edit this leave/absence',
              textColour: 'white',
              leadingIcon: 'PencilAltIcon',
              onClick: () => {
                history.push(ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS, {
                  practitionerId: practitioner?.id,
                  principalPractitioner: practitioner?.isPrincipal
                    ? practitioner
                    : undefined,
                  allAbsenteeClasses: currentClassesReassigned,
                } as ReassignClassPageState);
              },
            },
            {
              type: 'outlined',
              colour: 'quatenary',
              text: 'Add a new leave/absence',
              textColour: 'quatenary',
              leadingIcon: 'PlusIcon',
              onClick: () => {},
            },
            {
              type: 'outlined',
              colour: 'quatenary',
              text: 'Delete this leave/absence',
              textColour: 'quatenary',
              leadingIcon: 'TrashIcon',
              onClick: () => {},
            },
          ]}
        />
      ),
    });
  };
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
      {currentClassesReassigned?.map((item, index) => (
        <Typography
          key={`${item.className}-${index}`}
          type={'markdown'}
          className="text-textMid"
          text={`<b>${item.className} class reassigned to:</b> ${item.reassignedToPerson}`}
        />
      ))}
      <Button
        type="filled"
        color="quatenary"
        className={'mt-6 w-full rounded-2xl'}
        icon="PencilAltIcon"
        text="Edit"
        textColor="white"
        onClick={onEdit}
      />
    </Card>
  );
};
