import { NoPlaygroupClassroomType } from './../../enums/ProgrammeType';
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
import { isPractitionerAttendanceMissingForLearner } from '../classroom/attendance/track-attendance-utils';
import {
  getChildAttendancePercentageAtPlaygroup,
  getReportingPeriod,
  isInFinalMonthOfReportingPeriod,
  isMatchingReportingPeriods,
} from './child-profile-utils';
import { differenceInDays } from 'date-fns';

export const getChildAlertModel = (
  learner?: LearnerDto,
  pendingStatusId?: string,
  childUser?: UserDto,
  child?: ChildDto,
  userDocuments?: Document[],
  attendance?: AttendanceDto[],
  classroomGroups?: ClassroomGroupDto[],
  classProgrammes?: ClassProgrammeDto[],
  childReports?: ChildProgressReportSummaryModel[],
  attendedChildProgressTraining?: boolean,
  userRole: 'practitioner' | 'coach' = 'practitioner'
) => {
  const today = new Date();
  let alert = 'success';
  let alertMessage = 'All information captured';
  if (classroomGroups && learner) {
    const classroomGroup = classroomGroups.find(
      (x) => x.id === learner?.classroomGroupId
    );

    if (classroomGroup?.name === NoPlaygroupClassroomType.name) {
      alert = 'error';
      alertMessage = 'No class assigned';

      return { status: alert, message: alertMessage, severity: 1 };
    }
  }

  if (
    !childUser?.firstName ||
    !childUser?.surname ||
    !child?.caregiverId ||
    !learner
  ) {
    alert = 'error';
    alertMessage = 'Child information missing';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  const report = childReports?.find((x) =>
    isMatchingReportingPeriods(new Date(x.reportDate), today)
  );
  const reportingPeriod = getReportingPeriod(today, false);

  const isCurrentlyInReportingOverduePeriod = isInFinalMonthOfReportingPeriod(
    reportingPeriod.monthName,
    today
  );

  const daysSinceInsertedDate = differenceInDays(
    new Date(),
    new Date(child?.insertedDate!)
  );

  if (
    attendedChildProgressTraining &&
    !report &&
    isCurrentlyInReportingOverduePeriod &&
    daysSinceInsertedDate > 30
  ) {
    alert = 'error';
    alertMessage = 'Progress report overdue';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  const userBirthDocument = userDocuments?.find(
    (x) => x.name.includes('clinicCard') || x.name.includes('birthCertificate')
  );

  if (!userBirthDocument && daysSinceInsertedDate >= 14) {
    alert = 'error';
    alertMessage = 'Child document missing';

    return { status: alert, message: alertMessage, severity: 1 };
  }

  if (classroomGroups && attendance) {
    const missedAttendance = isPractitionerAttendanceMissingForLearner(
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

  if (child?.workflowStatusId === pendingStatusId) {
    alert = 'warning';
    alertMessage = 'Pending';

    return { status: alert, message: alertMessage, severity: 2 };
  }

  return { status: alert, message: alertMessage, severity: 3 };
};
