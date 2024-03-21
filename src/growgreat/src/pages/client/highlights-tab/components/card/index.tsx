import { RoundIcon, Typography, renderIcon } from '@ecdlink/ui';

interface CardProps {
  value?: number;
  label: string;
  icon: string;
  points?: number;
}

export const Card = ({ value, label, icon, points }: CardProps) => (
  <div className="bg-uiBg mb-4 flex items-center gap-3 rounded-2xl p-4">
    <RoundIcon icon={icon} iconColor="white" backgroundColor="tertiary" />
    <Typography
      type="body"
      weight="bold"
      lineHeight="snug"
      color="textDark"
      className="text-3xl"
      text={String(value)}
    />
    <Typography
      type="h4"
      weight="bold"
      lineHeight="snug"
      color="textMid"
      text={label}
      className="w-screen"
    />
    {!!points && (
      <div className="relative mr-1 flex h-12 w-12 items-center justify-center bg-transparent text-center">
        <span className="bg-secondary absolute top-3 h-5 w-6 rounded-xl"></span>
        {renderIcon('BadgeCheckIcon', 'text-secondary absolute h-12 w-12')}
        <Typography
          type="body"
          weight="bold"
          lineHeight="snug"
          color="white"
          className="absolute pt-1"
          text={String(points)}
        />
      </div>
    )}
  </div>
);
