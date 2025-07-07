import { Typography, Card, Button } from '@ecdlink/ui';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { useTenant } from '@/hooks/useTenant';

export const WelcomePage = ({ onNext }: { onNext: () => void }) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  return (
    <>
      <div className="h-full pt-7">
        <div className="flex flex-col gap-11">
          <div>
            <Card
              className="bg-uiBg flex flex-col items-center gap-3 p-6"
              borderRaduis="xl"
              shadowSize="lg"
            >
              <div className="">
                <Cebisa />
              </div>
              <Typography
                color="textDark"
                text={`Hello, I'm Cebisa, your ${appName} guide!`}
                type={'h3'}
                align="center"
              />
              <Typography
                className="text-center"
                color="textMid"
                text="I'd like to get to know you."
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
            color="quatenary"
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
