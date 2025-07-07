import { Colours, Typography } from '@ecdlink/ui';

interface ScoreProps {
  sum: number;
  total: number;
}
export const Score = ({ sum, total }: ScoreProps) => {
  const getScore = () => {
    let scoreColours: Colours = 'errorMain';
    const result = sum;
    const percentage = (result / total) * 100;

    if (percentage > 28 && percentage < 74) {
      scoreColours = 'alertMain';
    }

    if (percentage >= 75) {
      scoreColours = 'successMain';
    }

    return {
      score: result,
      color: scoreColours,
      total,
    };
  };

  return (
    <div className="mt-8 flex items-center gap-2">
      <span
        className={`p-2 text-sm font-semibold text-white bg-${
          getScore().color
        } rounded-15`}
      >
        {getScore().score}/{getScore().total}
      </span>
      <Typography type="h4" text="Score" />
    </div>
  );
};
