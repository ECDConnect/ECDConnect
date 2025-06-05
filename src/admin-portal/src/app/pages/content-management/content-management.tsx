import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import {
  GetAllLanguage,
  contentDefinitions,
  contentTypes,
} from '@ecdlink/graphql';
import { ContentTypeDto, usePrevious } from '@ecdlink/core';
import {
  ActivitiesTitles,
  ContentManagementView,
  ResourcesTitles,
} from './content-management-models';
import ContentList from './sub-pages/content-list/content-list';
import { StackedList, TitleListDataItem, classNames } from '@ecdlink/ui';
import ContentLoader from '../../components/content-loader/content-loader';
import ContentWorkflow from './sub-pages/content-workflow/content-workflow';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useLazyQuery } from '@apollo/client';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../constants/content-management';
import { LinksShared } from './components/links-shared/links-shared';
import ProgressToolsContentList from './sub-pages/content-list/components/progress-tools-content-list/progress-tools-content-list';
import { useTenant } from '../../hooks/useTenant';
import { LinksSharedResource } from './components/links-shared/links-shared-resource';
import ResourceList from './sub-pages/content-list/components/resources/resource-list';
import StoryBookList from './sub-pages/content-list/components/create-story/story-book-list';
import { pluralize } from '../pages.utils';
import ActivityList from './sub-pages/content-list/components/activities/activity-list';
import ThemeList from './sub-pages/content-list/components/themes/theme-list';

