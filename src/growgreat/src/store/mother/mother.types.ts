import { EventRecordType } from '@ecdlink/graphql';
import { MotherDto } from '@ecdlink/core';

export interface MotherState {
  mothers?: MotherDto[];
  eventRecordTypes?: EventRecordType[];
  motherCountForMonth?: number;
}
