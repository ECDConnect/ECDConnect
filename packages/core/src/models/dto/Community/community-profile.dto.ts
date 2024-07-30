export interface CommunityProfileDto {
  id?: string;
  userId?: string;
  aboutShort?: string;
  aboutLong?: any;
  shareContactInfo?: boolean;
  shareEmail?: any;
  sharePhoneNumber?: any;
  shareProfilePhoto?: boolean;
  shareProvince?: boolean;
  provinceId?: string;
  provinceName?: string;
  shareRole?: any;
  clickedECDHeros: boolean;
  coachUserId?: any;
  coachName?: string;
  completenessPerc?: number;
  completenessPercColor?: string;
  completenessPercImage?: string;
  insertedDate?: string;
  profileSkills?: ProfileSkillsDto[];
  communityUser?: CommunityUserDto;
  acceptedConnections?: CommunityProfileDto[];
  pendingConnections?: CommunityProfileDto[];
  userConnectionRequests?: CommunityProfileDto[];
  connectionAccepted?: boolean | null;
}

export interface CommunityUserDto {
  id?: string;
  fullName?: string;
  email?: any;
  phoneNumber?: string;
  whatsAppNumber?: any;
  profilePhoto?: string;
  roleName?: string;
}

export interface ProfileSkillsDto {
  id: string;
  name: string;
  imageName: string;
  description: string;
  isActive: boolean;
  ordering: number;
}
