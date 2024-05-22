import { AttendanceDto, ChildDto } from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { AlertSeverityType } from '@ecdlink/ui';
import { getWeek } from 'date-fns';

interface ChildAlertModel {
  status: AlertSeverityType;
  message: string;
  severity: number;
}

interface ChildAlertModelProps {
  child?: ChildDto;
  attendance?: AttendanceDto[];
  classroomGroups?: ClassroomGroupDto[];
  childPendingWorkflowStatusId?: string;
  childExternalWorkflowStatusId?: string;
}

function getAttendancePercentage(schoolDays: AttendanceDto[]) {
  const totalDays = schoolDays.length;
  const attendedDays = schoolDays.filter((day) => day.attended).length;

  return { percentage: attendedDays / totalDays, attendedDays, totalDays };
}

export const getChildAlertModel = ({
  attendance,
  child,
  classroomGroups,
  childExternalWorkflowStatusId,
  childPendingWorkflowStatusId,
}: ChildAlertModelProps): ChildAlertModel => {
  const isClassAssigned = classroomGroups?.some((classroomGroup) =>
    classroomGroup?.learners?.some(
      (learner) => learner.childUserId === child?.userId
    )
  );
  const isChildRegistrationIncomplete =
    child?.workflowStatusId === childPendingWorkflowStatusId ||
    child?.workflowStatusId === childExternalWorkflowStatusId;

  const currentWeekOfYear = getWeek(new Date());

  const attendanceLastWeek = attendance?.filter(
    (day) => day.weekOfYear === currentWeekOfYear - 1
  );

  if (isChildRegistrationIncomplete) {
    return {
      status: 'error',
      message: 'Child registration incomplete',
      severity: 1,
    };
  }

  if (!isClassAssigned) {
    return { status: 'error', message: 'No class assigned', severity: 2 };
  }

  if (attendanceLastWeek?.length) {
    const { percentage, attendedDays, totalDays } =
      getAttendancePercentage(attendanceLastWeek);

    const isLessThan75Percent = percentage < 0.75;

    return {
      status: isLessThan75Percent ? 'warning' : 'success',
      message: `Attended ${attendedDays} of ${totalDays} days last week`,
      severity: isLessThan75Percent ? 3 : 4,
    };
  }

  return { status: 'none', message: '', severity: 5 };
};
