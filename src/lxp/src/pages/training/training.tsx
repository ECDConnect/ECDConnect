import { useState, useEffect, useRef } from 'react';
import { BannerWrapper, LoadingSpinner } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { authSelectors } from '@store/auth';
import { useSelector } from 'react-redux';

import React from 'react';
import { userSelectors } from '@store/user';
import { PractitionerService } from '@/services/PractitionerService';
import { useTenant } from '@/hooks/useTenant';

export const Training: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const userData = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [moodleUserCreated, setMoodleUserCreated] = useState(false);
  const [loginPosted, setLoginPosted] = useState(false);
  const tenant = useTenant();

  const formRef = useRef(null);

  const createMoodleUser = async () => {
    if (userData?.id) {
      const data = await new PractitionerService(
        userAuth?.auth_token!
      ).getMoodleSessionForCurrentUser();
      const bData = Boolean(data);
      setMoodleUserCreated(bData);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      // creating user in moodle database if doesn't exist.
      createMoodleUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  useEffect(() => {
    if (
      formRef &&
      formRef.current &&
      !!moodleUserCreated &&
      !!tenant &&
      !!tenant.tenant?.moodleUrl
    ) {
      (formRef.current as any).submit();
      setLoginPosted(true);
    }
  }, [moodleUserCreated, tenant.tenant]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Training"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      {!loginPosted && (
        <div className="divide-uiLight divide-y-2 divide-dashed">
          <LoadingSpinner
            className="mt-6"
            size={'medium'}
            spinnerColor={'primary'}
            backgroundColor={'uiLight'}
          />
        </div>
      )}
      <form
        style={{ display: 'none' }}
        ref={formRef}
        method="post"
        name="moodle-training-login-form"
        id="moodle-training-login-form"
        target="moodle-training"
        action={`${tenant.tenant?.moodleUrl}/login/index.php?service=moodle_mobile_app`}
      >
        <input
          type="text"
          name="username"
          title="username"
          defaultValue={userData?.id}
        />
        <input
          type="password"
          name="password"
          title="password"
          defaultValue={'Test@1234'}
        />
        <input type="submit" name="Submit" value="Login" />
      </form>
      <div
        className="divide-uiLight divide-y-2 divide-dashed"
        style={loginPosted ? undefined : { display: 'none' }}
      >
        <iframe
          id="moodle-training"
          name="moodle-training"
          src=""
          title="ECD Moodle"
          height="800px"
          width="90%"
          className="divide-uiLight mx-auto divide-y-2 divide-dashed"
        ></iframe>
      </div>
    </BannerWrapper>
  );
};
