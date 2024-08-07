import SearchHeader, {
  SearchHeaderAlternativeRenderItem,
} from '@/components/search-header/search-header';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ConnectionsTypes } from '@/pages/community/community.types';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { staticDataSelectors } from '@/store/static-data';
import {
  CommunityProfileDto,
  getAvatarColor,
  useDialog,
  useSnackbar,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  CheckboxGroup,
  DialogPosition,
  FADButton,
  LoadingSpinner,
  ProfileAvatar,
  SearchDropDown,
  SearchDropDownOption,
  StackedList,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as JoinCommunity } from '@/assets/joinCommunity.svg';
import { CommunityConnectInputModelInput } from '@ecdlink/graphql';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { practitionerThunkActions } from '@/store/practitioner';

interface ECDHeroesProps {
  onClose?: (item: boolean) => void;
}

export interface ECDHeroesRouteState {
  isFromConnectionProfile?: boolean;
}

export const ECDHeroes: React.FC<ECDHeroesProps> = ({ onClose }) => {
  const { isOnline } = useOnlineStatus();
  const { showMessage } = useSnackbar();
  const { state } = useLocation<ECDHeroesRouteState>();
  const isFromConnectionProfile = state?.isFromConnectionProfile;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const communityProfileId = communityProfile?.id;
  const [communityUsers, setCommunityUsers] = useState<
    CommunityProfileDto[] | undefined
  >([]);
  const [otherConnections, setOtherConnections] = useState<
    CommunityProfileDto[] | undefined
  >([]);
  const [otherConnectionsFormatted, setOtherConnectionsFormatted] = useState<
    CommunityProfileDto[] | undefined
  >([]);
  const [communityUsersList, setCommunityUsersList] = useState<
    UserAlertListDataItem[] | undefined
  >([]);
  const [communityUsersListFormatted, setCommunityUsersListFormatted] =
    useState<UserAlertListDataItem[]>();
  const [isConnectActive, setIsConnectActive] = useState(false);
  const [addConnectButtonExpanded, setConnectButtonExpanded] =
    useState<boolean>(true);
  const [searchTextActive, setSearchTextActive] = useState(false);
  const provincesData = useSelector(staticDataSelectors.getProvinces);
  const profileSkillsData = useSelector(staticDataSelectors.getCommunitySkills);
  const [isLoading, setIsLoading] = useState(false);
  const [addedConnections, setAddedConnections] = useState<
    CommunityConnectInputModelInput[]
  >([]);

  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [provincesFiltered, setProvincesFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredProvinces = useMemo(
    () => provincesFiltered?.map((item) => item?.id),
    [provincesFiltered]
  );

  const [profileSkills, setProfileSkills] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [profileSkillsFiltered, setProfileSkillsFiltered] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredProfileSkills = useMemo(
    () => profileSkillsFiltered?.map((item) => item?.id),
    [profileSkillsFiltered]
  );

  const [connectionTypesFilter, setConnectionTypesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredConnectionsType = useMemo(
    () => connectionTypesFilter?.map((item) => item?.id),
    [connectionTypesFilter]
  );

  const SortByConnectionTypes: SearchDropDownOption<string>[] = [
    ConnectionsTypes?.Connected,
    ConnectionsTypes?.ReceivedRequests,
    ConnectionsTypes?.SentRequests,
  ].map((item) => ({
    id: item,
    label: item,
    value: item,
  }));

  useEffect(() => {
    if (provincesData?.length > 0) {
      const provincesSorted = provincesData
        ?.slice()
        ?.sort((a, b) =>
          a.description < b.description
            ? -1
            : a.description > b.description
            ? 1
            : 0
        ) as any;

      setProvinces(
        provincesSorted
          ?.filter((prov: any) => prov?.description !== 'N/A')
          ?.map((item: any) => {
            return {
              value: item?.id,
              label: item?.description,
              id: item?.id,
            };
          })
      );
    }
  }, [provincesData]);

  useEffect(() => {
    if (profileSkillsData?.length > 0) {
      const profileSkillsSorted = profileSkillsData
        ?.slice()
        ?.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        ) as any;

      setProfileSkills(
        profileSkillsSorted
          ?.filter((prov: any) => prov?.description !== 'N/A')
          ?.map((item: any) => {
            return {
              value: item?.id,
              label: item?.name,
              id: item?.id,
            };
          })
      );
    }
  }, [profileSkillsData]);

  useEffect(() => {
    if (
      communityProfile ||
      filteredProvinces ||
      filteredProfileSkills ||
      filteredConnectionsType
    ) {
      handleConnectionsQuery();
    }
  }, [
    communityProfile,
    filteredProvinces,
    filteredProfileSkills,
    filteredConnectionsType,
  ]);

  const handleConnectionsQuery = useCallback(async () => {
    if (communityProfile) {
      setIsLoading(true);
      const response: any = await dispatch(
        communityThunkActions.getUsersToConnectWith({
          userId: communityProfile?.userId!,
          provinceIds: filteredProvinces || [],
          connectionTypes: filteredConnectionsType || [],
          communitySkillIds: filteredProfileSkills || [],
        })
      );

      const connectionsResponse: any = await dispatch(
        communityThunkActions.getOtherConnections({
          userId: communityProfile?.userId!,
          provinceIds: filteredProvinces || [],
          communitySkillIds: filteredProfileSkills || [],
        })
      );
      setIsLoading(false);
      if (response && connectionsResponse) {
        setCommunityUsers(response?.payload);
        setOtherConnections(connectionsResponse?.payload);
        setOtherConnectionsFormatted(connectionsResponse?.payload);
      }
    }
  }, [
    communityProfile,
    dispatch,
    filteredProvinces,
    filteredConnectionsType,
    filteredProfileSkills,
  ]);

  const handleUsersList = useCallback(() => {
    const communityUsersList: UserAlertListDataItem[] = [];

    if (communityUsersList) {
      communityUsers?.map((item) => {
        return communityUsersList.push({
          id: item.id,
          title: item?.communityUser?.fullName!,
          titleStyle: 'text-textDark',
          profileText: item?.communityUser?.fullName
            ?.match(/^(\w)\w*\s+(\w{1,2})/)
            ?.slice(1)
            .join('')
            ?.toLocaleUpperCase(),
          subTitle: item?.aboutShort,
          subTitleStyle: 'text-infoDark',
          alertSeverity: 'none',
          avatarColor: getAvatarColor() || '',
          onActionClick: () =>
            history.push(ROUTES.COMMUNITY.CONNECTION_PROFILE, {
              connectionProfile: item,
            }),
          profileDataUrl: item?.shareProfilePhoto
            ? item?.communityUser?.profilePhoto
            : '',
        });
      });
    }
    setCommunityUsersList(communityUsersList);
    setCommunityUsersListFormatted(communityUsersList);
  }, [communityUsers, history]);

  useEffect(() => {
    handleUsersList();
  }, [handleUsersList]);

  useEffect(() => {
    if (!communityProfile?.clickedECDHeros) {
      handleFirstTimeOnECDHeroes();
    }
  }, []);

  const handleClickedFirstTimeECDHeroes = async () => {
    await dispatch(
      practitionerThunkActions.updateClickedECDHeros({
        userId: communityProfile?.userId!,
      })
    );

    await dispatch(
      communityThunkActions.getCommunityProfile({
        userId: communityProfile?.userId!,
      })
    );
  };

  const handleFirstTimeOnECDHeroes = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <ActionModal
          title={`Use this section to search for people to connect with!`}
          detailText={`Share skills, get support, make new friends.`}
          customIcon={<JoinCommunity className="my-2" />}
          actionButtons={[
            {
              text: 'Start',
              colour: 'quatenary',
              onClick: () => {
                handleClickedFirstTimeECDHeroes();
                onClose();
              },
              type: 'outlined',
              textColour: 'quatenary',
              leadingIcon: 'ArrowCircleRightIcon',
            },
          ]}
        />
      ),
    });
  }, []);

  const handleAddConnections = (item: string) => {
    if (addedConnections?.some((opt) => opt?.toCommunityProfileId === item)) {
      const filteredAddedConnections = addedConnections?.filter(
        (connection) => connection?.toCommunityProfileId !== item
      );
      setAddedConnections(filteredAddedConnections);
      return;
    }
    const newConnection = {
      fromCommunityProfileId: communityProfileId,
      toCommunityProfileId: item,
    };

    setAddedConnections([...addedConnections, newConnection]);
  };

  const saveNewConnections = async () => {
    setIsLoading(true);
    dispatch(
      communityThunkActions.saveCommunityProfileConnections({
        input: addedConnections,
      })
    ).then(async () => {
      await handleConnectionsQuery();
      setIsLoading(false);
      setIsConnectActive(false);
      setAddedConnections([]);
      showMessage({
        message: 'Connections updated',
        type: 'success',
        duration: 3000,
      });
    });
  };

  const handleOpenSaveConnectionsModal = useCallback(() => {
    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            customIcon={<Robot className="mb-4" />}
            iconClassName="h-10 w-10"
            title="Great! Confirm your changes"
            detailText={`Send requests to ${addedConnections?.length} new people.`}
            actionButtons={[
              {
                colour: 'quatenary',
                text: 'Confirm',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'CheckCircleIcon',
                onClick: () => {
                  saveNewConnections();
                  onClose();
                },
              },
              {
                colour: 'quatenary',
                text: 'Close',
                textColour: 'quatenary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog, addedConnections]);

  const renderUsersList = useMemo(() => {
    if (isLoading) {
      return (
        <div className="p-24">
          <LoadingSpinner
            size="big"
            spinnerColor="quatenary"
            backgroundColor="uiLight"
            className="my-4"
          />
        </div>
      );
    }
    if (isConnectActive && otherConnectionsFormatted) {
      return (
        <div>
          {otherConnectionsFormatted?.map((item, index) => (
            <CheckboxGroup
              title={item?.communityUser?.fullName!}
              key={item?.id! + index}
              description={item?.aboutShort}
              onChange={(e) => handleAddConnections(e?.value as string)}
              value={item?.id}
              checked={addedConnections?.some(
                (option) => option.toCommunityProfileId === item.id
              )}
              icon={
                <div className="ml-2">
                  <ProfileAvatar
                    dataUrl={
                      item?.shareProfilePhoto
                        ? item?.communityUser?.profilePhoto!
                        : ''
                    }
                    size={'md'}
                    hasConsent={true}
                    className="h-4 w-6 text-white"
                    canChangeImage={false}
                    userAvatarText={item?.communityUser?.fullName
                      ?.match(/^(\w)\w*\s+(\w{1,2})/)
                      ?.slice(1)
                      .join('')
                      ?.toLocaleUpperCase()}
                  />
                </div>
              }
              isIconFullWidth={true}
              className="mb-1"
            />
          ))}
        </div>
      );
    } else {
      return (
        <StackedList
          listItems={communityUsersListFormatted || []}
          type={'UserAlertList'}
          className="flex flex-col gap-1"
        ></StackedList>
      );
    }
  }, [
    isLoading,
    isConnectActive,
    otherConnectionsFormatted,
    addedConnections,
    handleAddConnections,
    communityUsersListFormatted,
  ]);

  const handleListScroll = (scrollTop: number) => {
    if (scrollTop < 30) {
      setConnectButtonExpanded(true);
    } else {
      setConnectButtonExpanded(false);
    }
  };

  const onSearchChange = (value: string) => {
    setCommunityUsersListFormatted(
      communityUsersList?.filter((x) =>
        x?.title?.toLowerCase()?.includes(value?.toLowerCase())
      ) || []
    );

    setOtherConnectionsFormatted(
      otherConnections?.filter((x) =>
        x?.communityUser?.fullName
          ?.toLowerCase()
          ?.includes(value?.toLowerCase())
      ) || []
    );
  };

  const alternativeSearchItems: SearchHeaderAlternativeRenderItem<CommunityProfileDto> =
    {
      render: (item) => {
        return (
          <div>
            <CheckboxGroup
              title={item?.communityUser?.fullName!}
              key={item?.id!}
              description={item?.aboutShort}
              onChange={(e) => handleAddConnections(e?.value as string)}
              value={item?.id}
              checked={addedConnections?.some(
                (option) => option.toCommunityProfileId === item.id
              )}
              icon={
                <div className="ml-2">
                  <ProfileAvatar
                    dataUrl={item?.communityUser?.profilePhoto!}
                    size={'md'}
                    hasConsent={true}
                    className="h-4 w-6 text-white"
                    canChangeImage={false}
                    userAvatarText={item?.communityUser?.fullName
                      ?.match(/^(\w)\w*\s+(\w{1,2})/)
                      ?.slice(1)
                      .join('')
                      ?.toLocaleUpperCase()}
                  />
                </div>
              }
              isIconFullWidth={true}
              className="mb-1"
            />
            <FADButton
              title={'Save connections'}
              icon={'SaveIcon'}
              iconDirection={'left'}
              textToggle={addConnectButtonExpanded}
              type={'filled'}
              color={'quatenary'}
              shape={'round'}
              className={'absolute bottom-6 right-0 z-10 m-3 px-3.5 py-2.5'}
              click={handleOpenSaveConnectionsModal}
            />
          </div>
        );
      },
    };

  const handleGoBack = () => {
    if (isFromConnectionProfile) {
      history?.push(ROUTES.COMMUNITY.WELCOME);
    } else {
      history?.goBack();
    }
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`ECD Heroes`}
      color={'primary'}
      onBack={isConnectActive ? () => setIsConnectActive(false) : handleGoBack}
      displayOffline={!isOnline}
      onClose={isConnectActive ? () => setIsConnectActive(false) : handleGoBack}
    >
      {isConnectActive && (
        <div className="p-4">
          <Typography
            type={'h3'}
            text={'Choose educators to connect with'}
            color={'textDark'}
          />
          <Typography
            type={'h4'}
            text={
              'Your contact details will be shared once they accept your request.'
            }
            color={'textMid'}
          />
        </div>
      )}
      <SearchHeader<any>
        searchItems={
          !isConnectActive
            ? (communityUsersListFormatted as UserAlertListDataItem<{}>[])
            : otherConnectionsFormatted || []
        }
        onScroll={handleListScroll}
        onSearchChange={onSearchChange}
        isTextSearchActive={searchTextActive}
        onBack={() => setSearchTextActive(false)}
        onSearchButtonClick={() => setSearchTextActive(true)}
        alternativeSearchItemRender={
          isConnectActive ? alternativeSearchItems : undefined
        }
      >
        <SearchDropDown<string>
          displayMenuOverlay={true}
          className={'mr-1'}
          menuItemClassName={
            'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
          }
          overlayTopOffset={isConnectActive ? '28' : '3'}
          options={provinces}
          selectedOptions={provincesFiltered}
          onChange={setProvincesFiltered}
          placeholder={'Province'}
          multiple={true}
          color={'quatenary'}
          preventCloseOnClick={true}
        />
        <SearchDropDown<string>
          displayMenuOverlay={true}
          className={'mr-1'}
          menuItemClassName={
            'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
          }
          overlayTopOffset={isConnectActive ? '28' : '3'}
          options={profileSkills}
          selectedOptions={profileSkillsFiltered}
          onChange={setProfileSkillsFiltered}
          placeholder={'Skills'}
          multiple={true}
          color={'quatenary'}
          preventCloseOnClick={true}
        />
        {!isConnectActive && (
          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1'}
            menuItemClassName={
              'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
            }
            overlayTopOffset={'3'}
            options={SortByConnectionTypes}
            selectedOptions={connectionTypesFilter}
            onChange={setConnectionTypesFilter}
            placeholder={'Connection'}
            multiple={true}
            color={'quatenary'}
            preventCloseOnClick={true}
          />
        )}
      </SearchHeader>
      <div className="p-4">
        <div>{renderUsersList}</div>
        {!isConnectActive && (
          <FADButton
            title={'Connect'}
            icon={'HandIcon'}
            iconDirection={'left'}
            textToggle={addConnectButtonExpanded}
            type={'filled'}
            color={'quatenary'}
            shape={'round'}
            className={'absolute bottom-16 right-0 z-10 m-3 px-3.5 py-2.5'}
            click={() => setIsConnectActive(true)}
          />
        )}
        {isConnectActive && (
          <FADButton
            title={'Save connections'}
            icon={'SaveIcon'}
            iconDirection={'left'}
            textToggle={addConnectButtonExpanded}
            type={'filled'}
            color={'quatenary'}
            shape={'round'}
            className={'absolute bottom-16 right-0 z-10 m-3 px-3.5 py-2.5'}
            click={handleOpenSaveConnectionsModal}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
