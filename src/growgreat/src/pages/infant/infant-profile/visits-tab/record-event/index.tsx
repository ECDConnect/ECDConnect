import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { BannerWrapper } from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { RecordEventState } from './index.types';
import { getInfantById } from '@/store/infant/infant.selectors';

export const RecordEvent: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation<RecordEventState>();

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
      className={'flex flex-col p-4'}
    >
      Coming soon
    </BannerWrapper>
  );
};
