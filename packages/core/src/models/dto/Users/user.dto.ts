import { EntityBase } from '../entity-base';
import { RoleDto } from '../Roles/role.dto';
import { GenderDto } from '../StaticData/gender.dto';
import { RaceDto } from '../StaticData/race.dto';

export interface UserDto extends EntityBase {
  // APPLICATION USER
  userName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: RoleDto[];
  // EXTENSION
  isSouthAfricanCitizen?: boolean;
  idNumber?: string;
  verifiedByHomeAffairs?: boolean;
  dateOfBirth?: Date | string;
  firstName?: string;
  surname?: string;
  fullName?: string;
  contactPreference?: string;
  gender?: GenderDto;
  genderId?: string;
  isActive?: boolean;
  raceId?: string;
  race?: RaceDto;
  profileImageUrl?: string;
  whatsappNumber?: string;
  whatsAppNumber?: string;
  emergencyContactFirstName?: string;
  emergencyContactSurname?: string;
  emergencyContactPhoneNumber?: string;
  languageId?: string;
  emailConfirmed?: boolean;
  isImported?: boolean;
  resetData?: boolean;
  isOnline?: boolean;
  lockoutEnd?: Date;
  principalObjectData?: {
    isPrincipal?: boolean;
  };
  connectUsage?: string;
  profilePicIsEmoji?: boolean;
}
