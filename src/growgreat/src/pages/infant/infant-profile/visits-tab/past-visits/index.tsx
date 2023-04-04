import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import {
  BannerWrapper,
  Button,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import {
  getInfantById,
  getInfantCurrentVisitSelector,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { VisitDto } from '@ecdlink/core';

export const PastVisits: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const visits = useSelector(getInfantVisitsSelector);
  const currentVisit = useSelector(getInfantCurrentVisitSelector);

  const filterArrayBeforeId = (arr: VisitDto[], id: string) => {
    const index = arr.findIndex((obj) => obj.id === id);
    return index !== -1 ? arr.slice(0, index) : [];
  };

  const visitSteps = useMemo(() => {
    const visitsBeforeCurrentVisit = filterArrayBeforeId(
      visits,
      currentVisit?.id || ''
    );
    const pastVisits = visitsBeforeCurrentVisit.length
      ? visitsBeforeCurrentVisit
      : visits;

    const array: StepItem[] = pastVisits.map((item, index) => {
      const getType = (): StepItem['type'] => {
        if (!item.attended) {
          return 'inProgress';
        }

        return 'completed';
      };

      return {
        title: item.visitType?.normalizedName || 'Visit',
        subTitle: getType() === 'inProgress' ? 'Missed visit' : '',
        subTitleColor: 'alertDark',
        inProgressStepIcon: 'ExclamationCircleIcon',
        type: getType(),
        showActionButton: getType() === 'completed',
        actionButtonText: 'See info',
        actionButtonTextColor: 'secondary',
        actionButtonColor: 'secondaryAccent2',
        actionButtonOnClick: () =>
          history.push(
            `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}/antenatal-visit`
          ),
      };
    });

    array.unshift({
      title: 'Folder opened',
      type: 'completed',
    });

    return array;
  }, [currentVisit?.id, history, infantId, visits]);

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}`);
  }, [history, infantId]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title="Past visits"
      subTitle={`${
        infant?.caregiver?.firstName ? infant?.caregiver?.firstName + ' & ' : ''
      }${infant?.user?.firstName || ''} `}
      backgroundColour="white"
      displayOffline={!isOnline}
      className={'flex flex-col p-4'}
    >
      <Typography
        type="body"
        align="left"
        weight="bold"
        text="All visits"
        color="textDark"
        className="pb-4 text-xl"
      />
      <Steps items={visitSteps} />
      <div className="mt-7 flex h-full items-end">
        <Button
          type="outlined"
          color="primary"
          icon="ArrowCircleLeftIcon"
          className="w-full "
          text="Back to client profile"
          textColor="primary"
          onClick={goBack}
        />
      </div>
    </BannerWrapper>
  );
};
