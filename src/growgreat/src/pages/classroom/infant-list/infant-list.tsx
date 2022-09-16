import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  ActionListDataItem,
  DialogPosition,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useDialog } from '@ecdlink/core';
import * as styles from './infant-list.styles';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { infantSelectors } from '@/store/infant';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';

export const InfantList: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const infants = useSelector(infantSelectors.getInfants);
  const [infantsListItems, setInfantsListItems] = useState<
    ActionListDataItem[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addChildButtonExpanded, setAddChildButtonExpanded] =
    useState<boolean>(true);

  useEffect(() => {
    const infantsList: ActionListDataItem[] = infants.map((infant) => {
      return {
        title: infant.firstName!,
        subTitle: `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
        switchTextStyles: true,
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
          type={'MenuList'}
          onScroll={(scrollTop: number) => {}}
        ></StackedList>
      ) : null}
      <FADButton
        title={'Add a child'}
        icon={'PlusIcon'}
        iconDirection={'left'}
        textToggle={addChildButtonExpanded}
        type={'filled'}
        color={'primary'}
        shape={'round'}
        className={styles.fadButton}
        click={registerNewInfant}
      />
    </div>
  );
};
