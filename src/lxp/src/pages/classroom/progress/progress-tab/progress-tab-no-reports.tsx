import { Button, Typography } from '@ecdlink/ui';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';

export type ProgressTabNoReports = {
  trackProgress: () => void;
};

export const ProgressTabNoReports: React.FC<ProgressTabNoReports> = ({
  trackProgress,
}) => {
  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <Emoji4Icon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text="You don't have any progress observations yet!"
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text={`Tap the button below to start`}
        type={'body'}
      />
      <Button
        onClick={trackProgress}
        className="mt-4 w-full"
        size="small"
        color="quatenary"
        textColor="white"
        type="filled"
        icon="PresentationChartBarIcon"
        text="Track progress"
      />
    </div>
  );
};
