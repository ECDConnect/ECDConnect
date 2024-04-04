/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  PermissionEnum,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import {
  ContentManagementView,
  FieldType,
  NatalTypes,
  sortByNatalTypeOptions,
} from '../../content-management-models';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../../../constants/content-management';
import { BulkActionStatus } from '../../../../components/ui-table/type';
import { LanguageId } from '../../../../constants/language';
import { GetNatalRecordsForType, GetTenantContext } from '@ecdlink/graphql';
import { TenantContext } from '../../../../utils/constants';
import {
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
  Table,
  Typography,
} from '@ecdlink/ui';
import { formatDate } from '../../../../utils/date-utils/date-utils';
import { format } from 'date-fns';
import ReactDatePicker from 'react-datepicker';

export interface ContentListProps {
  selectedTab?: number;
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  languages: LanguageDto[];
  viewContent: (content?: ContentManagementView) => void;
  refreshParent: () => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
  choosedSectionTitle?: string;
  specialType?: string;
  setNatalType?: (item: number) => void;
  setSelectedType?: (item: ContentTypeDto) => void;
  dataTypes?: any;
}

export default function ContentList({
  selectedTab,
  contentType,
  languages,
  optionDefinitions,
  viewContent,
  refreshParent,
  onSearch,
  searchValue,
  choosedSectionTitle,
  specialType,
  setNatalType,
  setSelectedType,
  dataTypes,
}: ContentListProps) {
  const { hasPermission } = useUser();
  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [buttonText, setButtonText] = useState(contentType.name);

  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();
  const [typeFilter, setTypeFilter] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const sortByLanguageOptions: SearchDropDownOption<string>[] = languages?.map(
    (item) => ({
      id: item?.id,
      label: item?.description,
      value: item?.id,
    })
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
  const [showFilter, setShowFilter] = useState(false);

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
          x?.displayName === 'CTF45 - Languages' ||
          x?.displayName === 'Languages' ||
          x?.displayName === 'GT - Available Languages'
        )
          displayFields.push(x);
      });

      // if (contentType.name === 'CoachingCircleTopics') {
      //   displayFields.push(
      //     {
      //       "__typename": "ContentTypeField",
      //       "fieldOrder": orderedList.length + 1,
      //       "fieldName": "dateUpdated",
      //       "fieldType": {
      //           "__typename": "FieldType",
      //           "name": "Text",
      //           "dataType": "text"
      //       },
      //       "dataLinkName": "",
      //       "displayName": "Date Updated",
      //       "displayMainTable": true,
      //       "displayPage": false
      //   });
      // }

      if (choosedSectionTitle === 'Small/large group activities') {
        const smallLargeGroupsDisplayFields = displayFields?.filter(
          (item) => item?.fieldName !== 'subType'
        );
        setDisplayFields(smallLargeGroupsDisplayFields);
        return;
      }

      if (choosedSectionTitle === 'Story activities') {
        const smallLargeGroupsDisplayFields = displayFields?.filter(
          (item) => item?.fieldName !== 'subCategories'
        );
        setDisplayFields(smallLargeGroupsDisplayFields);
        return;
      }

      setDisplayFields(displayFields);
    }
  }, [choosedSectionTitle, contentType]);

  const fields =
    contentType.fields?.map((x) => {
      if (
        x.fieldType.dataType !== FieldType.Link &&
        x.fieldType.dataType !== FieldType.StaticLink
      )
        return x.fieldName;
      else if (x?.fieldName === 'subCategories')
        return `
        ${x.fieldName} {
          id
          name
          imageUrl
        }
        `;
      else if (
        x.fieldType.dataType === FieldType.Link &&
        x?.displayMainTable === true
      )
        return `
        ${x.fieldName} {
          id
          name
        }
      `;
      else
        return `
        ${x.fieldName} {
          id
        }
      `;
    }) ?? [];

  const getAllCall = `GetAll${contentType.name}`;

  const query = gql` 
    query ${getAllCall} ($localeId: String) {
      ${getAllCall} (localeId: $localeId) {
        id
        ${fields.join('\n')}
        }
      }
  `;

  const {
    data: contentData,
    refetch: refetchContent,
    loading: loadingContent,
  } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });

  const [
    natalQuery,
    {
      data: natalData,
      refetch: refetchNatalContent,
      loading: loadingNatalContent,
    },
  ] = useLazyQuery(GetNatalRecordsForType, {
    fetchPolicy: 'cache-and-network',
    variables: {
      contentTypeId: 29,
      natalType: 'postnatal',
      localeId: languageId,
    },
  });

  useEffect(() => {
    if (selectedTab === 2) {
      natalQuery({
        variables: {
          contentTypeId: 29,
          natalType: 'postnatal',
          localeId: languageId,
        },
      });
    }

    if (selectedTab === 3) {
      natalQuery({
        variables: {
          contentTypeId: 29,
          natalType: 'antenatal',
          localeId: languageId,
        },
      });
    }
  }, [languageId, natalQuery, selectedTab]);

  const { data: tenantData } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      const moreInforItems = contentData[getAllCall].map((item: any) => ({
        ...item,
      }));
      if (selectedTab === 1) {
        setTableData(
          moreInforItems?.filter(
            (item) => item?.type === 'Points' || item?.type === 'Info page'
          )
        );
      } else if (selectedTab === 2) {
        let postNatalData = moreInforItems.filter(
          (item: { type: string }) => item.type === 'postnatal'
        );
        setTableData(
          postNatalData?.length > 0 ? postNatalData : moreInforItems
        );
      } else if (selectedTab === 3) {
        let anteNatalData = moreInforItems.filter(
          (item: { type: string }) => item.type === 'antenatal'
        );

        setTableData(
          anteNatalData?.length > 0 ? anteNatalData : moreInforItems
        );
      } else if (selectedTab === 4) {
        const getFormattedDateString = (mDate: String) => {
          if (mDate == null || '') return '';
          const dateItems = mDate.split('T');
          return dateItems[0];
        };

        const copyItems = contentData[getAllCall].map((item: any) => ({
          ...item,
          startDate:
            item.startDate !== null
              ? getFormattedDateString(item.startDate)
              : '',
          endDate:
            item.startDate !== null ? getFormattedDateString(item.endDate) : '',
        }));

        setTableData(copyItems);
      } else {
        const copyItems = contentData[getAllCall].map((item: any) => ({
          ...item,
        }));

        // let clientProfileData = copyItems.filter(
        //   (item: { type: string; name: string }) => {
        //     return (
        //       item.type !== 'TermsAndConditions' &&
        //       item.name !== 'Personal Information'
        //     );
        //   }
        // );

        setTableData(copyItems);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData, selectedTab]);

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

  useEffect(() => {
    if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
      setSearchText('Search by topic…');
      setButtonText('Topic');
    } else if (contentType?.name === 'StoryBook') {
      setButtonText('Story');
    }
  }, [contentType.name]);

  const getContentGroupContentByLanguageId = (languageId: string) => {
    setLanguageId(languageId);
    refetchContent({
      localeId: languageId.toString(),
    });
  };

  const viewSelectedRow = useCallback(
    (item?: any) => {
      if (selectedTab === 2 || selectedTab === 3) {
        const selecteditem = natalData?.natalRecordsForType?.find(
          (record) => record?.title === item?.title
        );
        const currentType = dataTypes.contentTypes.find(
          (x: ContentTypeDto) =>
            Number(x.id) === Number(selecteditem?.childContentTypeId)
        );
        setSelectedType(currentType);
        setNatalType(Number(selecteditem?.childContentTypeId));
        const model: ContentManagementView = {
          content: selecteditem,
          languageId: languageId,
        };

        viewContent(model);

        return;
      }
      const currentType = dataTypes.contentTypes.find(
        (x: ContentTypeDto) => x.id === item?.childContentTypeId
      );
      setSelectedType(currentType);
      setNatalType(Number(item?.childContentTypeId));
      const model: ContentManagementView = {
        content: item,
        languageId: languageId,
      };

      viewContent(model);
    },
    [
      dataTypes.contentTypes,
      languageId,
      natalData?.natalRecordsForType,
      selectedTab,
      setNatalType,
      setSelectedType,
      viewContent,
    ]
  );

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
  const natalDataFiltered = useMemo(() => {
    return searchValue !== 'Search by title or content...'
      ? filterByValue(natalData?.natalRecordsForType, searchValue)
      : natalData?.natalRecordsForType;
  }, [filterByValue, natalData?.natalRecordsForType, searchValue]);

  const filteredData = useMemo(() => {
    const filteredByDate = natalDataFiltered?.filter((d) => {
      return (
        new Date(d?.updatedDate).getTime() >= new Date(startDate)?.getTime() &&
        new Date(d?.updatedDate).getTime() <= new Date(endDate)?.getTime()
      );
    });

    if (startDate && endDate) {
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
      const typeFilterValue = natalDataFiltered?.filter((el) => {
        return typeFilterValues?.some((f) => {
          return f === el.childType;
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
      const filteredbyLanguageObjects = natalDataFiltered.filter((item) =>
        item.availableLanguages.some((languageId) =>
          languageFilterValues.includes(languageId)
        )
      );
      return filteredbyLanguageObjects;
    }

    return natalDataFiltered;
  }, [
    endDate,
    languageFilter?.length,
    languageFilterValues,
    natalDataFiltered,
    startDate,
    typeFilterValues,
  ]);

  const columns = useMemo(
    () => [
      { field: 'title', use: 'Title' },
      { field: 'section', use: 'Section' },
      { field: `availableLanguages`, use: 'Languages' },
      { field: 'childType', use: 'Type' },
      { field: 'updatedDate', use: 'Last updated' },
    ],
    []
  );

  const chipColor = (type?: string) => {
    switch (type) {
      case NatalTypes.HealthPromotion:
        return 'bg-secondary';
      case NatalTypes.Info:
        return 'bg-tertiary';
      case NatalTypes.Infographic:
        return 'bg-infographicBg';
      case NatalTypes.Video:
        return 'bg-successMain';
      default:
        return 'bg-primary';
    }
  };

  const handleTypesStyles = useCallback((type: string) => {
    return (
      <div
        className={
          `${chipColor(type)}` +
          ' m-1 rounded-full py-1 px-3 text-xs text-white'
        }
      >
        {type}
      </div>
    );
  }, []);

  const rows =
    tenantData &&
    tenantData.tenantContext &&
    tenantData.tenantContext.applicationName === TenantContext.GrowGreat &&
    natalData &&
    natalData?.natalRecordsForType &&
    natalDataFiltered &&
    filteredData?.map((item) => ({
      title: item?.title,
      section: item?.section,
      availableLanguages: (
        <div className="ml-0 flex cursor-pointer flex-row items-center">
          {item?.availableLanguages?.map((item: any, index: number) => {
            const language = languages?.find(
              (language) => language?.id === item?.id || language?.id === item
            );
            return (
              <div
                key={`language_` + item?.id}
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
      childType: handleTypesStyles(item?.childType),
      updatedDate: formatDate(item?.updatedDate),
    }));

  const renderTables = useMemo(() => {
    if (
      tenantData &&
      tenantData.tenantContext &&
      tenantData.tenantContext.applicationName === TenantContext.GrowGreat &&
      natalData &&
      natalData?.natalRecordsForType &&
      (selectedTab === 2 || selectedTab === 3)
    ) {
      return (
        <Table
          columns={columns}
          rows={rows?.length > 0 ? rows : []}
          onClickRow={(item) => viewSelectedRow(item)}
        />
      );
    } else {
      return (
        <UiTable
          isLoading={!tableData.length && loadingContent}
          columns={displayFields?.map((item) => {
            return {
              field:
                typeof item.fieldName === 'string'
                  ? item.fieldName
                  : JSON?.stringify(item.fieldName),
              use:
                typeof item.displayName === 'string'
                  ? item.displayName
                  : JSON?.stringify(item.displayName),
            };
          })}
          rows={
            searchValue !== 'Search by title or content...'
              ? filterByValue(tableData, searchValue)
              : tableData
          }
          component={
            selectedTab === ContentManagementTabs.COMMUNITY.id
              ? ContentTypes.COACHING_CIRCLE_TOPICS
              : 'cms'
          }
          viewRow={
            hasPermission(PermissionEnum.update_static) && viewSelectedRow
          }
          onBulkActionCallback={onBulkActionCallback}
          languages={languages}
          noBulkSelection={true}
        />
      );
    }
  }, [
    columns,
    displayFields,
    filterByValue,
    hasPermission,
    languages,
    loadingContent,
    natalData,
    onBulkActionCallback,
    rows,
    searchValue,
    selectedTab,
    tableData,
    tenantData,
    viewSelectedRow,
  ]);

  const hasDateFilter = useMemo(() => (!startDate ? 0 : 1), [startDate]);
  const numberOfFilters = useMemo(
    () => typeFilter?.length + hasDateFilter,
    [hasDateFilter, typeFilter?.length]
  );

  const renderFilterButtonText = useMemo(() => {
    if (numberOfFilters) {
      if (numberOfFilters === 1) {
        return `${numberOfFilters} Filter`;
      }
      return `${numberOfFilters} Filters`;
    }

    return 'Filter';
  }, [numberOfFilters]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setTypeFilter([]);
    setLanguageFilter([]);
  };

  useEffect(() => {
    if (selectedTab) {
      clearFilters();
      setShowFilter(false);
    }
  }, [selectedTab]);

  if (tableData && displayFields) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="mb-8 flex flex-col items-center gap-2 md:justify-between lg:flex-row">
            <div className="bg-adminPortalBg relative w-full rounded-md lg:w-6/12">
              <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="text-textMid h-5 w-5" />
              </span>
              <input
                id="search-input"
                className="text-textMid focus:outline-none w-full rounded-md bg-transparent py-2 pl-11 focus:ring-2 focus:ring-offset-2"
                placeholder={searchText}
                onChange={onSearch}
              />
            </div>
            {hasPermission(PermissionEnum.create_static) &&
              contentType?.name !== ContentTypes.CONSENT &&
              contentType?.name !== ContentTypes.MORE_INFORMATION &&
              contentType?.name !== ContentTypes.POSTNATAL &&
              contentType?.name !== ContentTypes.ANTENATAL &&
              contentType?.name !== ContentTypes.NATALINFO &&
              contentType?.name !== ContentTypes.DANGERSIGN && (
                <button
                  onClick={() => {
                    hasPermission(PermissionEnum.update_static) &&
                      viewSelectedRow();
                  }}
                  type="button"
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 lg:w-auto"
                >
                  <PlusIcon width="22px" className="pl-1" />
                  Add {camelCaseToSentanceCase(buttonText)}
                </button>
              )}
            <div className="mt-0  flex w-10/12 justify-between sm:mt-0  sm:ml-4">
              {(selectedTab === 2 || selectedTab === 3) && (
                <div className="pr-2 ">
                  <span className=" text-lg font-medium leading-6 text-gray-900">
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      id="dropdownHoverButton"
                      className={`${
                        numberOfFilters
                          ? ' bg-secondary'
                          : 'border-secondary border-2 bg-white'
                      } focus:border-secondary focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium ${
                        numberOfFilters ? 'text-white' : 'text-textMid'
                      } hover:bg-gray-300 focus:ring-2`}
                      type="button"
                    >
                      <div className="flex items-center gap-1">
                        <Typography
                          className="truncate"
                          type="help"
                          color={numberOfFilters ? 'white' : 'textLight'}
                          text={renderFilterButtonText}
                        />
                        {!showFilter ? (
                          <span>
                            <ChevronDownIcon
                              className={`h-6 w-6 ${
                                numberOfFilters
                                  ? 'text-white'
                                  : 'text-textLight'
                              }`}
                            />
                          </span>
                        ) : (
                          <span>
                            <ChevronUpIcon
                              className={`h-6 w-6 ${
                                numberOfFilters
                                  ? 'text-white'
                                  : 'text-textLight'
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="pb-5 sm:flex sm:items-center sm:justify-between"></div>
          {showFilter && (
            <div className="mb-4 grid auto-cols-min grid-cols-5 items-center">
              {!filterDateAdded && (
                <div
                  onClick={() => setFilterDateAdded(!filterDateAdded)}
                  className="mr-1"
                >
                  <Dropdown
                    fillType="filled"
                    textColor={'textLight'}
                    fillColor={endDate ? 'secondary' : 'adminPortalBg'}
                    placeholder={dateDropdownValue || 'Last updated'}
                    labelColor={endDate ? 'white' : 'textLight'}
                    list={[]}
                    onChange={(item) => {}}
                    className="w-full text-sm text-white"
                  />
                </div>
              )}

              {filterDateAdded && (
                <div>
                  <ReactDatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange={true}
                    inline
                    shouldCloseOnSelect={true}
                  />
                </div>
              )}
              <div className="mr-2 flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={sortByNatalTypeOptions}
                  selectedOptions={typeFilter}
                  onChange={setTypeFilter}
                  placeholder={'Types'}
                  multiple={true}
                  color={'secondary'}
                  info={{
                    name: `Types:`,
                  }}
                  bgColor="adminPortalBg"
                />
              </div>

              <div className="mr-2 flex items-center gap-2">
                <SearchDropDown<string>
                  displayMenuOverlay={true}
                  className={'mr-1 w-full'}
                  menuItemClassName={
                    'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                  }
                  overlayTopOffset={'120'}
                  options={sortByLanguageOptions}
                  selectedOptions={languageFilter}
                  onChange={setLanguageFilter}
                  placeholder={'Languages'}
                  multiple={true}
                  color={'secondary'}
                  info={{
                    name: `Languages:`,
                  }}
                  bgColor="adminPortalBg"
                />
              </div>

              <div className=" flex-end flex">
                <button
                  onClick={clearFilters}
                  type="button"
                  className="text-secondary hover:bg-secondary outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:text-white "
                >
                  Clear All
                </button>
              </div>
              <div></div>
            </div>
          )}
          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                {renderTables}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
