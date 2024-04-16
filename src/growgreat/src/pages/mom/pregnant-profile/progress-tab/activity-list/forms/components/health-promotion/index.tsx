import {
  BannerWrapper,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { replaceBraces } from '@ecdlink/core';
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
    (item) => item.section === section
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

  const formattedHealthPromotion = useMemo(() => {
    const healthPromotion = healthPromotionList?.find(
      (item) => item?.section === section
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      healthPromotion?.description || '',
      'text/html'
    );
    const items = doc.querySelectorAll('li');
    const headerItems = doc.querySelectorAll('p');

    const itemStrings = Array.from(items).map((item) => item.outerHTML);
    const headerStrings = Array.from(headerItems).map((item) => item.outerHTML);

    const formattedHeader = headerStrings.reduce(
      (accumulator: string[] | undefined, current) => {
        if (!accumulator?.some((item) => item?.includes(current))) {
          accumulator?.push(current);
        }
        return accumulator;
      },
      []
    ) as string[];

    const formattedDescription = itemStrings.reduce(
      (accumulator: string[] | undefined, current) => {
        if (!accumulator?.some((item) => item?.includes(current))) {
          accumulator?.push(current);
        }
        return accumulator;
      },
      []
    ) as string[];

    return {
      ...healthPromotion,
      description: formattedDescription,
      header: formattedHeader,
    };
  }, [healthPromotionList, section]);

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

  const renderHeader = useMemo(() => {
    if (!!formattedHealthPromotion?.header?.length) {
      return formattedHealthPromotion?.header?.map((item) => (
        <Fragment key={item}>
          <div className="flex items-start gap-2">
            <ul className="list-none">
              <Typography
                type="markdown"
                className="text-infoDark font-medium"
                color="infoDark"
                text={replaceBraces(item, client || '')}
              />
            </ul>
          </div>
        </Fragment>
      ));
    }
  }, [client, formattedHealthPromotion?.header]);

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

    if (!!formattedHealthPromotion?.description?.length) {
      return formattedHealthPromotion?.description?.map((item) => (
        <Fragment key={item}>
          <div className="flex items-start gap-2">
            {!!formattedHealthPromotion?.descriptionListIcon && (
              <img
                alt="icon"
                src={formattedHealthPromotion?.descriptionListIcon}
                className="h-9 w-9"
              />
            )}
            <ul className="list-none">
              <Typography
                type="markdown"
                className="text-infoDark font-medium"
                color="infoDark"
                text={replaceBraces(item, client || '')}
              />
            </ul>
          </div>
        </Fragment>
      ));
    }

    return 'Unavailable translation';
  }, [
    client,
    formattedHealthPromotion?.description,
    formattedHealthPromotion?.descriptionListIcon,
    isLoading,
  ]);

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
        {renderHeader}
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
