import { useMemo, useState, useEffect } from 'react';
import { BannerWrapper, LoadingSpinner } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { ContextService } from '@/services/ContextService';
import { authSelectors } from '@store/auth';
import { useSelector } from 'react-redux';

import React from 'react';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<any>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    getContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContext = async () => {
    const data = await new ContextService(
      userAuth?.auth_token!
    ).tenantContext();
    setUrl(data?.moodleUrlVar);
  };

  const renderIframe = useMemo(() => {
    if (url) {
      if (loading) {
        return (
          <LoadingSpinner
            className="mt-6"
            size={'medium'}
            spinnerColor={'primary'}
            backgroundColor={'uiLight'}
          />
        );
      } else {
        return (
          <iframe
            src={`${url}/?service=moodle_mobile_app`}
            title="ECD Moodle"
            height="800px"
            width="90%"
            className="divide-uiLight mx-auto divide-y-2 divide-dashed"
          ></iframe>
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, url]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Training"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div className="divide-uiLight divide-y-2 divide-dashed">
        <div>{renderIframe}</div>
      </div>
    </BannerWrapper>
  );
};
