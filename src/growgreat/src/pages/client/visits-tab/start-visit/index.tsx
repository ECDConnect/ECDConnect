import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  getInfantCurrentVisitSelector,
  getInfants,
} from '@/store/infant/infant.selectors';
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
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';

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
  const infantCurrentVisit = useSelector(getInfantCurrentVisitSelector);

  const { isLoading: isLoadingInfant } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_VISITS
  );
  const { isLoading: isLoadingMother } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_VISITS
  );

  const { errorDialog } = useRequestResponseDialog();

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

  const motherOptions = useMemo(
    () =>
      mothers.map((mom) => ({
        value: { id: mom.user?.id, type: 'mother' } as DropdownOnChange,
        label: `${mom.user?.firstName || ''} ${mom.user?.surname || ''}`,
      })),
    [mothers]
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

  const onStartVisit = () => {
    // TODO: add integration
    if (!infantCurrentVisit) {
      return errorDialog(
        'Integration for additional visit and visit for mom coming soon'
      );
    }

    switch (client?.type) {
      case 'infant':
        history.push(
          `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${client.id}/activities-form/${infantCurrentVisit?.id}`
        );
        break;

      case 'mother':
      default:
        // TODO: add integration
        break;
    }
  };
  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Client Folders'}
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
