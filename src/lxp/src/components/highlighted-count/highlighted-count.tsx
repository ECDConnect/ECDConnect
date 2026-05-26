// components/highlighted-count/highlighted-count.tsx
import { Typography } from '@ecdlink/ui';

interface HighlightedCountProps {
  count: string | number;
}

export const HighlightedCount: React.FC<HighlightedCountProps> = ({
  count,
}) => (
  <div className="bg-errorMain flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
    <Typography type="h3" weight="bold" color="white" text={count.toString()} />
  </div>
);
