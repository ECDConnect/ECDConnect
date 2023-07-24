import { Typography } from '@ecdlink/ui';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

interface ItemProps {
  text: string;
  checked: boolean;
}
export const Item = ({ text, checked }: ItemProps) => (
  <div className="flex items-center gap-2">
    {checked ? (
      <CheckCircleIcon className="text-successMain h-5 w-5" />
    ) : (
      <XCircleIcon className="text-errorMain h-5 w-5" />
    )}
    <Typography type="h4" text={text} color="textDark" />
  </div>
);
