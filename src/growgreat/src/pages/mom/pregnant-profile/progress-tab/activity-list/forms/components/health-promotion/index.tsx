import {
  BannerWrapper,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
  RoundIcon,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { visitThunkActions } from '@/store/visit';
import { useSelector } from 'react-redux';
import { getHealthPromotionSelector } from '@/store/visit/visit.selectors';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { LanguageCode } from '@/i18n/types';

export const HealthPromotion = ({
  section,
  title,
  subTitle,
  client,
  onClose,
}: {
  title: string;
  subTitle?: string;
  section: string;
  client?: string;
  onClose: () => void;
}) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [healthPromotionList, setHealthPromotionList] = useState(
    useSelector(getHealthPromotionSelector)
  );

  const healthPromotionItem = healthPromotionList?.find(
    (item) => item?.section === section
  );

  const availableLanguages: LanguageCode[] =
    healthPromotionItem?.availableLanguages
      ? healthPromotionItem.availableLanguages?.map((item) => {
          return item?.locale as LanguageCode;
        })
      : [language.locale as LanguageCode];

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_HEALTH_PROMOTION
  );

  const renderText = (text: string) => {
    return (
      <div className="flex gap-2">
        <RoundIcon
          size={{ h: '9', w: '9' }}
          icon="ChatAlt2Icon"
          backgroundColor="infoMain"
          iconColor="white"
        />
        <Typography
          type="markdown"
          align="left"
          weight="normal"
          text={text}
          className="text-infoDark"
        />
        <Divider dividerType="dashed" className="my-2" />
      </div>
    );
  };

  const getContent = useCallback(async () => {
    if (!isOnline) return;
    const newHealthPromtionList = await appDispatch(
      visitThunkActions.getHealthPromotion({
        section,
        locale: language.locale,
      })
    ).unwrap();
    if (newHealthPromtionList) {
      setHealthPromotionList([newHealthPromtionList]);
    }
  }, [appDispatch, isOnline, language.locale, section]);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
        />
      );
    }

    const healthPromotion = healthPromotionList?.find(
      (item) => item.section === section
    );

    if (healthPromotion) {
      return (
        <>
          {!!healthPromotion?.description && (
            <>{renderText(healthPromotion?.description)}</>
          )}
          {/* ------- B ------- */}
          {!!healthPromotion?.descriptionB && (
            <>{renderText(healthPromotion?.descriptionB)}</>
          )}
          {/* ------- C ------- */}
          {!!healthPromotion?.descriptionC && (
            <>{renderText(healthPromotion?.descriptionC)}</>
          )}
          {/* ------- D ------- */}
          {!!healthPromotion?.descriptionD && (
            <>{renderText(healthPromotion?.descriptionD)}</>
          )}
          {/* ------- E ------- */}
          {!!healthPromotion?.descriptionE && (
            <>{renderText(healthPromotion?.descriptionE)}</>
          )}
          {/* ------- F ------- */}
          {!!healthPromotion?.descriptionF && (
            <>{renderText(healthPromotion?.descriptionF)}</>
          )}
          {/* ------- G ------- */}
          {!!healthPromotion?.descriptionG && (
            <>{renderText(healthPromotion?.descriptionG)}</>
          )}
          {/* ------- H ------- */}
          {!!healthPromotion?.descriptionH && (
            <>{renderText(healthPromotion?.descriptionH)}</>
          )}
          {/* ------- I ------- */}
          {!!healthPromotion?.descriptionI && (
            <>{renderText(healthPromotion?.descriptionI)}</>
          )}
          {/* ------- J ------- */}
          {!!healthPromotion?.descriptionJ && (
            <>{renderText(healthPromotion?.descriptionJ)}</>
          )}
        </>
      );
    }

    return 'Unavailable translation';
  }, [healthPromotionList, isLoading, section]);

  useLayoutEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={section}
      renderOverflow
      onClose={onClose}
    >
      <Header
        backgroundColor="infoMain"
        icon="ChatIcon"
        title={title}
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
        <Divider dividerType="dashed" className="my-2" />
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
