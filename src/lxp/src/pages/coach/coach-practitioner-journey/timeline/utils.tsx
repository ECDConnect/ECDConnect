import { Maybe } from '@ecdlink/graphql';
import { Colours } from '@ecdlink/ui';

export interface RatingData {
  text: string;
  icon: JSX.Element;
  color: Colours;
}

export const followUpDeadline = { default: 14, lastVisit: 60 };

export const getRatingData = (
  overallRatingColor?: Maybe<string>
): RatingData => {
  switch (overallRatingColor) {
    case 'Error':
      return {
        text: 'Red rating',
        icon: <span className="text-errorMain text-xl">■</span>,
        color: 'errorMain',
      };
    case 'Warning':
      return {
        text: 'Orange rating',
        icon: <span className="text-alertMain text-xs">▲</span>,
        color: 'alertMain',
      };
    default:
      return {
        text: 'Green rating',
        icon: <span className="text-successMain text-xl">●</span>,
        color: 'successMain',
      };
  }
};
