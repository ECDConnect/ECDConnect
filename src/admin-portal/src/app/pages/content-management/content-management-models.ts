import { ContentDefinitionModelDto, ContentValueDto } from '@ecdlink/core';

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
}

export enum ContentName {
  StoryBook = 'StoryBook',
  Theme = 'Theme',
  ProgressTrackingCategory = 'ProgressTrackingCategory',
  ProgressTrackingSkill = 'ProgressTrackingSkill',
}

export interface DynamicFormTemplate {
  title: string;
  fields: FormTemplateField[];
}

export interface FormTemplateField {
  title: string;
  propName: string;
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
