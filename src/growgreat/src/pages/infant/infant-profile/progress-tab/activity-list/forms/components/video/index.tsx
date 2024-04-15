import { Alert, LoadingSpinner } from '@ecdlink/ui';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { RootState } from '@/store/types';
import { visitThunkActions } from '@/store/visit';
import { getVisitVideoBySectionAndLocale } from '@/store/visit/visit.selectors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineCard } from '@/components/offline-card/offline-card';
import { LanguageCode } from '@/i18n/types';

interface VideoProps {
  section: string;
}

export const Video = ({ section }: VideoProps) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [videoItem, setVideoItem] = useState(
    useSelector((state: RootState) =>
      getVisitVideoBySectionAndLocale(state, section, language.locale)
    )
  );

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_VIDEOS
  );

  const video = videoItem?.video;

  const availableLanguages: LanguageCode[] = videoItem?.availableLanguages
    ? videoItem.availableLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [language.locale as LanguageCode];

  const getVideo = useCallback(async () => {
    const visitVideos = await appDispatch(
      visitThunkActions.getVisitVideos({
        section,
        locale: language.locale,
      })
    ).unwrap();

    const newVideoItem = visitVideos?.find(
      (item) => item.section === section && item.locale === language.locale
    );

    if (newVideoItem) {
      setVideoItem(newVideoItem);
    }
  }, [appDispatch, language.locale, section]);

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

    if (video) {
      return <video src={video} controls className="rounded-3xl" />;
    }

    return <Alert type="error" title="Video unavailable" />;
  }, [isLoading, video]);

  useEffect(() => {
    if (isOnline) {
      getVideo();
    }
  }, [getVideo, isOnline]);

  if (!isOnline) return <OfflineCard />;

  return (
    <>
      <LanguageSelector
        showOfflineAlert
        selectLanguage={setLanguage}
        availableLanguages={availableLanguages}
      />
      {renderContent}
    </>
  );
};
