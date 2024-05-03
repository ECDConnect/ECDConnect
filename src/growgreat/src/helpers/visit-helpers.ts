import { VisitDto } from '@ecdlink/core';
import { StepItem } from '@ecdlink/ui';

export const getVisitStatus = (visit: VisitDto): StepItem['type'] => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  if (
    visit.attended ||
    (!!visit.startedDate && new Date(visit.startedDate) < twoDaysAgo)
  ) {
    return 'completed';
  }

  if (visit.startedDate && new Date(visit.startedDate) > twoDaysAgo) {
    return 'inProgress';
  }

  return 'todo';
};

export const canStartVisit = (visit: VisitDto): boolean => {
  if (visit.attended) {
    return false;
  }

  if (isVisitInProgress(visit)) {
    return true;
  }

  var todayStart = new Date();
  todayStart.setHours(0, 0, 0);

  var todayEnd = new Date();
  todayEnd.setHours(23, 59, 59);

  // Check date range
  if (
    !!visit.plannedVisitDate &&
    new Date(visit.plannedVisitDate) >= todayEnd
  ) {
    return false;
  }

  if (!!visit.dueDate && new Date(visit.dueDate) <= todayStart) {
    return false;
  }

  return true;
};

export const getVisitSubTitle = (visit: VisitDto): string => {
  const date = new Date(visit.orderDate);
  date.setHours(0, 0, 0, 0);

  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  if (isVisitInProgress(visit)) {
    return 'Visit incomplete';
  }

  if (
    !visit.attended &&
    !!visit.startedDate &&
    new Date(visit.startedDate) < twoDaysAgo
  ) {
    return `Missed visit deadline`;
  }

  if (
    visit.visitType?.normalizedName === 'Additional visits' &&
    visit.comment
  ) {
    return visit.comment;
  }

  return `By ${date.getDate()} ${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getFullYear()}`;
};

export const isVisitInProgress = (visit: VisitDto): boolean => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  if (
    !visit.attended &&
    !!visit.startedDate &&
    new Date(visit.startedDate) > twoDaysAgo
  ) {
    return true;
  }

  return false;
};

export const isVisitMissed = (visit: VisitDto): boolean => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  if (
    !visit.attended &&
    !!visit.startedDate &&
    new Date(visit.startedDate) < twoDaysAgo
  ) {
    return true;
  }

  return false;
};
