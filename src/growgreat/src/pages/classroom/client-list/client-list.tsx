import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  DialogPosition,
  UserAlertListDataItem,
  ActionModal,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useDialog } from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import * as styles from './infant-list.styles';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { getInfants } from '@/store/infant/infant.selectors';
import { motherSelectors } from '@/store/mother';
import { getAvatarColor } from '@ecdlink/core';
import Infant from '@/assets/infant.svg';

export const ClientList: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();

  const history = useHistory();

  const infants = useSelector(getInfants);
  const mothers = useSelector(motherSelectors.getMothers);

  const [infantsListItems, setInfantsListItems] = useState<
    UserAlertListDataItem[]
  >([]);
  const [mothersListItems, setMothersListItems] = useState<
    UserAlertListDataItem[]
  >([]);
  const [clientsListItems, setClientsListItems] = useState<any>([]);

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

  useEffect(() => {
    const mothersList: UserAlertListDataItem[] = mothers.map((mother) => {
      return {
        icon: Infant,
        title: mother?.firstName || mother?.user?.firstName!,
        subTitle: mother?.expectedDateOfDelivery
          ? `Expected delivery date: ${format(
              new Date(mother?.expectedDateOfDelivery!),
              'PP'
            )}`
          : `Expected delivery date: -`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor() || '',
        onActionClick: () => {},
      };
    });

    setMothersListItems(mothersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mothers]);

  useEffect(() => {
    if (infantsListItems || mothersListItems) {
      setClientsListItems([...infantsListItems, ...mothersListItems]);
    }
  }, [infantsListItems, mothersListItems]);

  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            className="z-50"
            title="Open a new folder"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Pregnant mom',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'UserAddIcon',
                onClick: async () => {
                  onSubmit();
                  history.push(ROUTES.MOM_REGISTER);
                },
              },
              {
                colour: 'primary',
                text: 'Child',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'UserGroupIcon',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.INFANT_REGISTER);
                },
              },
            ]}
          />
        );
      },
    });
  };

  const goToClientFolders = () => {
    showCompleteProfileBlockingDialog();
  };

  return (
    <div className={styles.overlay}>
      {(!infants || infants.length === 0) &&
        (!mothers || mothers.length === 0) && (
          <IconInformationIndicator
            title="You don't have any client yet!"
            subTitle="Tap the add a client button below to start"
          />
        )}
      {clientsListItems.length > 0 ? (
        <StackedList
          className={styles.stackedList}
          listItems={clientsListItems || []}
          type={'UserAlertList'}
          onScroll={(scrollTop: number) => {}}
        />
      ) : null}
      <FADButton
        title={'Open a folder'}
        icon={'PlusIcon'}
        iconDirection={'left'}
        textToggle
        type={'filled'}
        color={'primary'}
        shape={'round'}
        className={styles.fadButton}
        click={goToClientFolders}
      />
    </div>
  );
};
