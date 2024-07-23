import {
  BannerWrapper,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
  RoundIcon,
} from '@ecdlink/ui';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { Header } from '@/pages/infant/infant-profile/components';
import { visitThunkActions } from '@/store/visit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMoreInformationSelector } from '@/store/visit/visit.selectors';
import { VisitActions } from '@/store/visit/visit.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { replaceBraces } from '@ecdlink/core';
import { LanguageCode } from '@/i18n/types';
import momImage from '@/assets/momImage.png';

export const MoreInformation = ({
  section,
  client,
  subTitle,
  onClose,
}: {
  subTitle?: string;
  section: string;
  client?: string;
  onClose: () => void;
}) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [moreInformationList, setMoreInformationList] = useState(
    useSelector(getMoreInformationSelector)
  );

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MORE_INFORMATION
  );

  const moreInformationItem = moreInformationList?.find(
    (item) => item?.section === section
  );
  const availableLanguages: LanguageCode[] =
    moreInformationItem?.availableLanguages
      ? moreInformationItem.availableLanguages?.map((item) => {
          return item?.locale as LanguageCode;
        })
      : [language.locale as LanguageCode];

  const renderLighbulbText = (text: string) => {
    return (
      <div className="flex gap-2">
        <RoundIcon
          size={{ h: '9', w: '9' }}
          icon="LightBulbIcon"
          backgroundColor="infoMain"
          iconColor="white"
        />
        <Typography
          type="markdown"
          align="left"
          weight="normal"
          text={replaceBraces(text, client || '')}
          className="text-infoDark"
        />
        <Divider dividerType="dashed" className="my-2" />
      </div>
    );
  };

  const renderContentText = (text: string) => {
    return (
      <div className="flex gap-2">
        <Typography
          type="markdown"
          align="left"
          weight="normal"
          text={replaceBraces(text, client || '')}
          className={'textDark'}
          color="infoDark"
        />
        <Divider dividerType="dashed" className="my-2" />
      </div>
    );
  };

  const renderContent = useMemo(() => {
    const moreInformation = moreInformationList?.find(
      (item) => item.section === section
    );

    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
        />
      );
    }

    if (moreInformation) {
      return (
        <div className="mb-4">
          {/* --- Info Box ---- */}
          {!!moreInformation.infoBoxTitle && (
            <div className="bg-uiBg rounded-10 mb-4 flex gap-3 p-4">
              <img src={momImage} alt="cebisa" className="h-16 w-16" />
              <div>
                <Typography
                  type="h4"
                  text={replaceBraces(
                    moreInformation.infoBoxTitle,
                    client || ''
                  )}
                  className="mb-3"
                />
                <Typography
                  type="markdown"
                  text={replaceBraces(
                    moreInformation?.infoBoxDescription || '',
                    client || ''
                  )}
                />
              </div>
            </div>
          )}
          {/* ------- A ------- */}
          {!!moreInformation.headerA && (
            <>{renderContentText(moreInformation.headerA)}</>
          )}
          {!!moreInformation?.descriptionA && (
            <>
              {renderLighbulbText(moreInformation.descriptionA)}
              <Divider dividerType="dashed" className="my-2" />
            </>
          )}

          {/* ------- B ------- */}
          {!!moreInformation.headerB && (
            <>{renderContentText(moreInformation.headerB)}</>
          )}
          {!!moreInformation?.descriptionB && (
            <>
              {renderLighbulbText(moreInformation.descriptionB)}
              <Divider dividerType="dashed" className="my-2" />
            </>
          )}
          {/* ------- C ------- */}
          {!!moreInformation.headerC && (
            <>{renderContentText(moreInformation.headerC)}</>
          )}
          {!!moreInformation?.descriptionC && (
            <>
              {renderLighbulbText(moreInformation.descriptionC)}
              <Divider dividerType="dashed" className="my-2" />
            </>
          )}
        </div>
      );
    }

    return 'Unavailable translation';
  }, [client, isLoading, moreInformationList, section]);

  const getContent = useCallback(async () => {
    if (!isOnline) return;

    const newMoreInformation = await appDispatch(
      visitThunkActions.getMoreInformation({
        section,
        locale: language.locale,
      })
    ).unwrap();
    if (newMoreInformation) {
      setMoreInformationList([newMoreInformation]);
    }
  }, [appDispatch, isOnline, language.locale, section]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={section}
      onClose={onClose}
      renderOverflow
    >
      <Header
        backgroundColor="infoMain"
        icon="InformationCircleIcon"
        title="More information"
        subTitle={subTitle}
      />
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          showOfflineAlert
          selectLanguage={setLanguage}
          availableLanguages={availableLanguages}
        />
      </div>
      <div className="flex h-full flex-col p-4">
        {renderContent}
        <Button
          className="mt-auto"
          type="filled"
          color="primary"
          textColor="white"
          text="Close"
          icon="XIcon"
          onClick={onClose}
        />
      </div>
    </BannerWrapper>
  );
};
