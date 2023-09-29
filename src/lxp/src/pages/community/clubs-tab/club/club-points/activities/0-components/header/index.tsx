import { RoundIcon, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';

interface HeaderProps {
  title: string;
  date: Date;
  imageUrl?: string;
  icon?: string;
}

export const Header = ({ date, imageUrl, icon, title }: HeaderProps) => (
  <div className="flex gap-4">
    {(icon || imageUrl) && (
      <RoundIcon icon={icon} imageUrl={imageUrl} backgroundColor="tertiary" />
    )}
    <div>
      <Typography type="h2" text={title} />
      <Typography type="h4" color="textMid" text={format(date, 'MMMM yyyy')} />
    </div>
  </div>
);
