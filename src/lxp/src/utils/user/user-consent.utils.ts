import { ConsentDto, UserConsentDto } from '@ecdlink/core';
import { newGuid } from '../common/uuid.utils';

export const mapUserConsentDto = (
  createdUserId: string,
  userId: string,
  consent: ConsentDto,
  consentId?: string
): UserConsentDto => {
  return {
    id: consentId ? consentId : newGuid(),
    createdUserId,
    userId,
    consentId: consent.id,
    consentType: consent.type,
    insertedDate: new Date().toISOString(),
    isActive: true,
  };
};
