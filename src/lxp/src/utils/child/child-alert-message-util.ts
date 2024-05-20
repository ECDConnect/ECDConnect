import { AttendanceDto, ChildDto } from '@ecdlink/core';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { AlertSeverityType } from '@ecdlink/ui';

interface ChildAlertModel {
  status: AlertSeverityType;
  message: string;
  severity: number;
}

interface ChildAlertModelProps {
  child?: ChildDto;
  attendance?: AttendanceDto[];
  classroomGroups?: ClassroomGroupDto[];
}
// TODO: update function (W5 - use case 3)
export const getChildAlertModel = ({
  attendance,
  child,
  classroomGroups,
}: ChildAlertModelProps): ChildAlertModel => {
  const isClassAssigned = classroomGroups?.some((classroomGroup) =>
    classroomGroup?.learners?.some(
      (learner) => learner.childUserId === child?.userId
    )
  );
  // const childPendingWorkflowStatusId = getWorkflowStatusIdByEnum(
  //   WorkflowStatusEnum.ChildPending
  // );
  // const childExternalWorkflowStatusId = getWorkflowStatusIdByEnum(
  //   WorkflowStatusEnum.ChildExternalLink
  // );

  if (!isClassAssigned) {
    return { status: 'error', message: 'No class assigned', severity: 1 };
  }

  return { status: 'none', message: '', severity: 0 };

  // if ((child?.workflowStatusId === childPendingWorkflowStatusId ||
  //   child?.workflowStatusId === childExternalWorkflowStatusId)) {
  //   alert = 'warning';
  //   alertMessage = 'Pending';

  //   return { status: alert, message: alertMessage, severity: 2 };
  // }

  // if (classroomGroups && attendance) {
  //   const missedAttendance = isPractitionerAttendanceMissingForLearner(
  //     classroomGroups,
  //     classProgrammes || [],
  //     learner,
  //     attendance,
  //     today
  //   );

  //   if (missedAttendance) {
  //     alert = 'warning';
  //     alertMessage = 'Missing attendance information';

  //     return { status: alert, message: alertMessage, severity: 2 };
  //   }
  // }

  // if (classroomGroups && attendance) {
  //   const classroomGroup = classroomGroups.find(
  //     (x) => x.id === learner?.classroomGroupId
  //   );

  //   const childAttendancePercentage = getChildAttendancePercentageAtPlaygroup(
  //     child?.userId ?? '',
  //     attendance,
  //     classroomGroup?.id ?? '',
  //     classProgrammes || [],
  //     userRole
  //   );

  //   const daysSinceInsertedDate = differenceInDays(
  //     new Date(),
  //     new Date(learner?.startedAttendance)
  //   );

  //   if (childAttendancePercentage && daysSinceInsertedDate >= 7) {
  //     if (childAttendancePercentage.percentage < 50) {
  //       alert = 'warning';
  //     }

  //     alertMessage = `Attended ${childAttendancePercentage.daysAttended} of ${
  //       childAttendancePercentage.daysExpected
  //     } days last ${userRole === 'coach' ? 'month' : 'week'}`;
  //   }
  // }
};
