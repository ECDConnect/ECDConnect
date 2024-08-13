import {
  ChildDto,
  ChildProgressObservationReport,
  ChildProgressObservationStatus,
  ProgressTrackingCategoryDto,
} from '@ecdlink/core';
import { differenceInDays } from 'date-fns';
import { childRegistrationConstants } from '../../constants/Child';
import { SeperatedCategoryResult } from '@hooks/useChildProgressObservations';
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

export const getCategoryFromCurrentReport = (
  categoryId: number,
  report?: ChildProgressObservationReport
) => {
  if (!report) return;

  return report.categories.find((cat) => cat.categoryId === categoryId);
};

export const saveBase64Pdf = (buffer: string, pdfName: string) => {
  const linkSource = `data:application/octet-stream;base64,${buffer}`;
  const fileName = `${pdfName}.pdf`;
  saveAs(linkSource, fileName);
};

export const seperateCategoriesByStatus = (
  categories: ProgressTrackingCategoryDto[],
  report?: ChildProgressObservationReport
): SeperatedCategoryResult => {
  if (!report || report.categories.length === 0) {
    return {
      notStartedCategories: categories,
      inProgressCategories: [],
      completedCategories: [],
    };
  }

  const completedCategories =
    report?.categories.filter(
      (cat) => cat.status === ChildProgressObservationStatus.Completed
    ) || [];
  const inProgressCategories =
    report?.categories.filter(
      (cat) =>
        cat.status === ChildProgressObservationStatus.Started &&
        !completedCategories.some(
          (compCat) => compCat.categoryId === cat.categoryId
        )
    ) || [];
  const notStartedCategories =
    report?.categories.filter(
      (cat) =>
        cat.status === undefined ||
        (cat.status === ChildProgressObservationStatus.NotStarted &&
          !inProgressCategories.some(
            (compCat) => compCat.categoryId === cat.categoryId
          ))
    ) || [];

  return {
    notStartedCategories: categories.filter((cat) =>
      notStartedCategories.some((repCat) => repCat.categoryId === cat.id)
    ),
    inProgressCategories: categories.filter((cat) =>
      inProgressCategories.some((repCat) => repCat.categoryId === cat.id)
    ),
    completedCategories: categories.filter((cat) =>
      completedCategories.some((repCat) => repCat.categoryId === cat.id)
    ),
  };
};
