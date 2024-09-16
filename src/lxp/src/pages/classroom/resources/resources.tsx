import {
  Button,
  StackedList,
  StackedListItemType,
  Typography,
} from '@ecdlink/ui';
import { ResourcesIcons, ResourcesNames } from './resources.types';
import { useCallback, useEffect, useState } from 'react';
import { ResourcesService } from '@/services/Resources';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';

export const Resources = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [locale, setLocale] = useState<string>(
    '9688cd08-adef-408c-9d34-5d75ae5c44df'
  );
  const handleGetResources = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.getResources(locale);
  }, [locale, userAuth?.auth_token]);

  useEffect(() => {
    handleGetResources();
  }, []);

  const resourceItems: StackedListItemType[] = [
    {
      title: ResourcesNames.activities,
      titleIcon: ResourcesIcons.activities,
      titleIconClassName: 'bg-quatenary text-white',
      classNames: 'bg-quatenaryBg',
      onActionClick: () => {},
    },
    {
      title: ResourcesNames.stories,
      titleIcon: ResourcesIcons.stories,
      titleIconClassName: 'bg-secondary text-white',
      classNames: 'bg-secondaryAccent2',
      onActionClick: () => {},
    },
    {
      title: ResourcesNames.teachingTips,
      titleIcon: ResourcesIcons.teachingTips,
      titleIconClassName: 'bg-warning text-white',
      classNames: 'bg-warningBg',
      onActionClick: () => {},
    },
    {
      title: ResourcesNames.other,
      titleIcon: ResourcesIcons.other,
      titleIconClassName: 'bg-successMain text-white',
      classNames: 'bg-successBg',
      onActionClick: () => {},
    },
  ];
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
        onClick={() => {}}
        className="mt-12 w-full rounded-2xl"
        size="small"
        color="quatenary"
        textColor="white"
        type="filled"
        icon={'EyeIcon'}
        text={'See all classroom resources'}
      />
    </div>
  );
};
