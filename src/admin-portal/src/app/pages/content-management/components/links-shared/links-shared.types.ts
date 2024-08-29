import { ContentTypeDto } from '@ecdlink/core';

export interface ConnectLink {
  title: string;
  link: string;
  description: string;
  contentTypeId: number;
  contentId: number;
}

export interface ResourceLink {
  title: string;
  link: string;
  description: string;
  contentTypeId: number;
  contentId: number;
}

export interface LinkPerSection {
  section: string;
  hint: string;
  contentTypeId: number;
  contentId: number;
  links: ConnectLink[];
}

export interface LinksSharedProps {
  contentType: ContentTypeDto;
  onClose: () => void;
}
