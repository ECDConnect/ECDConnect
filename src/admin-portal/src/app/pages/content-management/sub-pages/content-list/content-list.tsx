/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useQuery } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  NOTIFICATION,
  PermissionEnum,
  useNotifications,
  usePanel,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import UiTable from '../../../../components/ui-table';
import { useUser } from '../../../../hooks/useUser';
import {
  ContentManagementView,
  FieldType,
} from '../../content-management-models';
import ContentCreate from './components/content-create/content-create';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../../../constants/content-management';
import { BulkActionStatus } from '../../../../components/ui-table/type';
import { LanguageId } from '../../../../constants/language';

export interface ContentListProps {
  selectedTab?: number;
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
  languages: LanguageDto[];
  viewContent: (content?: ContentManagementView) => void;
  refreshParent: () => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
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
}: ContentListProps) {
  const { hasPermission } = useUser();

  const [tableData, setTableData] = useState<any[]>([]);
  const { setNotification } = useNotifications();
  const panel = usePanel();
  const type = contentType.description;

  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);

  const [displayFields, setDisplayFields] = useState<ContentTypeFieldDto[]>();

  function filterByValue(array, value) {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

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
            x.fieldType.dataType === FieldType.Link) &&
            !!x.displayMainTable) ||
          x?.displayName === 'CTF45 - Languages' ||
          x?.displayName === 'Languages'
        )
          displayFields.push(x);
      });

      setDisplayFields(displayFields);
    }
  }, [contentType]);

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

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      const moreInforItems = contentData[getAllCall].map((item: any) => ({
        ...item,
      }));

      if (selectedTab === 1) {
        let clientProfileData = moreInforItems.filter(
          (item: { type: string }) => {
            return (
              item.type === 'client profile' ||
              item.type === 'Info Page' ||
              item?.type === 'Income Statements' ||
              item?.type === 'Taking Child Attendance' ||
              item?.type === 'League Of Stars' ||
              item?.type === 'Purple Clubs' ||
              item?.type === 'Learning Through Play' ||
              item?.type === 'The Daily Routine' ||
              item?.type === 'Tracking Progress' ||
              item?.type === 'Trainee Onboarding'
            );
          }
        );
        setTableData(
          clientProfileData?.length > 0 ? clientProfileData : moreInforItems
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

  const getContentGroupContentByLanguageId = (languageId: string) => {
    setLanguageId(languageId);
    refetchContent({
      localeId: languageId.toString(),
    });
  };

  const viewSelectedRow = (item?: any) => {
    const model: ContentManagementView = {
      content: item,
      languageId: languageId,
    };
    viewContent(model);
  };

  const displayCreatePanel = () => {
    panel({
      noPadding: true,
      title: `Create ${type}`,
      render: (onSubmit: any) => (
        <ContentCreate
          key={`contentPanelCreate`}
          acceptedFileFormats={
            selectedTab === ContentManagementTabs.COMMUNITY.id
              ? ['pdf']
              : undefined
          }
          selectedLanguageId={languageId}
          languages={languages}
          contentType={contentType}
          optionDefinitions={optionDefinitions}
          closeDialog={(created: boolean) => {
            onSubmit();

            if (created) {
              refetchContent({
                localeId: languageId.toString(),
              });
              refreshParent();

              setNotification({
                title: 'Successfully Created Content!',
                variant: NOTIFICATION.SUCCESS,
              });
            }
          }}
        />
      ),
    });
  };

  const onBulkActionCallback = (status: BulkActionStatus) => {
    if (status !== 'success') return;

    refetchContent({
      localeId: languageId.toString(),
    });
    refreshParent();
  };

  if (tableData && displayFields) {
    return (
      <div>
        <div className="flex flex-col">
          {/* <div className="pb-5 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium leading-6 text-white">{type}</h3>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <LanguageSelector
                  disabled={false}
                  languages={languages}
                  currentLanguageId={languageId}
                  selectLanguage={getContentGroupContentByLanguageId}
                />
              </div>
              <div className="flex flex-col">
                <div className="mt-1 ml-4">
                </div>
              </div>
            </div>
          </div> */}
          <div className="mb-8 flex flex-col items-center gap-2 md:justify-between lg:flex-row">
            <div className="bg-adminPortalBg relative w-full rounded-md lg:w-6/12">
              <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="text-textMid h-5 w-5" />
              </span>
              <input
                className="text-textMid focus:outline-none w-full rounded-md bg-transparent py-2 pl-11 focus:ring-2 focus:ring-offset-2"
                placeholder="Search by title, section or content..."
                onChange={onSearch}
              />
            </div>
            {hasPermission(PermissionEnum.create_static) &&
              contentType?.name !== 'Consent' && (
                <button
                  onClick={() => displayCreatePanel()}
                  type="button"
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex w-full items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 lg:w-auto"
                >
                  <PlusIcon width="22px" className="pl-1" />
                  Add {camelCaseToSentanceCase(contentType.name)}
                </button>
              )}
          </div>
          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  isLoading={!tableData.length && loadingContent}
                  columns={displayFields.map((item) => {
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
                    searchValue
                      ? filterByValue(tableData, searchValue)
                      : tableData
                  }
                  component={
                    selectedTab === ContentManagementTabs.COMMUNITY.id
                      ? ContentTypes.COACHING_CIRCLE_TOPICS
                      : 'cms'
                  }
                  viewRow={
                    hasPermission(PermissionEnum.update_static) &&
                    viewSelectedRow
                  }
                  onBulkActionCallback={onBulkActionCallback}
                  languages={languages}
                />
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
