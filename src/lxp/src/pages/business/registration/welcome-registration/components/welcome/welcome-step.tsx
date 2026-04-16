import { BannerWrapper, Button, Card, Typography } from '@ecdlink/ui';
import { ReactComponent as EmojiYellowHappy } from '../../../../../../assets/iconRobot.svg';
import TransparentLayer from '../../../../../../assets/TransparentLayer.png';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '@/pages/business/business.types';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const history = useHistory();

  return (
    <BannerWrapper
      size={'large'}
      renderBorder={true}
      showBackground={true}
      title={`DBE registration helper`}
      onBack={() => history.push('/')}
      backgroundColour={'white'}
      className={'relative'}
      backgroundUrl={TransparentLayer}
    >
      <div className={'h-screen overflow-auto px-4'}>
        <div className="h-screen overflow-auto pt-2">
          <div className="flex flex-col gap-11">
            <div className="flex w-full justify-center">
              <Card
                className="bg-uiBg fixed flex w-11/12 flex-col items-center gap-3 p-6"
                borderRaduis="xl"
                shadowSize="lg"
              >
                <div className="">
                  <EmojiYellowHappy />
                </div>
                <Typography
                  color="textDark"
                  text={`Your guide to DBE registration`}
                  type={'h3'}
                  align="center"
                />
              </Card>
            </div>
          </div>

          <div className="mt-56 py-4">
            <Typography
              type={'h1'}
              text={`What is ECD registration?`}
              className={'mb-4 text-sm'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'Registration means your programme is officially recognised by the Department of Basic Education (DBE). It is the first step to getting the ECD subsidy.'
              }
              className={'mb-4 text-sm font-normal'}
              color={'textMid'}
            />
            <Typography
              type={'body'}
              text={
                'This app shows you the steps. You will need to submit your information to the DBE.'
              }
              className={'mb-2 font-bold'}
              color={'textMid'}
            />
          </div>

          <div className="mt-32 mb-20 max-h-20 w-full p-4 align-bottom">
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
      </div>
    </BannerWrapper>
  );
};
