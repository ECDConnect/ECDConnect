import { MoreInformation } from '@ecdlink/graphql';

export interface InformationState {
  information?: {
    section: string;
    locale: string;
    data: MoreInformation[];
  };
}
