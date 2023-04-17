import { Colours, renderIcon, Typography } from '@ecdlink/ui';

interface GrowthCardProps {
  color: Colours;
  icon: string;
  text: string;
}

export const GrowthCard = ({ color, icon, text }: GrowthCardProps) => {
  return (
    <div className={`rounded-10 bg-${color} flex items-center gap-5 p-5`}>
      {renderIcon(icon, 'w-10 h-10 text-white')}
      <Typography type="h3" text={text} color="white" />
    </div>
  );
};
