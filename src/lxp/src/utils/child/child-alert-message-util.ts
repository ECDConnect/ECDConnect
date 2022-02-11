import {
  AttendanceDto,
  ChildDto,
  ChildProgressReportSummaryModel,
  ClassProgrammeDto,
  ClassroomGroupDto,
  Document,
  LearnerDto,
  UserDto,
} from '@ecdlink/core';
import { isPracitionerAttendanceMissingForLearner } from '../classroom/attendance/track-attendance-utils';
import {
  getChildsAttendancePercentageAtPlaygroup,
  isMatchingReportingPeriods,
} from './child-profile-utils';

export const getChildAlertModel = (
  learner?: LearnerDto,
  pendingStatusId?: string,
  childUser?: UserDto,
  child?: ChildDto,
  userDocuments?: Document[],
  attendance?: AttendanceDto[],
  classroomGroups?: ClassroomGroupDto[],
  classProgrammes?: ClassProgrammeDto[],
  childReports?: ChildProgressReportSummaryModel[]
) => {
  const today = new Date();
  let alert = 'success';
  let alertMessage = 'All information captured';

  const userBirthDocument = userDocuments?.find(
    (x) => x.name.includes('clinicCard') || x.name.includes('clinicCard')
  );

  if (!childUser?.firstName || !childUser?.surname || !child?.caregiverId || !learner) {
    alert = 'error';
    alertMessage = 'Child information missing';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  const report = childReports?.find((x) =>
    isMatchingReportingPeriods(new Date(x.reportDate), today)
  );

  if (!report) {
    alert = 'error';
    alertMessage = 'Progress report overdue';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  if (userBirthDocument) {
    alert = 'error';
    alertMessage = 'Child document missing';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  if (classroomGroups && attendance) {
    const missedAttendance = isPracitionerAttendanceMissingForLearner(
      classroomGroups,
      classProgrammes || [],
      learner,
      attendance,
      today
    );

    if (missedAttendance) {
      alert = 'warning';
      alertMessage = 'Missing attendance information';

      return { status: alert, message: alertMessage, severity: 2 };
    }
  }

  if (classroomGroups && attendance) {
    const classroomGroup = classroomGroups.find((x) => x.id === learner?.classroomGroupId);

    const childAttendancePercentage = getChildsAttendancePercentageAtPlaygroup(
      child?.userId ?? '',
      attendance,
      classroomGroup?.id ?? '',
      classProgrammes || []
    );

    if (childAttendancePercentage) {
      if (childAttendancePercentage.percentage < 50) {
        alert = 'warning';
      }

      alertMessage = `Attended ${childAttendancePercentage.daysAttended} of ${childAttendancePercentage.daysExpected} days last week`;
    }
  }

  if (child?.workflowStatusId === pendingStatusId) {
    alert = 'warning';
    alertMessage = 'Pending';

    return { status: alert, message: alertMessage, severity: 2 };
  }

  return { status: alert, message: alertMessage, severity: 3 };
};
