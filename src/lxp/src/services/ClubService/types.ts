export interface NewClubLeaderInput {
  clubId: string;
  practitionerId: string;
}

export interface ChangeClubSupportRoleInput {
  clubId: string;
  practitionerId: string;
}

export interface ClubMeetingInput {
  meetingDate: string;
  meetingType?: string;
  meetingNotes?: string;
  clubId: string;
  coachAttend?: boolean;
  totalCaregiversAttended: number;
  clubMeetingParticipants: { practitionerId: string; attended: boolean }[];
  fileType?: string;
  imageBase64?: string;
}

export interface BeCreativeActivityInput {
  clubId: string;
  dateUploaded: string;
  description?: string;
  fileType?: string;
  imageBase64?: string;
}

export interface ActivityHostFamilyDetailsInput {
  clubId: string;
}

export interface ActivityLeaveNoOneBehindDetailsInput {
  clubId: string;
}

export interface ActivityChildAttendanceDetailsInput {
  clubId: string;
}

export interface UpdateClubSupportStatusInput {
  practitionerId: string;
}
