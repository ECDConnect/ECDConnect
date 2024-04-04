import { Typography } from '@ecdlink/ui';
import { ReactComponent as PollySad } from '@/assets/pollySad.svg';

export const NoCommunityFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 pt-6 text-center">
      <PollySad className="mb-4 h-24 w-24" />
      <Typography
        type="h4"
        color="textDark"
        text="Sorry, no data found for this community"
      />
      <Typography
        type="body"
        color="textMid"
        text="Please make sure you're a member or try again later"
      />
    </div>
  );
};
