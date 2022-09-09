import { useMemo, useState } from 'react';
import { BannerWrapper, LoadingSpinner } from '@ecdlink/ui';
// import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import React from 'react';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<any>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

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
      return (
        <iframe
          src={`https://moodle.ecdlink.co.za/?service=moodle_mobile_app`}
          title="ECD Moodle"
          height="800px"
          width="90%"
          className="divide-y-2 divide-uiLight divide-dashed mx-auto"
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
      <div className="divide-y-2 divide-uiLight divide-dashed">
        <div>{renderIframe}</div>
      </div>
    </BannerWrapper>
  );
};
