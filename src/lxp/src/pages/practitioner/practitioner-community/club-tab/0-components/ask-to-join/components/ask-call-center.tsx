import { Alert, Button, Typography } from '@ecdlink/ui';

export const AskCallCentre: React.FC = () => {
  const call = () => {
    window.open('tel:0800014817');
  };

  return (
    <div className={'h-full overflow-y-auto bg-white'}>
      <Typography
        text={'Contact the call centre for help'}
        type="h1"
        color="textMid"
        className={'flex-column mx-auto mt-4 w-11/12 items-center'}
      />
      <Typography
        text={
          'Your coach has not added you to a club yet. You can contact the call centre to ask for help.'
        }
        type="h2"
        color="textMid"
        className={'flex-column mx-auto mt-4 w-11/12 items-center'}
      />
      <div className={'flex-column mx-auto mt-2 w-11/12 items-center'}>
        <Typography
          text={'0800 014 817'}
          type="h2"
          color="textMid"
          className={'mt-4'}
        />
        <div className={'mt-4 flex justify-start gap-3'}>
          <Button
            text={'Call 0800 014 817'}
            icon={'PhoneIcon'}
            color={'primary'}
            textColor={'primary'}
            type={'outlined'}
            size={'small'}
            onClick={call}
          />
        </div>
        <Alert
          type={'info'}
          className="items-left justify-left mt-4 flex"
          title={"SmartStart's call centre number is toll free."}
        />
      </div>
    </div>
  );
};
