import { Button, Typography, renderIcon } from '@ecdlink/ui';
import { useTheme } from '@ecdlink/core';

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
  const { theme } = useTheme();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-8 text-center">
      {theme?.images?.logoUrl && (
        <img
          src={theme.images.logoUrl}
          alt="App logo"
          className="mb-8 h-16 object-contain"
        />
      )}
      {renderIcon('ExclamationCircleIcon', 'mb-4 h-16 w-16 text-alertMain')}
      <Typography
        type="h2"
        text="Update required"
        color="textDark"
        className="mb-2"
      />
      <Typography
        type="body"
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
  );
};
