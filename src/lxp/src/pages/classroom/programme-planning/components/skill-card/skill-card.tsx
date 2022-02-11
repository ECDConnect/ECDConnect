import { Card, RoundIcon, Typography } from '@ecdlink/ui';

export type SkillCardProps = {
  className: string;
  icon: string;
  title: string;
  hexBackgroundColor?: string;
};

const SkillCard: React.FC<SkillCardProps> = ({ className, icon, title, hexBackgroundColor }) => {
  return (
    <Card
      shadowSize="lg"
      borderRaduis="lg"
      className={`flex flex-row p-4 items-center ${className}`}
    >
      <RoundIcon
        imageUrl={icon}
        hexBackgroundColor={hexBackgroundColor}
        className={`mr-4 ${!hexBackgroundColor ? 'bg-primary' : ''} text-white`}
      />
      <Typography type="body" fontSize={'16'} text={title} color={'textDark'} />
    </Card>
  );
};

export default SkillCard;
