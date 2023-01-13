import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { getMothers } from '@/store/mother/mother.selectors';
import { Typography, Dropdown, BannerWrapper, Button } from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { useHistory } from 'react-router';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';

const HEADER_HEIGHT = 64;

export const StartVisit: React.FC = () => {
  const [client, setClient] = useState<string | undefined>();

  const infants = useSelector(getInfants);
  const mothers = useSelector(getMothers);

  const date = format(new Date(), 'EEEE, d LLLL');

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { height } = useWindowSize();

  const infantOptions = useMemo(
    () =>
      infants.map((infant) => ({
        value: infant.user?.id,
        label: `${infant.user?.firstName || ''} ${infant.user?.surname || ''}`,
      })),
    [infants]
  );

  const motherOptions = useMemo(
    () =>
      mothers.map((mom) => ({
        value: mom.user?.id,
        label: `${mom.user?.firstName || ''} ${mom.user?.surname || ''}`,
      })),
    [mothers]
  );

  const clients = [...motherOptions, ...infantOptions];

  const goBack = () => {
    history.push(ROUTES.CLIENT.ROOT, { activeTabIndex: 1 });
  };

  const onStartVisit = () => {
    goBack();

    // TODO: add integration
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
        <Dropdown
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
            disabled={!client}
            onClick={onStartVisit}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
export default StartVisit;
