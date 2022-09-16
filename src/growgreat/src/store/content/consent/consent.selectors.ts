import { ConsentDto } from '@ecdlink/core';
import { RootState } from '../../types';

export const getConsent = (state: RootState): ConsentDto[] | undefined =>
  state.contentConsentData.consent;
