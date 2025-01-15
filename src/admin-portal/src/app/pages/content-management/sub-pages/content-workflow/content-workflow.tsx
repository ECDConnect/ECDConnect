import {
  ContentDto,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentValueDto,
  LanguageDto,
} from '@ecdlink/core';
import { classNames } from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import {
  ContentManagementView,
  ContentName,
  ResourcesTitles,
} from '../../content-management-models';
import ContentCompare from './components/content-compare/content-compare';
import ContentEdit from './components/content-edit/content-edit';
import { ContentLoader } from '../../../../components/content-loader/content-loader';
import CreateStory from '../content-list/components/create-story/create-story';
import CreateTheme from './components/create-theme/create-theme';
import EditCategory from './components/edit-category/edit-category';
import EditSkills from './components/edit-skills/edit-skills';
import { ContentTypes } from '../../../../constants/content-management';
import CreateResource from './components/create-resource/create-resource';
import { ArrowRightIcon } from '@heroicons/react/solid';

export interface ContentWorkflowProps {
  contentView: ContentManagementView;
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  languages: LanguageDto[];
  goBack: () => void;
  savedContent: () => void;
  choosedSectionTitle?: string;
  setSearchValue?: (item: string) => void;
  selectedTab?: number;
}

export default function ContentWorkflow({
  contentView,
  optionDefinitions,
  contentType,
  languages,
  goBack,
  savedContent,
  choosedSectionTitle,
  setSearchValue,
  selectedTab,
}: ContentWorkflowProps) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    contentView?.languageId
  );
  const [viewKey, setViewKey] = useState<number>(Math.random());
  const [defaultLanguageId, setDefaultLanguageId] = useState<string>();
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<ContentDto>();

  useEffect(() => {
    if (languages) {
      const language = languages.find((x) => x.locale === 'en-za');
      if (language) {
        setDefaultLanguageId(language.id);
      }
    }
  }, [languages]);

  useEffect(() => {
    if (
      contentType &&
      contentType.content &&
      contentView &&
      contentView.content
    ) {
      const c = contentType.content.find(
        (x) =>
          x.id === contentView.content.id ||
          Number(x?.id) === Number(contentView.content?.childId)
      );
      if (c) {
        setCurrentContent(c);
        setViewKey(Math.random());
      }
    }
  }, [contentType, contentView]);

  const getOrderedContentValues = (contentValues: ContentValueDto[]) => {
    const copy: ContentValueDto[] = Object.assign([], contentValues);

    const orderedList = copy?.sort(function (a, b) {
      return a.contentTypeField.fieldOrder - b.contentTypeField.fieldOrder;
    });

    return orderedList;
  };

  const isEdit = contentView && !!contentView?.content;

  const breadCrumbName = useCallback(
    (item: ContentTypeDto) => {
      if (item.name === ContentTypes.THEME) {
        return isEdit ? 'Edit theme' : 'Add new theme';
      } else if (item.name === ContentTypes.ACTIVITY) {
        return isEdit ? 'Edit activity' : 'Add new activity';
      } else if (item.name === ContentTypes.STORY_BOOK) {
        return isEdit ? 'Edit story' : 'Add new story';
      } else if (item.name === ContentTypes.CLASSROOMBUSINESSRESOURCE) {
        if (choosedSectionTitle === ResourcesTitles.ClassroomResources) {
          return isEdit
            ? 'Edit classroom resource'
            : 'Add new classroom resource';
        } else {
          return isEdit
            ? 'Edit business resource'
            : 'Add new business resource';
        }
      }
      return '';
    },
    [choosedSectionTitle, isEdit]
  );

  const breadCrumbParentName = useCallback(
    (item: ContentTypeDto) => {
      if (item.name === ContentTypes.STORY_BOOK) {
        return 'Stories';
      } else if (item.name === ContentTypes.ACTIVITY) {
        return choosedSectionTitle;
      }
      return item.description;
    },
    [choosedSectionTitle]
  );

  const handleNoDynamicForms = (type: string) => {
    switch (type) {
      case ContentTypes.STORY_BOOK:
        return (
          <>
            <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <CreateStory
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        cancelEdit={() => goBack()}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
                        cancelCompare={() => setIsCompareMode(isEdit)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case ContentTypes.THEME:
        return (
          <>
            <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
              <div className="h-full">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b">
                    <div key={selectedLanguageId}>
                      <CreateTheme
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        cancelEdit={() => goBack()}
                        savedContent={savedContent}
                        defaultLanguageId={selectedLanguageId}
                        cancelCompare={() => setIsCompareMode(isEdit)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case ContentTypes.CLASSROOMBUSINESSRESOURCE:
        return (
          <>
            <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <CreateResource
                        key={choosedSectionTitle}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        cancelEdit={() => goBack()}
                        savedContent={savedContent}
                        defaultLanguageId={selectedLanguageId}
                        cancelCompare={() => {
                          setIsCompareMode(isEdit);
                        }}
                        choosedSectionTitle={choosedSectionTitle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case ContentTypes.PROGRESS_TRACKING_CATEGORY:
        return (
          <>
            <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <EditCategory
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
                        cancelCompare={() => setIsCompareMode(isEdit)}
                        cancelEdit={() => goBack()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case ContentTypes.PROGRESS_TRACKING_SKILL:
        return (
          <>
            <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <EditSkills
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        cancelEdit={() => goBack()}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
                        cancelCompare={() => setIsCompareMode(isEdit)}
                        setSelectedLanguageId={setSelectedLanguageId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (contentView && languages && defaultLanguageId) {
    return (
      <div className="flex flex-col pl-6 pr-6">
        <div className="flex flex-row overflow-auto rounded-md bg-white">
          {!isCompareMode &&
            contentType?.name !== ContentName.Theme &&
            languages
              ?.filter((item) => item?.isActive === true)
              .map((item: LanguageDto, index: number) => (
                <div className={'w-3/12'} key={index}>
                  <a
                    key={index}
                    onClick={() => {
                      setSelectedLanguageId(item.id ?? '');
                    }}
                    className={classNames(
                      selectedLanguageId === item.id
                        ? 'bg-infoBb text-secondary border-b-secondary border-b-2   '
                        : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                      'users-tabs text-md flex h-14 items-center font-medium'
                    )}
                  >
                    {item.description}
                  </a>
                </div>
              ))}
        </div>
        {/* BREADCRUMBS */}
        <div>
          <button
            onClick={() => {
              goBack();
            }}
            type="button"
            className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
          >
            Programme
            <ArrowRightIcon className="text-secondary ml-1 mr-1 h-4 w-4" />
            {breadCrumbParentName(contentType)}
            <ArrowRightIcon className="text-secondary ml-1 h-4 w-4" />
            <span className="px-1 text-gray-400">
              {breadCrumbName(contentType)}
            </span>
          </button>
        </div>
        <div className="min-w-0 flex-1 rounded xl:flex">
          {!isCompareMode ? (
            contentType?.name === ContentName.StoryBook ||
            contentType?.name === ContentName.Theme ||
            contentType?.name === ContentName.ProgressTrackingCategory ||
            contentType?.name === ContentName.ClassroomBusinessResource ||
            contentType?.name === ContentName.ProgressTrackingSkill ? (
              handleNoDynamicForms(contentType?.name)
            ) : (
              <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
                <div className="h-full">
                  <div
                    className="relative h-full"
                    style={{ minHeight: '36rem' }}
                  >
                    <div className="rounded-lg border-b py-5">
                      <div key={selectedLanguageId}>
                        <ContentEdit
                          optionDefinitions={optionDefinitions}
                          content={contentView.content}
                          selectedLanguageId={selectedLanguageId}
                          contentValues={getOrderedContentValues(
                            currentContent?.contentValues
                          )}
                          contentType={contentType}
                          cancelEdit={() => goBack()}
                          savedContent={savedContent}
                          defaultLanguageId={defaultLanguageId}
                          cancelCompare={() => setIsCompareMode(isEdit)}
                          choosedSectionTitle={choosedSectionTitle}
                          setSearchValue={setSearchValue}
                          contentView={contentView}
                          languages={languages}
                          isEdit={isEdit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <ContentCompare
              key={`contentPanelCreate`}
              contentView={contentView}
              optionDefinitions={optionDefinitions}
              languages={languages}
              selectedLanguageId={selectedLanguageId}
              defaultLanguageId={defaultLanguageId}
              contentType={contentType}
              cancelCompare={() => setIsCompareMode(!isCompareMode)}
              savedContent={savedContent}
              choosedSectionTitle={choosedSectionTitle}
              goBack={() => goBack()}
            />
          )}
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
