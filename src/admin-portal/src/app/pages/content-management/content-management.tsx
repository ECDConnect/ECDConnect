import { useQuery } from '@apollo/client';
import { ContentTypeDto } from '@ecdlink/core';
import {
  contentDefinitions,
  contentTypes,
  GetAllLanguage,
} from '@ecdlink/graphql';
import { classNames } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import ContentLoader from '../../components/content-loader/content-loader';
import { ContentManagementView } from './content-management-models';
import ContentList from './sub-pages/content-list/content-list';
import ContentWorkflow from './sub-pages/content-workflow/content-workflow';
import SubNavigationLink from '../../components/sub-navigation-link/sub-navigation-link';

export default function ContentManagement() {
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

  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

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

  if (
    dataTypes &&
    dataTypes.contentTypes &&
    dataDefinitions &&
    dataDefinitions.contentDefinitions
  ) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-center bg-white ">
          {dataTypes.contentTypes.map((item) => (
            <div
             
              style={{
                width: '15%'
              }}
            >
              <SubNavigationLink
                key={`${item.name}-${new Date().getTime()}`}
                item={item}
              ></SubNavigationLink>
            </div>
          ))}
        </div>
        {!selectedContent && (
          <div className="shadow flex-1 min-w-0 bg-white xl:flex rounded bg-white">
            <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-uiMidDark ">
              {/* <div
                key={"contentGroupCreate"}
                onClick={() => displayPanel()}
                className={classNames(
                  "bg-uiMid text-white group flex items-center justify-between just px-4 text-sm font-medium h-14 cursor-pointer"
                )}
              >
                Create Content Type
                <PlusCircleIcon width="20px" />
              </div> */}
              {dataTypes.contentTypes.map((item: ContentTypeDto) => (
                <div
                  key={item.id}
                  onClick={() => {
                    showGroupContentTypes(item);
                  }}
                  className={classNames(
                    selectedType?.id === item.id
                      ? 'bg-uiMidDark text-white'
                      : 'text-textMid hover:bg-uiMidDark hover:text-white',
                    'group flex items-center px-4 text-sm font-medium h-14 cursor-pointer'
                  )}
                >
                  {item.description}
                </div>
              ))}
            </div>

            <div className="bg-uiMidDark lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  {selectedType && languages?.GetAllLanguage && (
                    <ContentList
                      optionDefinitions={dataDefinitions.contentDefinitions}
                      contentType={selectedType}
                      languages={languages.GetAllLanguage}
                      viewContent={getContentValues}
                      refreshParent={() => refreshParent()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedType && languages?.GetAllLanguage && selectedContent && (
          <ContentWorkflow
            optionDefinitions={dataDefinitions.contentDefinitions}
            contentView={selectedContent}
            contentType={selectedType}
            languages={languages.GetAllLanguage}
            goBack={() => setSelectedContent(undefined)}
            savedContent={() => refreshParent()}
          />
        )} 
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
