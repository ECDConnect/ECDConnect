import { SelfAssessmentOptions } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms/self-assessment/index.types';
import { Typography } from '@ecdlink/ui';

interface SelfAssessmentCardProps {
  text: string;
  rating: string;
}
export const SelfAssessmentCard = ({
  text,
  rating,
}: SelfAssessmentCardProps) => {
  const getRatingData = () => {
    switch (rating) {
      case SelfAssessmentOptions.Sometimes:
        return {
          text: rating,
          icon: <span className="text-errorMain text-xl">■</span>,
        };
      case SelfAssessmentOptions.MostOfTheTime:
        return {
          text: rating,
          icon: <span className="text-alertMain text-12">▲</span>,
        };
      default:
        return {
          text: rating,
          icon: <span className="text-successMain text-xl">●</span>,
        };
    }
  };

  return (
    <div>
      <Typography type="h4" text={text} color="textDark" />
      <span className="flex items-center gap-2">
        {getRatingData().icon}
        <Typography type="help" text={getRatingData().text} color="textMid" />
      </span>
    </div>
  );
};
