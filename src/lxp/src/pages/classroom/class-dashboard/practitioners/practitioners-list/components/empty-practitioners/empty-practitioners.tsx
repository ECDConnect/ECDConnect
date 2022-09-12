import { Typography } from '@ecdlink/ui';
import AlienImage from '../../../../../../../assets/ECD_Connect_alien.svg';

export const EmptyPractitioners = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-cols-1 justify-center gap-4">
        <div className="flex justify-center">
          <img src={AlienImage} alt="alien" />
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center w-8/12">
            <Typography
              type="h1"
              color="textDark"
              text={"You don't have any practitioners yet!"}
              className={'text-center'}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Typography
            type="body"
            color="textMid"
            text={'Reach out to your franchisor'}
            className={'mb-4'}
          />
        </div>
      </div>
    </div>
  );
};
