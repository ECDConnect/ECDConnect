import { Alert, Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import RobotHearts from '../../assets/gifs/robothearts.gif';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@routes/routes';
import { TIMEOUTS } from '@/constants/timeouts';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

// robothearts.gif has 8 frames at 200ms each (1.6s loop): the heart builds up
// piece by piece (blue, then yellow, then pink) and then disassembles again.
const GIF_FRAME_DURATION = 200;
const GIF_FRAME_COUNT = 8;
const DOTS_PER_FRAME = [0, 1, 2, 3, 3, 2, 1, 0];

const Loader = ({ loadingMessage = 'Waking up the robots' }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { resetAuth, resetAppStore } = useStoreSetup();

  const [showIssue, setShowIssue] = useState<boolean>(false);
  const [gifFrame, setGifFrame] = useState<number>(0);

  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      setGifFrame((frame) => (frame + 1) % GIF_FRAME_COUNT);
    }, GIF_FRAME_DURATION);

    return () => clearInterval(interval);
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) return;
    // Ensure compatibility with all browsers
    const connection = (window.navigator as any).connection;
    const connectionType: string = connection?.effectiveType || '4g';

    // Ensure timeout exists to avoid undefined errors
    const issueTimeout = TIMEOUTS[connectionType]?.loadIssueTime || 5000; // Default 5s timeout if missing

    const timer = setTimeout(() => {
      setShowIssue(true);
    }, issueTimeout);

    return () => clearTimeout(timer);
  }, [isOnline]);

  return (
    <div
      style={{ backgroundColor: '#27385A' }}
      className="bottom-0 left-0 right-0 top-0 z-50 flex h-full w-full flex-col items-center justify-between overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center"></div>
      <div className="flex flex-col items-center justify-center">
        {isOnline ? (
          <img src={RobotHearts} alt="loading rocket" className="h-16 w-16" />
        ) : null}
        <div className="flex items-end">
          <Typography
            type="h2"
            color="white"
            weight="bold"
            className="text-center"
            text={loadingMessage}
          />
          {isOnline && (
            <div className="ml-1 flex items-end gap-1 pb-1">
              {[0, 1, 2].map((dotIndex) => (
                <span
                  key={dotIndex}
                  className="h-1 w-1 rounded-full bg-white transition-opacity duration-200"
                  style={{
                    opacity: dotIndex < DOTS_PER_FRAME[gifFrame] ? 1 : 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-4">
        {showIssue && (
          <Alert
            message={
              'Having issues? Go back to the login screen here to allow for a reset'
            }
            messageColor="white"
            type={'warning'}
            customIcon={
              <ExclamationCircleIcon
                className="white mb-4 h-6 w-6"
                style={{
                  color: '#ffffff',
                }}
              />
            }
            button={
              <Button
                color="textMid"
                type="filled"
                size="small"
                onClick={async () => {
                  resetAuth && (await resetAuth());
                  resetAppStore && (await resetAppStore());
                  history
                    ? history.push(ROUTES.LOGIN)
                    : window.location.reload();
                }}
              >
                <Typography
                  color="white"
                  text={'Reset & Go back to login'}
                  type="small"
                  underline
                />
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Loader;
