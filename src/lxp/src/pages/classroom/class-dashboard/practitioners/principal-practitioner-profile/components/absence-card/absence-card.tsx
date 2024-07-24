import { LeaveCard } from '@/components/leave-card';
import { usePractitionerAbsentees } from '@/hooks/usePractitionerAbsentees';
import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { Button, Card, Typography, renderIcon } from '@ecdlink/ui';
import { ReassignClassPageState } from '../../../reassign-class/reassign-class.types';

interface AbsenceCardProps {
  practitioner: PractitionerDto;
  reassignClassRouteState?: Partial<ReassignClassPageState>;
  handleReassignClass: (
    practitionerId: string,
    allAbsenteeClasses?: AbsenteeDto[]
  ) => void;
  practitionerUserId: string;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  practitioner,
  handleReassignClass,
  practitionerUserId,
  reassignClassRouteState,
}) => {
  const { practitionerIsOnLeave, isScheduledLeave } = usePractitionerAbsentees(
    practitioner!
  );

  if (practitioner && (practitionerIsOnLeave || isScheduledLeave)) {
    return (
      <LeaveCard
        className="mx-4"
        practitioner={practitioner}
        reassignClassRouteState={reassignClassRouteState}
      />
    );
  }

  return (
    <Card className={'bg-uiBg mt-4 w-11/12 rounded-xl'}>
      <div className={'mt-6 ml-4'}>
        <Typography
          type={'h1'}
          color="textDark"
          text={`Mark ${practitioner?.user?.firstName} absent`}
          className={'mt-6 ml-4'}
        />
        <Typography
          type={'body'}
          color="textMid"
          text={`Mark ${practitioner?.user?.firstName} absent and reassign classes to another practitioner if needed.`}
          className={'mt-4 ml-4'}
        />
        <div className="flex justify-center">
          <Button
            type="filled"
            color="quatenary"
            className={'mt-6 mb-6 w-11/12 rounded-2xl'}
            onClick={() => handleReassignClass(practitionerUserId)}
          >
            {renderIcon('PencilAltIcon', 'w-5 h-5 color-white text-white mr-1')}
            <Typography
              type="body"
              className="mr-4"
              color="white"
              text={'Record absence/leave'}
            ></Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};
