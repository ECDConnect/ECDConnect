import { Maybe } from '@ecdlink/graphql';

export interface RatingData {
  text: string;
  icon: JSX.Element;
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
      };
    case 'Warning':
      return {
        text: 'Orange rating',
        icon: <span className="text-alertMain text-xs">▲</span>,
      };
    default:
      return {
        text: 'Green rating',
        icon: <span className="text-successMain text-xl">●</span>,
      };
  }
};
