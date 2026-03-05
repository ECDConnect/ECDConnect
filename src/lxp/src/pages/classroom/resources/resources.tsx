import {
  Button,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  StackedList,
  StackedListItemType,
  Typography,
} from '@ecdlink/ui';
import { ResourcesIcons, ResourcesNames } from './resources.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResourcesService } from '@/services/ResourcesService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { AllResources } from './all-resources/all-resources';
import { userSelectors } from '@/store/user';
import { ComingSoon } from '@/pages/business/components/coming-soon/coming-soon';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { resourcesSelectors } from '@/store/resources';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../class-dashboard/class-dashboard.types';

export const Resources = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const [resourcesLikedByUser, setResourcesLikedByUser] = useState<any[]>([]);
  const [viewAllResources, setViewAllResources] = useState(false);
  const [resourceTypeItem, setResourceTypeItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const history = useHistory();

  const resources = useSelector(resourcesSelectors.getClassroomResources);

  const activitiesResources = useMemo(
    () =>
      resources?.filter(
        (item) => item?.resourceType === ResourcesNames.activities
      ),
    [resources]
  );
  const storiesResources = useMemo(
    () =>
      resources?.filter(
        (item) => item?.resourceType === ResourcesNames.stories
      ),
    [resources]
  );
  const teachingTipssResources = useMemo(
    () =>
      resources?.filter(
        (item) => item?.resourceType === ResourcesNames.teachingTips
      ),
    [resources]
  );
  const otherResources = useMemo(
    () =>
      resources?.filter((item) => item?.resourceType === ResourcesNames.other),
    [resources]
  );

  const handleGetResourcesLikedByUser = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.allResourceLikesForUser(user?.id!);

    if (response) {
      setResourcesLikedByUser(response);
    }
  }, [user?.id, userAuth?.auth_token]);

  const handleGetResourcesQueries = useCallback(async () => {
    if (isOnline) {
      setIsLoading(true);
      await handleGetResourcesLikedByUser();
      setIsLoading(false);
    }
  }, [handleGetResourcesLikedByUser, isOnline]);

  useEffect(() => {
    handleGetResourcesQueries();
  }, []);

  const handleOpenResources = useCallback(() => {
    setViewAllResources(true);
  }, []);

  const resourceItems: StackedListItemType[] = [];

  if (activitiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.activities,
      titleIcon: ResourcesIcons.activities,
      titleIconClassName: 'bg-quatenary text-white',
      classNames: 'bg-quatenaryBg',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.activities);
        handleOpenResources();
      },
    });
  }

  if (storiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.stories,
      titleIcon: ResourcesIcons.stories,
      titleIconClassName: 'bg-secondary text-white',
      classNames: 'bg-secondaryAccent2',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.stories);
        handleOpenResources();
      },
    });
  }

  if (teachingTipssResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.teachingTips,
      titleIcon: ResourcesIcons.teachingTips,
      titleIconClassName: 'bg-warning text-white',
      classNames: 'bg-warningBg',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.teachingTips);
        handleOpenResources();
      },
    });
  }

  if (otherResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.other,
      titleIcon: ResourcesIcons.other,
      titleIconClassName: 'bg-successMain text-white',
      classNames: 'bg-successBg',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.other);
        handleOpenResources();
      },
    });
  }

  useEffect(() => {
    if (!isOnline) {
      setIsLoading(false);
      openOfflineDialog();
    }
  }, [isOnline]);

  // Use useCallback to avoid re-renders
  const openOfflineDialog = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => (
        <OnlineOnlyModal
          onSubmit={() => {
            history.replace(ROUTES.CLASSROOM.ROOT, {
              activeTabIndex: TabsItems.CLASSES,
            });
            onSubmit();
          }}
        />
      ),
    });
  }, [dialog, history.push]);

  const hasResources = resourceItems?.length > 0;

  return (
    <div className="p-4">
      {isLoading ? (
        <LoadingSpinner
          className="mt-6"
          size="medium"
          spinnerColor="quatenary"
          backgroundColor="uiBg"
        />
      ) : hasResources ? (
        <div>
          <Typography
            type="h2"
            weight="bold"
            color="textDark"
            text="What type of resource would you like to see?"
          />
          <StackedList
            className="my-4 flex w-full flex-col gap-1 rounded-2xl"
            type="TitleList"
            listItems={resourceItems}
          />
        </div>
      ) : isOnline ? (
        <ComingSoon />
      ) : null}

      {hasResources && (
        <Button
          onClick={() => setViewAllResources(true)}
          className="mt-12 w-full rounded-2xl"
          size="normal"
          color="quatenary"
          textColor="white"
          type="filled"
          icon="EyeIcon"
          text="See all classroom resources"
        />
      )}

      <Dialog
        stretch
        fullScreen
        visible={viewAllResources}
        position={DialogPosition.Full}
      >
        <AllResources
          resources={resources}
          setViewAllResources={setViewAllResources}
          setResourceTypeItem={setResourceTypeItem}
          resourceTypeItem={resourceTypeItem}
          resourcesLikedByUser={resourcesLikedByUser}
          handleGetResourcesQueries={handleGetResourcesQueries}
        />
      </Dialog>
    </div>
  );
};
