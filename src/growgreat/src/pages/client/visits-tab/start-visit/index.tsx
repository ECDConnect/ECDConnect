import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { getMothers } from '@/store/mother/mother.selectors';
import { Typography, Dropdown, BannerWrapper, Button } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import { MotherActions } from '@/store/mother/mother.actions';
import { useSnackbar } from '@ecdlink/core';
import { startVisit } from './start-visit.utils';
import { StartVisitClient } from './start-visit.types';

interface DropdownOnChange extends StartVisitClient {}

const HEADER_HEIGHT = 64;

export const StartVisitFromVisitDashboard: React.FC = () => {
  const [client, setClient] = useState<DropdownOnChange | undefined>(undefined);

  const appDispatch = useAppDispatch();

  const infants = useSelector(getInfants);
  const mothers = useSelector(getMothers);

  const {
    isLoading: isLoadingAdditionalVisitForMother,
    wasLoading: wasLoadingAdditionalVisitForMother,
    isRejected: isRejectedAdditionalVisitForMother,
  } = useThunkFetchCall(
    'mothers',
    MotherActions.ADD_ADDITIONAL_VISIT_FOR_MOTHER
  );
  const {
    isLoading: isLoadingAdditionalVisitForInfant,
    wasLoading: wasLoadingAdditionalVisitForInfant,
    isRejected: isRejectedAdditionalVisitForInfant,
  } = useThunkFetchCall(
    'infants',
    InfantActions.ADD_ADDITIONAL_VISIT_FOR_INFANT
  );
  const {
    isLoading: isLoadingInfant,
    wasLoading: wasLoadingInfant,
    isRejected: isRejectedInfant,
  } = useThunkFetchCall('infants', InfantActions.GET_INFANT_VISITS);
  const {
    isLoading: isLoadingMother,
    wasLoading: wasLoadingMother,
    isRejected: isRejectedMother,
  } = useThunkFetchCall('mothers', MotherActions.GET_MOTHER_VISITS);

  const { showMessage } = useSnackbar();

  const date = format(new Date(), 'EEEE, d LLLL');

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { height } = useWindowSize();

  const infantOptions = useMemo(
    () =>
      infants.map((infant) => ({
        value: { id: infant.user?.id, type: 'infant' } as DropdownOnChange,
        label: `${infant.user?.firstName || ''} ${infant.user?.surname || ''}`,
      })),
    [infants]
  );

  const filteredMothers = useMemo(
    () => mothers.filter((item) => !!item.expectedDateOfDelivery),
    [mothers]
  );

  const motherOptions = useMemo(
    () =>
      filteredMothers.map((mom) => ({
        value: { id: mom.user?.id, type: 'mother' } as DropdownOnChange,
        label: `${mom.user?.firstName || ''} ${mom.user?.surname || ''}`,
      })),
    [filteredMothers]
  );

  const clients = [...motherOptions, ...infantOptions];

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  // When the user starts a visit from this screen, it should start the next scheduled/planned visit if available. If there’s no planned visit, then start an “Other visit”.
  const onStartVisit = async () => {
    if (!!client) {
      await startVisit(client, appDispatch, history);
    } else {
      history.push(ROUTES.CLIENTS.ROOT, {
        activeTabIndex: CLIENT_TABS.VISIT,
      });
    }
  };

  useEffect(() => {
    if (
      (wasLoadingInfant && !isLoadingInfant && isRejectedInfant) ||
      (wasLoadingMother && !isLoadingMother && isRejectedMother) ||
      (wasLoadingAdditionalVisitForInfant &&
        !isLoadingAdditionalVisitForInfant &&
        isRejectedAdditionalVisitForInfant) ||
      (wasLoadingAdditionalVisitForMother &&
        !isLoadingAdditionalVisitForMother &&
        isRejectedAdditionalVisitForMother)
    ) {
      showMessage({
        message: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    }
  }, [
    isLoadingAdditionalVisitForInfant,
    isLoadingAdditionalVisitForMother,
    isLoadingInfant,
    isLoadingMother,
    isRejectedAdditionalVisitForInfant,
    isRejectedAdditionalVisitForMother,
    isRejectedInfant,
    isRejectedMother,
    showMessage,
    wasLoadingAdditionalVisitForInfant,
    wasLoadingAdditionalVisitForMother,
    wasLoadingInfant,
    wasLoadingMother,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Client folders'}
      subTitle={date}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <div
        className="flex flex-col p-4"
        style={{ height: height - HEADER_HEIGHT }}
      >
        <Typography
          type="h2"
          weight="bold"
          lineHeight="snug"
          color="textDark"
          text="Find the client"
        />
        <Dropdown<DropdownOnChange>
          showSearch
          className="pt-4"
          label="Who are you visiting?"
          placeholder="Tap to search for client"
          list={clients}
          selectedValue={client}
          onChange={setClient}
        />
        <div className="mt-4 flex h-full items-end">
          <Button
            text="Start a visit"
            icon="HomeIcon"
            type="filled"
            color="primary"
            textColor="white"
            className="w-full"
            iconPosition="start"
            disabled={
              !client ||
              isLoadingInfant ||
              isLoadingMother ||
              isLoadingAdditionalVisitForInfant ||
              isLoadingAdditionalVisitForMother
            }
            isLoading={
              isLoadingInfant ||
              isLoadingMother ||
              isLoadingAdditionalVisitForInfant ||
              isLoadingAdditionalVisitForMother
            }
            onClick={onStartVisit}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
export default StartVisitFromVisitDashboard;
