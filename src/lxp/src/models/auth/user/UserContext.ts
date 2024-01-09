export enum UserTypeEnum {
  Coach = 'Coach',
  Practitioner = 'Practitioner',
  Caregiver = 'Caregiver',
  Child = 'Child',
  Principal = 'Principal',
}

export interface UserContext {
  id: string;
  userName: string;
  firstName: string;
  fullName: string;
  surname: string;
  phoneNumber: string;
  userTypeDetail: UserTypeDetail[];
  email: string;
  isSouthAfricanCitizen: boolean;
  idNumber?: string;
  verifiedByHomeAffairs: boolean;
  dateOfBirth: Date;
  genderId?: number;
  contactPreference: string;
}

export interface UserTypeDetail {
  key: number;
  description: string;
  userType: UserType;
}

export interface UserType {
  id: string;
  name: string;
  normalizedName: string;
}
