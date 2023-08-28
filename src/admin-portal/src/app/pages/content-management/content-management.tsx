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
import { ContentTypeDto, DocumentTypeDto } from '@ecdlink/core';
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

  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });


  const [getContentTypes, { data: dataTypes, refetch }] = useLazyQuery(contentTypes, {
    variables: {
      search: '',
      searchInContent: null,
      isVisiblePortal: true,
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
      setSelectedType(dataTypes.contentTypes[0]);
    } else if (dataTypes && dataTypes.contentTypes && selectedType) {
      const currentSelectedContent = dataTypes.contentTypes.find(
        (x) => x.id === selectedType.id
      );
      setSelectedType(currentSelectedContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTypes]);


  // Helper function to check if a navigation item is selected
  const isSelected = (itemName: string) => {
    return (
      selectedType?.name === itemName ||
      isSelectedRelated(itemName) ||
      specialType === itemName
    );
  };

  // Helper function to check if a related navigation item is selected
  const isSelectedRelated = (itemName: string) => {
    if (itemName === 'Info  pages') {
      return (
        selectedType?.name === 'Postnatal' || selectedType?.name === 'Antenatal'
      );
    }
    return false;
  };

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
        },
        {
          name: 'Info  pages',
          href: 'MoreInformation',
          id: 0
        },
        {
          name: 'Postnatal',
          href: 'MoreInformation',
          id: 1

        },
        {
          name: 'Antenatal',
          href: 'MoreInformation',
          id: 2
        },
        {
          name: 'Danger signs',
          // href: '/',
        },
        {
          name: 'Community',
          href: 'CommunitySectionGG',
        },
      ];
    } else {
      return [
        {
          name: 'Consent',
          // href: '/content-management',
        },
        {
          name: 'Info pages',
          href: 'MoreInformation',
        },
        {
          name: 'Progress',
          // href: '/',
        },
        {
          name: 'Programmes',
          // href: '/',
        },
        {
          name: 'Community',
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
    console.log(searchValue)
    getContentTypes(
      {
        variables: {
          search: searchValue,
          searchInContent: true,
          isVisiblePortal: true,
        }
      });
    // TODO: Use actual pagination when table component supports it.
    // const getUserCountQueryVariables = getCountVariables(searchValue);
    // getCountUsers({
    //   variables: getUserCountQueryVariables
    // });
  }, [searchValue]);

  console.log(dataTypes?.contentTypes);

  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value || '');
  }, 150);

  const programItems: StackedListItemType[] = [];

  programItems.push(
    {
      title: 'Themes',
      description: 'An organized set of activities based around a particular topic',
      titleIcon: 'SparklesIcon',
      titleIconClassName: 'bg-secondary text-white',
      onActionClick: () => {
        setSpecialType('');
        const selectedTypeObject = dataTypes?.contentTypes.find((type: ContentTypeDto) => (type.name === 'Theme'));
        showGroupContentTypes(selectedTypeObject);
      },
      classNames: 'bg-uiBg',
    },
    {
      title: 'Small/large group activities',
      description: 'Classroom activities for children to do either in small groups or as a whole class',
      titleIcon: 'UsersIcon',
      titleIconClassName: 'bg-secondary text-white',

      onActionClick: () => {
        setSpecialType('');
        const selectedTypeObject = dataTypes?.contentTypes.find((type: ContentTypeDto) => (type.name === 'Activity'));
        showGroupContentTypes(selectedTypeObject);
      },
      classNames: 'bg-uiBg',
    },
    {
      title: 'Stories',
      description: 'Read aloud stories and story books',
      titleIcon: 'BookOpenIcon',
      titleIconClassName: 'bg-secondary text-white',

      onActionClick: () => {
        setSpecialType('');
        const selectedTypeObject = dataTypes?.contentTypes.find((type: ContentTypeDto) => (type.name === 'StoryBook'));
        showGroupContentTypes(selectedTypeObject);
      },
      classNames: 'bg-uiBg',
    },
    {
      title: 'Story activities',
      description: 'Activities to do during story time ',

      titleIcon: 'BriefcaseIcon',
      titleIconClassName: 'bg-secondary text-white',

      onActionClick: () => {
        setSpecialType('');
        const selectedTypeObject = dataTypes?.contentTypes.find((type: ContentTypeDto) => (type.name === 'StoryBookPartQuestion'));
        showGroupContentTypes(selectedTypeObject);
      },
      classNames: 'bg-uiBg',
    }
  );


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
                        setSpecialType('');
                        showGroupContentTypes(selectedTypeObject);
                      } else {
                        setSpecialType(item.name);
                      }
                    }}
                    className={classNames(
                      isSelected(item.name) ||
                        isSelected(item.href) ||
                        isSelectedRelated(item.name)
                        ? 'bg-infoBb text-secondary border-b-secondary border-b-2  '
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
                {(selectedType?.name === 'Theme' || selectedType?.name === 'Activity' || selectedType?.name === 'StoryBook' || selectedType?.name === 'StoryBookPartQuestion') && <div className="justify-self col-end-3 pb-2">
                  <button
                    onClick={() => {
                      setSelectedType(null);
                      setSpecialType('Programmes');
                    }}
                    type="button"
                    className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
                  >
                    <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
                      {' '}
                    </ArrowLeftIcon>
                    Programme
                    <span className="px-1 text-gray-400">
                      {' '}
                      / {selectedType?.name}
                    </span>
                  </button>
                </div>}
                <div
                  className="relative h-full rounded-xl bg-white p-12"
                  style={{ minHeight: '36rem' }}
                >
                  {specialType === '' && <div className="relative w-6/12">
                    <span className="absolute inset-y-1/2 left-3 mr-4 flex -translate-y-1/2 transform items-center">
                      {searchValue === '' && (
                        <SearchIcon className="h-5 w-5 text-black"></SearchIcon>
                      )}
                    </span>
                    <input
                      className="bg-uiBg focus:outline-none sm:text-md block w-full rounded-md py-3 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-600 focus:border-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                      placeholder="      Search by type..."
                      onChange={search}
                    />
                  </div>}
                  {selectedType && languages?.GetAllLanguage && specialType === '' && (
                    <ContentList
                      optionDefinitions={dataDefinitions.contentDefinitions}
                      contentType={selectedType}
                      languages={languages.GetAllLanguage}
                      viewContent={getContentValues}
                      refreshParent={() => refreshParent()}
                    ></ContentList>
                  )}
                  {
                    specialType === 'Programmes' ? <div className="flex">
                      <StackedList
                        className="w-full rounded-2xl -mt-0.5 flex flex-col gap-1"
                        type="TitleList"
                        listItems={programItems}
                      />
                    </div> : null
                  }
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
