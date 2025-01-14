import { ContentDefinitionModelDto, ContentValueDto } from '@ecdlink/core';
import { SearchDropDownOption } from '@ecdlink/ui';

export interface ContentManagementView {
  content: any;
  languageId: string;
}

export enum FieldType {
  Text = 'text',
  Markdown = 'markdown',
  Image = 'image',
  Link = 'link',
  StaticLink = 'staticLink',
  ColorPicker = 'color-picker',
  DatePicker = 'date-picker',
  video = 'video',
}

export enum ContentName {
  StoryBook = 'StoryBook',
  Theme = 'Theme',
  ProgressTrackingCategory = 'ProgressTrackingCategory',
  ProgressTrackingSkill = 'ProgressTrackingSkill',
  ClassroomBusinessResource = 'ClassroomBusinessResource',
}

export enum StoryActivitiesTypes {
  Storybook = 'Story book',
  ReadAloud = 'Read aloud',
  Other = 'other',
}

export enum ActivitiesTitles {
  StorybookParts = 'StorybookParts',
  StoryActivities = 'Story activities',
  Storybooks = 'Storybooks',
  SmallLargeGroupActivities = 'Small/large group activities',
}

export enum ResourcesTitles {
  ClassroomResources = 'Classroom resources',
  BusinessResources = 'Business resources',
  CommunityLinks = 'Community links',
  ChildProgressReportLinksForCaregivers = 'Child progress report links for caregivers',
}

export enum ActivityTypes {
  SmallGroup = 'Small group',
  LargeGroup = 'Large group',
}

export enum MediaTypes {
  Infographic = 'infoGraphic',
  Image = 'image',
  InfographicSecondLanguage = 'infoGraphicsecondLanguageContent',
  ImageSecondLanguage = 'imagesecondLanguageContent',
}

export enum TemplateTypenames {
  DangerSigns = 'DangerSign Form',
  NatalGraphic = 'NatalGraphic Form',
}

export const searchByActivityTypeOptions: SearchDropDownOption<string>[] = [
  ActivityTypes?.SmallGroup,
  ActivityTypes?.LargeGroup,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export interface DynamicFormTemplate {
  title: string;
  fields: FormTemplateField[];
}

export interface FormTemplateField {
  title: string;
  propName: string;
  propOrder?: number;
  type: string;
  required: FormTemplateFieldRequired;
  validation?: any;
  options?: string; // NUMBERS IN STRING WITH , SPLIT
  contentValue?: ContentValueDto;
  optionDefinition?: ContentDefinitionModelDto;
  selectedLanguageId?: string;
  dataLinkName?: string;
  isRequired?: boolean;
  subHeading?: string;
  fieldAlert?: string;
}

export interface FormTemplateFieldRequired {
  value: boolean;
  message: string;
}
