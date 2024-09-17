import {
  Button,
  Dialog,
  DialogPosition,
  StackedList,
  StackedListItemType,
  Typography,
} from '@ecdlink/ui';
import { ResourcesIcons, ResourcesNames } from './resources.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResourcesService } from '@/services/Resources';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { AllResources } from './all-resources/all-resources';

export const Resources = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [locale, setLocale] = useState<string>(
    '9688cd08-adef-408c-9d34-5d75ae5c44df'
  );
  const [resources, setResources] = useState<any[]>([]);
  const [viewAllResources, setViewAllResources] = useState(false);
  console.log({ resources });
  console.log(ResourcesNames?.activities);
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

  console.log({ activitiesResources });
  console.log({ storiesResources });
  console.log({ teachingTipssResources });
  console.log({ otherResources });
  const handleGetResources = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.getResources(locale, 'classroom', '', [], [], null, null);
    console.log({ response });
    if (response) {
      setResources(response);
    }
  }, [locale, userAuth?.auth_token]);

  useEffect(() => {
    handleGetResources();
  }, []);

  const resourceItems: StackedListItemType[] = [];

  if (activitiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.activities,
      titleIcon: ResourcesIcons.activities,
      titleIconClassName: 'bg-quatenary text-white',
      classNames: 'bg-quatenaryBg',
      onActionClick: () => {},
    });
  }

  if (storiesResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.stories,
      titleIcon: ResourcesIcons.stories,
      titleIconClassName: 'bg-secondary text-white',
      classNames: 'bg-secondaryAccent2',
      onActionClick: () => {},
    });
  }

  if (teachingTipssResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.teachingTips,
      titleIcon: ResourcesIcons.teachingTips,
      titleIconClassName: 'bg-warning text-white',
      classNames: 'bg-warningBg',
      onActionClick: () => {},
    });
  }

  if (otherResources?.length > 0) {
    resourceItems?.push({
      title: ResourcesNames.other,
      titleIcon: ResourcesIcons.other,
      titleIconClassName: 'bg-successMain text-white',
      classNames: 'bg-successBg',
      onActionClick: () => {},
    });
  }
  return (
    <div className="p-4">
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
      <Button
        onClick={() => setViewAllResources(true)}
        className="mt-12 w-full rounded-2xl"
        size="normal"
        color="quatenary"
        textColor="white"
        type="filled"
        icon={'EyeIcon'}
        text={'See all classroom resources'}
      />
      <Dialog
        stretch
        fullScreen
        visible={viewAllResources}
        position={DialogPosition.Full}
      >
        <AllResources
          resources={resources}
          setViewAllResources={setViewAllResources}
        />
      </Dialog>
    </div>
  );
};
