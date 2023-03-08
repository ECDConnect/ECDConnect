import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { authSelectors } from '@/store/auth';
import { useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import LanguageSelector from '../../../components/language-selector/language-selector';
import walktroughImage from '../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useAppContext } from '@/walkthrougContext';
import { useHistory } from 'react-router';

interface StatementsShowInfoProps {
  setShowInfo: any;
}

interface Dataprops {
  description: string;
  id: number;
  locale?: string;
}

export const StatementsInfoPage: React.FC<StatementsShowInfoProps> = ({
  setShowInfo,
}) => {
  const dialog = useDialog();
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [data, setData] = useState<Dataprops[]>();
  const [availableLanguages, setAvailableLanguages] = useState<Dataprops[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  console.log({ availableLanguages });

  useLayoutEffect(() => {
    const loadInfoData = async () => {
      const htmlData = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).GetAllIncomeStatementsInfo(selectedLanguage);

      setData(htmlData as any);
    };

    loadInfoData();
  }, [selectedLanguage, userAuth?.auth_token]);

  useLayoutEffect(() => {
    const loadAvailableLanguages = async () => {
      const availableLang = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).allContentLanguages('IncomeStatements');

      setAvailableLanguages(availableLang as any);
    };

    loadAvailableLanguages();
  }, [userAuth?.auth_token]);

  const { setState } = useAppContext();

  const handleClickStart = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
    setShowInfo(false);
    history.push(ROUTES.BUSINESS);
  };

  const gotToStatementsWalkthrough = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          // icon={'InformationCircleIcon'}
          // iconColor="alertMain"
          // iconBorderColor="alertBg"
          customIcon={
            <div className="flex">
              <img src={walktroughImage} alt="profile" className="mb-2" />
            </div>
          }
          importantText={`Welcome to the Money section of Funda App!`}
          detailText={
            'Would you like to see how to create your income statements?'
          }
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                handleClickStart();
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

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
            onClick={gotToStatementsWalkthrough}
          />
        </Card>

        <div>{renderData}</div>
      </div>
    </BannerWrapper>
  );
};
