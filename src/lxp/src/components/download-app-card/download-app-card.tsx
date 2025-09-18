import { useTenant } from '@/hooks/useTenant';
import pwa from '@/utils/pwa';
import { Button, Card, Typography, classNames, renderIcon } from '@ecdlink/ui';

interface DownloadAppCardProps {
  className?: string;
}

export const DownloadAppCard: React.FC<DownloadAppCardProps> = ({
  className,
}) => {
  const tenant = useTenant();

  if (!pwa.isInstallationAvailable()) {
    console.warn('App download not available.');
    return null;
  }

  const onClick = async () => {
    pwa.showInstallPrompt();
  };

  return (
    <Card className={classNames(className, 'bg-uiBg rounded-xl p-4')}>
      <Typography
        type="h2"
        color="textDark"
        text={`Download ${tenant.tenant?.applicationName}`}
      />
      <Typography
        type="body"
        color="textMid"
        text="Save the app on your phone so it's quick and easy to open any time!"
        className="mt-4 "
      />
      <div className="flex justify-center">
        <Button
          type="filled"
          color="quatenary"
          className="mt-6 w-full rounded-2xl"
          onClick={onClick}
        >
          {renderIcon('PencilAltIcon', 'w-5 h-5 color-white text-white mr-1')}
          <Typography
            type="body"
            className="mr-4"
            color="white"
            text="Download the app"
          ></Typography>
        </Button>
      </div>
    </Card>
  );
};
