import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentDto,
  ContentTypeDto,
  ContentValueDto,
  LanguageDto,
} from '@ecdlink/core';
import { useCallback, useEffect, useState } from 'react';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import LanguageSelector from '../../../../../../components/language-selector/language-selector';
import {
  ContentManagementView,
  ContentName,
} from '../../../../content-management-models';
import ContentEdit from '../content-edit/content-edit';
import { XIcon } from '@heroicons/react/solid';

import CreateTheme from '../create-theme/create-theme';
import CreateStory from '../../../content-list/components/create-story/create-story';
import EditSkills from '../edit-skills/edit-skills';
import EditCategory from '../edit-category/edit-category';
import { ContentTypes } from '../../../../../../constants/content-management';
import CreateResource from '../create-resource/create-resource';

export interface ContentCompareProps {
  contentView: ContentManagementView;
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  languages: LanguageDto[];
  selectedLanguageId: string;
  defaultLanguageId: string;
  cancelCompare: () => void;
  savedContent: () => void;
  choosedSectionTitle?: string;
  goBack?: () => void;
}

export default function ContentCompare({
  contentView,
  optionDefinitions,
  contentType,
  languages,
  defaultLanguageId,
  selectedLanguageId,
  cancelCompare,
  savedContent,
  choosedSectionTitle,
  goBack,
}: ContentCompareProps) {
  const [selectedFirstLanguageId, setSelectedFirstLanguageId] =
    useState<string>(selectedLanguageId);

  const [selectedSecondLanguageId, setSelectedSecondLanguageId] =
    useState<string>(defaultLanguageId);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<ContentDto>();

  useEffect(() => {
    if (
      contentType &&
      contentType.content &&
      contentView &&
      contentView.content
    ) {
      const content = contentType.content.find(
        (x) =>
          x.id === contentView.content.id ||
          Number(x?.id) === Number(contentView.content?.childId)
      );
      if (content) {
        setCurrentContent(content);
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
                        key={'firstLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedFirstLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <CreateTheme
                        key={'firstLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedFirstLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
                        key={'firstLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedFirstLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
                        choosedSectionTitle={choosedSectionTitle}
                        cancelEdit={goBack}
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
                        key={'firstLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedFirstLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
                        key={'firstLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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

  const handleSecondLanguageNoDynamicForms = (type: string) => {
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
                        key={'secondLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedSecondLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
              <div className="h-full py-6">
                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                  <div className="rounded-lg border-b py-5">
                    <div key={selectedLanguageId}>
                      <CreateTheme
                        key={'secondLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedSecondLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
                        key={'secondLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedSecondLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
                        choosedSectionTitle={choosedSectionTitle}
                        cancelEdit={goBack}
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
                        key={'secondLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedSecondLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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
                        key={'secondLanguageContent'}
                        optionDefinitions={optionDefinitions}
                        content={contentView.content}
                        selectedLanguageId={selectedSecondLanguageId}
                        contentValues={getOrderedContentValues(
                          currentContent?.contentValues
                        )}
                        contentType={contentType}
                        savedContent={savedContent}
                        defaultLanguageId={defaultLanguageId}
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

  if (
    (contentView && languages && currentContent) ||
    (contentType?.name === ContentTypes.PROGRESS_TRACKING_SKILL &&
      contentView &&
      languages)
  ) {
    return (
      <div className=" lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="relative h-full" style={{ minHeight: '36rem' }}>
            <div className="pb-5 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-lg font-medium leading-6 ">
                {breadCrumbParentName(contentType)} - Compare languages
              </h3>
              <div className="flex flex-row">
                <div className="ml-4">
                  <button
                    onClick={cancelCompare}
                    type="button"
                    className="bg-errorBg text-tertiary hover:bg-tertiary inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm hover:text-white"
                  >
                    Cancel Compare
                    <XIcon width="22px" className="pl-1" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="relative flex flex-row justify-items-stretch"
              style={{ minHeight: '36rem' }}
            >
              {/* FIRST LANGUAGE */}
              <div className="w-1/2 rounded-lg border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                <div className=" flwx w-2/12">
                  <LanguageSelector
                    disabled={false}
                    languages={languages?.filter(
                      (item) => item?.isActive === true
                    )}
                    currentLanguageId={selectedFirstLanguageId}
                    selectLanguage={setSelectedFirstLanguageId}
                  />
                </div>

                {contentType?.name === ContentName.StoryBook ||
                contentType?.name === ContentName.Theme ||
                contentType?.name === ContentName.ProgressTrackingCategory ||
                contentType?.name === ContentName.ClassroomBusinessResource ||
                contentType?.name === ContentName.ProgressTrackingSkill ? (
                  handleNoDynamicForms(contentType?.name)
                ) : (
                  <ContentEdit
                    key={'firstLanguageContent'}
                    optionDefinitions={optionDefinitions}
                    content={contentView.content}
                    selectedLanguageId={selectedFirstLanguageId}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    contentType={contentType}
                    savedContent={savedContent}
                    defaultLanguageId={defaultLanguageId}
                    choosedSectionTitle={choosedSectionTitle}
                    contentView={contentView}
                    languages={languages}
                    isEdit={true}
                  />
                )}
              </div>
              {/* SECOND LANGUAGE */}
              <div className="ml-4 w-1/2 rounded-lg border-b border-gray-200 bg-white px-4 py-5 sm:px-6 ">
                <div className=" flex w-2/12 ">
                  <LanguageSelector
                    disabled={false}
                    languages={languages?.filter(
                      (item) => item?.isActive === true
                    )}
                    currentLanguageId={selectedSecondLanguageId}
                    selectLanguage={setSelectedSecondLanguageId}
                  />
                </div>
                {contentType?.name === ContentName.StoryBook ||
                contentType?.name === ContentName.Theme ||
                contentType?.name === ContentName.ProgressTrackingCategory ||
                contentType?.name === ContentName.ClassroomBusinessResource ||
                contentType?.name === ContentName.ProgressTrackingSkill ? (
                  handleSecondLanguageNoDynamicForms(contentType?.name)
                ) : (
                  <ContentEdit
                    key={'secondLanguageContent'}
                    optionDefinitions={optionDefinitions}
                    content={contentView.content}
                    selectedLanguageId={selectedSecondLanguageId}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    contentType={contentType}
                    savedContent={savedContent}
                    defaultLanguageId={defaultLanguageId}
                    choosedSectionTitle={choosedSectionTitle}
                    contentView={contentView}
                    languages={languages}
                    id={'secondLanguageContent'}
                    isEdit={true}
                  />
                )}
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
