// import { useEffect } from 'react';
import { BannerWrapper } from '@ecdlink/ui';
// import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import React from 'react';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  // const handleFetch = async () => {
  //   const res = await fetch(
  //     'https://ecdconnect.appysites.co.za/login/index.php',
  //     {
  //       method: 'POST',
  //       headers: {
  //         // username: 'Reeffaard',
  //         // password: 'M4%c%1h$38',
  //         loginToken: 'yKYGWNdj7ZBLQwPg5dZ4tcssJgAsdgu5',
  //       },
  //     }
  //   );
  //   return res;
  // };

  // useEffect(() => {
  //   handleFetch();
  // }, []);

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
        <iframe
          src="https://ecdconnect.appysites.co.za"
          title="ECD Moodle"
          height="800px"
          width="90%"
          loading="lazy"
          className="divide-y-2 divide-uiLight divide-dashed mx-auto"
        ></iframe>
      </div>
    </BannerWrapper>
  );
};
