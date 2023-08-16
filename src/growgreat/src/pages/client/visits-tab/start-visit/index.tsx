import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { getMothers } from '@/store/mother/mother.selectors';
import { Typography, Dropdown, BannerWrapper, Button } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';
import { useAppDispatch } from '@/store';
import { infantThunkActions } from '@/store/infant';
import { motherThunkActions } from '@/store/mother';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import { MotherActions } from '@/store/mother/mother.actions';
import { VisitDto } from '@ecdlink/core';
import { VisitModelInput } from '@ecdlink/graphql';

interface DropdownOnChange {
  id: string | undefined;
  type: 'mother' | 'infant';
}

const HEADER_HEIGHT = 64;

export const StartVisitFromVisitDashboard: React.FC = () => {
  const [client, setClient] = useState<DropdownOnChange | undefined>();

  const appDispatch = useAppDispatch();

  const infants = useSelector(getInfants);
  const mothers = useSelector(getMothers);

  const { isLoading: isLoadingInfant } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_VISITS
  );
  const { isLoading: isLoadingMother } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_VISITS
  );

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

  const onChangeClient = (client: DropdownOnChange) => {
    setClient(client);

    if (!client.id) return;

    if (client.type === 'infant') {
      appDispatch(
        infantThunkActions.getInfantVisits({ infantId: client.id })
      ).unwrap();
    }

    if (client.type === 'mother') {
      appDispatch(
        motherThunkActions.getMotherVisits({ motherId: client.id })
      ).unwrap();
    }
  };

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  const onStartVisit = async () => {
    switch (client?.type) {
      case 'infant': {
        const input: VisitModelInput = {
          infantId: client.id,
          plannedVisitDate: new Date().toISOString(),
          actualVisitDate: new Date().toISOString(),
          attended: false,
        };

        const response = await appDispatch(
          infantThunkActions.addAdditionalVisitForInfant(input)
        );

        const otherVisit = (response.payload as VisitDto) || undefined;
        if (otherVisit?.id) {
          history.push(
            `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${client.id}/activities-form/${otherVisit?.id}`
          );
        }
        return;
      }
      case 'mother': {
        const input: VisitModelInput = {
          motherId: client.id,
          plannedVisitDate: new Date().toISOString(),
          actualVisitDate: new Date().toISOString(),
          attended: false,
        };

        const response = await appDispatch(
          motherThunkActions.addAdditionalVisitForMother(input)
        );

        const otherVisit = (response.payload as VisitDto) || undefined;
        if (otherVisit?.id) {
          history.push(
            `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${client.id}/activities-form/${otherVisit?.id}`
          );
        }
        return;
      }
      default:
        history.push(ROUTES.CLIENTS.ROOT, {
          activeTabIndex: CLIENT_TABS.VISIT,
        });
    }
  };
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
          onChange={onChangeClient}
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
            disabled={!client || isLoadingInfant || isLoadingMother}
            isLoading={isLoadingInfant || isLoadingMother}
            onClick={onStartVisit}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
export default StartVisitFromVisitDashboard;
