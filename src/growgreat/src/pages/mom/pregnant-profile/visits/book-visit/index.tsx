import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { BannerWrapper, Typography } from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { getMotherById } from '@/store/mother/mother.selectors';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';

export const BookVisit: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}`);
  }, [history, motherId]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${mother?.user?.firstName || ''} ${mother?.user?.surname || ''}`}
      backgroundColour="white"
      displayOffline={!isOnline}
      className={'p-4'}
    >
      <Typography
        type="h2"
        align="left"
        weight="bold"
        text="Book a visit"
        color="textDark"
      />
      Coming soon
    </BannerWrapper>
  );
};
