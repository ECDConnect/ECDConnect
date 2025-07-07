import { Typography } from '@ecdlink/ui';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

interface ItemProps {
  text: string;
  checked: boolean;
}
export const Item = ({ text, checked }: ItemProps) => (
  <div className="mt-4 flex items-center gap-2">
    {checked ? (
      <CheckCircleIcon className="text-successMain h-7 w-7" />
    ) : (
      <XCircleIcon className="text-errorMain h-7 w-7" />
    )}
    <Typography type="h4" text={text} color="textDark" />
  </div>
);
