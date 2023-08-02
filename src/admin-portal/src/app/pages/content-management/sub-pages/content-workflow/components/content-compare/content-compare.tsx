import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentDto,
  ContentTypeDto,
  ContentValueDto,
  LanguageDto,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import LanguageSelector from '../../../../../../components/language-selector/language-selector';
import { ContentManagementView } from '../../../../content-management-models';
import ContentEdit from '../content-edit/content-edit';
import ContentView from '../content-view/content-view';

export interface ContentCompareProps {
  contentView: ContentManagementView;
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  languages: LanguageDto[];
  selectedLanguageId: string;
  defaultLanguageId: string;
  cancelCompare: () => void;
  savedContent: () => void;
}

export default function ContentCompare({
  contentView,
  optionDefinitions,
  contentType,
  languages,
  defaultLanguageId,
  cancelCompare,
  savedContent,
}: ContentCompareProps) {
  const [selectedFirstLanguageId, setselectedFirstLanguageId] =
    useState<string>(contentView.languageId);

  const [selectedSecondLanguageId, setselectedSecondLanguageId] =
    useState<string>(contentView.languageId);

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
        (x) => x.id === contentView.content.id
      );
      if (content) {
        setCurrentContent(content);
        console.log(content);
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

  if (contentView && languages && currentContent) {
    return (
      <div className=" lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="relative h-full" style={{ minHeight: '36rem' }}>
            <div className="pb-5 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">
                {camelCaseToSentanceCase(contentType.name ?? '')} - Compare
                languages
              </h3>
              <div className="flex flex-row">

                <div>
                  <button
                    onClick={() => setIsEdit(!isEdit)}
                    type="button"
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    {isEdit ? 'Preview' : 'Edit'} content
                  </button>
                </div>

                <div className="ml-4">
                  <button
                    onClick={cancelCompare}
                    type="button"
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Cancel Compare
                  </button>
                </div>

              </div>
            </div>

            <div
              className="flex flex-row justify-items-stretch relative"
              style={{ minHeight: '36rem' }}
            >
              {/* FIRST LANGUAGE */}
              <div className="w-1/2 bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg">
                <LanguageSelector
                  disabled={false}
                  languages={languages}
                  currentLanguageId={selectedFirstLanguageId}
                  selectLanguage={setselectedFirstLanguageId}
                />

                {!isEdit ? (
                  <ContentView
                    optionDefinitions={optionDefinitions}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    selectedLanguageId={selectedFirstLanguageId}
                    contentType={contentType}
                  />
                ) : (
                  <ContentEdit
                    optionDefinitions={optionDefinitions}
                    content={contentView.content}
                    selectedLanguageId={selectedFirstLanguageId}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    contentType={contentType}
                    cancelEdit={() => setIsEdit(!isEdit)}
                    savedContent={savedContent}
                    defaultLanguageId={defaultLanguageId}
                  />
                )}
              </div>
              {/* SECOND LANGUAGE */}
              <div className="w-1/2 ml-4 bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg">
                <LanguageSelector
                  disabled={false}
                  languages={languages}
                  currentLanguageId={selectedSecondLanguageId}
                  selectLanguage={setselectedSecondLanguageId}
                />

                {!isEdit ? (
                  <ContentView
                    optionDefinitions={optionDefinitions}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    selectedLanguageId={selectedSecondLanguageId}
                    contentType={contentType}
                  />
                ) : (
                  <ContentEdit
                    optionDefinitions={optionDefinitions}
                    content={contentView.content}
                    selectedLanguageId={selectedSecondLanguageId}
                    contentValues={getOrderedContentValues(
                      currentContent?.contentValues
                    )}
                    contentType={contentType}
                    cancelEdit={() => setIsEdit(!isEdit)}
                    savedContent={savedContent}
                    defaultLanguageId={defaultLanguageId}
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
