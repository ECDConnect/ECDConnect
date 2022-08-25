import { ChildDto } from '@ecdlink/core';

export interface ChildrenPerAgeGroupProps {
  childrenForPractitionerList?: ChildDto[] | undefined;
  practitionerId?: string;
}
