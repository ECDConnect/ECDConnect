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
  ResourcesTitles,
} from '../../../../content-management-models';
// import { useResources } from '../../../../../../hooks/useResources';
import { LanguageId } from '../../../../../../constants/language';
import { ContentTypes } from '../../../../../../constants/content-management';
import { BulkActionStatus } from '../../../../../../components/ui-table/type';
import { TableRefMethods } from '@ecdlink/ui/lib/components/table/types';
import debounce from 'lodash.debounce';
import { DeleteMultipleResources, GetResources } from '@ecdlink/graphql';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import {
  businessResourceOptions,
  classroomResourceOptions,
  DataFree,
  Likes,
} from './resource.types';

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

export const sortByDataFreeOptions: SearchDropDownOption<string>[] = [
  DataFree?.Yes,
  DataFree?.No,
].map((item) => ({
  id: item,
  label: item,
  value: item === 'Yes' ? 'true' : 'false',
}));

export const sortByLikeOptions: SearchDropDownOption<string>[] = [
  Likes?.Zero,
  Likes?.OneToTen,
  Likes?.ElevenToFifty,
  Likes?.FiftyOneToHundred,
  Likes?.MoreThanHundred,
].map((item) => ({
  id: item,
  label: item,
  value: item,
}));

export default function ResourceList({
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
  // const { hasPermission } = useResources();
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

      if (contentType.name === ContentTypes.CLASSROOMBUSINESSRESOURCE) {
        const resourceFields = displayFields?.filter(
          (item) =>
            item?.fieldName === 'title' ||
            item?.fieldName === 'resourceType' ||
            item?.fieldName === 'dataFree' ||
            item?.fieldName === 'numberLikes' ||
            item?.fieldName === 'updatedDate'
        );

        const resourceItems = resourceFields
          .map((item: any) => ({
            ...item,
            displayName:
              item.fieldName === 'title'
                ? 'Resource title'
                : item.fieldName === 'resourceType'
                ? 'Type'
                : item.fieldName === 'dataFree'
                ? 'Data free?'
                : item.displayName,
            fieldOrder:
              item.fieldName === 'title'
                ? 1
                : item.fieldName === 'resourceType'
                ? 2
                : item.fieldName === 'dataFree'
                ? 3
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
      localeId: languageId,
      sectionType:
        choosedSectionTitle === ResourcesTitles.ClassroomResources
          ? 'classroom'
          : 'business',
      search: '',
      dataFreeSearch: filteredDataFree,
      likesSearch: filteredLikes,
      startDate: startDate === '' ? null : startDate,
      endDate: endDate === '' ? null : endDate,
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
    }),
    [
      choosedSectionTitle,
      endDate,
      filteredDataFree,
      filteredLikes,
      languageId,
      startDate,
    ]
  );

  const [resources, setResources] = useState<any[]>([]);
  const [
    fetchResourceData,
    { data: resourceData, refetch: refetchContent, loading: loadingContent },
  ] = useLazyQuery(GetResources, {
    fetchPolicy: 'network-only',
    variables: queryVariables,
  });

  useEffect(() => {
    if (resourceData && resourceData.resources) {
      const copyItems = resourceData.resources.map((item: any) => ({
        ...item,
      }));

      if (choosedSectionTitle === ResourcesTitles.ClassroomResources) {
        const classroomData = copyItems.filter(
          (item) => item.sectionType === 'classroom'
        );
        setTableData(classroomData);
        return;
      }
      if (choosedSectionTitle === ResourcesTitles.BusinessResources) {
        const businessData = copyItems.filter(
          (item) => item.sectionType === 'business'
        );
        setTableData(businessData);
        return;
      }

      setTableData(copyItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceData, selectedTab]);

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
  const [selectedResources, setSelectedResources] = useState<Irow[]>([]);
  const dialog = useDialog();
  const { setNotification } = useNotifications();

  const handleResetSelectedRows = () => {
    tableRef?.current?.resetSelectedRows();
  };

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const inactiveResources = selectedResources?.filter(
    (item) => item?.isActive === false
  );

  const isAllInactive = selectedResources.every(
    (obj) => obj?.isActive === false
  );

  const getChipColor = (type?: string) => {
    if (type) {
      switch (type) {
        case classroomResourceOptions?.Activites:
          return 'bg-primary';
        case classroomResourceOptions?.Stories:
          return 'bg-secondary';
        case classroomResourceOptions?.TeachingTips:
          return 'bg-tertiary';
        case businessResourceOptions?.Finances:
          return 'bg-primary';
        case businessResourceOptions?.Marketing:
          return 'bg-secondary';
        case businessResourceOptions?.Safety:
          return 'bg-tertiary';
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
        key: `resource_` + item?.id,
        title: item?.title,
        numberLikes: item?.numberLikes === null ? 0 : item?.numberLikes,
        updatedDate: item?.updatedDate
          ? format(new Date(item.updatedDate), 'dd/MM/yyyy')
          : '-',
        resourceTypeComponent: (
          <div className="ml-0 flex cursor-pointer items-center">
            <div
              key={`role_` + item?.id}
              className={
                `${getChipColor(item?.resourceType)}` +
                ' m-1 rounded-full py-1 px-3 text-xs text-white'
              }
            >
              {item?.resourceType}
            </div>
          </div>
        ),
        dataFreeComponent: (
          <p
            className={
              item?.dataFree === 'true' ? 'text-successMain' : 'text-errorMain'
            }
          >
            {item?.dataFree === 'true'
              ? renderIcon('CheckCircleIcon', 'success h-6 w-6')
              : renderIcon('XCircleIcon', 'error h-6 w-6')}
          </p>
        ),
      })
    ) ?? [];

  const columns: Icolumn[] = [
    {
      field: 'title',
      use: 'Resource title',
    },
    {
      field: 'resourceTypeComponent',
      use: 'Type',
    },
    {
      field: 'dataFreeComponent',
      use: 'Data free?',
    },
    {
      field: 'numberLikes',
      use: '# of likes',
    },
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
    DeleteMultipleResources,
    {
      variables: {
        contentIds: selectedResources?.map((item) => item?.id),
      },
      fetchPolicy: 'network-only',
    }
  );

  const deactivateResource = useCallback(() => {
    deactivateResources({
      variables: {
        contentIds: selectedResources?.map((item) => item?.id),
      },
    })
      .then((res) => {
        if (res.data?.deleteBulkResources?.success.length > 0) {
          setNotification({
            title: ` Successfully Deleted ${res.data?.deleteBulkResources?.success.length} Resources!`,
            variant: NOTIFICATION.SUCCESS,
          });
          refetchContent();
          setSelectedResources([]);
          handleResetSelectedRows();
        }
        if (res.data?.deleteBulkResources?.failed.length > 0) {
          setNotification({
            title: ` Failed to Deleted ${res.data?.deleteBulkResources?.failed.length} Resources!`,
            variant: NOTIFICATION.ERROR,
          });
          setSelectedResources([]);
          handleResetSelectedRows();
        }
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to delete',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateResources, refetchContent, selectedResources, setNotification]);

  const handleBulkDelete = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onClose) => (
        <AlertModal
          title={`Are you sure you want to delete ${
            selectedResources?.length - inactiveResources?.length
          } items?`}
          message={`Practitioners will no longer have access to these resources.`}
          btnText={['Yes, delete', 'No, Cancel']}
          hasAlert={isAllInactive || inactiveResources?.length > 0}
          alertMessage={`Note: ${inactiveResources?.length} deleted.`}
          alertType="error"
          onCancel={() => {
            onClose();
            setSelectedResources([]);
            handleResetSelectedRows();
          }}
          onSubmit={() => {
            deactivateResource();
            onClose();
          }}
        />
      ),
    });
  }, [
    deactivateResource,
    dialog,
    inactiveResources?.length,
    isAllInactive,
    selectedResources?.length,
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
            onChangeSelectedRows={setSelectedResources}
            onClickRow={viewSelectedRow}
            noContentText={noContentText}
            loading={{
              isLoading: tableData === undefined || loadingContent,
              size: 'medium',
              spinnerColor: 'adminPortalBg',
              backgroundColor: 'secondary',
            }}
            actionButton={{
              text: 'Add Resource',
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
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByDataFreeOptions,
                selectedOptions: dataFreeFilter,
                onChange: setDataFreeFilter,
                placeholder: 'Datafree',
                multiple: true,
                info: { name: 'Datafree :' },
              },
              {
                type: 'search-dropdown',
                menuItemClassName: 'ml-20 w-11/12',
                options: sortByLikeOptions,
                selectedOptions: likesFilter,
                onChange: setLikesFilter,
                placeholder: 'Likes',
                multiple: true,
                info: { name: 'Likes :' },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
