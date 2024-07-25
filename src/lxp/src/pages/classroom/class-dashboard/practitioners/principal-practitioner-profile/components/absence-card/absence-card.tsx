import { LeaveCard } from '@/components/leave-card';
import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { PractitionerDto, useDialog } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import {
  Button,
  Card,
  DialogPosition,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { ReassignClassPageState } from '../../../reassign-class/reassign-class.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

interface AbsenceCardProps {
  className?: string;
  practitioner: PractitionerDto;
  reassignClassRouteState?: Partial<ReassignClassPageState>;
  handleReassignClass: (
    practitionerId: string,
    allAbsenteeClasses?: AbsenteeDto[]
  ) => void;
  practitionerUserId: string;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  className,
  practitioner,
  handleReassignClass,
  practitionerUserId,
  reassignClassRouteState,
}) => {
  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const { allAbsentees } = usePractitionerAbsentees(practitioner!);

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

    handleReassignClass(practitionerUserId);
  };

  if (practitioner && !!allAbsentees?.length) {
    return (
      <>
        {allAbsentees?.map((absentee) => {
          return (
            <LeaveCard
              className={className}
              absentee={absentee}
              practitioner={practitioner}
              reassignClassRouteState={reassignClassRouteState}
            />
          );
        })}
      </>
    );
  }

  return (
    <Card className={classNames(className, 'bg-uiBg rounded-xl p-4')}>
      <Typography
        type={'h1'}
        color="textDark"
        text={
          practitioner?.isPrincipal
            ? 'Log my time off'
            : `Mark ${practitioner?.user?.firstName} absent`
        }
      />
      <Typography
        type={'body'}
        color="textMid"
        text={
          practitioner?.isPrincipal
            ? 'Need time off? Record your leave here.'
            : `Mark ${practitioner?.user?.firstName} absent and reassign classes to another practitioner if needed.`
        }
        className={'mt-4 '}
      />
      <div className="flex justify-center">
        <Button
          type="filled"
          color="quatenary"
          className={'mt-6 w-full rounded-2xl'}
          onClick={onClick}
        >
          {renderIcon('PencilAltIcon', 'w-5 h-5 color-white text-white mr-1')}
          <Typography
            type="body"
            className="mr-4"
            color="white"
            text={
              practitioner?.isPrincipal
                ? 'Take time off'
                : 'Record absence/leave'
            }
          ></Typography>
        </Button>
      </div>
    </Card>
  );
};
