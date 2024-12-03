/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useLazyQuery, gql, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  NOTIFICATION,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogPosition, SearchDropDownOption, Table } from '@ecdlink/ui';
import { format } from 'date-fns';
import {
  ContentManagementView,
  FieldType,
} from '../../../../content-management-models';
// import { useResources } from '../../../../../../hooks/useResources';
import { LanguageId } from '../../../../../../constants/language';
import { ContentTypes } from '../../../../../../constants/content-management';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import { DeleteMultipleActivities, GetActivityRecords } from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import { ActivityTypeOptions, ActivityShareOptions } from './activity.types';

export interface ActivityListProps {
  selectedTab?: number;
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  languages: LanguageDto[];
  viewContent: (content?: ContentManagementView) => void;
  refreshParent: () => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  choosedSectionTitle?: string;
  specialType?: string;
  setSelectedType?: (item: ContentTypeDto) => void;
  dataTypes?: any;
}

export const sortByTypeOptions: SearchDropDownOption<string>[] = [
  ActivityTypeOptions?.StoryBook,
  ActivityTypeOptions?.ReadAloud,
  ActivityTypeOptions?.Other,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const sortByShareOptions: SearchDropDownOption<string>[] = [
  ActivityShareOptions?.Yes,
  ActivityShareOptions?.No,
  ActivityShareOptions?.NA,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ActivityList({
  selectedTab,
  contentType,
  languages,
  viewContent,
  refreshParent,
  onSearch,
  choosedSectionTitle,
  setSelectedType,
  dataTypes,
}: ActivityListProps) {
  const sortByLanguageOptions: SearchDropDownOption<string>[] = languages?.map(
    (item) => ({
      id: item?.id,
      label: item?.description,
      value: item?.id,
    })
  );

  console.log('choosedSectionTitle', choosedSectionTitle);

  const [sortByThemeOptions, setSortByThemeOptions] = useState<any[]>([]);

  const getAllTheme = `GetAllTheme`;
  const query = gql` 
    query ${getAllTheme} ($localeId: String) {
      ${getAllTheme} (localeId: $localeId) {
        id
        name
        }
      }
  `;

  const { data: themeData } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  useEffect(() => {
    if (themeData && themeData.GetAllTheme) {
      setSortByThemeOptions(themeData.getAllTheme);
    }
  }, [themeData]);

  console.log('themeData', themeData);

  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();

  // Filter options
  // ---------
  const [typesFilter, setTypesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredTypes = useMemo(
    () => typesFilter?.map((item) => item?.value),
    [typesFilter]
  );
  // ---------
  const [themesFilter, setThemesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredThemes = useMemo(
    () => themesFilter?.map((item) => item?.value),
    [themesFilter]
  );
  // ---------
  const [shareFilter, setShareFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredShare = useMemo(
    () => shareFilter?.map((item) => item?.value),
    [shareFilter]
  );
  // ---------
  const [languageFilter, setLanguageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredLanguage = useMemo(
    () => languageFilter?.map((item) => item?.value),
    [languageFilter]
  );

  const [filterDateAdded, setFilterDateAdded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setFilterDateAdded((prevState) => !prevState);
    }
  };

  const dateDropdownValue = useMemo(
    () =>
      startDate && endDate
        ? `${format(startDate, 'd MMM yy')} - ${format(endDate, 'd MMM yy')}`
        : '',
    [endDate, startDate]
  );

  const filterByValue = useCallback((array, value) => {
    return array?.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }, []);

  useEffect(() => {
    if (contentType && contentType.fields) {
      const displayFields: ContentTypeFieldDto[] = [];

      const copy: ContentTypeFieldDto[] = Object.assign([], contentType.fields);

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((x) => {
        if (
          ((x.fieldType.dataType === FieldType.Text ||
            x.fieldType.dataType === FieldType.Link ||
            x.fieldType.dataType === FieldType.DatePicker) &&
            !!x.displayMainTable) ||
          !!x.displayMainTable
        )
          displayFields.push(x);
      });

      if (contentType.name === ContentTypes.ACTIVITY) {
        const resourceFields = displayFields?.filter(
          (item) =>
            item?.fieldName === 'name' ||
            item?.fieldName === 'subType' ||
            item?.fieldName === 'themes' ||
            item?.fieldName === 'languages' ||
            item?.fieldName === 'updatedDate'
        );

        const resourceItems = resourceFields
          .map((item: any) => ({
            ...item,
            displayName:
              item.fieldName === 'name'
                ? 'Activity title'
                : item.fieldName === 'subType'
                ? 'For story type(s)'
                : item.displayName,
            fieldOrder:
              item.fieldName === 'name'
                ? 1
                : item.fieldName === 'subType'
                ? 2
                : item.fieldName === 'themes'
                ? 3
                : item.fieldName === 'languages'
                ? 4
                : item.fieldName === 'updatedDate'
                ? 4
                : item.fieldOrder,
          }))
          .sort(function (a, b) {
            return a.fieldOrder - b.fieldOrder;
          });

        setDisplayFields(resourceItems);
        return;
      }

      setDisplayFields(displayFields);
    }
  }, [choosedSectionTitle, contentType]);

  const queryVariables = useMemo(
    () => ({
      isStoryActivity: choosedSectionTitle === 'Story activities',
      search: '',
      typesSearch: filteredTypes,
      themesSearch: filteredThemes,
      languageSearch: filteredLanguage,
      startDate: startDate === '' ? null : startDate,
      endDate: endDate === '' ? null : endDate,
      shareContent: filteredShare,
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
    }),
    [
      choosedSectionTitle,
      filteredTypes,
      filteredThemes,
      filteredLanguage,
      startDate,
      endDate,
      filteredShare,
    ]
  );

  const [
    fetchActivities,
    { data: activityData, refetch: refetchContent, loading: loadingContent },
  ] = useLazyQuery(GetActivityRecords, {
    fetchPolicy: 'network-only',
    variables: queryVariables,
  });

  useEffect(() => {
    if (activityData && activityData.activityRecords) {
      const copyItems = activityData.activityRecords.map((item: any) => ({
        ...item,
      }));

      setTableData(copyItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityData, selectedTab]);

  useEffect(() => {
    if (languages) {
      const defaultLanguage = languages.find((x) => x.locale === 'en-za');
      setLanguageId(defaultLanguage.id);

      refetchContent({
        localeId: defaultLanguage.id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  const viewSelectedRow = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };

    if (item) {
      const itemLanguages = item?.availableLanguages.map((item: any) => ({
        id: item,
        __typename: 'Language',
      }));

      const copyItem = {
        __typename: ContentTypes.ACTIVITY,
        id: +item.id,
        name: item.name,
        subType: item.subType,
        materials: item.materials,
        description: item.description,
        notes: item.notes,
        availableLanguages: itemLanguages,
        shareContent: item.shareContent,
        themes: item.themes,
      };

      model.content = copyItem;
    }
    viewContent(model);
  };

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const tableRef = useRef<TableRefMethods>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<Irow[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const inactiveActivities = selectedActivities?.filter(
    (item) => item?.isActive === false
  );

  const isAllInactive = selectedActivities.every(
    (obj) => obj?.isActive === false
  );

  const getChipColor = (type?: string) => {
    if (type) {
      switch (type) {
        case ActivityTypeOptions?.StoryBook:
          return 'bg-primary';
        case ActivityTypeOptions?.ReadAloud:
          return 'bg-secondary';
        default:
          return 'bg-infoMain';
      }
    } else {
      return 'bg-infoMain';
    }
  };

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: `activity_` + item?.id,
        name: item?.name,
        themes: item?.themes,
        updatedDate: item?.updatedDate
          ? format(new Date(item.updatedDate), 'dd/MM/yyyy')
          : '-',
        subTypeComponent: (
          <div className="ml-0 flex cursor-pointer items-center">
            <div
              key={`subType_` + item?.id}
              className={
                `${getChipColor(item?.subType)}` +
                ' m-1 rounded-full py-1 px-3 text-xs text-white'
              }
            >
              {item?.subType}
            </div>
          </div>
        ),
        languageComponent: (
          <div className="ml-0 flex cursor-pointer flex-row items-center">
            {item.availableLanguages?.map((item: any, index: number) => {
              const language = languages?.find(
                (language) =>
                  language?.id === item.availableLanguages?.id ||
                  language?.id === item
              );
              return (
                <div
                  key={`language_` + index}
                  className={' text-textMid m-1 rounded-full py-1 text-xs'}
                >
                  {index === item.availableLanguages?.length - 1
                    ? `${language?.locale}`
                    : `${language?.locale};`}
                </div>
              );
            })}
          </div>
        ),
      })
    ) ?? [];

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Activity title',
    },
    {
      field: 'typeComponent',
      use: 'For story type(s)',
    },
    {
      field: 'themes',
      use: 'Themes',
    },
    {
      field: 'languageComponent',
      use: 'Languages',
    },
    {
      field: 'updatedDate',
      use: 'Last updated',
    },
  ];

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setTypesFilter([]);
    setThemesFilter([]);
    setLanguageFilter([]);
    setShareFilter([]);
  };

  const isFilterActive =
    !!typesFilter?.length ||
    !!themesFilter?.length ||
    !!languageFilter?.length ||
    !!shareFilter?.length ||
    !!startDate ||
    !!endDate;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }
    return 'No entries found';
  }, [isFilterActive]);

  const [deactivateActivities, { loading: deactivating }] = useMutation(
    DeleteMultipleActivities,
    {
      variables: {
        contentIds: selectedActivities?.map((item) => item?.id),
      },
      fetchPolicy: 'network-only',
    }
  );

  const deactivateRecords = useCallback(() => {
    deactivateActivities({
      variables: {
        contentIds: selectedActivities?.map((item) => item?.id),
      },
    })
      .then((res) => {
        if (res.data?.deleteMultipleActivities?.success.length > 0) {
          setNotification({
            title: ` Successfully Deleted ${res.data?.deleteMultipleActivities?.success.length} Story books!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetchContent();
          setSelectedActivities([]);
          handleResetSelectedRows();
        }
        if (res.data?.deleteMultipleActivities?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deleted ${res.data?.deleteMultipleActivities?.failed.length} Story books!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedActivities([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to delete',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [
    deactivateActivities,
    refetchContent,
    selectedActivities,
    setNotification,
  ]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Are you sure you want to delete ${
            selectedActivities?.length - inactiveActivities?.length
          } items?`}
          message={`Practitioners will no longer have access to these activities.`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveActivities?.length > 0}
          alertMessage={`Note: ${inactiveActivities?.length} deleted.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedActivities([]);
            handleResetSelectedRows();
          }}
          onSubmit={() => {
            deactivateRecords();
            onClose();
          }}
        />
      ),
    });
  }, [
    deactivateRecords,
    dialog,
    inactiveActivities?.length,
    isAllInactive,
    selectedActivities?.length,
  ]);

  return (
    <>
      <div className=" h-full rounded-2xl ">
        <div className="rounded-xl bg-white ">
          <Table
            watchMode={true}
            ref={tableRef}
            rows={rows}
            columns={columns}
            onClearFilters={clearFilters}
            onChangeSelectedRows={setSelectedActivities}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || loadingContent,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={{
              text: 'Add activity',
              onClick: () => viewSelectedRow(),
              icon: 'PlusIcon',
            }}
            search={{
              placeholder: 'Search by title or content...',
              onChange: search,
            }}
            bulkActions={[
              {
                type: 'outlined',
                color: 'tertiary',
                textColor:
                  deactivating || isAllInactive ? 'uiLight' : 'tertiary',
                icon: 'TrashIcon',
                text: 'Delete',
                isLoading: deactivating,
                disabled: deactivating || isAllInactive,
                onClick: handleBulkDelete,
              },
            ]}
            filters={[
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByTypeOptions,
                selectedOptions: typesFilter,
                onChange: setTypesFilter,
                placeholder: 'Type',
                multiple: true,
                info: { name: 'Type :' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByThemeOptions,
                selectedOptions: themesFilter,
                onChange: setThemesFilter,
                placeholder: 'Theme',
                multiple: true,
                info: { name: 'Theme :' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByLanguageOptions,
                selectedOptions: languageFilter,
                onChange: setLanguageFilter,
                placeholder: 'Languages',
                multiple: true,
                info: { name: 'Languages :' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByShareOptions,
                selectedOptions: shareFilter,
                onChange: setShareFilter,
                placeholder: 'Shared with others',
                multiple: false,
                info: { name: 'Shared with others:' },
              },
              {
                dateFormat: 'd MMM yyyy',
                className: 'w-64 h-11 mt-1 border-2 border-transparent',
                isFullWidth: false,
                colour: !!startDate ? 'secondary' : 'adminPortalBg',
                textColour: !!startDate ? 'white' : 'textMid',
                placeholderText: 'Date inserted',
                type: 'date-picker',
                showChevronIcon: true,
                chevronIconColour: !!startDate ? 'white' : 'primary',
                hideCalendarIcon: true,
                selected: startDate,
                onChange,
                startDate,
                endDate,
                selectsRange: true,
                shouldCloseOnSelect: true,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
