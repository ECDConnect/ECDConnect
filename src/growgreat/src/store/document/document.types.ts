import { Document } from '@ecdlink/core';
import { Document as DocumentsForHCW } from '@ecdlink/graphql';

export type DocumentState = {
  documents?: Document[] | undefined;
  documentsForHCW?: DocumentsForHCW[];
};
