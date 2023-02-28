import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { authSelectors } from '@/store/auth';
import { Alert, BannerWrapper, Button, Card, Typography } from '@ecdlink/ui';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import LanguageSelector from '../../../components/language-selector/language-selector';

interface StatementsShowInfoProps {
  setShowInfo: any;
}

interface Dataprops {
  description: string;
  id: number;
}

export const StatementsInfoPage: React.FC<StatementsShowInfoProps> = ({
  setShowInfo,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [data, setData] = useState<Dataprops[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  useLayoutEffect(() => {
    const loadInfoData = async () => {
      const htmlData = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).GetAllIncomeStatementsInfo(selectedLanguage);

      setData(htmlData as any);
    };

    loadInfoData();
  }, [selectedLanguage, userAuth?.auth_token]);

  const renderData = useMemo(() => {
    return (
      <>
        <Typography
          type="markdown"
          fontSize={'16'}
          text={data?.[0]?.description}
          color={'textDark'}
        />
        <Alert
          className="my-2"
          type="info"
          title={`You will get 100 Top Me Up points for every income statement you submit!`}
        />
        <Typography
          type="markdown"
          fontSize={'16'}
          text={data?.[1]?.description}
          color={'textDark'}
        />
      </>
    );
  }, [data]);

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
          selectLanguage={(data) => setSelectedLanguage(data.locale)}
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

        <div>{renderData}</div>
      </div>
    </BannerWrapper>
  );
};
