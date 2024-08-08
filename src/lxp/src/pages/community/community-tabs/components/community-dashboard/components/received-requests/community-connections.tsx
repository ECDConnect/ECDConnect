import SearchHeader from '@/components/search-header/search-header';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import {
  CommunityProfileDto,
  getAvatarColor,
  useSnackbar,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Divider,
  EmptyPage,
  LoadingSpinner,
  StackedList,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { AcceptRejectCommunityRequestsInputModelInput } from '@ecdlink/graphql';

interface ReceivedRequestsProps {
  onClose?: (item: boolean) => void;
}

export interface CommunityProfileRouteState {
  isRequest: CommunityProfileDto[];
  isConnectedScreen?: boolean;
  isFromReceivedConnections?: boolean;
}

export const CommunityConnections: React.FC<ReceivedRequestsProps> = ({
  onClose,
}) => {
  const { isOnline } = useOnlineStatus();
  const { showMessage } = useSnackbar();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { state } = useLocation<CommunityProfileRouteState>();
  const isRequest = state?.isRequest;
  const isConnectedScreen = state?.isConnectedScreen;
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const isFromReceivedConnections = state?.isFromReceivedConnections;
  const usersData = isRequest
    ? communityProfile?.pendingConnections
    : communityProfile?.acceptedConnections;
  const receivedRequestsUserIds = useMemo(
    () => usersData?.map((item) => item?.userId),
    [usersData]
  );

  const renderECDHeroesString = useMemo(
    () => (usersData && usersData?.length > 1 ? 'Heroes' : 'Hero'),
    [usersData]
  );

  const renderConnectionsString = useMemo(
    () => (usersData && usersData?.length > 1 ? 'connections' : 'connection'),
    [usersData]
  );

  const [communityUsers, setCommunityUsers] = useState<
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
  const [isLoading, setIsLoading] = useState(false);
  const [acceptOrRejectIsLoading, setAcceptOrRejectIsLoading] = useState(false);

  const handleConnectionsQuery = useCallback(async () => {
    if (communityProfile) {
      setIsLoading(true);
      if (usersData && usersData?.length > 0) {
        setCommunityUsers(usersData);
      } else {
        setCommunityUsers([]);
      }

      setIsLoading(false);
    }
  }, [communityProfile, usersData]);

  useEffect(() => {
    if (usersData) {
      handleConnectionsQuery();
    }
  }, [handleConnectionsQuery, usersData]);

  const handleAcceptAllConnections = useCallback(async () => {
    setAcceptOrRejectIsLoading(true);
    const acceptedInput: AcceptRejectCommunityRequestsInputModelInput = {
      userId: communityProfile?.userId,
      userIdsToAccept: receivedRequestsUserIds,
    };

    await dispatch(
      communityThunkActions.acceptOrRejectCommunityRequests({
        input: acceptedInput,
      })
    );

    onClose && onClose(true);
    setAcceptOrRejectIsLoading(false);
    history.goBack();
    showMessage({
      message: 'Connections updated!',
      type: 'success',
      duration: 3000,
    });
    setAcceptOrRejectIsLoading(false);
  }, [
    communityProfile?.userId,
    dispatch,
    history,
    onClose,
    receivedRequestsUserIds,
    showMessage,
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
              isFromReceivedConnections: true,
              isConnectedScreen: isConnectedScreen,
            }),
          profileDataUrl: item?.shareProfilePhoto
            ? item?.communityUser?.profilePhoto
            : '',
        });
      });
    }
    setCommunityUsersList(communityUsersList);
    setCommunityUsersListFormatted(communityUsersList);
  }, [communityUsers, history, isConnectedScreen]);

  useEffect(() => {
    handleUsersList();
  }, [handleUsersList]);

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
    if (
      communityUsersListFormatted &&
      communityUsersListFormatted?.length > 0
    ) {
      return (
        <div>
          {usersData?.length && usersData?.length > 0 && !isConnectedScreen && (
            <Typography
              type="h4"
              text={`${usersData?.length} ECD ${renderECDHeroesString} want to connect with you
`}
              className="my-4"
            />
          )}
          {usersData?.length && usersData?.length > 0 && isConnectedScreen && (
            <Typography
              type="h4"
              text={`${usersData?.length} ${renderConnectionsString}
`}
              className="my-4"
            />
          )}
          {usersData && usersData?.length > 10 && (
            <Button
              className="mb-5"
              type="outlined"
              color="secondary"
              textColor="secondary"
              text={'Search'}
              icon={'SearchIcon'}
              onClick={() => setSearchTextActive(true)}
              size="small"
            />
          )}
          <StackedList
            listItems={communityUsersListFormatted || []}
            type={'UserAlertList'}
            className="flex flex-col gap-1"
          ></StackedList>
          {!isConnectedScreen && (
            <Button
              className="mt-5 w-full rounded-2xl px-2"
              type="filled"
              color="quatenary"
              textColor="white"
              text="Accept all"
              icon="CheckCircleIcon"
              iconPosition="start"
              isLoading={acceptOrRejectIsLoading}
              disabled={acceptOrRejectIsLoading}
              onClick={handleAcceptAllConnections}
            />
          )}
          <Divider dividerType="dashed" className="my-4" />
          <Button
            className="w-full rounded-2xl px-2"
            type="outlined"
            color="quatenary"
            textColor="quatenary"
            text="See all ECD Heroes"
            icon="UserGroupIcon"
            iconPosition="start"
            onClick={() => history.push(ROUTES.COMMUNITY.ECD_HEROES_LIST)}
          />
        </div>
      );
    } else {
      return (
        <div>
          <EmptyPage
            title={
              isConnectedScreen
                ? `You don't have any connections yet!`
                : `You don't have any requests yet! `
            }
            image={AlienImage}
          />
          <Button
            className="w-full rounded-2xl px-2"
            type="filled"
            color="quatenary"
            textColor="white"
            text="See ECD Heroes"
            icon="UserGroupIcon"
            iconPosition="start"
            onClick={() => history.push(ROUTES.COMMUNITY.ECD_HEROES_LIST)}
          />
        </div>
      );
    }
  }, [
    acceptOrRejectIsLoading,
    communityUsersListFormatted,
    handleAcceptAllConnections,
    history,
    isConnectedScreen,
    isLoading,
    renderConnectionsString,
    renderECDHeroesString,
    usersData,
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
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={isConnectedScreen ? `Connections` : `Connection requests`}
      color={'primary'}
      onBack={
        isConnectActive
          ? () => setIsConnectActive(false)
          : isFromReceivedConnections
          ? () => history?.push(ROUTES.COMMUNITY.ROOT)
          : () => history.goBack()
      }
      displayOffline={!isOnline}
      onClose={
        isConnectActive
          ? () => setIsConnectActive(false)
          : isFromReceivedConnections
          ? () => history?.push(ROUTES.COMMUNITY.ROOT)
          : () => history.goBack()
      }
    >
      {searchTextActive && (
        <SearchHeader<any>
          searchItems={
            communityUsersListFormatted as UserAlertListDataItem<{}>[]
          }
          onScroll={handleListScroll}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          onBack={() => setSearchTextActive(false)}
          onSearchButtonClick={() => setSearchTextActive(true)}
          children={undefined}
        ></SearchHeader>
      )}

      <div className="p-4">
        {isConnectedScreen ? (
          <Typography type="h2" text="Connected ECD Heroes" />
        ) : (
          <Typography type="h2" text="Requests to connect" />
        )}
        {!isConnectedScreen && (
          <Typography
            className="mb-2"
            type="body"
            color="textMid"
            text="Tap each profile to accept or decline requests, or scroll to the bottom to accept all requests."
          />
        )}

        <Divider dividerType="dashed" className="my-4" />
        <div>
          {acceptOrRejectIsLoading ? (
            <LoadingSpinner
              size="medium"
              spinnerColor="quatenary"
              backgroundColor="uiLight"
              className="my-28"
            />
          ) : (
            renderUsersList
          )}
        </div>
      </div>
    </BannerWrapper>
  );
};
