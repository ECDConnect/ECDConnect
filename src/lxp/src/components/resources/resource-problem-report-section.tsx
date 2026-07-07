import {
  Alert,
  Button,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { FlagIcon } from '@heroicons/react/solid';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';

interface ResourceProblemReportSectionProps {
  onReportClick: () => void;
}

export const ResourceProblemReportSection: React.FC<
  ResourceProblemReportSectionProps
> = ({ onReportClick }) => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <>
      <Divider dividerType="dashed" className="mb-2" />
      <Alert
        type="info"
        title="Found a problem with this resource?"
        customMessage={
          <div className={'w-full'}>
            <Button
              onClick={() => {
                if (!isOnline) {
                  showOnlineOnly();
                } else {
                  onReportClick();
                }
              }}
              className="justify-left mt-1"
              size="normal"
              color="quatenary"
              type="filled"
            >
              <FlagIcon className="mr-1 h-5 w-5" />
              <Typography
                type="help"
                color={'white'}
                text={`Report a problem`}
              />
            </Button>
          </div>
        }
      />
    </>
  );
};
