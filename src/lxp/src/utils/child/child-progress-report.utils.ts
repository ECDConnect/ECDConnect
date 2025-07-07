import {
  ChildDto,
  ChildProgressObservationReport,
  ProgressTrackingAgeGroupDto,
} from '@ecdlink/core';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { childRegistrationConstants } from '../../constants/Child';
import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { ProgressSkill } from '@/models/progress/progress-skill';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export const replaceSkillText = (skillText: string, childFirstName: string) => {
  let finalText = skillText;

  // Child name
  finalText = skillText.replaceAll('[childFirstName]', childFirstName);

  return finalText;
};

export const isChildsFirstReport = (
  child: ChildDto,
  completedReports: ChildProgressObservationReport[]
) => {
  return (
    isChildInitialRegistrationPeriod(child) && completedReports.length === 0
  );
};

export const isChildInitialRegistrationPeriod = (child: ChildDto) => {
  const childRegistrationDate = child.insertedDate
    ? new Date(child.insertedDate)
    : undefined;

  if (!childRegistrationDate) {
    return false;
  }

  const daysSinceRegistration = Math.abs(
    differenceInDays(childRegistrationDate, new Date())
  );

  return (
    daysSinceRegistration < childRegistrationConstants.firstProgressReportPeriod
  );
};

export const getProgressAgeGroupForChild = (
  reportPeriodEndDate: Date,
  child: ChildDto,
  ageGroups: ProgressTrackingAgeGroupDto[]
) => {
  if (!child.user?.dateOfBirth) {
    return;
  }

  const ageInMonths = differenceInMonths(
    reportPeriodEndDate,
    new Date(child.user.dateOfBirth)
  );

  // Now get age group that matches
  const ageGroup = ageGroups.find(
    (x) => x.startAgeInMonths <= ageInMonths && x.endAgeInMonths >= ageInMonths
  );

  return ageGroup;
};

export const mapProgressReportDetails = (
  childReport: ChildProgressReport | undefined,
  allSkills: ProgressSkill[],
  childFirstName: string,
  skillsForAgeGroupCount: number
) => {
  const mappedSkills = (childReport?.skillObservations || []).map(
    (skillObs) => {
      const skill = allSkills?.find((x) => x.id === skillObs.skillId);
      return {
        ...skillObs,
        skillName: replaceSkillText(skill?.name || '', childFirstName),
        skillDescription: skill?.description,
        subCategoryId: skill?.subCategory.id || 0,
        categoryId: skill?.subCategory.category.id || 0,
        isPositive:
          !!skillObs.value &&
          ((!skill?.isReverseScored &&
            skillObs.value === ProgressSkillValues.Yes) ||
            (!!skill?.isReverseScored &&
              skillObs.value === ProgressSkillValues.No)),
        isNegative:
          !!skillObs.value &&
          ((!skill?.isReverseScored &&
            skillObs.value === ProgressSkillValues.No) ||
            (!!skill?.isReverseScored &&
              skillObs.value === ProgressSkillValues.Yes)),
      };
    }
  );

  return {
    isNotStarted: !childReport,
    isInProgress: !!childReport?.skillObservations.length,
    isObservationsComplete: !!childReport?.observationsCompleteDate,
    report: {
      ...childReport,
      skillObservations: mappedSkills,
    },
  };
};
