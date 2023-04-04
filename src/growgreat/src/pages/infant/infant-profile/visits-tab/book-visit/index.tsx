import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import { BannerWrapper, Typography } from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { getInfantById } from '@/store/infant/infant.selectors';

export const BookVisit: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}`);
  }, [history, infantId]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${
        infant?.caregiver?.firstName ? infant?.caregiver?.firstName + ' & ' : ''
      }${infant?.user?.firstName || ''} `}
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
