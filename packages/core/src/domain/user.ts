import { EntityCacheBase } from './entity-cache-base';

export interface User extends EntityCacheBase {
  id?: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  isSouthAfricanCitizen: boolean;
  idNumber: string;
  verifiedByHomeAffairs: boolean;
  dateOfBirth?: string;
  firstName: string;
  surname: string;
  fullName?: string;
  contactPreference: string;
  genderId: number;
  raceId?: number;
  lockoutEnd?: Date;
}
