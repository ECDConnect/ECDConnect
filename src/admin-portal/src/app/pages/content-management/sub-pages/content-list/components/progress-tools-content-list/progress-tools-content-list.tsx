/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useQuery } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  PermissionEnum,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import UiTable from '../../../../../../components/ui-table';
import { useUser } from '../../../../../../hooks/useUser';
import {
  ContentManagementView,
  FieldType,
} from '../../../../content-management-models';
import { PlusIcon, SearchIcon } from '@heroicons/react/solid';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../../../../../constants/content-management';
import { BulkActionStatus } from '../../../../../../components/ui-table/type';
import { LanguageId } from '../../../../../../constants/language';

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
}

export default function ProgressToolsContentList({
  selectedTab,
  contentType,
  languages,
  optionDefinitions,
  viewContent,
  refreshParent,
  onSearch,
  searchValue,
  choosedSectionTitle,
}: ContentListProps) {
  const { hasPermission } = useUser();
  const [tableData, setTableData] = useState<any[]>([]);
  const [languageId, setLanguageId] = useState<string>(LanguageId.enZa);
  const [searchText, setSearchText] = useState('Search by title or content...');
  const [buttonText, setButtonText] = useState(contentType.name);

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
            x.fieldType.dataType === FieldType.Link ||
            x.fieldType.dataType === FieldType.DatePicker) &&
            !!x.displayMainTable) ||
          x?.displayName === 'CTF45 - Languages' ||
          x?.displayName === 'Languages'
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

  const categoriesQuery = gql`
    query GetAllProgressTrackingCategory($localeId: String) {
      GetAllProgressTrackingCategory(localeId: $localeId) {
        id
        subCategories {
          id
          name
          imageUrl
          __typename
          skills {
            id
          }
        }
        imageUrl
        color
        description
        subTitle
        name
        __typename
      }
    }
  `;

  const subcategoriesQuery = gql`
    query GetAllProgressTrackingSubCategory($localeId: String) {
      GetAllProgressTrackingSubCategory(localeId: $localeId) {
        id
        skills {
          id
          __typename
        }
        imageUrl
        imageHexColor
        description
        name
        __typename
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

  const {
    data: categoriesContentData,
    refetch: refetchCategoriesContent,
    loading: loadingCategoriesContent,
  } = useQuery(categoriesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });

  const {
    data: subcategoriesContentData,
    refetch: refetchSubcategoriesContent,
    loading: loadingSubCategoriesContent,
  } = useQuery(subcategoriesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: languageId,
    },
  });

  const catArray = categoriesContentData?.GetAllProgressTrackingCategory?.map(
    (item) => {
      return {
        name: item?.name,
        id: item?.id,
        skills:
          item?.subCategories?.[0]?.skills?.length +
          item?.subCategories?.[1]?.skills?.length,
      };
    }
  );

  useEffect(() => {
    if (contentData && contentData[getAllCall]) {
      const moreInforItems = contentData[getAllCall].map((item: any) => ({
        ...item,
      }));

      if (selectedTab === 1) {
        // Wait for validation on dev
        // let clientProfileData = moreInforItems.filter(
        //   (item: { type: string }) => {
        //     return (
        //       item.type === 'client profile' ||
        //       item.type === 'Info Page' ||
        //       item?.type === 'Income Statements' ||
        //       item?.type === 'Taking Child Attendance' ||
        //       item?.type === 'League Of Stars' ||
        //       item?.type === 'Purple Clubs' ||
        //       item?.type === 'Learning Through Play' ||
        //       item?.type === 'The Daily Routine' ||
        //       item?.type === 'Tracking Progress' ||
        //       item?.type === 'Trainee Onboarding'
        //     );
        //   }
        // );
        setTableData(moreInforItems);
      } else if (selectedTab === 2) {
        const postNatalData = moreInforItems.filter(
          (item: { type: string }) => item.type === 'postnatal'
        );
        setTableData(
          postNatalData?.length > 0 ? postNatalData : moreInforItems
        );
      } else if (selectedTab === 3) {
        const anteNatalData = moreInforItems.filter(
          (item: { type: string }) => item.type === 'antenatal'
        );

        if (choosedSectionTitle === 'Small/large group activities') {
          setTableData(
            moreInforItems?.filter(
              (item) =>
                item?.type === 'Small group' || item?.type === 'Large group'
            )
          );
          return;
        }

        if (choosedSectionTitle === 'Story activities') {
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

  //TO BE REMOVED AFTER NEW CREATE BE VALIDATED
  // const displayCreatePanel = () => {
  //   panel({
  //     noPadding: true,
  //     title: `Create ${type}`,
  //     render: (onSubmit: any) => (
  //       <ContentCreate
  //         key={`contentPanelCreate`}
  //         acceptedFileFormats={
  //           selectedTab === ContentManagementTabs.COMMUNITY.id
  //             ? ['pdf']
  //             : undefined
  //         }
  //         selectedLanguageId={languageId}
  //         languages={languages}
  //         contentType={contentType}
  //         optionDefinitions={optionDefinitions}
  //         closeDialog={(created: boolean) => {
  //           onSubmit();

  //           if (created) {
  //             refetchContent({
  //               localeId: languageId.toString(),
  //             });
  //             refreshParent();

  //             setNotification({
  //               title: 'Successfully Created Content!',
  //               variant: NOTIFICATION.SUCCESS,
  //             });
  //           }
  //         }}
  //       />
  //     ),
  //   });
  // };

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
          {/* EC-1701 - remove search bar  */}
          {/* <div className="mb-8 flex flex-col items-center gap-2 md:justify-between lg:flex-row">
            <div className="bg-adminPortalBg relative w-full rounded-md lg:w-6/12">
              <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                <SearchIcon className="text-textMid h-5 w-5" />
              </span>
              <input
                className="text-textMid focus:outline-none w-full rounded-md bg-transparent py-2 pl-11 focus:ring-2 focus:ring-offset-2"
                placeholder={searchText}
                onChange={onSearch}
              />
            </div>
          </div> */}
          <div className=" -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <UiTable
                  isLoading={!tableData.length && loadingContent}
                  columns={[
                    { field: 'name', use: 'Name' },
                    { field: 'skills', use: '# skills' },
                  ]}
                  rows={
                    searchValue
                      ? filterByValue(catArray, searchValue)
                      : catArray
                  }
                  component={
                    selectedTab === ContentManagementTabs.RESOURCES.id
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
