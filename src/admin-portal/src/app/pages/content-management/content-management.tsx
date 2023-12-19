import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
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
import { StackedList, StackedListItemType, classNames } from '@ecdlink/ui';
import ContentLoader from '../../components/content-loader/content-loader';
import ContentWorkflow from './sub-pages/content-workflow/content-workflow';
import { ArrowLeftIcon, SearchIcon } from '@heroicons/react/solid';
import { useLazyQuery } from '@apollo/client';

export function ContentManagement() {
  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [searchValue, setSearchValue] = useState('');
  const [specialType, setSpecialType] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const [getContentTypes, { data: dataTypes, refetch }] = useLazyQuery(
    contentTypes,
    {
      variables: {
        search: '',
        searchInContent: null,
        isVisiblePortal: true,
        // contentTypeIdFilter: '',
        // contentTypeNameFilter: ''
      },
      fetchPolicy: 'cache-and-network',
    }
  );

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
    if (
      data &&
      data.tenantContext &&
      data.tenantContext.applicationName === 'GrowGreat'
    ) {
      return [
        {
          name: 'Consent',
          // href: '/',
          id: 0,
        },
        {
          name: 'Info  pages',
          href: 'MoreInformation',
          id: 1,
        },
        {
          name: 'Postnatal',
          href: 'MoreInformation',
          id: 2,
        },
        {
          name: 'Antenatal',
          href: 'MoreInformation',
          id: 3,
        },
        {
          name: 'Danger signs',
          // href: '/',
          id: 4,
        },
        {
          name: 'Community',
          href: 'CommunitySectionGG',
          id: 5,
        },
      ];
    } else {
      return [
        {
          name: 'Consent',
          // href: '/content-management',
          id: 0,
        },
        {
          name: 'Info pages',
          href: 'MoreInformation',
          id: 1,
        },
        {
          name: 'Progress',
          // href: '/',
          id: 2,
        },
        {
          name: 'Programmes',
          // href: '/',
          id: 3,
        },
        {
          name: 'Community',
          id: 4,
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

  useEffect(() => {
    getContentTypes({
      variables: {
        search: searchValue,
        searchInContent: true,
        isVisiblePortal: true,
        // contentTypeIdFilter: null,
        // contentTypeNameFilter: ''
      },
    });
    // TODO: Use actual pagination when table component supports it.
    // const getUserCountQueryVariables = getCountVariables(searchValue);
    // getCountUsers({
    //   variables: getUserCountQueryVariables
    // });
  }, []);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 500);

  const listItems: StackedListItemType[] = [];

  if (specialType === 'Progress') {
    listItems.push(
      {
        title: 'Levels',
        description:
          'Children will be placed at a specific level or stage of development',
        titleIcon: 'ChartBarIcon',
        titleIconClassName: 'bg-secondary text-white',
        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'ProgressTrackingLevel'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      {
        title: 'Progress categories & subcategories',
        description: 'Development areas',
        titleIcon: 'PresentationChartBarIcon',
        titleIconClassName: 'bg-secondary text-white',
        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'ProgressTrackingCategory'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      // {
      //   title: 'Progress subcategories',
      //   description: 'Development areas',
      //   titleIcon: 'PresentationChartBarIcon',
      //   titleIconClassName: 'bg-secondary text-white',
      //   onActionClick: () => {
      //     setSpecialType('');
      //     const selectedTypeObject = dataTypes?.contentTypes.find(
      //       (type: ContentTypeDto) =>
      //         type.name === 'ProgressTrackingSubCategory'
      //     );
      //     showGroupContentTypes(selectedTypeObject);
      //   },
      //   classNames: 'bg-uiBg',
      // },
      {
        title: 'Progress tool',
        description: 'Edit the skills shown in the progress tracker',
        titleIcon: 'PresentationChartBarIcon',
        titleIconClassName: 'bg-secondary text-white',
        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'ProgressTrackingSkill'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      }
    );
  } else {
    listItems.push(
      {
        title: 'Themes',
        description:
          'An organized set of activities based around a particular topic',
        titleIcon: 'SparklesIcon',
        titleIconClassName: 'bg-secondary text-white',
        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'Theme'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      {
        title: 'Small/large group activities',
        description:
          'Classroom activities for children to do either in small groups or as a whole class',
        titleIcon: 'UsersIcon',
        titleIconClassName: 'bg-secondary text-white',

        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'Activity'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      {
        title: 'Stories',
        description: 'Read aloud stories and story books',
        titleIcon: 'BookOpenIcon',
        titleIconClassName: 'bg-secondary text-white',

        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'StoryBook'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      {
        title: 'Story Book Parts',
        description: 'Read aloud stories and story books',
        titleIcon: 'BookOpenIcon',
        titleIconClassName: 'bg-secondary text-white',
        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'StoryBookParts'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      },
      {
        title: 'Story activities',
        description: 'Activities to do during story time ',

        titleIcon: 'BriefcaseIcon',
        titleIconClassName: 'bg-secondary text-white',

        onActionClick: () => {
          setSpecialType('');
          const selectedTypeObject = dataTypes?.contentTypes.find(
            (type: ContentTypeDto) => type.name === 'StoryBookPartQuestion'
          );
          showGroupContentTypes(selectedTypeObject);
        },
        classNames: 'bg-white',
      }
    );
  }

  return (
    <div className="">
      {dataTypes ? (
        <>
          {!selectedContent && (
            <div className="flex w-full  flex-row overflow-auto rounded-md bg-white">
              {navigation.map((item: any) => (
                <div
                  key={item.name}
                  className={
                    data?.tenantContext.applicationName === 'GrowGreat'
                      ? 'w-3/12 '
                      : 'w-5/12 px-4'
                  }
                >
                  <a
                    onClick={() => {
                      const selectedTypeObject = dataTypes?.contentTypes.find(
                        (type: ContentTypeDto) =>
                          type.name === item.name || type.name === item.href
                      );
                      if (selectedTypeObject) {
                        setSelectedTab(item.id);
                        setSpecialType('');
                        showGroupContentTypes(selectedTypeObject);
                      } else {
                        setSelectedTab(item.id);
                        setSpecialType(item.name);
                      }
                    }}
                    className={classNames(
                      item.id === selectedTab
                        ? 'bg-adminPortalBg text-secondary border-b-secondary border-b-2  '
                        : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                      'consent-tabs text-md flex h-14 items-center font-medium'
                    )}
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </div>
          )}

          {selectedType && languages?.GetAllLanguage && selectedContent ? (
            <ContentWorkflow
              optionDefinitions={dataDefinitions.contentDefinitions}
              contentView={selectedContent}
              contentType={selectedType}
              languages={languages.GetAllLanguage}
              goBack={() => setSelectedContent(undefined)}
              savedContent={() => refreshParent()}
            />
          ) : (
            <div className=" lg:min-w-0 lg:flex-1">
              <div className="h-full py-3 px-4 sm:px-6 lg:px-8">
                {(selectedType?.name === 'Theme' ||
                  selectedType?.name === 'Activity' ||
                  selectedType?.name === 'ProgressTrackingLevel' ||
                  selectedType?.name === 'ProgressTrackingCategory' ||
                  selectedType?.name === 'StoryBookParts' ||
                  selectedType?.name === 'StoryBook' ||
                  selectedType?.name === 'StoryBookPartQuestion') && (
                  <div className="justify-self col-end-3 pb-2">
                    <button
                      onClick={() => {
                        setSelectedType(null);
                        setSpecialType(
                          selectedTab === 2 ? 'Progress' : 'Programmes'
                        );
                      }}
                      type="button"
                      className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
                    >
                      <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
                        {' '}
                      </ArrowLeftIcon>
                      {selectedTab === 2 ? 'Progress' : 'Programmes'}
                      <span className="px-1 text-gray-400">
                        {' '}
                        / {selectedType?.name}
                      </span>
                    </button>
                  </div>
                )}
                <div
                  className="relative h-full rounded-xl bg-white p-12"
                  style={{ minHeight: '36rem' }}
                >
                  {specialType === '' && (
                    <div className="relative w-6/12 py-8">
                      <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                        {searchValue === '' && (
                          <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                        )}
                      </span>
                      <input
                        className="bg-adminPortalBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                        placeholder="      Search by title, section or content..."
                        onChange={search}
                      />
                    </div>
                  )}
                  {selectedType &&
                    languages?.GetAllLanguage &&
                    specialType === '' && (
                      <ContentList
                        optionDefinitions={dataDefinitions.contentDefinitions}
                        contentType={selectedType}
                        languages={languages.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        searchValue={searchValue}
                      ></ContentList>
                    )}
                  {specialType === 'Programmes' && (
                    <div className="flex">
                      <StackedList
                        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                        type="TitleList"
                        listItems={listItems}
                      />
                    </div>
                  )}

                  {specialType === 'Progress' && (
                    <div className="flex">
                      <StackedList
                        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                        type="TitleList"
                        listItems={listItems}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <ContentLoader />
      )}
    </div>
  );
}

export default ContentManagement;
