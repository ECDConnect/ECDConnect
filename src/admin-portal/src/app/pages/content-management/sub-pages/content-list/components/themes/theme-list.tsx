/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from '@apollo/client';
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
import { ContentManagementView } from '../../../../content-management-models';
import { LanguageId } from '../../../../../../constants/language';
import { ContentTypes } from '../../../../../../constants/content-management';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import { DeleteMultipleThemes, GetThemeRecords } from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import { ShareOptions } from './theme.types';

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

export const sortByShareOptions: SearchDropDownOption<string>[] = [
  ShareOptions?.Yes,
  ShareOptions?.No,
  ShareOptions?.NA,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ThemeList({
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
  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();

  // Filter options
  // ---------
  const [shareFilter, setShareFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredShare = useMemo(
    () => shareFilter?.map((item) => item?.value),
    [shareFilter]
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

      // orderedList.forEach((x) => {
      //   if (
      //     ((x.fieldType.dataType === FieldType.Text ||
      //       x.fieldType.dataType === FieldType.Link ||
      //       x.fieldType.dataType === FieldType.DatePicker) &&
      //       !!x.displayMainTable) ||
      //     !!x.displayMainTable
      //   )
      //     displayFields.push(x);
      // });

      if (contentType.name === ContentTypes.STORY_BOOK) {
        const resourceFields = displayFields?.filter(
          (item) =>
            item?.fieldName === 'name' ||
            item?.fieldName === 'imageUrl' ||
            item?.fieldName === 'themeLogo' ||
            item?.fieldName === 'themeDays' ||
            item?.fieldName === 'updatedDate'
        );

        const resourceItems = resourceFields
          .map((item: any) => ({
            ...item,
            displayName: item.fieldName === 'name' ? 'Title' : item.displayName,
            fieldOrder:
              item.fieldName === 'name'
                ? 1
                : item.fieldName === 'updatedDate'
                ? 2
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
      startDate: startDate === '' ? null : startDate,
      endDate: endDate === '' ? null : endDate,
      shareContent: filteredShare,
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
    }),
    [startDate, endDate, filteredShare]
  );

  const {
    data: themeData,
    refetch: refetchContent,
    loading: loadingContent,
  } = useQuery(GetThemeRecords, {
    fetchPolicy: 'network-only',
    variables: queryVariables,
  });

  useEffect(() => {
    if (themeData && themeData.themeRecords) {
      const copyItems = themeData.themeRecords.map((item: any) => ({
        ...item,
      }));

      setTableData(copyItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeData, selectedTab]);

  // useEffect(() => {
  //   if (languages) {
  //     const defaultLanguage = languages.find((x) => x.locale === 'en-za');
  //     setLanguageId(defaultLanguage.id);

  //     refetchContent({
  //       localeId: defaultLanguage.id.toString(),
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [languages]);

  const viewSelectedRow = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };

    if (item) {
      // const itemLanguages = item?.availableLanguages.map((item: any) => ({
      //   id: item,
      //   __typename: 'Language',
      // }));

      // const storyBookParts = item?.storyBookParts.split(',');
      // const itemStoryBookParts = storyBookParts.map((item: any) => ({
      //   id: item,
      //   __typename: 'StoryBookParts',
      // }));

      const copyItem = {
        __typename: ContentTypes.THEME,
        id: +item.id,
        name: item.name,
        color: item.color,
        imageUrl: item.imageUrl,
        themeDays: item.themeDays,
        shareContent: item.shareContent,
        themeLogo: item.themeLogo,
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
  const [selectedThemes, setSelectedThemes] = useState<Irow[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const inactiveThemes = selectedThemes?.filter(
    (item) => item?.isActive === false
  );

  const isAllInactive = selectedThemes.every((obj) => obj?.isActive === false);

  const rows: Irow[] =
    (!!searchValue ? filterByValue(tableData, searchValue) : tableData)?.map(
      (item) => ({
        ...item,
        key: `theme_` + item?.id,
        name: item?.name,
        updatedDate: item?.updatedDate
          ? format(new Date(item.updatedDate), 'dd/MM/yyyy')
          : '-',
      })
    ) ?? [];

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Title',
    },
    {
      field: 'updatedDate',
      use: 'Last updated',
    },
  ];

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setShareFilter([]);
  };

  const isFilterActive = !!shareFilter?.length || !!startDate || !!endDate;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }
    return 'No entries found';
  }, [isFilterActive]);

  const [deactivateThemes, { loading: deactivating }] = useMutation(
    DeleteMultipleThemes,
    {
      variables: {
        contentIds: selectedThemes?.map((item) => item?.id),
      },
      fetchPolicy: 'network-only',
    }
  );

  const deactivateRecords = useCallback(() => {
    deactivateThemes({
      variables: {
        contentIds: selectedThemes?.map((item) => item?.id),
      },
    })
      .then((res) => {
        if (res.data?.deleteMultipleThemes?.success.length > 0) {
          setNotification({
            title: ` Successfully Deleted ${res.data?.deleteMultipleThemes?.success.length} Story books!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetchContent();
          setSelectedThemes([]);
          handleResetSelectedRows();
        }
        if (res.data?.deleteMultipleThemes?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deleted ${res.data?.deleteMultipleThemes?.failed.length} Story books!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedThemes([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to delete',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateThemes, refetchContent, selectedThemes, setNotification]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Are you sure you want to delete ${
            selectedThemes?.length - inactiveThemes?.length
          } items?`}
          message={`Practitioners will no longer have access to these themes.`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveThemes?.length > 0}
          alertMessage={`Note: ${inactiveThemes?.length} deleted.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedThemes([]);
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
    inactiveThemes?.length,
    isAllInactive,
    selectedThemes?.length,
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
            onChangeSelectedRows={setSelectedThemes}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || loadingContent,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={{
              text: 'Add theme',
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
