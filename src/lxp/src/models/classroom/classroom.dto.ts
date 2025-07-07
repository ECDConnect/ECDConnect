import { MessageLogDto } from '@ecdlink/core';
import { BasePractitionerDto } from './practitioner.dto';
import { SiteAddressDto } from './site-address.dto';

export type ClassroomDto = {
  id: string;
  name: string;
  classroomImageUrl: string;
  numberPractitioners?: number;
  numberOfAssistants?: number;
  numberOfOtherAssistants?: number;
  siteAddress: SiteAddressDto;
  principal: BasePractitionerDto;
  preschoolCode?: string;
  userId?: string;
  isDummySchool?: boolean;
  childProgressReportPeriods?: ChildProgressReportPeriodDto[];
};

export type ChildProgressReportPeriodDto = {
  id: string;
  startDate: string;
  endDate: string;
  notifications?: MessageLogDto[];
};
