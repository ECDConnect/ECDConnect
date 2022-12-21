import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  ActionListDataItem,
  DialogPosition,
} from '@ecdlink/ui';
import { useDialog } from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import * as styles from './mother-list.styles';
import { motherSelectors } from '@/store/mother';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const MotherList: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const mothers = useSelector(motherSelectors.getMothers);
  const [mothersListItems, setMothersListItems] = useState<
    ActionListDataItem[]
  >([]);

  useEffect(() => {
    const mothersList: ActionListDataItem[] = mothers.map((mother) => {
      return {
        title: mother?.user?.firstName! + ' ' + mother?.user?.surname,
        subTitle: mother?.siteAddressId,
        switchTextStyles: true,
        onActionClick: () => {},
      };
    });

    setMothersListItems(mothersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mothers]);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const registerNewMother = () => {
    if (isOnline) {
      history.push(ROUTES.MOM_REGISTER);
    } else {
      showOnlineOnly();
    }
  };

  return (
    <div className={styles.overlay}>
      {(!mothers || mothers.length === 0) && (
        <IconInformationIndicator
          title="You don't have any children yet!"
          subTitle="Tap the add a child button below to start"
        />
      )}
      {mothers.length > 0 && (
        <StackedList
          type={'MenuList'}
          className={styles.stackedList}
          listItems={mothersListItems}
          onScroll={(scrollTop: number) => {}}
        />
      )}
      <FADButton
        title={'Add a mother'}
        icon={'PlusIcon'}
        iconDirection={'left'}
        textToggle
        type={'filled'}
        color={'primary'}
        shape={'round'}
        className={styles.fadButton}
        click={registerNewMother}
      />
    </div>
  );
};
