import { useEffect, useMemo, useState } from 'react';
import { BannerWrapper } from '@ecdlink/ui';
// import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import React from 'react';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [token, setToken] = useState<any>('');
  const [token2, setToken2] = useState<any>(false);

  const handleFetch = async () => {
    // const payload = {
    //   username: 'Reeffaard',
    //   password: 'M4%c%1h$38',
    //   loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
    // };
    const res = await fetch(
      'https://ecdconnect.appysites.co.za/login/token.php?service=moodle_mobile_app&username=Reeffaard&password=M4%c%1h$38',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Connection: 'keep-alive',
        },
        // body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    await setToken(data.token);
    await console.log(data.token);
    return data;
  };

  const handleFetch2 = async () => {
    const payload = {
      username: 'Reeffaard',
      password: 'M4%c%1h$38',
      loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
    };
    const res = await fetch(
      `https://ecdconnect.appysites.co.za/login/token.php?service=moodle_mobile_app&username=Reeffaard&password=M4%c%1h$38&logintoken=${token}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Connection: 'keep-alive',
          // username: 'Reeffaard',
          // password: 'M4%c%1h$38',
          // loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
        },
        // body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    await setToken(data.token);
    setToken2(true);
    return data;
  };

  useEffect(() => {
    if (token) {
      handleFetch2();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const renderIframe = useMemo(() => {
    if (token2) {
      return (
        <iframe
          src={`https://ecdconnect.appysites.co.za?service=moodle_mobile_app`}
          title="ECD Moodle"
          height="800px"
          width="90%"
          className="divide-y-2 divide-uiLight divide-dashed mx-auto"
        ></iframe>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, token2]);

  useEffect(() => {
    handleFetch();
  }, []);

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
        {renderIframe}
      </div>
    </BannerWrapper>
  );
};
