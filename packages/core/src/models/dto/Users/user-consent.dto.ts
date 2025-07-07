import { EntityBase } from '../entity-base';

export interface UserConsentDto extends EntityBase {
  consentType: string;
  consentId: number;
  userId: string;
  createdUserId: string;
}
