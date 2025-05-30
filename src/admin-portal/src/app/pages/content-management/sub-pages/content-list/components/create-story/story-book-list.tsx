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
import { LanguageId } from '../../../../../../constants/language';
import { ContentTypes } from '../../../../../../constants/content-management';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import {
  DeleteMultipleStoryBooks,
  GetStoryBookRecords,
} from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import {
  StoryBookTypeOptions,
  StoryBookShareOptions,
} from './story-book.types';

export interface ContentListProps {
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
  StoryBookTypeOptions?.StoryBook,
  StoryBookTypeOptions?.ReadAloud,
  StoryBookTypeOptions?.Other,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export const sortByShareOptions: SearchDropDownOption<string>[] = [
  StoryBookShareOptions?.Yes,
  StoryBookShareOptions?.No,
  StoryBookShareOptions?.NA,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function StoryBookList({
  selectedTab,
  contentType,
  languages,
  viewContent,
  refreshParent,
  onSearch,
  choosedSectionTitle,
  setSelectedType,
  dataTypes,
}: ContentListProps) {
  const sortByLanguageOptions: SearchDropDownOption<string>[] = languages?.map(
    (item) => ({
      id: item?.id,
      label: item?.description,
      value: item?.id,
    })
  );

  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();

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
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: LanguageId.enZa,
    },
  });

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

      if (contentType.name === ContentTypes.STORY_BOOK) {
        const resourceFields = displayFields?.filter(
          (item) =>
            item?.fieldName === 'name' ||
            item?.fieldName === 'type' ||
            item?.fieldName === 'themes' ||
            item?.fieldName === 'languages' ||
            item?.fieldName === 'updatedDate'
        );

        const resourceItems = resourceFields
          .map((item: any) => ({
            ...item,
            displayName:
              item.fieldName === 'name'
                ? 'Story title'
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
      filteredTypes,
      filteredThemes,
      filteredLanguage,
      startDate,
      endDate,
      filteredShare,
    ]
  );

  const [
    fetchStoryBooks,
    { data: storyBookData, refetch: refetchContent, loading: loadingContent },
  ] = useLazyQuery(GetStoryBookRecords, {
    fetchPolicy: 'network-only',
    variables: queryVariables,
  });

  useEffect(() => {
    if (storyBookData && storyBookData.storyBookRecords) {
      const copyItems = storyBookData.storyBookRecords.map((item: any) => ({
        ...item,
      }));

      setTableData(copyItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyBookData, selectedTab]);

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

      const storyBookParts = item?.storyBookParts.split(',');
      const filteredBookParts = storyBookParts.filter(function (el) {
        return el !== '';
      });
      const itemStoryBookParts = filteredBookParts.map((item: any) => ({
        id: +item,
        __typename: 'StoryBookParts',
      }));

      const copyItem = {
        __typename: ContentTypes.STORY_BOOK,
        id: +item.id,
        name: item?.name,
        type: item?.type,
        author: item?.auther,
        illustrator: item?.illustrator,
        translator: item?.translator,
        bookLocation: item?.bookLocation,
        keywords: item?.keywords,
        storyBookParts: itemStoryBookParts,
        availableLanguages: itemLanguages,
        shareContent: item?.shareContent,
        themes: item?.themes,
        authorsAuthorization: item?.authorsAuthorization,
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
  const [selectedStorybooks, setSelectedStoryBooks] = useState<Irow[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const inactiveStorybooks = selectedStorybooks?.filter(
    (item) => item?.isActive === false
  );

  const isAllInactive = selectedStorybooks.every(
    (obj) => obj?.isActive === false
  );

  const inUseStoryBooks = selectedStorybooks?.filter(
    (item) => item?.isInUse === true
  );

  const getChipColor = (type?: string) => {
    if (type) {
      switch (type) {
        case StoryBookTypeOptions?.ReadAloud:
          return 'bg-primary';
        case StoryBookTypeOptions?.StoryBook:
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
        key: `storybook_` + item?.id,
        name: item?.name,
        updatedDate: item?.updatedDate
          ? format(new Date(item.updatedDate), 'dd/MM/yyyy')
          : '-',
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
        typeComponent: (
          <div className="ml-0 flex cursor-pointer items-center">
            <div
              key={`type_` + item?.id}
              className={
                `${getChipColor(item?.type)}` +
                ' m-1 rounded-full py-1 px-3 text-xs text-white'
              }
            >
              {item?.type}
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
      use: 'Story title',
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

  const [deactivateStoryBooks, { loading: deactivating }] = useMutation(
    DeleteMultipleStoryBooks,
    {
      variables: {
        contentIds: selectedStorybooks?.map((item) => item?.id),
      },
      fetchPolicy: 'network-only',
    }
  );

  const deactivateRecords = useCallback(() => {
    deactivateStoryBooks({
      variables: {
        contentIds: selectedStorybooks?.map(
          (item) => item?.id && item?.isInUse === false
        ), // exclude ids which is in use
      },
    })
      .then((res) => {
        if (res.data?.deleteMultipleStoryBooks?.success.length > 0) {
          setNotification({
            title: ` Successfully Deleted ${res.data?.deleteMultipleStoryBooks?.success.length} Story books!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetchContent();
          setSelectedStoryBooks([]);
          handleResetSelectedRows();
        }
        if (res.data?.deleteMultipleStoryBooks?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deleted ${res.data?.deleteMultipleStoryBooks?.failed.length} Story books!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedStoryBooks([]);
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
    deactivateStoryBooks,
    refetchContent,
    selectedStorybooks,
    setNotification,
  ]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Are you sure you want to delete ${
            selectedStorybooks?.length - inactiveStorybooks?.length
          } items?  Some practitioner's programme plans will be incomplete`}
          message={`Practitioners who have included these items in their plans will have incomplete programmes`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={
            isAllInactive ||
            inactiveStorybooks?.length > 0 ||
            inUseStoryBooks?.length > 0
          }
          alertMessage={
            inUseStoryBooks?.length > 0
              ? `Note: ${inUseStoryBooks?.length} item(s) selected cannot be removed because they are linked to  a published theme.`
              : isAllInactive || inactiveStorybooks?.length > 0
              ? `Note: ${inactiveStorybooks?.length} deleted.`
              : ''
          }
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedStoryBooks([]);
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
    inactiveStorybooks?.length,
    isAllInactive,
    selectedStorybooks?.length,
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
            onChangeSelectedRows={setSelectedStoryBooks}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || loadingContent,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={{
              text: 'Add story',
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
