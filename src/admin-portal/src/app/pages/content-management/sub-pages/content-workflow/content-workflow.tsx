import {
  ContentDto,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentValueDto,
  LanguageDto,
} from '@ecdlink/core';
import { camelCaseToSentanceCase } from '@ecdlink/core';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { classNames } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { ContentManagementView } from '../../content-management-models';
import ContentCompare from './components/content-compare/content-compare';
import ContentEdit from './components/content-edit/content-edit';
import ContentView from './components/content-view/content-view';
import { ContentLoader } from '../../../../components/content-loader/content-loader';

export interface ContentWorkflowProps {
  contentView: ContentManagementView;
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  languages: LanguageDto[];
  goBack: () => void;
  savedContent: () => void;
}

export default function ContentWorkflow({
  contentView,
  optionDefinitions,
  contentType,
  languages,
  goBack,
  savedContent,
}: ContentWorkflowProps) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    contentView.languageId
  );

  const [viewKey, setViewKey] = useState<number>(Math.random());
  const [defaultLanguageId, setDefaultLanguageId] = useState<string>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
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
        (x) => x.id === contentView.content.id
      );
      if (c) {
        setCurrentContent(c);
        setViewKey(Math.random());
      }
    }
  }, [contentType, contentView]);

  useEffect(() => {
    if (
      contentType &&
      contentType.content &&
      contentView &&
      contentView.content
    ) {
      const c = contentType.content.find(
        (x) => x.id === contentView.content.id
      );
      if (c) {
        setCurrentContent(c);
        setViewKey(Math.random());
      }
    }
  }, [contentType, contentView]);

  const checkIfLanguageTranslated = (languageId: string) => {
    let translated = false;
    if (currentContent) {
      translated = currentContent.contentValues.some(
        (x) => x.localeId === languageId
      );
    }

    return translated;
  };

  const getOrderedContentValues = (contentValues: ContentValueDto[]) => {
    const copy: ContentValueDto[] = Object.assign([], contentValues);

    const orderedList = copy?.sort(function (a, b) {
      return a.contentTypeField.fieldOrder - b.contentTypeField.fieldOrder;
    });

    return orderedList;
  };

  if (contentView && languages && currentContent && defaultLanguageId) {
    return (
      <div className="flex flex-col">
        <div className="shadow flex-1 min-w-0 bg-white xl:flex rounded bg-white">
          {!isCompareMode ? (
            <>
              <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-uiMidDark ">
                <div
                  key={'gobackToContentTypes'}
                  onClick={() => goBack()}
                  className={classNames(
                    'bg-uiMid text-white group flex items-center just px-4 text-sm font-medium h-14 cursor-pointer hover:bg-uiMidDark hover:text-white border-b'
                  )}
                >
                  <ArrowLeftIcon width="20px" />
                  <span className="pl-2">Content Types</span>
                </div>
                <div
                  key={'compareLanguages'}
                  onClick={() => setIsCompareMode(!isEdit)}
                  className={classNames(
                    'bg-uiMid text-white group flex items-center justify-between just px-4 text-sm font-medium h-14 cursor-pointer hover:bg-uiMidDark hover:text-white'
                  )}
                >
                  Compare Languages
                  <DocumentDuplicateIcon width="20px" />
                </div>
                {languages.map((item: LanguageDto, index: number) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedLanguageId(item.id ?? '');
                    }}
                    className={classNames(
                      selectedLanguageId === item.id
                        ? 'bg-uiMidDark text-white'
                        : 'text-textMid hover:bg-uiMidDark hover:text-white',
                      'group flex items-center px-4 text-sm font-medium h-14 cursor-pointer justify-between'
                    )}
                  >
                    {item.description}

                    {checkIfLanguageTranslated(item.id ?? '') ? (
                      <CheckCircleIcon
                        className="text-successMain"
                        width="20px"
                      />
                    ) : (
                      <XCircleIcon className="text-alertMain" width="20px" />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-uiMidDark lg:min-w-0 lg:flex-1 ">
                <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                  <div
                    className="relative h-full"
                    style={{ minHeight: '36rem' }}
                  >
                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg">
                      {!isEdit ? (
                        <div>
                          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                            <div className="ml-4 mt-2">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {camelCaseToSentanceCase(
                                  contentType.name ?? ''
                                )}
                              </h3>
                            </div>
                            <div className="ml-4 mt-2 flex-shrink-0">
                              <button
                                onClick={() => setIsEdit(!isEdit)}
                                type="button"
                                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-uiMid hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2"
                              >
                                {isEdit ? 'Preview' : 'Edit'} content
                              </button>
                            </div>
                          </div>
                          <ContentView
                            key={viewKey}
                            optionDefinitions={optionDefinitions}
                            contentValues={getOrderedContentValues(
                              currentContent?.contentValues
                            )}
                            selectedLanguageId={selectedLanguageId}
                            contentType={contentType}
                          />
                        </div>
                      ) : (
                        <div key={selectedLanguageId}>
                          <ContentEdit
                            optionDefinitions={optionDefinitions}
                            content={contentView.content}
                            selectedLanguageId={selectedLanguageId}
                            contentValues={getOrderedContentValues(
                              currentContent?.contentValues
                            )}
                            contentType={contentType}
                            cancelEdit={() => setIsEdit(!isEdit)}
                            savedContent={savedContent}
                            defaultLanguageId={defaultLanguageId}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
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
            />
          )}
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
