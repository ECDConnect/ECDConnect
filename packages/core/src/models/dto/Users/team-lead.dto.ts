import { ClinicDto } from './clinic.dto';
import { UserDto } from './user.dto';

export interface TeamLeadDto {
  id: string;
  firstName: string;
  surname: string;
  jobTitle: string;
  phoneNumber: string;
  user?: UserDto;
  clinic?: ClinicDto;
}
