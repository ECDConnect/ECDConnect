import { CaregiverBaseDto } from '../Users';

export interface BreastFeedingClubDto {
  id: string;
  meetingDate: string;
  clientsAttendedConfirmed: boolean;
  clients: CaregiverBaseDto[];
}
