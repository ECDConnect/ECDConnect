import { Colours, Typography } from '@ecdlink/ui';

interface ScoreProps {
  questions: {
    question: string;
    answer: string;
  }[];
  total: number;
}
export const Score = ({ questions, total }: ScoreProps) => {
  const getScore = () => {
    const scores = questions
      .filter((item) => item.answer !== '')
      .map((item) => Number(item.answer.split(' - ')[0]));

    const result = scores.reduce((total, number) => total + number, 0);
    const percentage = (result / total) * 100;
    let scoreColours: Colours = 'errorMain';

    if (percentage > 25 && percentage < 70) {
      scoreColours = 'alertMain';
    }

    if (percentage >= 70) {
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
