import { RoundIcon, Typography } from '@ecdlink/ui';

export type SkillCardProps = {
  className: string;
  icon: string;
  title: string;
  hexBackgroundColor?: string;
};

const SkillCard: React.FC<SkillCardProps> = ({
  icon,
  title,
  hexBackgroundColor,
}) => {
  return (
    <div className="flex items-center gap-2 p-3">
      <RoundIcon
        imageUrl={icon}
        hexBackgroundColor={hexBackgroundColor}
        className={`mr-4 ${!hexBackgroundColor ? 'bg-primary' : ''} text-white`}
      />
      <Typography type="body" fontSize={'16'} text={title} color={'textDark'} />
    </div>
  );
};

export default SkillCard;
