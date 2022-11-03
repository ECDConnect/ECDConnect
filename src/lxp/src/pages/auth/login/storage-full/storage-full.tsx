import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const StorageFull: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

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
          <div className={'flex w-full items-center justify-center p-4'}>
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
          <div className={'bg-uiLight w-full p-4'}>
            <Typography
              type="body"
              color={'black'}
              weight={'bold'}
              text={`If is no longer attending your programme, please remove them.`}
            />
          </div>
          <div className={'w-full p-4'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'w-full'}
              onClick={() => {}}
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
