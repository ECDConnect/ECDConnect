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
} from '@ecdlink/ui';
import { format, intervalToDuration } from 'date-fns';
import { useDialog, getAvatarColor, MotherDto, InfantDto } from '@ecdlink/core';
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

export const ClientList: React.FC<ComponentBaseProps> = () => {
  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const history = useHistory();
  const location = useLocation<ClientDashboardRouteState>();

  const infants = useSelector(getInfants);
  const mothers = useSelector(motherSelectors.getMothers);

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

  useEffect(() => {
    const infantsList: UserAlertListDataItem<ExtraInfantData>[] = infants.map(
      (infant) => {
        const { years, months } = intervalToDuration({
          start: new Date(infant?.user?.dateOfBirth || ''),
          end: new Date(),
        });

        return {
          icon: Infant,
          title: infant?.firstName ?? infant?.user?.firstName!,
          // TODO: add correct subTitle (alert status)
          subTitle: infant?.user?.dateOfBirth
            ? `Birth date: ${format(
                new Date(infant?.user?.dateOfBirth!),
                'PP'
              )}`
            : `Birth date: ${format(new Date(infant?.dateOfBirth!), 'PP')}`,
          switchTextStyles: true,
          alertSeverity: 'none',
          avatarColor: getAvatarColor('growgreat') || '',
          extraData: {
            ...infant,
            under6Months: !!years || (!!months && months > 6),
            age: `${years}.${months}`,
          },
          onActionClick: () =>
            navigate(INFANT_PROFILE_TABS.PROGRESS, infant, 'infant', () => {}),
        };
      }
    );

    setInfantsListItems(infantsList);
  }, [infants, navigate]);

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
                    navigate(
                      PREGNANT_PROFILE_TABS.VISITS,
                      client,
                      'mother',
                      onClose
                    ),
                  type: 'filled',
                  textColour: 'white',
                  leadingIcon: 'HomeIcon',
                },
                {
                  text: 'See client’s progress',
                  colour: 'primary',
                  onClick: () =>
                    navigate(
                      PREGNANT_PROFILE_TABS.PROGRESS,
                      client,
                      'mother',
                      onClose
                    ),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'PresentationChartLineIcon',
                },
                {
                  text: 'See referrals',
                  colour: 'primary',
                  onClick: () =>
                    navigate(
                      PREGNANT_PROFILE_TABS.REFERRALS,
                      client,
                      'mother',
                      onClose
                    ),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'ClipboardListIcon',
                },
                {
                  text: 'Contact client',
                  colour: 'primary',
                  onClick: () =>
                    navigate(
                      PREGNANT_PROFILE_TABS.CONTACT,
                      client,
                      'mother',
                      onClose
                    ),
                  type: 'outlined',
                  textColour: 'primary',
                  leadingIcon: 'PhoneIcon',
                },
                {
                  text: 'Something else',
                  colour: 'primary',
                  onClick: () =>
                    navigate(
                      PREGNANT_PROFILE_TABS.VISITS,
                      client,
                      'mother',
                      onClose
                    ),
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

  useLayoutEffect(() => {
    const mothersList: UserAlertListDataItem<ExtraMotherData>[] = mothers.map(
      (mother) => {
        return {
          icon: Pregnant,
          title: mother?.firstName || mother?.user?.firstName!,
          subTitle: mother.statusInfo?.subject,
          switchTextStyles: true,
          alertSeverity:
            (mother.statusInfo?.color?.toLocaleLowerCase() as AlertSeverityType) ||
            'none',
          alertSeverityNoneIcon: 'CalendarIcon',
          alertSeverityNoneColor: 'black',
          avatarColor: getAvatarColor('growgreat') || '',
          extraData: {
            ...mother,
            under6Months: true,
          },
          onActionClick: () => showClientProfileDialog(mother),
        };
      }
    );

    setMothersListItems(mothersList);
  }, [history, mothers, showClientProfileDialog]);

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
    appDispatch(motherThunkActions.getMothers({})).unwrap();
    appDispatch(infantThunkActions.getInfants({})).unwrap();
  }, [appDispatch]);

  useEffect(() => {
    if (location.state?.isFindClient && !isEmptyState) {
      setSearchTextActive(true);
    }
  }, [location, isEmptyState]);

  return (
    <div className={styles.overlay}>
      <SearchHeader<UserAlertListDataItem>
        searchItems={filteredList}
        onSearchChange={setSearch}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
        className="flex gap-2 overflow-auto"
      >
        <SearchDropDown<string>
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
          <StackedList
            className={styles.stackedList}
            listItems={filteredList || []}
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
    </div>
  );
};
