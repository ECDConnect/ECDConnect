import {
  ComponentBaseProps,
  FADButton,
  StackedList,
  DialogPosition,
  UserAlertListDataItem,
  ActionModal,
  AlertSeverityType,
  SearchDropDown,
  SearchDropDownOption,
  LoadingSpinner,
} from '@ecdlink/ui';
import { intervalToDuration } from 'date-fns';
import {
  useDialog,
  getAvatarColor,
  MotherDto,
  InfantDto,
  getStringFromClassNameOrId,
} from '@ecdlink/core';
import { IconInformationIndicator } from '@/components/icon-information-indicator/icon-information-indicator';
import * as styles from './client-list.styles';
import { useSelector } from 'react-redux';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import ROUTES from '@/routes/routes';
import { useHistory, useLocation } from 'react-router-dom';
import { getInfants } from '@/store/infant/infant.selectors';
import { motherSelectors, motherThunkActions } from '@/store/mother';
import Infant from '@/assets/infant.svg';
import Pregnant from '@/assets/pregnant.svg';
import { ReactComponent as BinocularsIcon } from '@/assets/binocularsIcon.svg';
import { PREGNANT_PROFILE_TABS } from '@/pages/mom/pregnant-profile';
import { useAppDispatch } from '@/store';
import SearchHeader from '@/components/search-header/search-header';
import { infantThunkActions } from '@/store/infant';
import {
  ageOptions,
  clientTypeOptions,
  ExtraInfantData,
  ExtraMotherData,
  filterByAge,
  filterByClientType,
  filterBySort,
  searchList,
  SortBy,
  sortOptions,
} from './filters';
import { ClientDashboardRouteState } from '../client-dashboard/class-dashboard.types';
import { INFANT_PROFILE_TABS } from '@/pages/infant/infant-profile';
import { caregiverThunkActions } from '@/store/caregiver';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CaregiverActions } from '@/store/caregiver/caregiver.actions';
import { PayloadAction } from '@reduxjs/toolkit';
import { generatePath } from 'react-router-dom';
import { MergedCaregiver } from '@/store/caregiver/caregiver.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getCaregiverClientsSelector } from '@/store/caregiver/caregiver.selectors';
import { MotherActions } from '@/store/mother/mother.actions';
import { InfantActions } from '@/store/infant/infant.actions';
import { clientSteps } from './walkthrough/steps';
import { multipleClientsSteps } from './walkthrough/steps_multiple_clients';
import { useWalkthrough } from '@/context/walkthroughContext';

export const useClientProfileDialog = () => {
  const history = useHistory();

  const navigate = useCallback(
    (
      activeTabIndex: number,
      client: MotherDto | InfantDto,
      clientType: 'mother' | 'infant',
      onClose: () => void
    ) => {
      history.push(
        `${
          clientType === 'mother'
            ? ROUTES.CLIENTS.MOM_PROFILE.ROOT
            : ROUTES.CLIENTS.INFANT_PROFILE.ROOT
        }${client.user?.id}`,
        {
          activeTabIndex,
        }
      );
      onClose();
    },
    [history]
  );

  const dialog = useDialog();

  const profileDialog = ({
    client,
    clientType,
  }: {
    client: MotherDto | InfantDto;
    clientType: 'infant' | 'mother';
  }) => {
    const NAVIGATE =
      clientType === 'infant' ? INFANT_PROFILE_TABS : PREGNANT_PROFILE_TABS;

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
                  navigate(NAVIGATE.VISITS, client, clientType, onClose),
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'HomeIcon',
              },
              {
                text: 'See client’s progress',
                colour: 'primary',
                onClick: () =>
                  navigate(NAVIGATE.PROGRESS, client, clientType, onClose),
                type: 'outlined',
                textColour: 'primary',
                leadingIcon: 'PresentationChartLineIcon',
              },
              {
                text: 'See referrals',
                colour: 'primary',
                onClick: () =>
                  navigate(NAVIGATE.REFERRALS, client, clientType, onClose),
                type: 'outlined',
                textColour: 'primary',
                leadingIcon: 'ClipboardListIcon',
              },
              {
                text: 'Contact client',
                colour: 'primary',
                onClick: () =>
                  navigate(NAVIGATE.CONTACT, client, clientType, onClose),
                type: 'outlined',
                textColour: 'primary',
                leadingIcon: 'PhoneIcon',
              },
              {
                text: 'Something else',
                colour: 'primary',
                onClick: () =>
                  navigate(NAVIGATE.VISITS, client, clientType, onClose),
                type: 'outlined',
                textColour: 'primary',
              },
            ]}
          />
        );
      },
    });
  };

  return profileDialog;
};

