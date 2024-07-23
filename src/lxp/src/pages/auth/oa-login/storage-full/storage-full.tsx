import { BannerWrapper, Button, Typography, renderIcon } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

export const StorageFull: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const reloadView = () => {
    window.location.reload();
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
                text={`Eish! Your phone storage 
              is full.`}
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
                text={`Please clear some items and tap refresh to try again.`}
              />
            </div>
          </div>
          <div className={'w-full p-4'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'w-full'}
              onClick={reloadView}
            >
              {renderIcon('RefreshIcon', 'w-5 h-5 text-white mr-1')}
              <Typography type="help" color={'white'} text={`Refresh`} />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
