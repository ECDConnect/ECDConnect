import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  ActionListDataItem,
  DialogPosition,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useDialog } from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import * as styles from './infant-list.styles';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { getAvatarColor } from '@ecdlink/core';
import Infant from '@/assets/infant.svg';

export const InfantList: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const infants = useSelector(getInfants);
  const [infantsListItems, setInfantsListItems] = useState<
    ActionListDataItem[]
  >([]);

  useEffect(() => {
    const infantsList: UserAlertListDataItem[] = infants.map((infant) => {
      return {
        icon: Infant,
        title: infant?.firstName ?? infant?.user?.firstName!,
        subTitle: infant?.user?.dateOfBirth
          ? `Birth date: ${format(new Date(infant?.user?.dateOfBirth!), 'PP')}`
          : `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor() || '',
        onActionClick: () => {},
      };
    });

    setInfantsListItems(infantsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infants]);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const registerNewInfant = () => {
    if (isOnline) {
      history.push(ROUTES.INFANT_REGISTER);
    } else {
      showOnlineOnly();
    }
  };

  return (
    <div className={styles.overlay}>
      {(!infants || infants.length === 0) && (
        <IconInformationIndicator
          title="You don't have any children yet!"
          subTitle="Tap the add a child button below to start"
        />
      )}
      {infants.length > 0 ? (
        <StackedList
          className={styles.stackedList}
          listItems={infantsListItems}
          type={'UserAlertList'}
          onScroll={(scrollTop: number) => {}}
        />
      ) : null}
      <FADButton
        title={'Add a child'}
        icon={'PlusIcon'}
        iconDirection={'left'}
        textToggle
        type={'filled'}
        color={'primary'}
        shape={'round'}
        className={styles.fadButton}
        click={registerNewInfant}
      />
    </div>
  );
};
