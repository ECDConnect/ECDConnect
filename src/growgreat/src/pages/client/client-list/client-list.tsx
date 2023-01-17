import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  DialogPosition,
  UserAlertListDataItem,
  ActionModal,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useDialog, getAvatarColor, MotherDto } from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import * as styles from './infant-list.styles';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { getInfants } from '@/store/infant/infant.selectors';
import { motherSelectors } from '@/store/mother';
import Infant from '@/assets/infant.svg';
import Pregnant from '@/assets/pregnant.svg';
import { ReactComponent as BinocularsIcon } from '@/assets/binocularsIcon.svg';
import { PREGNANT_PROFILE_TABS } from '@/pages/mom/pregnant-profile';

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
        // TODO: add correct subTitle (alert status)
        subTitle: infant?.user?.dateOfBirth
          ? `Birth date: ${format(new Date(infant?.user?.dateOfBirth!), 'PP')}`
          : `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () => {},
      };
    });

    setInfantsListItems(infantsList);
  }, [infants]);

  const navigate = useCallback(
    (activeTabIndex: number, client: MotherDto, onClose: () => void) => {
      history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${client.user?.id}`, {
        activeTabIndex,
      });
      onClose();
    },
    [history]
  );

  const showClientProfileDialog = useCallback(
    (client: MotherDto) => {
      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render(onClose) {
          return (
            <ActionModal
              className={'mx-4'}
              title={`What do you want to do on ${client.user?.firstName}’s profile?`}
              actionButtons={[
                {
                  text: 'Visit client',
                  colour: 'primary',
                  onClick: () =>
                    navigate(PREGNANT_PROFILE_TABS.VISITS, client, onClose),
                  type: 'filled',
                  textColour: 'white',
                  leadingIcon: 'HomeIcon',
                },
                {
                  text: 'See client’s progress',
                  colour: 'primary',
                  onClick: () =>
                    navigate(PREGNANT_PROFILE_TABS.PROGRESS, client, onClose),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'PresentationChartLineIcon',
                },
                {
                  text: 'See referrals',
                  colour: 'primary',
                  onClick: () =>
                    navigate(PREGNANT_PROFILE_TABS.REFERRALS, client, onClose),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'ClipboardListIcon',
                },
                {
                  text: 'Contact client',
                  colour: 'primary',
                  onClick: () =>
                    navigate(PREGNANT_PROFILE_TABS.CONTACT, client, onClose),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'PhoneIcon',
                },
                {
                  text: 'Something else',
                  colour: 'primary',
                  onClick: () =>
                    navigate(PREGNANT_PROFILE_TABS.VISITS, client, onClose),
                  type: 'outlined',
                  textColour: 'primary',
                },
              ]}
            />
          );
        },
      });
    },
    [dialog, navigate]
  );

  useEffect(() => {
    const mothersList: UserAlertListDataItem[] = mothers.map((mother) => {
      return {
        icon: Pregnant,
        title: mother?.firstName || mother?.user?.firstName!,
        // TODO: add correct subTitle (alert status)
        subTitle: mother?.expectedDateOfDelivery
          ? `Expected delivery date: ${format(
              new Date(mother?.expectedDateOfDelivery!),
              'PP'
            )}`
          : `Expected delivery date: -`,
        switchTextStyles: true,
        alertSeverity: 'none',
        avatarColor: getAvatarColor('growgreat') || '',
        onActionClick: () => showClientProfileDialog(mother),
      };
    });

    setMothersListItems(mothersList);
  }, [history, mothers, showClientProfileDialog]);

  useEffect(() => {
    if (infantsListItems || mothersListItems) {
      setClientsListItems([...infantsListItems, ...mothersListItems]);
    }
  }, [infantsListItems, mothersListItems]);

  const showCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: false,
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
            className="px-10 pt-28"
            title="You don't have any client yet!"
            subTitle="Tap the “Open a folder” button below to register clients"
            renderCustomIcon={<BinocularsIcon />}
          />
        )}
      {clientsListItems.length > 0 && (
        <StackedList
          className={styles.stackedList}
          listItems={clientsListItems || []}
          type={'UserAlertList'}
        />
      )}
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
