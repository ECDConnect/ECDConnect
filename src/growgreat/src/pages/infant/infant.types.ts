import { EventRecordModelInput } from '@ecdlink/graphql';
import { MotherDto } from '@ecdlink/core';

export interface InfantRouteState {
  motherId?: MotherDto['id'];
  bornEventId?: EventRecordModelInput['eventRecordTypeId'];
}
