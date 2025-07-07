import { EntityBase } from '../entity-base';

export interface MeetingDto extends EntityBase {
  clinicId: string;
  clinicName?: string;
  dateSubmitted: string;
  id: string;
  meetingDate: string;
  meetingTypeId: string;
  meetingTopicTitle?: string;
  month?: string;
  positiveStory?: string;
  reportingIssue?: string;
  totalSupportVisits: number;
  meetingTopic?: MeetingTopic;
}

export interface MeetingTopic {
  title?: string;
  topicTitle?: string;
  topicContent?: string;
  infoGraphic?: string;
  knowledgeContent?: string;
  selfCareContent?: string;
}
