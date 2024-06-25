import { BasePractitionerDto } from './practitioner.dto';
import { SiteAddressDto } from './site-address.dto';

export type ClassroomDto = {
  id: string;
  name: string;
  imageUrl: string;
  numberOfPractitioners?: number;
  numberOfAssistants?: number;
  numberOfOtherAssistants?: number;
  preschoolFeeAmount?: number;
  preschoolFeeAmountLastUpdateDate?: string;
  siteAddress: SiteAddressDto;
  principal: BasePractitionerDto;
  preschoolCode?: string;
};
