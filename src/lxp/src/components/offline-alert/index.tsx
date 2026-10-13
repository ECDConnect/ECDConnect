import OfflineIcon from '@/assets/offline.svg?react';
import { Typography } from '@ecdlink/ui';

export const OfflineAlert = () => {
  return (
    <div className="mt-4 flex flex-col items-center justify-center px-10 text-center">
      <OfflineIcon />
      <Typography
        type="h3"
        text="Information not available when offline"
        color="textDark"
        className="mb-2 mt-4"
      />
      <Typography
        type="body"
        text="Please go online and refresh the page to see this information."
        color="textDark"
      />
    </div>
  );
};
