import { Alert, Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import RobotHearts from '../../assets/gifs/robothearts.gif';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@routes/routes';
import { TIMEOUTS } from '@/constants/timeouts';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

const Loader = ({ loadingMessage = 'Waking up the robots' }) => {
  const history = useHistory();
  const { resetAuth, resetAppStore } = useStoreSetup();

  const [showIssue, setShowIssue] = useState<boolean>(false);

  useEffect(() => {
    // Ensure compatibility with all browsers
    const connection = (window.navigator as any).connection;
    const connectionType: string = connection?.effectiveType || '4g';

    // Ensure timeout exists to avoid undefined errors
    const issueTimeout = TIMEOUTS[connectionType]?.loadIssueTime || 5000; // Default 5s timeout if missing

    const timer = setTimeout(() => {
      setShowIssue(true);
    }, issueTimeout);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ backgroundColor: '#27385A' }}
      className="top-0 bottom-0 left-0 right-0 z-50 flex h-full w-full flex-col items-center justify-between overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center"></div>
      <div className="flex flex-col items-center justify-center">
        <img src={RobotHearts} alt="loading rocket" className="h-16 w-16" />
        <Typography
          type="h2"
          color="white"
          weight="bold"
          className="text-center"
          text={loadingMessage}
        />
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
