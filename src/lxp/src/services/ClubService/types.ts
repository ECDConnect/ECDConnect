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
  meetingNotes?: string;
  clubId: string;
  coachAttend: boolean;
  totalCaregiversAttended: number;
  clubMeetingParticipants: { practitionerId: string; attended: boolean }[];
}

export interface BeCreativeActivityInput {
  clubId: string;
  dateUploaded: string;
  description?: string;
  fileType?: string;
  imageBase64?: string;
}
