import { ClinicDto } from '../Community';
import { UserDto } from './user.dto';

export interface TeamLeadDto {
  id: string;
  firstName: string;
  surname: string;
  jobTitle: string;
  phoneNumber: string;
  whatsAppNumber: string;
  welcomeMessage: string;
  user?: UserDto;
  clinic?: ClinicDto;
}

export interface TeamLeadSummaryDto {
  clinicNames?: string;
  firstName?: string;
  surname?: string;
  idNumber?: string;
  lastSeen?: string;
  location?: string;
  phoneNumber?: string;
  totalChildren?: number;
  totalClinics?: number;
  totalHealthCareWorkers?: number;
  totalInFieldVisitsCompleted?: number;
  totalMeetingReportsSubmitted?: number;
  totalPregnantMoms?: number;
  whatsAppNumber?: string;
}
