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

  if (contentView && languages && defaultLanguageId) {
    return (
      <div className="flex flex-col">
        <div className="mb-6 flex flex-row gap-2 overflow-auto rounded-md bg-white px-2">
          {!isCompareMode &&
            languages
              ?.filter((item) => item?.isActive === true)
              .map((item: LanguageDto, index: number) => (
                <div className={'w-3/12'}>
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
        <div className="min-w-0 flex-1 rounded xl:flex">
          {!isCompareMode ? (
            <>
              <div className="bg-slate-100 lg:min-w-0 lg:flex-1 ">
                <div className="h-full py-6">
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
                          cancelCompare={() => setIsCompareMode(!isEdit)}
                        />
                      </div>
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
