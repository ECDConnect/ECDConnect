import { Alert, Button, LoadingSpinner } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getInfographicsSelector } from '@/store/visit/visit.selectors';
import { RootState } from '@/store/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineCard } from '@/components/offline-card/offline-card';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { LanguageCode } from '@/i18n/types';
import { visitThunkActions } from '@/store/visit';

interface DownloadResourceProps {
  onClose?: () => void;
  resource: string;
}
export const DownloadResource = ({
  onClose,
  resource,
}: DownloadResourceProps) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [imageList, setImageList] = useState(
    useSelector((state: RootState) => getInfographicsSelector(state))
  );

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_INFO_GRAPHICS
  );

  const imageItem = imageList?.find(
    (item) => item && item.section === resource
  );

  const availableLanguages: LanguageCode[] = imageItem?.availableLanguages
    ? imageItem.availableLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [language.locale as LanguageCode];

  const getImage = useCallback(async () => {
    const images = await appDispatch(
      visitThunkActions.getInfographics({
        section: resource,
        locale: language.locale,
      })
    ).unwrap();

    if (images) {
      setImageList([images]);
    }
  }, [appDispatch, language.locale, resource]);

  const onDownloadImage = useCallback(async () => {
    const imageItem = imageList?.find(
      (item) => item && item.section === resource
    );

    const imageUrl = imageItem?.imageA;
    const link = document.createElement('a');
    link.href = imageUrl || '';
    link.setAttribute('download', 'infographic.jpg');
    document.body.appendChild(link);
    link.click();
  }, [imageList, resource]);

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

    if (imageItem && imageItem.imageA!!) {
      return (
        <>
          <img
            alt="infographic"
            className="rounded-2xl object-cover"
            src={imageItem.imageA || ''}
          />
          ;
          <Button
            className="mt-auto mb-4"
            type="filled"
            color="primary"
            textColor="white"
            text="Share resource"
            icon="DownloadIcon"
            onClick={() => onDownloadImage}
          />
          <Button
            className="mt-auto"
            type="outlined"
            color="primary"
            textColor="primary"
            text="Close"
            icon="XIcon"
            onClick={onClose}
          />
        </>
      );
    }

    return <Alert type="error" title="Image unavailable" />;
  }, [imageItem, isLoading, onClose, onDownloadImage]);

  useEffect(() => {
    if (isOnline) {
      getImage();
    }
  }, [getImage, isOnline]);

  if (!isOnline) return <OfflineCard />;

  return (
    <>
      <Header
        backgroundColor="infoMain"
        icon="ChatIcon"
        title="Share the infographic"
      />
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          showOfflineAlert
          selectLanguage={setLanguage}
          availableLanguages={availableLanguages}
        />
      </div>
      {renderContent}
    </>
  );
};
