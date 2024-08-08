import { AttendanceDto, ChildDto } from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { AlertSeverityType } from '@ecdlink/ui';
import { getWeek } from 'date-fns';

interface ChildAlertModel {
  status: AlertSeverityType;
  message: string;
  severity: number;
  attendancePercentage: number;
}

interface ChildAlertModelProps {
  child?: ChildDto;
  attendance?: AttendanceDto[];
  classroomGroups?: ClassroomGroupDto[];
  childPendingWorkflowStatusId?: string;
  childExternalWorkflowStatusId?: string;
}

function getAttendanceData(schoolDays: AttendanceDto[]) {
  if (!schoolDays.length) {
    return { percentage: 0, attendedDays: 0, totalDays: 0 };
  }

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
      (learner) =>
        learner.childUserId === child?.userId ||
        learner.childUserId === child?.user?.id
    )
  );
  const isChildRegistrationIncomplete =
    child?.workflowStatusId === childPendingWorkflowStatusId ||
    child?.workflowStatusId === childExternalWorkflowStatusId;

  const currentWeekOfYear = getWeek(new Date());

  const attendanceLastWeek = attendance?.filter(
    (day) => day.weekOfYear === currentWeekOfYear - 2
  );

  const { percentage, attendedDays, totalDays } = getAttendanceData(
    attendanceLastWeek ?? []
  );

  const isLessThan75Percent = percentage < 0.75;

  if (isChildRegistrationIncomplete) {
    return {
      status: 'error',
      message: 'Child registration incomplete',
      severity: 1,
      attendancePercentage: percentage,
    };
  }

  if (!isClassAssigned) {
    return {
      status: 'error',
      message: 'No class assigned',
      severity: 2,
      attendancePercentage: percentage,
    };
  }

  if (attendanceLastWeek?.length) {
    return {
      status: isLessThan75Percent ? 'warning' : 'success',
      message: `Attended ${attendedDays} of ${totalDays} days last week`,
      severity: isLessThan75Percent ? 3 : 4,
      attendancePercentage: percentage,
    };
  }

  return {
    status: 'none',
    message: '',
    severity: 5,
    attendancePercentage: percentage,
  };
};
