import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const currentVersion: string =
  process.env.REACT_APP_VERSION ?? require('../../../package.json').version;

const handleUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
  window.location.reload();
};

export const UpdateRequired: React.FC = () => {
  return (
    <BannerWrapper
      size="small"
      color="primary"
      className={'h-full'}
      title={`Update required`}
    >
      <div className="flex h-screen flex-col items-center justify-center bg-white px-8 text-center">
        <div className="w-11/12">
          <Typography
            type="h1"
            text="Update required"
            color="textDark"
            className="mb-2"
          />
        </div>
        <div className={'flex w-full justify-center p-4'}>
          <ExclamationCircleIcon className="text-errorMain h-20 w-20" />
        </div>
        <Typography
          type="h3"
          text="A new version of the app is available. Please update now to continue."
          color="textMid"
          className="mb-8"
        />
        <Button
          type="filled"
          color="quatenary"
          className="w-full max-w-xs"
          onClick={handleUpdate}
        >
          {renderIcon('RefreshIcon', 'mr-2 h-5 w-5 text-white')}
          <Typography type="buttonSmall" text="Update now" color="white" />
        </Button>
        {currentVersion && (
          <Typography
            type="help"
            text={`Current version: ${currentVersion}`}
            color="textLight"
            className="mt-6"
          />
        )}
      </div>
    </BannerWrapper>
  );
};
