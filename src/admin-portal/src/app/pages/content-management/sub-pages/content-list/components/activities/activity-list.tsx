/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, gql, useQuery } from '@apollo/client';
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
import { LanguageId } from '../../../../../../constants/language';
import {
  ActivityTypes,
  ContentTypes,
} from '../../../../../../constants/content-management';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import { DeleteMultipleActivities, GetActivityRecords } from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import {
  ActivitySubTypeOptions,
  ActivityShareOptions,
  ActivityTypeOptions,
} from './activity.types';

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
// Story activities
export const sortBySubTypeOptions: SearchDropDownOption<string>[] = [
  ActivitySubTypeOptions?.StoryBook,
  ActivitySubTypeOptions?.ReadAloud,
  ActivitySubTypeOptions?.Other,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

// Small and Large groups
export const sortByTypeOptions: SearchDropDownOption<string>[] = [
  ActivityTypeOptions?.SmallGroup,
  ActivityTypeOptions?.LargeGroup,
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

  const [sortByThemeOptions, setSortByThemeOptions] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [themes, setThemes] = useState<any[]>([]);

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
    fetchPolicy: 'network-only',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  const [sortBySkillOptions, setSortBySkillOptions] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const getAllSkills = `GetAllProgressTrackingSubCategory`;
  const skillQuery = gql` 
    query ${getAllSkills} ($localeId: String) {
      ${getAllSkills} (localeId: $localeId) {
        id
        name
        }
      }
  `;

  const { data: skillData } = useQuery(skillQuery, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

  useEffect(() => {
    if (skillData && skillData.GetAllProgressTrackingSubCategory) {
      const copyItems = skillData.GetAllProgressTrackingSubCategory.map(
        (item: any) => ({
          ...item,
          id: item?.id,
          label: item?.name,
          value: item?.id,
        })
      );

      setSortBySkillOptions(copyItems);
    }
  }, [skillData]);

  useEffect(() => {
    if (themeData && themeData.GetAllTheme) {
      setThemes(themeData.GetAllTheme);

      const copyItems = themeData.GetAllTheme.map((item: any) => ({
        ...item,
        id: item?.id,
        label: item?.name,
        value: item?.id,
      }));
      copyItems.push({ id: 0, label: 'No theme', value: 0 });

      setSortByThemeOptions(copyItems);
    }
  }, [themeData]);

  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();

  // Filter options
  // ---------
  const [subTypesFilter, setSubTypesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredSubTypes = useMemo(
    () => subTypesFilter?.map((item) => item?.value),
    [subTypesFilter]
  );
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
  // ---------
  const [skillsFilter, setSkillsFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredSkills = useMemo(
    () => skillsFilter?.map((item) => item?.value),
    [skillsFilter]
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
        const activityFields =
          choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES
            ? displayFields?.filter(
                (item) =>
                  item?.fieldName === 'name' ||
                  item?.fieldName === 'subType' ||
                  item?.fieldName === 'themes' ||
                  item?.fieldName === 'languages' ||
                  item?.fieldName === 'updatedDate'
              )
            : displayFields?.filter(
                (item) =>
                  item?.fieldName === 'name' ||
                  item?.fieldName === 'type' ||
                  item?.fieldName === 'themes' ||
                  item?.fieldName === 'languages' ||
                  item?.fieldName === 'subCategories' ||
                  item?.fieldName === 'updatedDate'
              );
        const activityItems =
          choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES
            ? activityFields
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
                      ? 5
                      : item.fieldOrder,
                }))
                .sort(function (a, b) {
                  return a.fieldOrder - b.fieldOrder;
                })
            : activityFields
                .map((item: any) => ({
                  ...item,
                  displayName:
                    item.fieldName === 'name'
                      ? 'Activity title'
                      : item.fieldName === 'type'
                      ? 'Type'
                      : item.displayName,
                  fieldOrder:
                    item.fieldName === 'name'
                      ? 1
                      : item.fieldName === 'type'
                      ? 2
                      : item.fieldName === 'themes'
                      ? 3
                      : item.fieldName === 'languages'
                      ? 4
                      : item.fieldName === 'subCategories'
                      ? 5
                      : item.fieldName === 'updatedDate'
                      ? 6
                      : item.fieldOrder,
                }))
                .sort(function (a, b) {
                  return a.fieldOrder - b.fieldOrder;
                });
        setDisplayFields(activityItems);
        return;
      }

      setDisplayFields(displayFields);
    }
  }, [choosedSectionTitle, contentType]);

  const queryVariables = useMemo(
    () => ({
      isStoryActivity: choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES,
      search: '',
      subTypesSearch: filteredSubTypes,
      typesSearch: filteredTypes,
      themesSearch: filteredThemes,
      languageSearch: filteredLanguage,
      skillSearch: filteredSkills,
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
      filteredSubTypes,
      filteredTypes,
      filteredThemes,
      filteredLanguage,
      filteredSkills,
      startDate,
      endDate,
      filteredShare,
    ]
  );

  const {
    data: activityData,
    refetch: refetchContent,
    loading: loadingContent,
  } = useQuery(GetActivityRecords, {
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
  }, [activityData]);

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
        name: item?.name,
        subType: item?.subType,
        materials: item?.materials,
        description: item?.description,
        notes: item?.notes,
        availableLanguages: itemLanguages,
        shareContent: item?.shareContent,
        themes: item?.themes.split(','),
        type: item?.type,
        subCategories: item?.subCategories.split(','),
        image: item?.image,
        isInUse: item?.isInUse,
        inUseThemeNames: item?.inUseThemeNames,
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

  const inUseActivities = selectedActivities?.filter(
    (item) => item?.isInUse === true
  );

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: `activity_` + item?.id,
        name: item?.name,
        themeComponent: (
          <div className="ml-0 flex cursor-pointer flex-row items-center">
            {item?.themes !== '' &&
              item?.themes.split(',')?.map((item: any, index: number) => {
                const theme = themes?.find((x) => x?.id === +item);
                return (
                  <div
                    key={`theme_` + index}
                    className={'text-textMid m-1 rounded-full py-1'}
                  >
                    {theme?.name}
                  </div>
                );
              })}
          </div>
        ),
        updatedDate: item?.updatedDate
          ? format(new Date(item.updatedDate), 'dd/MM/yyyy')
          : '-',
        subTypeComponent: (
          <div className="ml-1 flex cursor-pointer gap-1">
            {item?.subTypeItems.map((sub, index) => {
              return (
                <div
                  key={'sb_' + index}
                  className={`${
                    sub.toString().toLowerCase() ===
                    ActivitySubTypeOptions.StoryBook.toLowerCase()
                      ? 'bg-secondary'
                      : sub.toString().toLowerCase() ===
                        ActivitySubTypeOptions.ReadAloud.toLowerCase()
                      ? 'bg-darkBlue'
                      : 'bg-successMain'
                  } inline-block overflow-ellipsis rounded-full px-2 py-1 font-bold text-white`}
                >
                  <span className="text-xs">{sub.toString()}</span>
                </div>
              );
            })}
          </div>
        ),
        languageComponent: (
          <div className="ml-0 flex cursor-pointer flex-row items-center">
            {item?.availableLanguages?.map((item: any, index: number) => {
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
                  {index === item?.availableLanguages?.length - 1
                    ? `${language?.locale}`
                    : `${language?.locale};`}
                </div>
              );
            })}
          </div>
        ),
        typeComponent:
          item?.type === 'Small group' ? (
            <div className="ml-1 flex cursor-pointer">
              <div className="bg-darkBlue inline-block overflow-ellipsis rounded-full px-2 py-1 font-bold text-white">
                <span>{item?.type}</span>
              </div>
            </div>
          ) : (
            <div className="ml-1 flex cursor-pointer">
              <div className="bg-secondary inline-block overflow-ellipsis rounded-full px-2 py-1 font-bold text-white">
                <span>{item?.type}</span>
              </div>
            </div>
          ),
        skillComponent: (
          <div className="ml-0 flex cursor-pointer flex-row items-center">
            {item.subCategoryItems?.map((item: any, index: number) => (
              <div key={`cat_` + index} className="flex cursor-pointer">
                <div
                // className={`${
                //   item?.imageHexColor ? '' : 'bg-tertiary'
                // } flex h-9 w-9 items-center rounded-full`}
                >
                  <img
                    alt="skill"
                    src={item?.imageUrl}
                    className="h-6 w-6 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      })
    ) ?? [];

  const columns: Icolumn[] =
    choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES
      ? [
          {
            field: 'name',
            use: 'Activity title',
          },
          {
            field: 'subTypeComponent',
            use: 'For story type(s)',
          },
          {
            field: 'themeComponent',
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
        ]
      : [
          {
            field: 'name',
            use: 'Activity title',
          },
          {
            field: 'typeComponent',
            use: 'Type',
          },
          {
            field: 'themeComponent',
            use: 'Themes',
          },
          {
            field: 'languageComponent',
            use: 'Languages',
          },
          {
            field: 'skillComponent',
            use: 'Skills',
          },
          {
            field: 'updatedDate',
            use: 'Last updated',
          },
        ];

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSubTypesFilter([]);
    setTypesFilter([]);
    setThemesFilter([]);
    setLanguageFilter([]);
    setShareFilter([]);
  };

  const isFilterActive =
    choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES
      ? !!subTypesFilter?.length ||
        !!themesFilter?.length ||
        !!languageFilter?.length ||
        !!shareFilter?.length ||
        !!startDate ||
        !!endDate
      : !!typesFilter?.length ||
        !!themesFilter?.length ||
        !!languageFilter?.length ||
        !!skillsFilter?.length ||
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
        contentIds: selectedActivities?.map(
          (item) => item?.id && item?.isInUse === false
        ), // exclude ids which is in use
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
          } items?  Some practitioner's programme plans will be incomplete`}
          message={`Practitioners who have included these items in their plans will have incomplete programmes`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={
            isAllInactive ||
            inactiveActivities?.length > 0 ||
            inUseActivities?.length > 0
          }
          alertMessage={
            inUseActivities?.length > 0
              ? `Note: ${inUseActivities?.length} item(s) selected cannot be removed because they are linked to  a published theme.`
              : isAllInactive || inactiveActivities?.length > 0
              ? `Note: ${inactiveActivities?.length} deleted.`
              : ''
          }
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
            filters={
              choosedSectionTitle === ActivityTypes.STORY_ACTIVITIES
                ? [
                    {
                      type: 'search-dropdown',
                      menuItemClassName: 'ml-20 w-11/12',
                      options: sortBySubTypeOptions,
                      selectedOptions: subTypesFilter,
                      onChange: setSubTypesFilter,
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
                      placeholderText: 'Last updated',
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
                  ]
                : [
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
                      options: sortBySkillOptions,
                      selectedOptions: skillsFilter,
                      onChange: setSkillsFilter,
                      placeholder: 'Skills',
                      multiple: true,
                      info: { name: 'Skills :' },
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
                      placeholderText: 'Last updated',
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
                  ]
            }
          />
        </div>
      </div>
    </>
  );
}
