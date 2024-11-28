import { useAppDispatch } from '@/store';
import { communityThunkActions } from '@/store/community';
import { getAllConnectItem } from '@/store/community/community.actions';
import { ConnectItem } from '@ecdlink/graphql';
import {
  Divider,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { UsersIcon } from '@heroicons/react/solid';
import { useCallback, useEffect, useState } from 'react';

export const CommunityLinks = () => {
  const dispatch = useAppDispatch();
  const [communityLinks, setCommunityLinks] = useState<ConnectItem[]>();
  const [isLoading, setIsLoading] = useState(false);
  const listItems: MenuListDataItem[] = [];

  const getCommunityLinks = useCallback(async () => {
    setIsLoading(true);
    const response = await dispatch(
      communityThunkActions?.getAllConnectItem({
        locale: '9688cd08-adef-408c-9d34-5d75ae5c44df',
      })
    );
    setIsLoading(false);
    if (response) {
      setCommunityLinks(response?.payload as ConnectItem[]);
    }
  }, [dispatch]);

  useEffect(() => {
    getCommunityLinks();
  }, []);

  if (communityLinks && communityLinks?.length > 0) {
    communityLinks
      ?.filter((item) => item?.buttonText)
      ?.map((item) => {
        listItems?.push({
          title: item?.buttonText!,
          titleStyle: 'text-textDark font-semibold text-base leading-snug',
          showIcon: false,
          rightIcon: 'ExternalLinkIcon',
          rightIconClassName: 'text-textMid w-6 h-6',
          onActionClick: () => {
            window.open(item?.link!);
          },
        });
      });
  }

  const isComingSoon = false;

  if (isComingSoon) {
    return (
      <div className="mt-2 flex flex-col p-4">
        <Typography color="textDark" text={`Coming soon`} type={'h2'} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="quatenary"
        backgroundColor="uiLight"
        className="my-24"
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <UsersIcon className="bg-secondary h-12 w-12 rounded-full p-3 text-white" />
        <Typography type="h2" color="textDark" text={`Connect`} />
      </div>
      <Divider dividerType="dashed" className="my-3" />
      <StackedList
        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
        type="MenuList"
        listItems={listItems}
      />
    </div>
  );
};
