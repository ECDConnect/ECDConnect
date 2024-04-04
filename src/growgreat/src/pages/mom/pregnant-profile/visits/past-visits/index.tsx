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
import { VisitDto } from '@ecdlink/core';

export const PastVisits: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation();

  const [, , , motherId] = location.pathname.split('/');

  const currentDate = new Date();
  currentDate?.setHours(0, 0, 0, 0);

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const visits = useSelector(getMotherVisits);

  const getSortedVisits = useCallback((visitsToSort: VisitDto[]) => {
    return visitsToSort.sort((a, b) => {
      if (a === undefined && b === undefined) {
        return 0;
      }
      if (a === undefined) {
        return -1;
      }
      if (b === undefined) {
        return 1;
      }

      if (a.visitType && b.visitType) {
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime() ||
          a.visitType.order - b.visitType.order!
        );
      } else {
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        );
      }
    });
  }, []);

  const visitSteps = useMemo(() => {
    const filteredVisits = visits.filter((item) => item?.attended);

    const sortedVisits = getSortedVisits(filteredVisits);

    const array: StepItem[] = sortedVisits.map((item) => {
      const getType = (): StepItem['type'] => {
        if (!item.attended) {
          return 'inProgress';
        }

        return 'completed';
      };
      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      return {
        title: isAdditionalVisit
          ? 'Other visit'
          : item.visitType?.normalizedName || 'Visit',
        subTitle:
          isAdditionalVisit && item.comment!
            ? item.comment
            : getType() === 'inProgress'
            ? 'Missed visit'
            : '',
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
            `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}/activities-form/${item.id}`,
            { editView: false }
          ),
      };
    });

    array.unshift({
      title: 'Folder opened',
      type: 'completed',
    });

    return array;
  }, [getSortedVisits, history, motherId, visits]);

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
