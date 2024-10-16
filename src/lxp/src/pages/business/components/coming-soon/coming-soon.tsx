import { Typography } from '@ecdlink/ui';
import ComingSoonImg from '../../../../assets/ECD_coming_soon.png';

export const ComingSoon = () => {
  return (
    <div className="flex justify-center p-4">
      <div>
        <Typography
          type="h4"
          color="textDark"
          text="Resources coming soon!"
          className="mt-8"
        />
        <img src={ComingSoonImg} alt="coming soon" className="mt-8 ml-8" />
      </div>
    </div>
  );
};
