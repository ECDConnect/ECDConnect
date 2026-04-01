import { ConsentDto } from '@ecdlink/core';
import { RootState } from '../../types';

export const getConsentSelector = (
  state: RootState
): ConsentDto[] | undefined => state.contentConsentData.consent;
