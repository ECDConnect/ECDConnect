/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
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
import {
  DialogPosition,
  renderIcon,
  SearchDropDownOption,
  Table,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import {
  ContentManagementView,
  FieldType,
} from '../../../../content-management-models';
// import { useResources } from '../../../../../../hooks/useResources';
import { LanguageId } from '../../../../../../constants/language';
import { ContentTypes } from '../../../../../../constants/content-management';
import { BulkActionStatus } from '../../../../../../components/ui-table/type';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import {
  DeleteMultipleStoryBooks,
  GetStoryBookRecords,
} from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import { storyBookTypeOptions } from './story-book.types';

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

// export const sortByDataFreeOptions: SearchDropDownOption<string>[] = [
//   DataFree?.Yes,
//   DataFree?.No,
// ].map((item) => ({
//   id: item,
//   label: item,
//   value: item === 'Yes' ? 'true' : 'false',
// }));

// export const sortByLikeOptions: SearchDropDownOption<string>[] = [
//   Likes?.Zero,
//   Likes?.OneToTen,
//   Likes?.ElevenToFifty,
//   Likes?.FiftyOneToHundred,
//   Likes?.MoreThanHundred,
// ].map((item) => ({
//   id: item,
//   label: item,
//   value: item,
// }));

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
  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();
  const [typeFilter, setTypeFilter] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const [dataFreeFilter, setDataFreeFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredDataFree = useMemo(
    () => dataFreeFilter?.map((item) => item?.value),
    [dataFreeFilter]
  );

  const [likesFilter, setLikesFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const filteredLikes = useMemo(
    () => likesFilter?.map((item) => item?.value),
    [likesFilter]
  );

  const [languageFilter, setLanguageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const languageFilterValues = useMemo(
    () => languageFilter?.map((item) => item?.value),
    [languageFilter]
  );
  const typeFilterValues = useMemo(
    () => typeFilter?.map((item) => item?.value),
    [typeFilter]
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

  //   string search = null,
  // List<string> typesSearch = null,
  // List<string> themesSearch = null,
  // List<string> skillsSearch = null,
  // List<Guid> languageSearch = null,
  // PagedQueryInput pagingInput = null,
  // DateTime? startDate = null,
  // DateTime? endDate= null

  const queryVariables = useMemo(
    () => ({
      localeId: languageId,
      search: '',
      typesSearch: filteredDataFree,
      themesSearch: filteredLikes,
      languageSearch: filteredLikes,
      startDate: startDate === '' ? null : startDate,
      endDate: endDate === '' ? null : endDate,
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
    }),
    [endDate, filteredDataFree, filteredLikes, languageId, startDate]
  );

  // const [resources, setResources] = useState<any[]>([]);
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

    viewContent(model);
  };

  const onBulkActionCallback = useCallback(
    (status: BulkActionStatus) => {
      if (status !== 'success') return;

      refetchContent({
        localeId: languageId.toString(),
      });
      refreshParent();
    },
    [languageId, refetchContent, refreshParent]
  );

  const filteredData = useMemo(() => {
    if (startDate && endDate) {
      const filteredByDate = tableData?.filter((d) => {
        return (
          new Date(d?.updatedDate).getTime() >=
            new Date(startDate)?.getTime() &&
          new Date(d?.updatedDate).getTime() <= new Date(endDate)?.getTime()
        );
      });

      const filteredByType =
        typeFilterValues?.length > 0
          ? filteredByDate?.filter((el) => {
              return typeFilterValues?.some((f) => {
                return f === el.childType;
              });
            })
          : filteredByDate;

      if (languageFilter?.length > 0) {
        const filteredbyLanguageObjects = filteredByType.filter((item) =>
          item.availableLanguages.some((languageId) =>
            languageFilterValues.includes(languageId)
          )
        );
        return filteredbyLanguageObjects;
      }

      return filteredByType;
    }

    if (typeFilterValues?.length > 0) {
      const typeFilterValue = tableData?.filter((el) => {
        return typeFilterValues?.some((f) => {
          return f === el.type;
        });
      });

      if (languageFilter?.length > 0) {
        const filteredbyLanguageObjects = typeFilterValue.filter((item) =>
          item.availableLanguages.some((languageId) =>
            languageFilterValues.includes(languageId)
          )
        );
        return filteredbyLanguageObjects;
      }

      return typeFilterValue;
    }

    if (languageFilter?.length > 0) {
      const filteredbyLanguageObjects = tableData.filter((item) =>
        item.availableLanguages.some((languageId) =>
          languageFilterValues.includes(languageId)
        )
      );
      return filteredbyLanguageObjects;
    }

    return tableData;
  }, [
    endDate,
    languageFilter?.length,
    languageFilterValues,
    tableData,
    startDate,
    typeFilterValues,
  ]);

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

  const getChipColor = (type?: string) => {
    if (type) {
      switch (type) {
        case storyBookTypeOptions?.ReadAloud:
          return 'bg-primary';
        case storyBookTypeOptions?.StoryBook:
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
        // dataFreeComponent: (
        //   <p
        //     className={
        //       item?.dataFree === 'true' ? 'text-successMain' : 'text-errorMain'
        //     }
        //   >
        //     {item?.dataFree === 'true'
        //       ? renderIcon('CheckCircleIcon', 'success h-6 w-6')
        //       : renderIcon('XCircleIcon', 'error h-6 w-6')}
        //   </p>
        // ),
      })
    ) ?? [];

  const columns: Icolumn[] = [
    {
      field: 'name',
      use: 'Storybook title',
    },
    {
      field: 'typeComponent',
      use: 'Type',
    },
    // {
    //   field: 'dataFreeComponent',
    //   use: 'Data free?',
    // },
    // {
    //   field: 'numberLikes',
    //   use: '# of likes',
    // },
    {
      field: 'updatedDate',
      use: 'Last updated',
    },
  ];

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setDataFreeFilter([]);
    setLikesFilter([]);
  };

  const isFilterActive =
    !!dataFreeFilter?.length ||
    !!startDate ||
    !!endDate ||
    !!likesFilter?.length;

  const noContentText = useMemo(() => {
    if (isFilterActive) {
      return 'No results found. Try changing the filters selected';
    }
    return 'No entries found';
  }, [isFilterActive]);

  const [deactivateResources, { loading: deactivating }] = useMutation(
    DeleteMultipleStoryBooks,
    {
      variables: {
        contentIds: selectedStorybooks?.map((item) => item?.id),
      },
      fetchPolicy: 'network-only',
    }
  );

  const deactivateStorybooks = useCallback(() => {
    deactivateResources({
      variables: {
        contentIds: selectedStorybooks?.map((item) => item?.id),
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
    deactivateResources,
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
          } items?`}
          message={`Practitioners will no longer have access to these story books.`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveStorybooks?.length > 0}
          alertMessage={`Note: ${inactiveStorybooks?.length} deleted.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedStoryBooks([]);
            handleResetSelectedRows();
          }}
          onSubmit={() => {
            deactivateStorybooks();
            onClose();
          }}
        />
      ),
    });
  }, [
    deactivateStorybooks,
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
              // {
              //   type: 'search-dropdown',
              //   menuItemClassName: 'ml-20 w-11/12',
              //   options: sortByDataFreeOptions,
              //   selectedOptions: dataFreeFilter,
              //   onChange: setDataFreeFilter,
              //   placeholder: 'Datafree',
              //   multiple: true,
              //   info: { name: 'Datafree :' },
              // },
              // {
              //   type: 'search-dropdown',
              //   menuItemClassName: 'ml-20 w-11/12',
              //   options: sortByLikeOptions,
              //   selectedOptions: likesFilter,
              //   onChange: setLikesFilter,
              //   placeholder: 'Likes',
              //   multiple: true,
              //   info: { name: 'Likes :' },
              // },
            ]}
          />
        </div>
      </div>
    </>
  );
}
