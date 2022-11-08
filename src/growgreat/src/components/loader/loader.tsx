import { Alert, Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import LoadingRocket from '@/assets/gifs/rocketclear.gif';
import { useStoreSetup } from '@/hooks/useStoreSetup';
// import { useTheme } from '@ecdlink/core';
import ROUTES from '@/routes/routes';

const Loader = ({ loadingMessage = 'Loading . . .' }) => {
  const history = useHistory();
  const { resetAuth, resetAppStore } = useStoreSetup();
  // const { theme } = useTheme();

  const [showIssue, setShowIssue] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIssue(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ backgroundColor: '#F47C24' }}
      className="z-50 flex w-full flex-col items-center justify-between"
    >
      <div className="flex h-screen flex-col items-center justify-center">
        <img src={LoadingRocket} alt="loading rocket" />
        <Typography
          type="h2"
          color="white"
          weight="bold"
          className="text-center"
          text={loadingMessage}
        />
      </div>
      {showIssue && (
        <div className="flex flex-col items-center justify-center px-4 py-4">
          <Alert
            type={'warning'}
            message={
              'Having issues? Go back to the login screen here to allow for a reset'
            }
            button={
              <Button
                color="textMid"
                type="filled"
                size="small"
                onClick={async () => {
                  await resetAuth();
                  await resetAppStore();
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
        </div>
      )}
    </div>
  );
};

export default Loader;
