import { AlertType, Typography, Alert } from '@ecdlink/ui';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';

export interface Item {
  title: string;
  subTitle?: string;
  descriptionLabel?: string;
  description?: string;
  rightChip?: string;
  leftChip?: string;
  alert: {
    title: string;
    type: AlertType;
  };
}

interface AlertCardProps {
  item: Item;
}

export const AlertCard = ({ item }: AlertCardProps) => (
  <div className="mb-5">
    <Typography type="h3" text={item.title} />
    {item.subTitle && (
      <Typography type="h4" color="textMid" text={item.subTitle} />
    )}
    {item.descriptionLabel && (
      <Typography
        type="h4"
        color="textDark"
        text={item.descriptionLabel}
        className="mt-5"
      />
    )}
    <Typography
      type="body"
      color="textMid"
      text={item.description}
      className={`${!item.descriptionLabel ? 'mt-5' : ''} mb-4`}
    />
    <Alert
      type={item.alert.type}
      title={item.alert.title}
      titleColor="textDark"
      rightChip={item.rightChip}
      leftChip={item.leftChip}
      customIcon={
        (item.alert.type === 'info' && (
          <ClockIcon className="h-6 w-6 self-center" />
        )) ||
        (item.alert.type === 'warning' && (
          <ExclamationCircleIcon className="h-6 w-6 self-center" />
        )) ||
        (item.alert.type === 'error' && (
          <XCircleIcon className="h-6 w-6 self-center" />
        )) ||
        (item.alert.type === 'success' && (
          <CheckCircleIcon className="h-6 w-6 self-center" />
        )) ||
        undefined
      }
    />
  </div>
);
