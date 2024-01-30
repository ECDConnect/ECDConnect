import { RoundIcon, Typography, classNames } from '@ecdlink/ui';
import { format } from 'date-fns';

interface HeaderProps {
  title: string;
  date: Date;
  imageUrl?: string;
  icon?: string;
  className?: string;
}

export const Header = ({
  date,
  imageUrl,
  icon,
  title,
  className,
}: HeaderProps) => (
  <div className={classNames('flex gap-4', className)}>
    {(icon || imageUrl) && (
      <RoundIcon
        icon={icon}
        imageUrl={imageUrl}
        backgroundColor="tertiary"
        iconColor="white"
      />
    )}
    <div>
      <Typography type="h2" text={title} />
      <Typography type="h4" color="textMid" text={format(date, 'MMMM yyyy')} />
    </div>
  </div>
);
