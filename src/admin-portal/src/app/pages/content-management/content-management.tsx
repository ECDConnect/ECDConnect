import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserRoutes } from '../../app.routes';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import {
  GetAllLanguage,
  GetTenantContext,
  contentDefinitions,
  contentTypes,
} from '@ecdlink/graphql';
import { ContentTypeDto } from '@ecdlink/core';
import { ContentManagementView } from './content-management-models';
import ContentList from './sub-pages/content-list/content-list';
import { classNames } from '@ecdlink/ui';
import ContentLoader from '../../components/content-loader/content-loader';

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

  return (
    <div className="">
      {dataTypes ? (
        <>
          {!selectedContent && (
            <div className="flex flex-row bg-white">
              {dataTypes?.contentTypes?.map((item: ContentTypeDto) => (
                <div
                  key={item.id}
                  onClick={() => {
                    showGroupContentTypes(item);
                  }}
                  className={classNames(
                    selectedType?.id === item.id
                      ? 'bg-infoBb text-secondary border-b-secondary border-b-2  bg-white'
                      : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                    'group flex h-14 cursor-pointer items-center px-4 text-sm font-medium'
                  )}
                >
                  {item.description}
                </div>
              ))}
            </div>
          )}
          <div className=" lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              <div
                className="relative h-full rounded-xl bg-white p-12"
                style={{ minHeight: '36rem' }}
              >
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
          </div>{' '}
        </>
      ) : (
        <ContentLoader />
      )}
    </div>
  );
}

export default ContentManagement;
