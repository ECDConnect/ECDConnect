import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useQueryParams } from '@ecdlink/core';
import { AuthService } from '@/services/AuthService';

interface InvalidTokenProps {
  closeAction: (item: boolean) => void;
  username: string;
}

export const InvalidToken: React.FC<InvalidTokenProps> = ({
  closeAction,
  username,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation();
  const queryParams = useQueryParams(location.search);
  const authToken = queryParams.getValue('token');

  const reloadView = async () => {
    if (authToken) {
      await new AuthService().SendNewInvitation(username, authToken);
    }
    closeAction(false);
    history.push('/');
  };

  return (
    <>
      <BannerWrapper
        size="small"
        onBack={history.goBack}
        color="primary"
        className={'h-full'}
        title={`Eish`}
        subTitle={'Something went wrong'}
        displayOffline={!isOnline}
      >
        <div className={'flex h-full flex-col overflow-y-scroll pb-20'}>
          <div
            className={
              'flex w-full items-center justify-center p-4 text-center'
            }
          >
            <div className="w-11/12">
              <Typography
                className={'mt-8'}
                type="h1"
                color={'textMid'}
                text={`Eish! This invitation link has expired.`}
              />
            </div>
          </div>
          <div className={'flex w-full justify-center p-4'}>
            <ExclamationCircleIcon className="text-errorMain h-20 w-20" />
          </div>
          <div
            className={
              'flex w-full items-center justify-center p-4 text-center'
            }
          >
            <div className="w-11/12">
              <Typography
                className={'mt-8'}
                type="h3"
                color={'textMid'}
                text={`Tap below to get a new invitation.`}
              />
            </div>
          </div>
          <div className={'w-full p-4'}>
            <Button
              type={'filled'}
              color={'quatenary'}
              className={'w-full'}
              onClick={reloadView}
            >
              {renderIcon('PaperAirplaneIcon', 'w-5 h-5 text-white mr-1')}
              <Typography
                type="help"
                color={'white'}
                text={`Get new invitation`}
              />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
