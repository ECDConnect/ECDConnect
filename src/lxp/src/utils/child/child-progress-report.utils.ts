import {
  ChildDto,
  ChildProgressObservationReport,
  ChildProgressObservationStatus,
  ProgressTrackingCategoryDto,
} from '@ecdlink/core';
import { differenceInDays } from 'date-fns';
import { childRegistrationConstants } from '../../constants/Child';
import { saveAs } from 'file-saver';

export const replaceSkillText = (skillText: string, childFirstName: string) => {
  let finalText = skillText;

  // Child name
  finalText = skillText.replace('[childFirstName]', childFirstName);

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
