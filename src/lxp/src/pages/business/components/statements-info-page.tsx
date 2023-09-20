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
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import walktroughImage from '../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useAppContext } from '@/walkthrougContext';
import { useHistory } from 'react-router';

interface StatementsShowInfoProps {
  setShowInfo: any;
  setIsFromAutomaticallyStart: (item: boolean) => void;
  isFromAutomaticallyStart: boolean;
  updateWalkThroughStatus: (item: boolean) => void;
}

interface Dataprops {
  description: string;
  id: number;
  locale?: string;
}

export const StatementsInfoPage: React.FC<StatementsShowInfoProps> = ({
  setShowInfo,
  isFromAutomaticallyStart,
  updateWalkThroughStatus,
}) => {
  const dialog = useDialog();
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [data, setData] = useState<Dataprops[]>();
  const [availableLanguages, setAvailableLanguages] = useState<Dataprops[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');
  const [languagesList, setLanguagesList] = useState<
    { label: string; value: any }[]
  >([]);
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState('');

  useEffect(() => {
    if (selectedLanguage) {
      const lang = availableLanguages?.find(
        (item) => item?.locale === selectedLanguage
      );
      setSelectedLanguageLabel(lang?.description!);
    }
  }, [availableLanguages, selectedLanguage]);

  useLayoutEffect(() => {
    const loadInfoData = async () => {
      const htmlData = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).GetAllIncomeStatementsInfo(selectedLanguage);

      setData(htmlData as any);
    };

    loadInfoData();
  }, [selectedLanguage, userAuth?.auth_token]);

  useEffect(() => {
    if (availableLanguages?.length! > 0) {
      const _list = availableLanguages
        ?.map((p) => {
          if (p?.id) {
            return {
              label: `${p?.description}`,
              value: p?.locale,
            };
          }
          return undefined;
        })
        ?.filter(Boolean) as { label: string; value: any }[];

      setLanguagesList(_list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableLanguages]);

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
                updateWalkThroughStatus(true);
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                onCancel();
                updateWalkThroughStatus(true);
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  useEffect(() => {
    if (isFromAutomaticallyStart) {
      gotToStatementsWalkthrough();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      showBackground={false}
      size="medium"
      renderBorder={true}
      onBack={() => setShowInfo(false)}
      title="Income statements"
      renderOverflow
    >
      <div className="bg-uiBg flex w-full items-center justify-start p-4">
        <Typography color={'textMid'} type={'h4'} text={'Change Language:'} />
        <Dropdown
          placeholder={selectedLanguageLabel}
          list={languagesList}
          fillType="clear"
          fullWidth
          onChange={(item: any) => {
            setSelectedLanguage(item);
          }}
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
