/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useQuery } from '@apollo/client';
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
  ActivitiesTitles,
  ContentManagementView,
  FieldType,
  searchByActivityTypeOptions,
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
import {
  Dropdown,
  SearchDropDown,
  SearchDropDownOption,
  Table,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import ReactDatePicker from 'react-datepicker';
import { formatDate } from '../../../../utils/date-utils/date-utils';

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
  viewContent,
  refreshParent,
  onSearch,
  searchValue,
  choosedSectionTitle,
  setSelectedType,
  dataTypes,
}: ContentListProps) {
  const { hasPermission } = useUser();
  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [buttonText, setButtonText] = useState(contentType.name);
  const [themes, setThemes] = useState([]);
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

  const sortByThemeOptions: SearchDropDownOption<string>[] = themes?.map(
    (item) => ({
      id: item?.id,
      label: item?.name,
      value: item?.id,
    })
  );

  const [themeFilter, setThemeFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const [languageFilter, setLanguageFilter] = useState<
    SearchDropDownOption<string>[]
  >([]);

  const themeFilterValues = useMemo(
    () => themeFilter?.map((item) => item?.value),
    [themeFilter]
  );

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
          !!x.displayMainTable
        )
          displayFields.push(x);
      });

      if (choosedSectionTitle === 'Small/large group activities') {
        const smallLargeGroupsDisplayFields = displayFields?.filter(
          (item) => item?.fieldName !== 'subType'
        );
        setDisplayFields(smallLargeGroupsDisplayFields);
        return;
      }

      if (choosedSectionTitle === 'Story activities') {
        const smallLargeGroupsDisplayFields = displayFields?.filter(
          (item) =>
            item?.fieldName !== 'subCategories' && item?.fieldName !== 'themes'
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
      else if (x?.fieldName === 'themes')
        return `
        ${x.fieldName} {
          id
          name
          color
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
        setTableData(moreInforItems);
      } else if (selectedTab === 3) {
        if (
          choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities
        ) {
          setTableData(
            moreInforItems
              ?.filter(
                (item) =>
                  item?.type === 'Small group' || item?.type === 'Large group'
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedDate).getTime() -
                  new Date(a.updatedDate).getTime()
              )
          );
          const itemsWithThemes = moreInforItems?.filter(
            (item) => item?.themes != null && item?.themes.length > 0
          );
          let themeArray = [];
          itemsWithThemes?.map((x) => {
            x.themes?.map((y) => {
              themeArray.push(y);
            });
          });
          setThemes(themeArray);
        }

        if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
          setTableData(
            moreInforItems?.filter((item) => item?.type === 'Story time')
          );
          return;
        }

        setTableData(moreInforItems);
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
    const filteredByDate = tableData?.filter((d) => {
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

    if (themeFilterValues?.length > 0) {
      const themeFilterValue = tableData?.filter((el) => {
        return themeFilterValues?.some((f) => {
          return f === el.themes.id;
        });
      });

      if (languageFilter?.length > 0) {
        const filteredbyLanguageObjects = themeFilterValue.filter((item) =>
          item.availableLanguages.some((languageId) =>
            languageFilterValues.includes(languageId)
          )
        );
        return filteredbyLanguageObjects;
      }

      return themeFilterValue;
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
    themeFilterValues,
  ]);

  const renderTables = useMemo(() => {
    return (
      <UiTable
        isLoading={!filteredData.length && loadingContent}
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
            ? filterByValue(filteredData, searchValue)
            : filteredData
        }
        component={
          selectedTab === ContentManagementTabs.COMMUNITY.id
            ? ContentTypes.COACHING_CIRCLE_TOPICS
            : 'cms'
        }
        viewRow={hasPermission(PermissionEnum.update_static) && viewSelectedRow}
        onBulkActionCallback={onBulkActionCallback}
        languages={languages}
        noBulkSelection={true}
      />
    );
  }, [
    displayFields,
    filterByValue,
    hasPermission,
    languages,
    loadingContent,
    onBulkActionCallback,
    searchValue,
    selectedTab,
    tableData,
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
    setThemeFilter([]);
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
              {hasPermission(PermissionEnum.create_static) &&
                contentType?.name !== ContentTypes.CONSENT &&
                contentType?.name !== ContentTypes.MORE_INFORMATION && (
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
              {(selectedTab === 2 || selectedTab === 3) && (
                <>
                  <div className="mr-2 flex items-center gap-2">
                    <SearchDropDown<string>
                      displayMenuOverlay={true}
                      className={'mr-1 w-full'}
                      menuItemClassName={
                        'w-11/12 left-4 h-60 overflow-y-scroll bg-adminPortalBg'
                      }
                      overlayTopOffset={'120'}
                      options={searchByActivityTypeOptions}
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
                      options={sortByThemeOptions}
                      selectedOptions={themeFilter}
                      onChange={setThemeFilter}
                      placeholder={'Themes'}
                      multiple={true}
                      color={'secondary'}
                      info={{
                        name: `Themes:`,
                      }}
                      bgColor="adminPortalBg"
                    />
                  </div>
                </>
              )}
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
