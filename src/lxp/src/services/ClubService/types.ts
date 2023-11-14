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
