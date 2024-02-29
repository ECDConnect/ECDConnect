import { EntityBase } from '../entity-base';
import { SiteAddressDto } from '../SiteAddress/site-address.dto';
import { UserDto } from './user.dto';
import {} from '../StaticData/education-level.dto';
import { DocumentDto } from '../Documents/document.dto';

export interface HealthCareWorkerDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  consentForPhoto?: boolean;
  isRegistered?: boolean;
  language?: string;
  languageId?: string;
  clickedDashboardClientsTab: boolean;
  clickedDashboardVisitsTab: boolean;
  clickedDashboardHighlightsTab: boolean;
  clickedVisitTab: boolean;
  clickedProgressTab: boolean;
  clickedReferralsTab: boolean;
  clickedContactTab: boolean;
  clickedTeamTab: boolean;
  clinicId?: string;
  welcomeMessage: string;
  shareContactInfo: boolean;
  isNewAtClinic: boolean;
  // TODO - Remove the team lead fields
  teamLeadId?: string;
  teamLead?: {
    jobTitle?: string;
    clinic?: {
      name?: string;
      phoneNumber?: string;
      siteAddress?: SiteAddressDto;
    };
    user?: {
      firstName?: string;
      surname?: string;
      phoneNumber?: string;
    };
  };
}
