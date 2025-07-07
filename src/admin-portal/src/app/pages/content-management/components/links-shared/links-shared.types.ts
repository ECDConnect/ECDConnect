import { ContentTypeDto } from '@ecdlink/core';

export interface ConnectItem {
  text: string;
  link: string;
  contentTypeId: number;
  linkedConnect: number;
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
  links: ConnectItem[];
}

export interface LinksSharedProps {
  contentType: ContentTypeDto;
  onClose: () => void;
}
