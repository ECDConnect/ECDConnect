import { Colours, Typography } from '@ecdlink/ui';
import { DataSetType } from './chart.types';

export const Card = ({
  value,
  title,
  subTitle,
  status,
}: {
  value: string;
  title: string;
  subTitle: string;
  status: DataSetType;
}) => {
  const getColor = (): { bg: Colours; main: Colours } => {
    switch (status) {
      case 'SD2':
        return { bg: 'alertBg', main: 'alertMain' };
      case 'SD2neg':
        return { bg: 'alertBg', main: 'alertMain' };
      case 'SD3neg':
        return { bg: 'errorBg', main: 'errorMain' };
      case 'SD3':
        if (title === 'Length') {
          return { bg: 'successBg', main: 'successMain' };
        } else {
          return { bg: 'errorBg', main: 'errorMain' };
        }
      default:
        return { bg: 'successBg', main: 'successMain' };
    }
  };

  return (
    <div
      className={`bg-${
        getColor().bg
      } flex w-full flex-col items-center justify-center rounded-xl p-4`}
    >
      <Typography type="h4" color="textDark" text={title} />
      <Typography
        type="body"
        color={getColor().main}
        className="my-3 text-4xl font-bold"
        text={value}
      />
      <Typography
        type="body"
        color="textMid"
        className="text-xs font-bold"
        text={subTitle}
      />
    </div>
  );
};
