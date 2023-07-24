import { Typography } from '@ecdlink/ui';

interface SelfAssessmentCardProps {
  text: string;
  ratingColor: 'Success' | 'Warning' | 'Error';
}
export const SelfAssessmentCard = ({
  text,
  ratingColor,
}: SelfAssessmentCardProps) => {
  const getRatingData = () => {
    switch (ratingColor) {
      case 'Error':
        return {
          text: 'Sometimes',
          icon: <span className="text-errorMain text-xl">■</span>,
        };
      case 'Warning':
        return {
          text: 'Most of the time',
          icon: <span className="text-alertMain text-12">▲</span>,
        };
      default:
        return {
          text: 'All the time',
          icon: <span className="text-successMain text-xl">●</span>,
        };
    }
  };

  return (
    <div>
      <Typography
        type="h4"
        text="lorem ipsum lorem lorem ipsum"
        color="textDark"
      />
      <span className="flex items-center gap-2">
        {getRatingData().icon}
        <Typography type="help" text={getRatingData().text} color="textMid" />
      </span>
    </div>
  );
};
