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

export interface ClubDto {
  id: string;
  name: string;
}

export interface CoachingCircleTopicDto {
  id: number;
  name: string;
  title: string;
  description: string;
  topicContent: string;
}
