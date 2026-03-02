import { Colours, Typography } from '@ecdlink/ui';

interface ScoreProps {
  sum: number;
  total: number;
}

export const Score = ({ sum, total }: ScoreProps) => {
  const { score, color, total: t } = getScore(sum, total); // renamed for clarity

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span
        className={`flex h-9 min-w-[4.5rem] items-center justify-center rounded-xl px-3 text-sm font-medium text-white bg-${color}`}
      >
        {score}/{t}
      </span>
      <Typography type="h3" text="Score" />
    </div>
  );
};

function getScore(sum: number, total: number) {
  const percentage = total === 0 ? 0 : (sum / total) * 100;
  let color: Colours = 'alertMain';

  if (percentage > 99) color = 'successMain';

  return { score: sum, color, total };
}
