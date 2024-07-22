import { Typography } from '@ecdlink/ui';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useTenant } from '@/hooks/useTenant';

export const EmptyPractitioners = () => {
  const tenant = useTenant();
  const orgName = tenant?.tenant?.applicationName;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid grid-cols-1 justify-center gap-4">
        <div className="flex justify-center">
          <img src={AlienImage} alt="alien" />
        </div>
        <div className="flex justify-center">
          <div className="flex w-8/12 justify-center">
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
            text={`Reach out to ${orgName}`}
            className={'mb-4'}
          />
        </div>
      </div>
    </div>
  );
};
