import { Alert, Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import LoadingRocket from '../../assets/gifs/rocketclear.gif';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@routes/routes';

const Loader = ({ loadingMessage = 'Loading . . .' }) => {
  const history = useHistory();
  const { resetAuth, resetAppStaticStores } = useStoreSetup();

  const [showIssue, setShowIssue] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowIssue(true);
    }, 15000);
  }, []);

  return (
    <div
      style={{ backgroundColor: '#583f99' }}
      className="flex flex-col top-0 bottom-0 left-0 right-0 items-center justify-between w-full h-full overflow-hidden z-50"
    >
      <div className="flex flex-col items-center justify-center"></div>
      <div className="flex flex-col items-center justify-center">
        <img src={LoadingRocket} alt="loading rocket" />
        <Typography
          type="h2"
          color="white"
          weight="bold"
          className="text-center"
          text={loadingMessage}
        />
      </div>
      <div className="px-4 py-4 flex flex-col items-center justify-center">
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
                  await resetAuth();
                  await resetAppStaticStores();
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
