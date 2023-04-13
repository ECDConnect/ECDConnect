import { getCaregiverClientsByIdSelector } from '@/store/caregiver/caregiver.selectors';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  AlertSeverityType,
  BannerWrapper,
  StackedList,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { getInfantById } from '@/store/infant/infant.selectors';
import { useCallback, useMemo } from 'react';
import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import Infant from '@/assets/infant.svg';
import Pregnant from '@/assets/pregnant.svg';
import { useClientProfileDialog } from '@/pages/client/clients-tab/client-list';
import { InfantDto, MotherDto, getAvatarColor } from '@ecdlink/core';

export const MultipleChildren: React.FC = () => {
  const { infantId } = useParams<{ infantId: string }>();

  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const profileDialog = useClientProfileDialog();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );
  const caregiverClients = useSelector((state: RootState) =>
    getCaregiverClientsByIdSelector(state, infant?.caregiver?.id || '')
  )?.clients;

  const caregiverName = useMemo(() => infant?.caregiver?.firstName, [infant]);

  const goBack = useCallback(() => {
    history.push(ROUTES.CLIENTS.ROOT);
  }, [history]);

  const infantsList: UserAlertListDataItem[] = !!caregiverClients?.infants
    ?.length
    ? caregiverClients?.infants?.map((infant) => ({
        icon: Infant,
        title: `${infant?.user?.firstName!}`,
        subTitle: infant?.statusInfo?.subject || 'No visit',
        switchTextStyles: true,
        alertSeverity:
          (infant?.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
          'none',
        alertSeverityNoneIcon: 'CalendarIcon',
        alertSeverityNoneColor: 'black',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () =>
          profileDialog({ client: infant as InfantDto, clientType: 'infant' }),
      }))
    : [];

  const mother: UserAlertListDataItem[] = !!caregiverClients?.mother
    ? [caregiverClients?.mother]?.map((mother) => ({
        icon: Pregnant,
        title: String(mother?.user?.firstName),
        subTitle: String(mother?.statusInfo?.subject),
        switchTextStyles: true,
        alertSeverity:
          (mother?.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
          'none',
        alertSeverityNoneIcon: 'CalendarIcon',
        alertSeverityNoneColor: 'black',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () =>
          profileDialog({ client: mother as MotherDto, clientType: 'mother' }),
      }))
    : [];

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${caregiverName} & family`}
      backgroundColour="white"
      displayOffline={!isOnline}
      displayHelp
      className="p-4"
    >
      <Typography
        type="h2"
        text={`${caregiverName} & family`}
        className="mb-6"
      />
      <Typography
        type="h4"
        text="Tap a profile below to see information about each client or record a visit."
        className="mb-4"
      />
      <StackedList
        className="flex flex-col gap-2"
        listItems={[...infantsList, ...mother]}
        type={'UserAlertList'}
      />
    </BannerWrapper>
  );
};
