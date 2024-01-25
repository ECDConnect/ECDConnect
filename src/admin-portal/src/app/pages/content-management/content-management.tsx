import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useQuery } from '@apollo/client/react/hooks/useQuery';
import {
  GetAllLanguage,
  GetTenantContext,
  contentDefinitions,
  contentTypes,
} from '@ecdlink/graphql';
import { ContentTypeDto, usePrevious } from '@ecdlink/core';
import {
  ActivitiesTitles,
  ContentManagementView,
} from './content-management-models';
import ContentList from './sub-pages/content-list/content-list';
import { StackedList, TitleListDataItem, classNames } from '@ecdlink/ui';
import ContentLoader from '../../components/content-loader/content-loader';
import ContentWorkflow from './sub-pages/content-workflow/content-workflow';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useLazyQuery } from '@apollo/client';
import {
  ContentManagementTabs,
  ContentTypes,
} from '../../constants/content-management';
import { LinksShared } from './components/links-shared/links-shared';
import ProgressToolsContentList from './sub-pages/content-list/components/progress-tools-content-list/progress-tools-content-list';

export function ContentManagement() {
  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [selectedSubType, setSelectedSubType] = useState<ContentTypeDto>();
  const [searchValue, setSearchValue] = useState('');
  const [specialType, setSpecialType] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [subTabs, setSubTabs] = useState<TitleListDataItem[]>();
  const [choosedSectionTitle, setChoosedSectionTitleSectionTitle] =
    useState('');

  const previousTab = usePrevious(selectedTab);

  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const [
    getContentTypes,
    { data: dataTypes, refetch, loading: isLoadingSelectedRow },
  ] = useLazyQuery(contentTypes, {
    variables: {
      search: '',
      searchInContent: null,
      isVisiblePortal: true,
      // contentTypeIdFilter: '',
      // contentTypeNameFilter: ''
    },
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
          name: ContentManagementTabs.COMMUNITY.name,
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
          name: ContentManagementTabs.PROCESS.name,
          // href: '/',
          id: ContentManagementTabs.PROCESS.id,
        },
        {
          name: ContentManagementTabs.PROGRAMMES.name,
          // href: '/',
          id: ContentManagementTabs.PROGRAMMES.id,
        },
        {
          name: ContentManagementTabs.COMMUNITY.name,
          id: ContentManagementTabs.COMMUNITY.id,
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

  const showGroupContentTypes = (
    item: ContentTypeDto,
    subItem?: ContentTypeDto
  ) => {
    setSelectedType(item);
    subItem && setSelectedSubType(subItem);
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
        },
      ]);
    }

    if (specialType === ContentManagementTabs.COMMUNITY.name) {
      return setSubTabs([
        {
          title: 'Coaching circle topics',
          description: 'Add, edit, delete topics for coaches',
          titleIcon: 'DuplicateIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) =>
                type.name === ContentTypes.COACHING_CIRCLE_TOPICS
            );
            showGroupContentTypes(selectedTypeObject);
          },
          classNames: 'bg-white',
        },
        {
          title: 'Connect tab',
          description:
            'Add or edit the links shared with practitioners and coaches',
          titleIcon: 'PuzzleIcon',
          titleIconClassName: 'bg-secondary text-white',
          onActionClick: () => {
            setSpecialType('');
            const selectedTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === ContentTypes.CONNECT
            );

            const selectedSubTypeObject = dataTypes?.contentTypes.find(
              (type: ContentTypeDto) => type.name === ContentTypes.CONNECT_ITEM
            );
            showGroupContentTypes(selectedTypeObject, selectedSubTypeObject);
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
            setChoosedSectionTitleSectionTitle(ActivitiesTitles.StorybookParts);
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
    if (previousTab !== selectedTab) {
      handleSubTabs();
    }
  }, [handleSubTabs, previousTab, selectedTab]);

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
                    data?.tenantContext.applicationName === 'GrowGreat'
                      ? 'w-3/12'
                      : 'flex w-5/12 justify-center'
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
              goBack={() => setSelectedContent(undefined)}
              savedContent={() => refreshParent()}
              choosedSectionTitle={choosedSectionTitle}
            />
          ) : (
            <div className=" lg:min-w-0 lg:flex-1">
              <div className="h-full py-3">
                {!!subTabs?.length && !specialType && (
                  <div className="justify-self col-end-3 pb-2">
                    <button
                      onClick={() => {
                        if (selectedType?.name === ContentTypes.CONNECT) return;

                        setSelectedType(null);
                        setSpecialType(
                          navigation?.find((tab) => tab.id === selectedTab).name
                        );
                      }}
                      type="button"
                      className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
                    >
                      {selectedType?.name !== ContentTypes.CONNECT && (
                        <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4" />
                      )}
                      {navigation?.find((tab) => tab.id === selectedTab).name}
                      <span className="px-1 text-gray-400">
                        {' '}
                        / {selectedType?.description}
                      </span>
                    </button>
                  </div>
                )}
                <div
                  className="relative h-full rounded-xl bg-white p-4 md:p-12"
                  style={{ minHeight: '36rem' }}
                >
                  {selectedType &&
                    selectedType.name !== ContentTypes.CONNECT &&
                    selectedType.name !== 'ProgressTrackingSkill' &&
                    languages?.GetAllLanguage &&
                    specialType === '' && (
                      <ContentList
                        optionDefinitions={dataDefinitions.contentDefinitions}
                        contentType={selectedType}
                        languages={languages.GetAllLanguage}
                        viewContent={getContentValues}
                        refreshParent={() => refreshParent()}
                        selectedTab={selectedTab}
                        onSearch={search}
                        searchValue={searchValue}
                        choosedSectionTitle={choosedSectionTitle}
                      ></ContentList>
                    )}

                  {selectedType &&
                    selectedType.name !== ContentTypes.CONNECT &&
                    selectedType.name === 'ProgressTrackingSkill' &&
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
                  {/* TODO: Replace it with dynamic validation (example: selectedType.type === 'linkGroup') */}
                  {selectedType?.name === ContentTypes.CONNECT &&
                    !specialType && (
                      <LinksShared
                        contentType={selectedType}
                        subContentType={selectedSubType}
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
