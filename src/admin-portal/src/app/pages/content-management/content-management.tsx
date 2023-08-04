import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import {
  GetAllLanguage,
  GetTenantContext,
  SortEnumType,
  contentDefinitions,
  contentTypes,
} from '@ecdlink/graphql';
import { ContentTypeDto } from '@ecdlink/core';
import { ContentManagementView } from './content-management-models';
import ContentList from './sub-pages/content-list/content-list';
import { classNames } from '@ecdlink/ui';
import ContentLoader from '../../components/content-loader/content-loader';
import ContentWorkflow from './sub-pages/content-workflow/content-workflow';
import { SearchIcon } from '@heroicons/react/solid';

export function ContentManagement() {
  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: dataTypes, refetch } = useQuery(contentTypes, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: dataDefinitions, refetch: refrechDefinitions } = useQuery(
    contentDefinitions,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    if (dataTypes && dataTypes.contentTypes && !selectedType) {
      setSelectedType(dataTypes.contentTypes[0]);
    } else if (dataTypes && dataTypes.contentTypes && selectedType) {
      const currentSelectedContent = dataTypes.contentTypes.find(
        (x) => x.id === selectedType.id
      );
      setSelectedType(currentSelectedContent);
      console.log(currentSelectedContent)
      setSelectedType(currentSelectedContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTypes]);

  const getNavigationItems = () => {
    console.log(data);
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === 'GrowGreat'
    ) {
      return [
        {
          name: 'All Roles',
          // href: '/',
        },
        {
          name: 'CHWs',
          // href: '/',
        },
        {
          name: 'Team Leads',
          // href: '/',
        },
        {
          name: 'Administrators',
          // href: '/',
        },
      ];
    } else {
      return [
        {
          name: 'Administrators',
          href: '/content-management',
        },
        {
          name: 'Administrators',
          // href: '/',
        },
        {
          name: 'Administrators',
          // href: '/',
        },
        {
          name: 'Administrators',
          // href: '/',
        },
      ];
    }
  };

  const navigation = getNavigationItems();

  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem('selectedUser');

    // GO TO DEFAULT ROUTE
    async function init() {
      history.push(navigation[0].href);
    }

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showGroupContentTypes = (item: ContentTypeDto) => {
    setSelectedType(item);
  };

  const getContentValues = (contentManagementView?: ContentManagementView) => {
    refetch().then(() => {
      const currentType = dataTypes.contentTypes.find(
        (x: ContentTypeDto) => x.id === selectedType?.id
      );
      setSelectedType(currentType);
      setSelectedContent(contentManagementView);
    });
  };

  const refreshParent = () => {
    refetch();
    refrechDefinitions();
  };

  const getVariables = (
    search: string,
    sortDescending: boolean,
    currentPage: number,
    pageSize: number
  ) => {
    return {
      search: search,
      order: [
        { insertedDate: sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
        { fullName: sortDescending ? SortEnumType.Desc : SortEnumType.Asc },
      ],
      pagingInput: {
        pageNumber: currentPage,
        pageSize: pageSize,
        filterBy: [
          {
            fieldName: 'ADMINISTRATOR',
            filterType: 'EQUALS',
            value: 'true',
          },
        ],
      },
    };
  };

  const [searchValue, setSearchValue] = useState('');



  const searchContent = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  return (
    <div className="">
      {dataTypes ? (
        <>
          {!selectedContent && (
            <div className="flex flex-row  w-full overflow-auto bg-white rounded-md">
              {dataTypes?.contentTypes?.map((item: ContentTypeDto) => (
                <div
                  key={item.id}
                  className={
                    data?.tenantContext.applicationName === 'GrowGreat'
                      ? 'w-3/12 '
                      : 'w-5/12 px-4'
                  }
                >
                  <a
                    onClick={() => {
                      showGroupContentTypes(item);
                    }}
                    className={classNames(
                      selectedType?.id === item.id
                        ? 'bg-infoBb text-secondary border-b-secondary border-b-2  '
                        : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                      'consent-tabs flex h-14 items-center text-md font-medium'
                    )}
                  >
                    {item.description}

                  </a>
                </div>

              ))}
            </div>
          )}


          {(selectedType && languages?.GetAllLanguage && selectedContent) ? (
            <ContentWorkflow
              optionDefinitions={dataDefinitions.contentDefinitions}
              contentView={selectedContent}
              contentType={selectedType}
              languages={languages.GetAllLanguage}
              goBack={() => setSelectedContent(undefined)}
              savedContent={() => refreshParent()}
            />
          ) : <div className=" lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">

              <div
                className="relative h-full rounded-xl bg-white px-14 py-12"
                style={{ minHeight: '36rem' }}
              >
                <div className="relative w-6/12">
                  <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                    {searchValue === '' && (
                      <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                    )}
                  </span>
                  <input
                    className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                    placeholder="      Search by email or name..."
                    onChange={() => searchContent}
                  />
                </div>
                {selectedType && languages?.GetAllLanguage && (
                  <ContentList
                    optionDefinitions={dataDefinitions.contentDefinitions}
                    contentType={selectedType}
                    languages={languages.GetAllLanguage}
                    viewContent={getContentValues}
                    refreshParent={() => refreshParent()}
                  ></ContentList>
                )}
              </div>
            </div>
          </div>}
        </>
      ) : (
        <ContentLoader />
      )}
    </div>
  );
}

export default ContentManagement;

