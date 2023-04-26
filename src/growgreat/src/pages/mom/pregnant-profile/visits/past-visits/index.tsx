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
import {
  getMotherById,
  getMotherVisits,
} from '@/store/mother/mother.selectors';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';

export const PastVisits: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const visits = useSelector(getMotherVisits);

  const visitSteps = useMemo(() => {
    const filteredVisits = visits.filter((item) => item.attended);

    const array: StepItem[] = filteredVisits.map((item, index) => {
      const getType = (): StepItem['type'] => {
        if (
          visits[index - 1]?.attended &&
          !item.attended &&
          visits[index + 1]
        ) {
          return 'inProgress';
        }

        return 'completed';
      };

      return {
        title:
          item.visitType?.normalizedName === 'Additional visits'
            ? 'Other visit'
            : item.visitType?.normalizedName || 'Visit',
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
            `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}/antenatal-visit`
          ),
      };
    });

    array.unshift({
      title: 'Folder opened',
      type: 'completed',
    });

    return array;
  }, [history, motherId, visits]);

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}`);
  }, [history, motherId]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title="Past visits"
      subTitle={`${mother?.user?.firstName || ''} ${
        mother?.user?.surname || ''
      }`}
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
