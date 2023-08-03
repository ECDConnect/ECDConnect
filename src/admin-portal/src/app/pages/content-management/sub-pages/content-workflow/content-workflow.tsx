import {
  ContentDto,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentValueDto,
  LanguageDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
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
        <div className="flex flex-row bg-white mb-6 overflow-x-scroll rounded-md">

          {languages.map((item: LanguageDto, index: number) => (

            <div
              className={'w-3/12 '
              }
            >
              <a
                key={index}
                onClick={() => {
                  setSelectedLanguageId(item.id ?? '');
                }}
                className={classNames(
                  selectedLanguageId === item.id
                    ? 'bg-infoBb text-secondary border-b-secondary border-b-2   '
                    : 'text-textMid hover:text-secondary hover:border hover:border-b-indigo-500 hover:bg-white',
                  'users-tabs flex h-14 items-center text-md font-medium'
                )}
              >
                {item.description}

              </a>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 rounded xl:flex">
          {!isCompareMode ? (
            <>

              <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
                <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                  <div
                    className="relative h-full"
                    style={{ minHeight: "36rem" }}
                  >
                    <div className="rounded-lg border-b px-4 py-5 sm:px-6">
                      {isEdit ? (
                        <div>
                          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                            <div className="ml-4 mt-2">
                              <h3 className="text-md font-medium leading-6 text-gray-900">
                                {camelCaseToSentanceCase(
                                  contentType.name ?? ''
                                )}
                              </h3>
                            </div>
                            <div className="ml-4 mt-2 flex-shrink-0">
                              <button
                                onClick={() => setIsEdit(!isEdit)}
                                type="button"
                                className="bg-uiMid hover:bg-secondary focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-md font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                              >
                                {!isEdit ? 'Preview' : 'Edit'} content
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
                            cancelEdit={() => goBack()}
                            savedContent={savedContent}
                            defaultLanguageId={defaultLanguageId}
                            cancelCompare={() => setIsCompareMode(!isEdit)}

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
