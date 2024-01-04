import { ContentTypeDto } from '@ecdlink/core';

interface Link {
  text: string;
  link: string;
  contentTypeId: number;
  linkedConnect: number;
  contentId: number;
}

export interface LinkPerSection {
  section: string;
  hint: string;
  contentTypeId: number;
  contentId: number;
  links: Link[];
}

export interface LinksSharedProps {
  contentType: ContentTypeDto;
  subContentType: ContentTypeDto;
  onClose: () => void;
}
