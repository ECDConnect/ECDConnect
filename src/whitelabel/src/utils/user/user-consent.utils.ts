import { ConsentDto, UserConsentDto } from '@ecdlink/core';
import { newGuid } from '../common/uuid.utils';

export const mapUserConsentDto = (
  createdUserId: string,
  userId: string,
  consent: ConsentDto
): UserConsentDto => {
  return {
    id: newGuid(),
    createdUserId,
    userId,
    consentId: consent.id,
    consentType: consent.type,
    insertedDate: new Date().toISOString(),
    isActive: true,
  };
};