export const ClientList: React.FC<ComponentBaseProps> = () => {
  const { isLoading } = useThunkFetchCall(
    'caregivers',
    CaregiverActions.GET_CAREGIVER_CLIENTS
  );
  const { isLoading: isLoadingMothers } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHERS
  );
  const { isLoading: isLoadingInfants } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANTS
  );

  const { isWalkthroughSession } = useWalkthrough();

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const appDispatch = useAppDispatch();
  const profileDialog = useClientProfileDialog();

  const history = useHistory();
  const location = useLocation<ClientDashboardRouteState>();

  const infants = useSelector(getInfants);
  const mothers = useSelector(motherSelectors.getMothers);
  const caregiverClients = useSelector(getCaregiverClientsSelector);

  const [infantsListItems, setInfantsListItems] = useState<
    UserAlertListDataItem<ExtraInfantData>[]
  >([]);
  const [mothersListItems, setMothersListItems] = useState<
    UserAlertListDataItem<ExtraMotherData>[]
  >([]);

  const [search, setSearch] = useState('');
  const [searchTextActive, setSearchTextActive] = useState(false);

  const [clientType, setClientType] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [age, setAge] = useState<SearchDropDownOption<string>[]>([]);
  const [sortBy, setSortBy] = useState<SearchDropDownOption<SortBy>[]>([]);

  const filteredList = useMemo(() => {
    let list = [...mothersListItems, ...infantsListItems];

    list = filterByClientType(
      list,
      mothersListItems,
      infantsListItems,
      clientType
    );
    list = filterByAge(list, age);
    list = filterBySort(list, sortBy);
    list = searchList(list, search);

    return list;
  }, [mothersListItems, infantsListItems, clientType, age, sortBy, search]);

  const isEmptyState = useMemo(
    () =>
      (!infants || infants.length === 0) && (!mothers || mothers.length === 0),
    [infants, mothers]
  );

  useLayoutEffect(() => {
    const infantsList: UserAlertListDataItem<ExtraInfantData>[] = infants.map(
      (infant) => {
        const { years, months } = intervalToDuration({
          start: new Date(infant?.user?.dateOfBirth || ''),
          end: new Date(),
        });

        return {
          icon: Infant,
          title: `${infant?.firstName ?? infant?.user?.firstName!} ${
            !!infant.caregiver?.id ? '& ' + infant.caregiver.firstName : ''
          }`,
          subTitle: infant?.statusInfo?.subject || 'No visit',
          switchTextStyles: true,
          alertSeverity:
            (infant.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
            'none',
          alertSeverityNoneIcon:
            infant?.statusInfo?.subject === 'New client'
              ? 'CheckCircleIcon'
              : 'CalendarIcon',
          alertSeverityNoneColor:
            infant?.statusInfo?.subject === 'New client'
              ? 'successDark'
              : 'black',
          avatarColor: getAvatarColor('growgreat') || '',
          extraData: {
            ...infant,
            under6Months: !!years || (!!months && months > 6),
            age: `${years}.${months}`,
          },
          onActionClick: async () => {
            const caregiverId = infant.caregiver?.id;
            const response =
              caregiverId &&
              isOnline &&
              ((await appDispatch(
                caregiverThunkActions.getCaregiverClients({
                  caregiverId: caregiverId,
                })
              )) as PayloadAction<MergedCaregiver> | undefined);

            if (
              (!!response &&
                isOnline &&
                typeof response !== 'string' &&
                Number(response?.payload?.infants?.length) > 1) ||
              caregiverClients?.find(
                (item) =>
                  item.id === caregiverId &&
                  item.infants?.length &&
                  item.infants.length > 1
              )
            ) {
              return history.push(
                generatePath(ROUTES.CLIENTS.INFANT_PROFILE.MULTIPLE_CHILDREN, {
                  infantId: infant.user?.id,
                })
              );
            }

            profileDialog({ client: infant, clientType: 'infant' });
          },
        };
      }
    );

    setInfantsListItems(infantsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appDispatch, history, infants]);

  useLayoutEffect(() => {
    const mothersList: UserAlertListDataItem<ExtraMotherData>[] = mothers.map(
      (mother) => {
        return {
          icon: Pregnant,
          title:
            mother?.user?.firstName! + ' ' + mother?.user?.surname! ||
            mother?.firstName!,
          subTitle: mother.statusInfo?.subject,
          switchTextStyles: true,
          alertSeverity:
            (mother.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
            'none',
          alertSeverityNoneIcon:
            mother?.statusInfo?.subject === 'New client'
              ? 'CheckCircleIcon'
              : 'CalendarIcon',
          alertSeverityNoneColor:
            mother?.statusInfo?.subject === 'New client'
              ? 'successDark'
              : 'black',
          avatarColor: getAvatarColor('growgreat') || '',
          extraData: {
            ...mother,
            under6Months: true,
          },
          onActionClick: () =>
            profileDialog({ client: mother, clientType: 'mother' }),
        };
      }
    );

    setMothersListItems(mothersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, mothers]);

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

  const onClientTypeChange = useCallback((value) => {
    setAge([]);
    setClientType(value);
  }, []);

  useLayoutEffect(() => {
    const promises = [
      appDispatch(motherThunkActions.getMothers({})).unwrap(),
      appDispatch(infantThunkActions.getInfants({})).unwrap(),
    ];

    Promise.all(promises);
  }, [appDispatch]);

  useEffect(() => {
    if (location.state?.isFindClient && !isEmptyState) {
      setSearchTextActive(true);
    }
  }, [location, isEmptyState]);

  if (isLoading || isLoadingMothers || isLoadingInfants) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
        className="pt-4"
      />
    );
  }

  return (
    <div className={styles.overlay}>
      <SearchHeader<UserAlertListDataItem>
        id={getStringFromClassNameOrId(multipleClientsSteps[1].target)}
        searchItems={filteredList}
        onSearchChange={setSearch}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
        className="flex gap-2 overflow-auto"
      >
        <SearchDropDown<string>
          id={getStringFromClassNameOrId(multipleClientsSteps[0].target)}
          displayMenuOverlay={true}
          menuItemClassName={'w-11/12 left-4 '}
          overlayTopOffset={'120'}
          options={clientTypeOptions}
          selectedOptions={clientType}
          onChange={onClientTypeChange}
          placeholder={'Client type'}
          color={'secondary'}
          info={{
            name: `Filter by: Client type`,
          }}
        />
        {clientType[0]?.value !== clientTypeOptions[0].value && (
          <SearchDropDown<string>
            displayMenuOverlay={true}
            menuItemClassName={'w-11/12 left-4 '}
            overlayTopOffset={'120'}
            options={ageOptions}
            selectedOptions={age}
            onChange={setAge}
            placeholder={'Age'}
            color={'secondary'}
            info={{
              name: `Filter by: Age`,
            }}
          />
        )}
        <SearchDropDown<SortBy>
          displayMenuOverlay={true}
          menuItemClassName={'w-11/12 left-4 '}
          overlayTopOffset={'120'}
          options={sortOptions}
          selectedOptions={sortBy}
          onChange={setSortBy}
          placeholder={'Sort by'}
          color={'secondary'}
          info={{
            name: `Sort by:`,
          }}
        />
      </SearchHeader>
      <div className={styles.content}>
        {!filteredList.length && (
          <IconInformationIndicator
            className="px-10 pt-28"
            title={
              isEmptyState ? "You don't have any clients yet!" : 'No results'
            }
            subTitle={
              isEmptyState
                ? 'Tap the “Open a folder” button below to register clients'
                : ''
            }
            renderCustomIcon={<BinocularsIcon />}
          />
        )}
        {filteredList.length > 0 && (
          <div id={getStringFromClassNameOrId(clientSteps[1].target)}>
            <StackedList
              className={styles.stackedList}
              listItems={
                isWalkthroughSession
                  ? filteredList.slice(0, 4)
                  : filteredList || []
              }
              type={'UserAlertList'}
            />
          </div>
        )}
        <FADButton
          id={getStringFromClassNameOrId(multipleClientsSteps[2].target)}
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
    </div>
  );
};
