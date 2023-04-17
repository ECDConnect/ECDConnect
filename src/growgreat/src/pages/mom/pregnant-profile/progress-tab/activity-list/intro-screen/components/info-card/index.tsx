import {
  classNames,
  Colours,
  renderIcon,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';

export interface Item {
  icon?: string;
  customIcon?: string;
  iconBackgroundColour?: Colours;
  iconHexBackgroundColour?: string;
  title: string;
}

interface InfoCardProps {
  icon: string;
  items: Item[];
  primaryColour: Colours;
  secondaryColour: Colours;
  className?: string;
}

export const InfoCard = ({
  icon,
  items,
  primaryColour,
  secondaryColour,
  className,
}: InfoCardProps) => (
  <div
    className={classNames(
      className,
      `bg-${secondaryColour} border-2 border-${primaryColour} rounded-10 relative px-4 pt-8`
    )}
  >
    <span className="absolute rounded-full bg-white" style={{ top: -14 }}>
      {renderIcon(icon, `w-7 h-7 text-${primaryColour}`)}
    </span>
    {items.map((item, index) => (
      <div key={index} className="mb-4 flex gap-2">
        <RoundIcon
          imageUrl={item.customIcon}
          icon={item.icon}
          iconColor="white"
          backgroundColor={item.iconBackgroundColour}
          hexBackgroundColor={item.iconHexBackgroundColour}
        />
        <Typography
          className="font-semibold"
          color="textMid"
          type="markdown"
          text={item.title}
        />
      </div>
    ))}
  </div>
);
