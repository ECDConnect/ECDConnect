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
import { XIcon } from '@heroicons/react/solid';

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
  selectedLanguageId,
  cancelCompare,
  savedContent,
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
              <h3 className="text-lg leading-6 font-medium ">
                {camelCaseToSentanceCase(contentType.name ?? '')} - Compare
                languages
              </h3>
              <div className="flex flex-row">
                <div className="ml-4">
                  <button
                    onClick={cancelCompare}
                    type="button"
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium bg-errorBg text-tertiary hover:bg-tertiary hover:text-white"
                  >
                    Cancel Compare
                    <XIcon width="22px" className='pl-1' />

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
                <div className=" flwx w-2/12">
                  <LanguageSelector
                    disabled={false}
                    languages={languages}
                    currentLanguageId={selectedFirstLanguageId}
                    selectLanguage={setSelectedFirstLanguageId}

                  />
                </div>


                <ContentEdit
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
              {/* SECOND LANGUAGE */}
              <div className="w-1/2 ml-4 bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg ">
                <div className=" flex w-2/12 ">
                  <LanguageSelector
                    disabled={false}
                    languages={languages}
                    currentLanguageId={selectedSecondLanguageId}
                    selectLanguage={setSelectedSecondLanguageId}
                  />
                </div>
                <ContentEdit
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
    );
  } else {
    return <ContentLoader />;
  }
}
