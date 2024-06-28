import { BasePractitionerDto } from './practitioner.dto';
import { SiteAddressDto } from './site-address.dto';

export type ClassroomDto = {
  id: string;
  name: string;
  classroomImageUrl: string;
  numberPractitioners?: number;
  numberOfAssistants?: number;
  numberOfOtherAssistants?: number;
  preschoolFeeAmount?: number;
  preschoolFeeAmountLastUpdateDate?: string;
  siteAddress: SiteAddressDto;
  principal: BasePractitionerDto;
  preschoolCode?: string;
  userId?: string;
  isDummySchool?: boolean;
};