export function ContentManagement() {
  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [selectedSubType, setSelectedSubType] = useState<ContentTypeDto>();
  const [searchValue, setSearchValue] = useState('');
  const [specialType, setSpecialType] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [allContentTypes, setAllContentTypes] = useState<ContentTypeDto[]>();
  const [subTabs, setSubTabs] = useState<TitleListDataItem[]>();
  const [choosedSectionTitle, setChoosedSectionTitleSectionTitle] =
    useState('');
  const previousTab = usePrevious(selectedTab);
  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();
  const tenant = useTenant();

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-first',
  });

  const [
    getContentTypes,
    { data: dataTypes, refetch, loading: isLoadingSelectedRow },
  ] = useLazyQuery(contentTypes, {
    variables: {
      search: '',
      searchInContent: null,
      isVisiblePortal: true,
    },
    fetchPolicy: 'cache-first',
  });

  const { data: dataDefinitions, refetch: refrechDefinitions } = useQuery(
    contentDefinitions,
    {
      fetchPolicy: 'cache-first',
    }
  );

  useEffect(() => {
    if (dataTypes && dataTypes.contentTypes) {
      setAllContentTypes(dataTypes.contentTypes);
    }

    if (dataTypes && dataTypes.contentTypes && !selectedType) {
      const defaultType = dataTypes.contentTypes?.find(
        (item) => item?.name === 'Consent'
      );
      setSelectedType(defaultType);
    } else if (dataTypes && dataTypes.contentTypes && selectedType) {
      const currentSelectedContent = dataTypes.contentTypes.find(
        (x) => x.id === selectedType.id
      );
      setSelectedType(currentSelectedContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTypes]);

  const getWLNavigationItems = () => {
    return [
      {
        name: ContentManagementTabs.PROGRAMMES.name,
        id: ContentManagementTabs.PROGRAMMES.id,
        href: '',
      },
      {
        name: ContentManagementTabs.RESOURCES.name,
        id: ContentManagementTabs.RESOURCES.id,
        href: '',
      },
    ];
  };

  const getOANavigationItems = () => {
    return [
      {
        name: 'Consent',
        href: '/content-management',
        id: 0,
      },
      {
        name: 'Info pages',
        href: 'MoreInformation',
        id: 1,
      },
      {
        name: ContentManagementTabs.PROGRAMMES.name,
        id: ContentManagementTabs.PROGRAMMES.id,
        href: '',
      },
      {
        name: ContentManagementTabs.RESOURCES.name,
        id: ContentManagementTabs.RESOURCES.id,
        href: '',
      },
    ];
  };

  const navigation = tenant.isWhiteLabel
    ? getWLNavigationItems()
    : getOANavigationItems();

  const history = useHistory();
  useEffect(() => {
    localStorage.removeItem('selectedUser');

    // GO TO DEFAULT ROUTE
    async function init() {
      if (tenant.isWhiteLabel) {
        // EC-3230 - hide consent and info pages
        setSelectedTab(navigation[0].id);
        setSpecialType(navigation[0].name);
      } else {
        history.push(navigation[0].href);
      }
    }

    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showGroupContentTypes = (
    item: ContentTypeDto,
    subItem?: ContentTypeDto
  ) => {
    setSelectedType(item);
    subItem && setSelectedSubType(subItem);
  };

  const getContentValues = (contentManagementView?: ContentManagementView) => {
    if (!dataTypes) {
      refetch();
    }

    const currentType = dataTypes.contentTypes.find(
      (x: ContentTypeDto) => x.id === selectedType?.id
    );
    setSelectedType(currentType);
    setSelectedContent(contentManagementView);
  };

  const refreshParent = () => {
    refetch();
    refrechDefinitions();
  };

  useEffect(() => {
    if (!dataTypes) {
      getContentTypes({
        variables: {
          search: searchValue,
          searchInContent: true,
          isVisiblePortal: true,
        },
      });
    }
  }, []);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 500);

  const handleSubTabs = useCallback(() => {
    if (specialType === ContentManagementTabs.PROCESS.name) {
      return setSubTabs([
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
        },
      ]);
    }
    if (specialType === ContentManagementTabs.RESOURCES.name) {
      return setSubTabs([
        {
          title: ResourcesTitles.ClassroomResources,
          description:
            'Add or edit resources in the classroom section of the app',
          titleIcon: 'PuzzleIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) =>
                type.name === ContentTypes.CLASSROOMBUSINESSRESOURCE
            );
            setChoosedSectionTitleSectionTitle(
              ResourcesTitles.ClassroomResources
            );
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
        {
          title: ResourcesTitles.BusinessResources,
          description:
            'Add or edit resources in the business section of the app',
          titleIcon: 'OfficeBuildingIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) =>
                type.name === ContentTypes.CLASSROOMBUSINESSRESOURCE
            );
            setChoosedSectionTitleSectionTitle(
              ResourcesTitles.BusinessResources
            );
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
        {
          title: ResourcesTitles.CommunityLinks,
          description:
            'Add or edit the links shared with practitioners and coaches',
          titleIcon: 'LinkIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === ContentTypes.CONNECT_ITEM
            );
            setChoosedSectionTitleSectionTitle(ResourcesTitles.CommunityLinks);
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
        {
          title: ResourcesTitles.ChildProgressReportLinksForCaregivers,
          description:
            'Change the links to be added to the child progress reports for caregivers',
          titleIcon: 'DocumentReportIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === ContentTypes.RESOURCE_LINK
            );
            setChoosedSectionTitleSectionTitle(
              ResourcesTitles.ChildProgressReportLinksForCaregivers
            );
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
      ]);
    }

    if (specialType === ContentManagementTabs.PROGRAMMES.name) {
      return setSubTabs([
        {
          title: 'Themes',
          description:
            'An organised set of activities based around a particular topic',
          titleIcon: 'SparklesIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === ContentTypes.THEME
            );
            setChoosedSectionTitleSectionTitle('');
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
              (type: ContentTypeDto) => type.name === ContentTypes.ACTIVITY
            );
            setChoosedSectionTitleSectionTitle(
              ActivitiesTitles.SmallLargeGroupActivities
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
            setChoosedSectionTitleSectionTitle(ActivitiesTitles.Storybooks);
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
        // Let the code here, to make possible to delete story book parts direct in the app
        // {
        //   title: 'Story Book Parts',
        //   description: 'Read aloud stories and story books',
        //   titleIcon: 'BookOpenIcon',
        //   titleIconClassName: 'bg-secondary text-white',
        //   onActionClick: () => {
        //     setSpecialType('');
        //     const selectedTypeObject = dataTypes?.contentTypes.find(
        //       (type: ContentTypeDto) => type.name === 'StoryBookParts'
        //     );
        //     showGroupContentTypes(selectedTypeObject);
        //     setChoosedSectionTitleSectionTitle(ActivitiesTitles.StorybookParts);
        //   },
        //   classNames: 'bg-white',
        // },
        {
          title: 'Story activities',
          description: 'Activities to do during story time ',

          titleIcon: 'BriefcaseIcon',
          titleIconClassName: 'bg-secondary text-white',

          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === 'Activity'
            );
            setChoosedSectionTitleSectionTitle(
              ActivitiesTitles.StoryActivities
            );
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
      ]);
    }
    return setSubTabs([]);
  }, [dataTypes?.contentTypes, specialType]);

  useEffect(() => {
    if (allContentTypes && allContentTypes.length !== 0) {
      handleSubTabs();
    }
  }, [allContentTypes]);

  useEffect(() => {
    if (previousTab !== selectedTab) {
      handleSubTabs();
    }
  }, [handleSubTabs, previousTab, selectedTab]);

  const goBackToList = () => {
    setSelectedContent(undefined);
    setSearchValue('');
  };

  const breadCrumbName = useCallback(
    (item: ContentTypeDto) => {
      if (item.name === ContentTypes.RESOURCE_LINK) {
        return ' Edit child progress report links';
      } else if (item.name === ContentTypes.CONNECT_ITEM) {
        return ' Edit community links';
      } else if (item.name === ContentTypes.STORY_BOOK) {
        return 'Stories';
      }
      if (
        choosedSectionTitle === ActivitiesTitles.StoryActivities ||
        choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities
      ) {
        return choosedSectionTitle;
      }
      return pluralize(item.name);
    },
    [choosedSectionTitle]
  );

  return (
    <div className="">
      {dataTypes && !isLoadingSelectedRow ? (
        <>
          {!selectedContent && (
            <div className="flex w-full  flex-row gap-4 overflow-auto whitespace-nowrap rounded-md bg-white">
              {navigation?.map((item: any) => (
                <button
                  key={item.name}
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
                      ? 'bg-adminPortalBg text-secondary border-b-secondary border-b-2'
                      : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                    'consent-tabs text-md flex h-14 items-center justify-center font-medium',
                    'flex w-5/12 justify-center'
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          {selectedType && languages?.GetAllLanguage && selectedContent ? (
            <ContentWorkflow
              optionDefinitions={dataDefinitions.contentDefinitions}
              contentView={selectedContent}
              contentType={selectedType}
              languages={languages.GetAllLanguage}
              goBack={() => goBackToList()}
              savedContent={() => refreshParent()}
              choosedSectionTitle={choosedSectionTitle}
              setSearchValue={setSearchValue}
              selectedTab={selectedTab}
            />
          ) : (
            <div className=" lg:min-w-0 lg:flex-1">
              <div className="h-full p-4 py-3">
                {!!subTabs?.length && !specialType && (
                  <div className="justify-self col-end-3 pb-2">
                    <button
                      onClick={() => {
                        setSelectedType(null);
                        setSpecialType(
                          navigation?.find((tab) => tab.id === selectedTab).name
                        );
                      }}
                      type="button"
                      className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
                    >
                      Content Management
                      <ArrowRightIcon className="text-secondary ml-1 mr-1 h-4 w-4" />
                      {navigation?.find((tab) => tab.id === selectedTab).name}
                      <ArrowRightIcon className="text-secondary ml-1 h-4 w-4" />
                      <span className="px-1 text-gray-400">
                        {breadCrumbName(selectedType)}
                      </span>
                    </button>
                  </div>
                )}
                <div
                  className="relative h-full rounded-xl bg-white p-12"
                  style={{ minHeight: '36rem' }}
                >
                  {selectedType &&
                    selectedType.name !== ContentTypes.RESOURCE_LINK &&
                    selectedType.name !== ContentTypes.CONNECT_ITEM &&
                    selectedType.name !== ContentTypes.STORY_BOOK &&
                    selectedType.name !== ContentTypes.ACTIVITY &&
                    selectedType.name !== ContentTypes.THEME &&
                    selectedType.name !==
                      ContentTypes.CLASSROOMBUSINESSRESOURCE &&
                    selectedType.name !==
                      ContentTypes.PROGRESS_TRACKING_SKILL &&
                    languages?.GetAllLanguage &&
                    specialType === '' && (
                      <ContentList
                        optionDefinitions={dataDefinitions?.contentDefinitions}
                        contentType={selectedType}
                        specialType={specialType}
                        languages={languages?.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        searchValue={searchValue}
                        choosedSectionTitle={choosedSectionTitle}
                        setSelectedType={setSelectedType}
                        dataTypes={dataTypes}
                      ></ContentList>
                    )}

                  {selectedType &&
                    selectedType.name ===
                      ContentTypes.PROGRESS_TRACKING_SKILL &&
                    languages?.GetAllLanguage &&
                    specialType === '' && (
                      <ProgressToolsContentList
                        optionDefinitions={dataDefinitions.contentDefinitions}
                        contentType={selectedType}
                        languages={languages.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        searchValue={searchValue}
                        choosedSectionTitle={choosedSectionTitle}
                      ></ProgressToolsContentList>
                    )}
                  {selectedType?.name ===
                    ContentTypes.CLASSROOMBUSINESSRESOURCE &&
                    !specialType && (
                      <ResourceList
                        optionDefinitions={dataDefinitions?.contentDefinitions}
                        contentType={selectedType}
                        specialType={specialType}
                        languages={languages?.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        choosedSectionTitle={choosedSectionTitle}
                        setSelectedType={setSelectedType}
                        dataTypes={dataTypes}
                      />
                    )}
                  {selectedType?.name === ContentTypes.ACTIVITY &&
                    !specialType && (
                      <ActivityList
                        optionDefinitions={dataDefinitions?.contentDefinitions}
                        contentType={selectedType}
                        specialType={specialType}
                        languages={languages?.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        choosedSectionTitle={choosedSectionTitle}
                        setSelectedType={setSelectedType}
                        dataTypes={dataTypes}
                      />
                    )}
                  {selectedType?.name === ContentTypes.STORY_BOOK &&
                    !specialType && (
                      <StoryBookList
                        optionDefinitions={dataDefinitions?.contentDefinitions}
                        contentType={selectedType}
                        specialType={specialType}
                        languages={languages?.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        choosedSectionTitle={choosedSectionTitle}
                        setSelectedType={setSelectedType}
                        dataTypes={dataTypes}
                      />
                    )}
                  {selectedType?.name === ContentTypes.THEME &&
                    !specialType && (
                      <ThemeList
                        optionDefinitions={dataDefinitions?.contentDefinitions}
                        contentType={selectedType}
                        specialType={specialType}
                        languages={languages?.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        choosedSectionTitle={choosedSectionTitle}
                        setSelectedType={setSelectedType}
                        dataTypes={dataTypes}
                      />
                    )}
                  {selectedType?.name === ContentTypes.RESOURCE_LINK &&
                    !specialType && (
                      <LinksSharedResource
                        contentType={selectedType}
                        onClose={() => {
                          setSelectedType(null);
                          setSpecialType(
                            navigation?.find((tab) => tab.id === selectedTab)
                              .name
                          );
                        }}
                      />
                    )}
                  {selectedType?.name === ContentTypes.CONNECT_ITEM &&
                    !specialType && (
                      <LinksShared
                        contentType={selectedType}
                        onClose={() => {
                          setSelectedType(null);
                          setSpecialType(
                            navigation?.find((tab) => tab.id === selectedTab)
                              .name
                          );
                        }}
                      />
                    )}
                  {!!subTabs?.length && !!specialType && (
                    <div className="flex">
                      <StackedList
                        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                        type="TitleList"
                        listItems={subTabs}
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
