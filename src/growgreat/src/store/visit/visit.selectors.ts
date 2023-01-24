import { VisitStatusDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getVisitStatus = (state: RootState): VisitStatusDto =>
  state.visits.visitStatus;
