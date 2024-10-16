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
import { ComingSoon } from '../coming-soon/coming-soon';

export const Resources = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const [locale, setLocale] = useState<string>(
    '9688cd08-adef-408c-9d34-5d75ae5c44df'
  );
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLikedByUser, setResourcesLikedByUser] = useState<any[]>([]);
  const [viewAllResources, setViewAllResources] = useState(false);
  const [resourceTypeItem, setResourceTypeItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activitiesResources = useMemo(
    () =>
      resources?.filter(
        (item) => item?.resourceType === ResourcesNames.financial
      ),
    [resources]
  );
  const storiesResources = useMemo(
    () =>
      resources?.filter(
        (item) => item?.resourceType === ResourcesNames.administration
      ),
    [resources]
  );
  const teachingTipssResources = useMemo(
    () =>
      resources?.filter((item) => item?.resourceType === ResourcesNames.dbe),
    [resources]
  );
  const otherResources = useMemo(
    () =>
      resources?.filter((item) => item?.resourceType === ResourcesNames.other),
    [resources]
  );

  const handleGetResources = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.getResources(locale, 'business', '', [], [], null, null);

    if (response) {
      setResources(response);
    }
  }, [locale, userAuth?.auth_token]);

  const handleGetResourcesLikedByUser = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.allResourceLikesForUser(user?.id!);

    if (response) {
      setResourcesLikedByUser(response);
    }
  }, [user?.id, userAuth?.auth_token]);

  const handleGetResourcesQueries = useCallback(async () => {
    setIsLoading(true);
    await handleGetResources();
    await handleGetResourcesLikedByUser();
    setIsLoading(false);
  }, [handleGetResources, handleGetResourcesLikedByUser]);

  useEffect(() => {
    handleGetResourcesQueries();
  }, []);

  const handleOpenResources = useCallback(() => {
    setViewAllResources(true);
  }, []);

  const resourceItems: StackedListItemType[] = [];

  if (activitiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.financial,
      titleIcon: ResourcesIcons.financial,
      titleIconClassName: 'bg-quatenary text-white',
      classNames: 'bg-quatenaryBg',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.financial);
        handleOpenResources();
      },
    });
  }

  if (storiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.administration,
      titleIcon: ResourcesIcons.administration,
      titleIconClassName: 'bg-secondary text-white',
      classNames: 'bg-secondaryAccent2',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.administration);
        handleOpenResources();
      },
    });
  }

  if (teachingTipssResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.dbe,
      titleIcon: ResourcesIcons.dbe,
      titleIconClassName: 'bg-warning text-white',
      classNames: 'bg-warningBg',
      onActionClick: () => {
        setResourceTypeItem(ResourcesNames.dbe);
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

  const isComingSoon = false;

  if (isComingSoon) {
    return <Typography color="textDark" text={`Coming soon`} type={'h2'} />;
  }

  return (
    <div className="p-4">
      {isLoading ? (
        <LoadingSpinner
          className="mt-6"
          size={'medium'}
          spinnerColor={'quatenary'}
          backgroundColor={'uiBg'}
        />
      ) : resourceItems && resourceItems?.length > 0 ? (
        <div>
          <Typography
            type="h2"
            weight="bold"
            color="textDark"
            text={`What type of resource would you like to see?`}
          />
          <StackedList
            className="my-4 flex w-full flex-col gap-1 rounded-2xl"
            type="TitleList"
            listItems={resourceItems}
          />
        </div>
      ) : (
        <ComingSoon />
      )}
      {resourceItems && resourceItems?.length > 0 && (
        <Button
          onClick={() => setViewAllResources(true)}
          className="mt-12 w-full rounded-2xl"
          size="normal"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'EyeIcon'}
          text={'See all business resources'}
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
