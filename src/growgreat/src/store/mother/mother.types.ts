import { MotherDto, VisitDto } from '@ecdlink/core';

export interface MotherState {
  mothers?: MotherDto[];
  visits?: VisitDto[];
  motherCountForMonth?: number;
}
