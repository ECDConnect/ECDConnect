import { BannerWrapper, Button, Card, Typography } from '@ecdlink/ui';
import LanguageSelector from '../../../components/language-selector/language-selector';

interface StatementsShowInfoProps {
  setShowInfo: any;
}

export const StatementsInfoPage: React.FC<StatementsShowInfoProps> = ({
  setShowInfo,
}) => {
  return (
    <BannerWrapper
      size="small"
      onBack={() => setShowInfo(false)}
      title="Income statements"
      renderOverflow
    >
      <div className="bg-uiBg w-full">
        <LanguageSelector
          currentLocale={'en-za'}
          selectLanguage={() => {}}
          className="bg-uiBg p-4"
        />
      </div>
      <div className="p-4">
        <Card className="bg-uiBg my-4 flex flex-col justify-center rounded-2xl p-4">
          <Typography
            className={'mt-4'}
            color={'textDark'}
            type={'h2'}
            text={'How to use income statements on Funda App'}
          />
          <Typography
            className={'mt-4'}
            color={'textMid'}
            type={'body'}
            text={
              'Tap the button below to see how to use this part of Funda App'
            }
          />
          <Button
            text={`Start walkthrough`}
            icon={'ArrowCircleRightIcon'}
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className={'mt-4 max-h-10'}
            iconPosition={'start'}
            onClick={() => {}}
          />
        </Card>
      </div>
    </BannerWrapper>
  );
};
