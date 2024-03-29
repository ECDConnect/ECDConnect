/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  PermissionEnum,
} from '@ecdlink/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import {
  ActivitiesTitles,
  ContentManagementView,
  FieldType,
} from '../../content-management-models';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../../../constants/content-management';
import { BulkActionStatus } from '../../../../components/ui-table/type';
import { LanguageId } from '../../../../constants/language';
import { GetNatalRecordsForType, GetTenantContext } from '@ecdlink/graphql';
import { TenantContext } from '../../../../utils/constants';

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

        if (
          choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities
        ) {
          setTableData(
            moreInforItems?.filter(
              (item) =>
                item?.type === 'Small group' || item?.type === 'Large group'
            )
          );
          return;
        }

        if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
          setTableData(
            moreInforItems?.filter((item) => item?.type === 'Story time')
          );
          return;
        }

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
        <UiTable
          columns={[
            { field: 'title', use: 'Title' },
            { field: 'section', use: 'Section' },
            { field: `availableLanguages`, use: 'Languages' },
            { field: 'childType', use: 'Type' },
            { field: 'updatedDate', use: 'Last updated' },
          ]}
          rows={
            searchValue !== 'Search by title or content...'
              ? filterByValue(natalData?.natalRecordsForType, searchValue)
              : natalData?.natalRecordsForType
          }
          viewRow={hasPermission(PermissionEnum.update_user) && viewSelectedRow}
          noBulkSelection={true}
          languages={languages}
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
        />
      );
    }
  }, [
    displayFields,
    filterByValue,
    hasPermission,
    languages,
    loadingContent,
    natalData,
    onBulkActionCallback,
    searchValue,
    selectedTab,
    tableData,
    tenantData,
    viewSelectedRow,
  ]);

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
                // value={searchValue}
              />
            </div>
            {hasPermission(PermissionEnum.create_static) &&
              contentType?.name !== 'Consent' &&
              contentType?.name !== 'MoreInformation' &&
              contentType?.name !== 'ProgressTrackingLevel' &&
              contentType?.name !== 'ProgressTrackingCategory' && (
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
