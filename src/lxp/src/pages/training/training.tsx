import { useMemo, useState, useEffect } from 'react';
import { BannerWrapper, LoadingSpinner } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import React from 'react';
import { AuthService } from '@/services/AuthService';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<any>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const userData = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [userSessionId, setUserSessionId] = useState('');

  const getUserSessionId = async () => {
    if (userData?.id) {
      const data = await new PractitionerService(
        userAuth?.auth_token!
      ).getMoodleSessionForUserId(userData?.id);
      setUserSessionId(data);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      getUserSessionId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const renderIframe = useMemo(() => {
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
      document.cookie = `MoodleSession=${userSessionId};path=/;domain=moodle.ecdlink.co.za`;
      document.cookie =
        'teste=1; Max-Age=2600000; Path=/; SameSite=None; Secure';
      return (
        <iframe
          src={`https://moodle.ecdlink.co.za/?service=moodle_mobile_app`}
          title="ECD Moodle"
          height="800px"
          width="90%"
          className="divide-uiLight mx-auto divide-y-2 divide-dashed"
        ></iframe>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading]);

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
