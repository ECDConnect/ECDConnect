import { Button, Typography } from '@ecdlink/ui';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';

export type ProgressTabNoReportsProps = {
  trackProgress: () => void;
};

export const ProgressTabNoReports: React.FC<ProgressTabNoReportsProps> = ({
  trackProgress,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden p-6">
      <div className="flex flex-1 flex-col items-center ">
        <Emoji4Icon />
        <Typography
          className="mt-4 text-center"
          color="textDark"
          text="You don't have any progress observations yet!"
          type="h3"
        />
        <Typography
          className="mt-2 text-center"
          color="textMid"
          text="Tap the button below to start"
          type="body"
        />
      </div>
      <Button
        onClick={trackProgress}
        className="mb-12 w-full"
        color="quatenary"
        textColor="white"
        type="filled"
        icon="PresentationChartBarIcon"
        text="Track progress"
      />
    </div>
  );
};
