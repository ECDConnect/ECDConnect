import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  DialogPosition,
  MenuListDataItem,
  SearchDropDown,
  SearchDropDownOption,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { useEffect, useMemo, useState } from 'react';
import { ResourceItem } from '../resource-item/resource-item';
import { useDialog } from '@ecdlink/core';
import SearchHeader, {
  SearchHeaderAlternativeRenderItem,
} from '@/components/search-header/search-header';
import {
  DataType,
  DataSortFilterOption,
  ResourcesNames,
  LikedFilterOption,
} from '../resources.types';

interface AllResourcesprops {
  resources: any[];
  resourcesLikedByUser?: any[];
  setViewAllResources: (item: boolean) => void;
  setResourceTypeItem?: (item: string) => void;
  resourceTypeItem?: string;
  handleGetResourcesQueries: any;
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

const SortByTypeOfData: SearchDropDownOption<string>[] = [
  DataType?.dataFree,
  DataType?.notDataFree,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

const SortByFilterOption: SearchDropDownOption<string>[] = [
  DataSortFilterOption?.mostLiked,
  DataSortFilterOption?.newest,
  DataSortFilterOption?.oldest,
  DataSortFilterOption?.title,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

const FilterByUserLiked: SearchDropDownOption<string>[] = [
  LikedFilterOption?.liked,
  LikedFilterOption?.notLiked,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const AllResources: React.FC<AllResourcesprops> = ({
  resources,
  resourcesLikedByUser,
  setViewAllResources,
  setResourceTypeItem,
  resourceTypeItem,
  handleGetResourcesQueries,
}) => {
  const { isOnline } = useOnlineStatus();
  const listItems: MenuListDataItem[] = [];
  const [resourcesListFormatted, setResourcesListFormatted] = useState<any[]>();
  const [resourcesTypesFilter, setResourcesTypesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [likedByUserFilter, setLikedByUserFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const likedByUserFormatted = useMemo(
    () => likedByUserFilter?.map((item) => item?.id),
    [likedByUserFilter]
  );

  const resourcesLiked = resources?.filter((item1) =>
    resourcesLikedByUser?.find((item2) => item1.id === item2.contentId)
  );
  const resourcesNotLiked = resources?.filter(
    (item1) =>
      !resourcesLikedByUser?.find((item2) => item1.id === item2.contentId)
  );

  const filteredByUserLiked = useMemo(() => {
    if (
      likedByUserFormatted?.find((item) => item === LikedFilterOption.liked) &&
      likedByUserFormatted?.find((item) => item === LikedFilterOption.notLiked)
    ) {
      return resources;
    }
    if (
      likedByUserFormatted?.find((item) => item === LikedFilterOption.liked)
    ) {
      return resourcesLiked;
    }

    if (
      likedByUserFormatted?.find((item) => item === LikedFilterOption.notLiked)
    ) {
      return resourcesNotLiked;
    }

    return resources;
  }, [likedByUserFormatted, resources]);

  const filteredByType = useMemo(
    () =>
      filteredByUserLiked?.length > 0
        ? filteredByUserLiked?.filter(
            (item) => item?.resourceType === resourceTypeItem
          )
        : resources?.filter((item) => item?.resourceType === resourceTypeItem),
    [filteredByUserLiked, resourceTypeItem, resources]
  );

  const resourcesSorted = useMemo(
    () =>
      resourceTypeItem
        ? filteredByType?.sort((a, b) =>
            Number(a.numberLikes) > Number(b.numberLikes)
              ? -1
              : Number(a.numberLikes) < Number(b.numberLikes)
              ? 1
              : 0
          )
        : filteredByUserLiked?.length > 0
        ? filteredByUserLiked?.sort((a, b) =>
            Number(a.numberLikes) > Number(b.numberLikes)
              ? -1
              : Number(a.numberLikes) < Number(b.numberLikes)
              ? 1
              : 0
          )
        : resources?.sort((a, b) =>
            Number(a.numberLikes) > Number(b.numberLikes)
              ? -1
              : Number(a.numberLikes) < Number(b.numberLikes)
              ? 1
              : 0
          ),
    [filteredByType, filteredByUserLiked, resourceTypeItem, resources]
  );

  const [resourcesData, setResourcesData] = useState(resourcesSorted);

  const [dataTypeFilter, setDataTypeFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [sortOptionFilter, setsortOptionFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const activitiesFormatted = useMemo(
    () => resourcesTypesFilter?.map((item) => item?.id),
    [resourcesTypesFilter]
  );
  const dataTypesFormatted = useMemo(
    () => dataTypeFilter?.map((item) => item?.id),
    [dataTypeFilter]
  );
  const filterByFormatted = useMemo(
    () => sortOptionFilter?.map((item) => item?.id),
    [sortOptionFilter]
  );

  const [searchTextActive, setSearchTextActive] = useState(false);
  const [resourcesIndex, setResourcesIndex] = useState(
    resources?.length < 5 ? resources?.length : 5
  );
  const dialog = useDialog();

  if (resourcesData) {
    (activitiesFormatted?.length > 0 || dataTypesFormatted?.length > 0
      ? resourcesListFormatted
      : resourcesData
    )
      ?.slice(0, resourcesIndex)
      ?.map((item) => {
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
                <ResourceItem
                  resource={item}
                  onClose={onClose}
                  handleGetResourcesQueries={handleGetResourcesQueries}
                />
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
              <div className="text-white">
                {item?.numberLikes ? item?.numberLikes : 0}
              </div>
            </div>
          ),
        });
      });
  }

  const onSearchChange = (value: string) => {
    setResourcesListFormatted(
      resourcesData?.filter((x) =>
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
                <ResourceItem
                  resource={item}
                  onClose={onClose}
                  handleGetResourcesQueries={handleGetResourcesQueries}
                />
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

  const filteredDataByActivity = useMemo(
    () =>
      resourcesData.filter((resource) =>
        activitiesFormatted.includes(resource.resourceType)
      ),
    [activitiesFormatted, resourcesData]
  );
  const filteredDataByDataType = useMemo(() => {
    if (!dataTypesFormatted?.find((item) => item === DataType?.dataFree)) {
      return resourcesData?.filter(
        (item) => item?.dataFree === 'false' || item?.dataFree === false
      );
    } else if (
      !dataTypesFormatted?.find((item) => item === DataType?.notDataFree)
    ) {
      return resourcesData?.filter(
        (item) => item?.dataFree === 'true' || item?.dataFree === true
      );
    } else return resourcesData;
  }, [dataTypesFormatted, resourcesData]);

  useEffect(() => {
    if (filterByFormatted?.length) {
      const sortedBy = filterByFormatted?.find((item) => item);

      if (sortedBy === DataSortFilterOption?.mostLiked) {
        if (activitiesFormatted?.length > 0 || dataTypesFormatted?.length > 0) {
          const sorted = resourcesListFormatted?.sort((a, b) =>
            Number(a.numberLikes) > Number(b.numberLikes)
              ? -1
              : Number(a.numberLikes) < Number(b.numberLikes)
              ? 1
              : 0
          );
          setResourcesListFormatted(sorted);
        } else {
          const sorted = resourcesData?.sort((a, b) =>
            Number(a.numberLikes) > Number(b.numberLikes)
              ? -1
              : Number(a.numberLikes) < Number(b.numberLikes)
              ? 1
              : 0
          );
          setResourcesData(sorted);
        }
      }

      if (sortedBy === DataSortFilterOption?.newest) {
        if (activitiesFormatted?.length > 0 || dataTypesFormatted?.length > 0) {
          const sorted = resourcesListFormatted?.sort((a, b) =>
            new Date(a.insertedDate) > new Date(b.insertedDate)
              ? -1
              : new Date(a.insertedDate) < new Date(b.insertedDate)
              ? 1
              : 0
          );
          setResourcesListFormatted(sorted);
        } else {
          const sorted = resourcesData?.sort((a, b) =>
            new Date(a.insertedDate) > new Date(b.insertedDate)
              ? -1
              : new Date(a.insertedDate) < new Date(b.insertedDate)
              ? 1
              : 0
          );
          setResourcesData(sorted);
        }
      }

      if (sortedBy === DataSortFilterOption?.oldest) {
        if (activitiesFormatted?.length > 0 || dataTypesFormatted?.length > 0) {
          const sorted = resourcesListFormatted?.sort((a, b) =>
            new Date(a.insertedDate) < new Date(b.insertedDate)
              ? -1
              : new Date(a.insertedDate) > new Date(b.insertedDate)
              ? 1
              : 0
          );
          setResourcesListFormatted(sorted);
        } else {
          const sorted = resourcesData?.sort((a, b) =>
            new Date(a.insertedDate) < new Date(b.insertedDate)
              ? -1
              : new Date(a.insertedDate) > new Date(b.insertedDate)
              ? 1
              : 0
          );
          setResourcesData(sorted);
        }
      }
      if (sortedBy === DataSortFilterOption?.title) {
        if (activitiesFormatted?.length > 0 || dataTypesFormatted?.length > 0) {
          const sorted = resourcesListFormatted?.sort((a, b) =>
            a.title < b.title ? -1 : a.title > b.title ? 1 : 0
          );
          setResourcesListFormatted(sorted);
        } else {
          const sorted = resourcesData?.sort((a, b) =>
            new Date(a.title) < new Date(b.title)
              ? -1
              : new Date(a.title) > new Date(b.title)
              ? 1
              : 0
          );
          setResourcesData(sorted);
        }
      }
    } else {
      setResourcesData(resourcesSorted);
    }
  }, [
    activitiesFormatted?.length,
    dataTypesFormatted?.length,
    filterByFormatted,
    resourcesListFormatted,
    resourcesData,
    resourcesSorted,
  ]);

  useEffect(() => {
    if (resourcesTypesFilter?.length > 0) {
      setResourcesListFormatted(filteredDataByActivity);
    }

    if (dataTypeFilter?.length > 0) {
      setResourcesListFormatted(filteredDataByDataType);
    }

    if (resourcesTypesFilter?.length > 0 && dataTypeFilter?.length > 0) {
      const filteredItems = filteredDataByActivity?.filter((x) =>
        filteredDataByDataType?.some((y) => y.id === x.id)
      );
      setResourcesListFormatted(filteredItems);
    }
  }, [
    dataTypeFilter,
    filteredDataByActivity,
    filteredDataByDataType,
    resourcesTypesFilter,
  ]);

  return (
    <BannerWrapper
      size="small"
      onBack={() => {
        setResourceTypeItem && setResourceTypeItem('');
        setViewAllResources(false);
      }}
      color="primary"
      className={'h-full'}
      title={resourceTypeItem || `Classroom resources`}
      subTitle={resourceTypeItem ? `Classroom resources` : ''}
      displayOffline={!isOnline}
      onClose={() => {
        setResourceTypeItem && setResourceTypeItem('');
        setViewAllResources(false);
      }}
    >
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
          {!resourceTypeItem && (
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
              placeholder={'Type'}
              info={{
                name: `Filter by: Type`,
              }}
              multiple={true}
              color={'quatenary'}
              preventCloseOnClick={true}
            />
          )}
          <SearchDropDown<string>
            displayMenuOverlay={true}
            className={'mr-1'}
            menuItemClassName={
              'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
            }
            overlayTopOffset={'3'}
            options={SortByTypeOfData}
            selectedOptions={dataTypeFilter}
            onChange={setDataTypeFilter}
            placeholder={'Data free'}
            info={{
              name: `Filter by: Data Free`,
            }}
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
            overlayTopOffset={'3'}
            options={FilterByUserLiked}
            selectedOptions={likedByUserFilter}
            onChange={setLikedByUserFilter}
            placeholder={'Liked'}
            info={{
              name: `Filter by: Your liked resources`,
            }}
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
            overlayTopOffset={'3'}
            options={SortByFilterOption}
            selectedOptions={sortOptionFilter}
            onChange={setsortOptionFilter}
            placeholder={'Sort'}
            info={{
              name: `Sort by:`,
            }}
            multiple={false}
            color={'quatenary'}
            preventCloseOnClick={true}
          />
        </SearchHeader>
      )}
      <div className="p-4">
        <Typography
          type={'h2'}
          text={resourceTypeItem}
          color={'textDark'}
          className="my-4"
        />
        <StackedList
          className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
          type="MenuList"
          listItems={listItems}
        />
        {resourcesIndex < resourcesData.length! && (
          <Button
            onClick={() =>
              resourcesIndex < resourcesData.length!
                ? setResourcesIndex(
                    resourcesIndex < resourcesData.length!
                      ? resourcesIndex + resourcesData.length! - resourcesIndex
                      : resourcesIndex + 5
                  )
                : {}
            }
            className="my-8 w-full rounded-2xl"
            size="normal"
            color="quatenary"
            textColor="quatenary"
            type="outlined"
            icon={'EyeIcon'}
            text={'See more resources'}
            disabled={resourcesIndex === resourcesData.length!}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
