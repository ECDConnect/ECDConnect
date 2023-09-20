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

interface VideoProps {
  section: string;
}

export const Video = ({ section }: VideoProps) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_VIDEOS
  );

  const video = useSelector((state: RootState) =>
    getVisitVideoBySectionAndLocale(state, section, language.locale)
  )?.video;

  const getVideo = useCallback(async () => {
    if (video) return;

    appDispatch(
      visitThunkActions.getVisitVideos({
        section,
        locale: language.locale,
      })
    );
  }, [appDispatch, language, section, video]);

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
      <LanguageSelector selectLanguage={setLanguage} />
      {renderContent}
    </>
  );
};
