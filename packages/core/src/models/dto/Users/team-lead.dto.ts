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
}
