import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  DialogPosition,
  MenuListDataItem,
  SearchDropDown,
  SearchDropDownOption,
  StackedList,
} from '@ecdlink/ui';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { useEffect, useMemo, useState } from 'react';
import { ResourceItem } from '../resource-item/resource-item';
import { useDialog } from '@ecdlink/core';
import SearchHeader, {
  SearchHeaderAlternativeRenderItem,
} from '@/components/search-header/search-header';
import { ResourcesNames } from '../resources.types';
import { filterActivitiesByType } from '@/utils/classroom/programme-planning/activity-search.utils';

interface AllResourcesprops {
  resources: any[];
  setViewAllResources: (item: boolean) => void;
}

const SortByResourcesTypes: SearchDropDownOption<string>[] = [
  ResourcesNames?.activities,
  ResourcesNames?.stories,
  ResourcesNames?.teachingTips,
  ResourcesNames?.other,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const AllResources: React.FC<AllResourcesprops> = ({
  resources,
  setViewAllResources,
}) => {
  const { isOnline } = useOnlineStatus();
  const listItems: MenuListDataItem[] = [];
  const [resourcesListFormatted, setResourcesListFormatted] =
    useState<MenuListDataItem[]>();
  const [resourcesTypesFilter, setResourcesTypesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const activitiesFormatted = useMemo(
    () => resourcesTypesFilter?.map((item) => item?.id),
    [resourcesTypesFilter]
  );
  const [searchTextActive, setSearchTextActive] = useState(false);
  const [resourcesIndex, setResourcesIndex] = useState(
    resources?.length < 5 ? resources?.length : 5
  );
  const dialog = useDialog();

  const resourcesSorted = useMemo(
    () =>
      resources?.sort((a, b) =>
        Number(a.numberLikes) > Number(b.numberLikes)
          ? -1
          : Number(a.numberLikes) < Number(b.numberLikes)
          ? 1
          : 0
      ),
    [resources]
  );

  if (resourcesSorted) {
    resourcesSorted?.slice(0, resourcesIndex)?.map((item) => {
      listItems?.push({
        title: item?.title,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: item?.shortDescription,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        showIcon: false,
        onActionClick: () => {
          dialog({
            position: DialogPosition.Full,
            render: (onClose) => (
              <ResourceItem resource={item} onClose={onClose} />
            ),
          });
        },
        likesItem: (
          <div
            className={`${
              Number(item?.numberLikes) > 0 ? 'bg-successMain' : 'bg-infoMain'
            } full mr-4 flex items-center gap-2 rounded-full px-3 py-1`}
          >
            <ThumbUpIcon className="h-6 w-6 text-white" />
            <div>{item?.numberLikes ? item?.numberLikes : 0}</div>
          </div>
        ),
      });
    });
  }

  const onSearchChange = (value: string) => {
    setResourcesListFormatted(
      resourcesSorted?.filter((x) =>
        x?.title?.toLowerCase()?.includes(value?.toLowerCase())
      ) || []
    );
  };

  const alternativeSearchItems: SearchHeaderAlternativeRenderItem<any> = {
    render: (item) => {
      const searchList = [
        {
          title: item?.title,
          titleStyle: 'text-textDark font-semibold text-base leading-snug',
          subTitle: item?.shortDescription,
          subTitleStyle:
            'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
          showIcon: false,
          onActionClick: () => {
            dialog({
              position: DialogPosition.Full,
              render: (onClose) => (
                <ResourceItem resource={item} onClose={onClose} />
              ),
            });
          },
          likesItem: (
            <div
              className={`${
                Number(item?.numberLikes) > 0 ? 'bg-successMain' : 'bg-infoMain'
              } mr-4 flex items-center gap-2 rounded-full px-3 py-1`}
            >
              <ThumbUpIcon className="h-6 w-6 text-white" />
              <div>{item?.numberLikes ? item?.numberLikes : 0}</div>
            </div>
          ),
        },
      ];

      return (
        <StackedList
          className="-mt-0.5 flex h-12 w-full flex-col gap-1 rounded-2xl"
          type="MenuList"
          listItems={searchList}
        />
      );
    },
  };

  console.log({ resourcesTypesFilter });
  const filteredData = resourcesSorted.filter((resource) =>
    activitiesFormatted.includes(resource.resourceType)
  );
  console.log({ filteredData });

  useEffect(() => {
    if (resourcesTypesFilter) {
      setResourcesListFormatted(filteredData);
    }
  }, []);

  return (
    <div>
      <BannerWrapper
        size="small"
        onBack={() => setViewAllResources(false)}
        color="primary"
        className={'h-full'}
        title={`Classroom resources`}
        displayOffline={!isOnline}
        onClose={() => setViewAllResources(false)}
      />
      {resources && resources.length > 0 && (
        <SearchHeader<MenuListDataItem>
          searchItems={resourcesListFormatted || []}
          //   onScroll={handleListScroll}
          onSearchChange={onSearchChange}
          isTextSearchActive={searchTextActive}
          onBack={() => setSearchTextActive(false)}
          onSearchButtonClick={() => setSearchTextActive(true)}
          alternativeSearchItemRender={
            searchTextActive ? alternativeSearchItems : undefined
          }
        >
          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1'}
            menuItemClassName={
              'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
            }
            overlayTopOffset={'3'}
            options={SortByResourcesTypes}
            selectedOptions={resourcesTypesFilter}
            onChange={setResourcesTypesFilter}
            placeholder={'Activities'}
            multiple={true}
            color={'quatenary'}
            preventCloseOnClick={true}
          />
        </SearchHeader>
      )}
      <div className="p-4">
        <StackedList
          className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
          type="MenuList"
          listItems={listItems}
        />
        <Button
          onClick={() =>
            resourcesIndex < resourcesSorted.length!
              ? setResourcesIndex(
                  resourcesIndex < resourcesSorted.length!
                    ? resourcesIndex + resourcesSorted.length! - resourcesIndex
                    : resourcesIndex + 5
                )
              : {}
          }
          className="mt-12 w-full rounded-2xl"
          size="normal"
          color="quatenary"
          textColor="quatenary"
          type="outlined"
          icon={'EyeIcon'}
          text={'See more resources'}
          disabled={resourcesIndex === resourcesSorted.length!}
        />
      </div>
    </div>
  );
};
