import { ContentTypeDto } from '@ecdlink/core';

interface Link {
  text: string;
  link: string;
}

export interface LinkPerSection {
  section: string;
  links: Link[];
}

export interface LinksSharedProps {
  contentType: ContentTypeDto;
  subContentType: ContentTypeDto;
}
