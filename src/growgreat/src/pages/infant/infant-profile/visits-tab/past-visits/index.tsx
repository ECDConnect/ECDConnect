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
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { getDateWithoutTimeZone } from '@ecdlink/core';

export const PastVisits: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , infantId] = location.pathname.split('/');

  const currentDate = new Date();
  currentDate?.setHours(0, 0, 0, 0);
  const todayDate = getDateWithoutTimeZone(currentDate.toISOString());

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const visits = useSelector(getInfantVisitsSelector);

  const visitSteps = useMemo(() => {
    const filteredVisits = visits.filter((item) => {
      const dueDate = getDateWithoutTimeZone(item.dueDate);
      const orderDate = getDateWithoutTimeZone(item.orderDate);
      const isAttend = item.attended;

      if (dueDate) {
        return isAttend || (!isAttend && dueDate < todayDate!);
      }

      if (orderDate) {
        return isAttend || (!isAttend && orderDate < todayDate!);
      }

      return isAttend;
    });

    const array: StepItem[] = filteredVisits.map((item, index) => {
      const getType = (): StepItem['type'] => {
        if (!item.attended) {
          return 'inProgress';
        }

        return 'completed';
      };

      return {
        title:
          item.visitType?.normalizedName === 'Additional visits'
            ? 'Other visit'
            : item.visitType?.normalizedName + ' visit' || 'Visit',
        subTitle: getType() === 'inProgress' ? 'Missed visit' : '',
        subTitleColor: 'alertDark',
        inProgressStepIcon: 'ExclamationCircleIcon',
        type: getType(),
        // Change this rule to not show 'See info' for past visits until further notice 30 June 2023 (Kim)
        //showActionButton: getType() === 'completed',
        showActionButton: false,
        actionButtonText: 'See info',
        actionButtonTextColor: 'secondary',
        actionButtonColor: 'secondaryAccent2',
        actionButtonOnClick: () =>
          history.push(
            `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}/activities-form/${item.id}`,
            { editView: false }
          ),
      };
    });

    array.unshift({
      title: 'Folder opened',
      type: 'completed',
    });

    return array;
  }, [history, infantId, todayDate, visits]);

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
