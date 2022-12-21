import { Typography, Card, Button } from '@ecdlink/ui';
import { ReactComponent as MomImage } from '@/assets/momImageSvg.svg';

export const WelcomePage = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
      <div className="h-full pt-7">
        <div className="flex flex-col gap-11">
          <Typography
            color="white"
            type="h1"
            text="Hello, my name is Polley and I'm here to help you!
          "
          />
          <div>
            <Card
              className="bg-uiBg flex flex-col items-center gap-3 p-4"
              borderRaduis="lg"
              shadowSize="lg"
            >
              <div className="bg-tertiary flex h-28 w-28 items-center justify-center rounded-full">
                <MomImage />
              </div>
              <Typography
                color="textDark"
                text="I'd like to get to know you."
                type={'h3'}
              />
              <Typography
                className="text-center"
                color="textMid"
                text="Please give me more information to make CHW Connect useful for you!"
                type={'body'}
              />
            </Card>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-h-20 p-4">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="primary"
            text="Start"
            textColor="white"
            icon="ArrowCircleRightIcon"
            onClick={onNext}
          />
        </div>
      </div>
    </>
  );
};
