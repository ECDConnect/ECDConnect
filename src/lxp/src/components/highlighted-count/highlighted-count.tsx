// components/highlighted-count/highlighted-count.tsx
import { Typography } from '@ecdlink/ui';

interface HighlightedCountProps {
  count: string | number;
}

export const HighlightedCount: React.FC<HighlightedCountProps> = ({
  count,
}) => (
  <div className="bg-alertMain flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
    <Typography type="h2" weight="bold" color="white" text={count.toString()} />
  </div>
);
