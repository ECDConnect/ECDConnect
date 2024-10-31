import { Alert, Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import RobotHearts from '../../assets/gifs/robothearts.gif';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@routes/routes';

const TIMEOUTS: { [key: string]: number } = {
  '4g': 20000,
  '3g': 30000,
  '2g': 40000,
  'slow-2g': 50000,
};

const Loader = ({ loadingMessage = 'Waking up the robots' }) => {
  const history = useHistory();
  const { resetAuth, resetAppStore } = useStoreSetup();

  const [showIssue, setShowIssue] = useState<boolean>(false);

  useEffect(() => {
    // Check for connection type and set timeout accordingly.
    // This gives slower connections more time to not throw false positives for issues.
    const connectionType: string = (window.navigator as any).connection
      .effectiveType as string;
    const issueTimeout = TIMEOUTS[connectionType] || TIMEOUTS['4g'];

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
            type={'warning'}
            button={
              <Button
                color="textMid"
                type="filled"
                size="small"
                onClick={async () => {
                  await resetAppStore();
                  await resetAuth();
                  history.push(ROUTES.LOGIN);
                }}
              >
                <Typography
                  color="white"
                  text={'Reset & Go back to login'}
                  type="small"
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
