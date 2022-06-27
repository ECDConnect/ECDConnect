// import { useEffect } from 'react';
import { BannerWrapper } from '@ecdlink/ui';
// import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

import React from 'react';

export const Trainning: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  //   const handleFetch = async () => {
  //     const res = await fetch(
  //       'http://apy-ecd-d-vm-moodle-01.northeurope.cloudapp.azure.com/login/index.php',
  //       {
  //         method: 'POST',
  //         headers: {
  //           // username: 'ubiratan@jungledevs.com',
  //           // password: 'Test@1234',
  //           loginToken: 'CiRa3bM03QkSXuEEraFBYiRANwkI2nZQ',
  //         },
  //       }
  //     );
  //     return res;
  //   };

  //   useEffect(() => {
  //     handleFetch();
  //   }, []);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Trainning"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div className="divide-y-2 divide-uiLight divide-dashed">
        <iframe
          src="http://apy-ecd-d-vm-moodle-01.northeurope.cloudapp.azure.com"
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
