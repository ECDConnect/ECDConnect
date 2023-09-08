import { AlertSeverityType } from '@ecdlink/ui';

export interface CoachCirclesDto {
  clubsWithLinkedMeetings: ClubsLinkedMeetingsDto[];
  clubsWithNoLinkedMeetings: ClubsLinkedMeetingsDto[];
}

export interface ClubsLinkedMeetingsDto {
  id: string;
  cCMeetingStatus: string;
  cCMeetingStatusColor: AlertSeverityType;
  name: string;
}
