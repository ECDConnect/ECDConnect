import { Typography } from '@ecdlink/ui';
import { ReactComponent as ConnectionIcon } from '@/assets/connectionIcon.svg';
export const OfflineCard: React.FC = () => {
  return (
    <div className={'flex flex-col items-center'}>
      <ConnectionIcon className="my-4 h-28 w-28" />
      <Typography
        text="Information not available when offline"
        type="h3"
        weight={'bold'}
        align="center"
      />

      <Typography
        text="Please go online and refresh the page to see this information."
        type={'body'}
        color="textMid"
        align="center"
        className="mt-2"
      />
    </div>
  );
};
