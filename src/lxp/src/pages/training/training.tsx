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

  // const handleFetch = async () => {
  //   // const payload = {
  //   //   username: 'Reeffaard',
  //   //   password: 'M4%c%1h$38',
  //   //   loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
  //   // };
  //   const res = await fetch(
  //     'https://ecdconnect.appysites.co.za/login/token.php?service=moodle_mobile_app&username=Reeffaard&password=M4%c%1h$38',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-type': 'application/json',
  //         Connection: 'keep-alive',
  //       },
  //       // body: JSON.stringify(payload),
  //     }
  //   );
  //   const data = await res.json();
  //   await setToken(data.token);
  //   await console.log(data.token);
  //   return data;
  // };

  const handleFetch = async () => {
    // const payload = {
    //   username: 'Reeffaard',
    //   password: 'M4%c%1h$38',
    //   loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
    // };
    const res = await fetch(
      'https://ecdconnect.appysites.co.za/login/token.php?service=moodle_mobile_app&username=9907045800080&password=Pass1234!',
      {
        method: 'GET',
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

  console.log({ token });

  const renderIframe = useMemo(() => {
    return (
      <iframe
        src={`https://ecdconnect.appysites.co.za/login/index.php?service=moodle_mobile_app`}
        title="ECD Moodle"
        height="800px"
        width="90%"
        className="divide-y-2 divide-uiLight divide-dashed mx-auto"
      ></iframe>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    handleFetch();
  }, []);

  // https://ecdconnect.appysites.co.za/login/token.php?username=9907045800080&password=Pass1234!&service=moodle_mobile_app
  console.log({ renderIframe });
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
        {/* <iframe
          // src={`https://ecdconnect.appysites.co.za`}
          src={String(renderIframe)}
          title="ECD Moodle"
          height="800px"
          width="90%"
          className="divide-y-2 divide-uiLight divide-dashed mx-auto"
        ></iframe> */}
      </div>
    </BannerWrapper>
  );
};
