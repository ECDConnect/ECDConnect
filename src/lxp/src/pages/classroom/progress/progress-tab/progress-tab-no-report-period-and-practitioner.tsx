import { Typography } from '@ecdlink/ui';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';

export const ProgressTabNoReportPeriodAndPractitioner: React.FC<{
  principalName: string;
}> = ({ principalName }) => {
  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <Emoji4Icon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text="Your principal has not created progress reporting periods yet."
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text={`Reach out to ${principalName} and ask them to set up progress reporting periods.`}
        type={'body'}
      />
    </div>
  );
};
