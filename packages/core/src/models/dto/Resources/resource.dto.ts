export interface ResourceDto {
  id: number;
  resourceType: string;
  title: string;
  shortDescription: string;
  link: string;
  longDescription: string;
  dataFree: string;
  sectionType: string;
  numberLikes: string;
  availableLanguages: ResourceLanguageDto[];
  updatedDate: string;
  insertedDate: string;
}

export interface ResourceLanguageDto {
  id: string;
}

export interface ResourcesLikedDto {
  isActive: boolean;
  contentId: number;
}

export const ResourceLocaleId = '9688cd08-adef-408c-9d34-5d75ae5c44df'; // English
