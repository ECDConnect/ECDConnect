export interface CalendarEventParticipantDto {
  id: string;
  isActive: boolean;
  participantUserId: string | null;
  participantUser: {
    firstName: string | null;
    surname: string | null;
  } | null;
}
