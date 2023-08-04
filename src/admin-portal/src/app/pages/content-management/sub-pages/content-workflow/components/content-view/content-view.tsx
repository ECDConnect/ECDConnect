import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  ContentValueDto,
  camelCaseToSentanceCase,
  getBase64TypeFromBaseString,
} from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';
import DynamicSelector from '../../../../../../components/dynamic-selector/dynamic-selector';
import { FieldType } from '../../../../content-management-models';
import DynamicStaticSelector from '../../../../../../components/dynamic-static-selector/dynamic-static-selector';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import { videoExtensions } from '../../../../../../utils/constants';

export interface ContentViewProps {
  contentValues: ContentValueDto[];
  selectedLanguageId: string;
  contentType: ContentTypeDto;
  optionDefinitions: ContentDefinitionModelDto[];
}

const contentWrapper =
  'mt-2 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg';

export default function ContentView({
  contentValues,
  selectedLanguageId,
  contentType,
  optionDefinitions,
}: ContentViewProps) {
  const getRenderElement = (item: ContentValueDto) => {
    const fields = contentType.fields ?? [];
    const field = fields.find(
      (x) => x.fieldName === item.contentTypeField.fieldName
    );

    if (item.localeId === selectedLanguageId) {
      switch (field?.fieldType.dataType) {
        case FieldType.Text:
          return (
            <div className={contentWrapper}>
              {getFieldHeader(field)}
              <Typography
                type={'body'}
                weight={'normal'}
                color={'textMid'}
                text={item.value}
              />
            </div>
          );
        case FieldType.Markdown:
          return (
            <div className={contentWrapper}>
              {getFieldHeader(field)}
              <Typography type={'markdown'} text={item.value} />{' '}
            </div>
          );
        case FieldType.Link: {
          const optionDefinition = optionDefinitions.find(
            (x) => x.contentName === field.dataLinkName
          );

          return (
            <div className={contentWrapper}>
              <DynamicSelector
                isReview={true}
                contentValue={item}
                languageId={selectedLanguageId}
                optionDefinition={optionDefinition}
              />
            </div>
          );
        }
        case FieldType.StaticLink: {
          return (
            <div className={contentWrapper}>
              <DynamicStaticSelector
                isReview={true}
                contentValue={item}
                title={field.fieldName}
                entityName={field.dataLinkName}
              />
            </div>
          );
        }
        case FieldType.Image: {
          const type = getBase64TypeFromBaseString(item.value);
          const isVideoExtension = videoExtensions.includes(type);

          return (
            <div className={contentWrapper}>
              {getFieldHeader(field)}
              <div className="bg-infoBb relative">
                <div className="relative">
                  {isVideoExtension ? (
                    <video src={item.value} controls className="h-60" />
                  ) : (
                    <div className="flex h-32 flex-wrap content-center">
                      <img
                        src={item.value}
                        className="mx-auto max-h-24 min-h-full rounded-md"
                        alt=""
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        default:
          return '';
      }
    }

    return '';
  };

  const getFieldHeader = (field: ContentTypeFieldDto) => {
    return (
      <div className="mb-2">
        <Typography
          type={'body'}
          weight={'bold'}
          color={'uiMidDark'}
          text={`${camelCaseToSentanceCase(field?.fieldName ?? '')}:`}
        />
      </div>
    );
  };

  if (contentType && contentValues) {
    return (
      <div className="flex flex-col">
        {contentValues
          .filter((x) => x.localeId === selectedLanguageId)
          .map((item: ContentValueDto, index: number) => (
            <div key={index} className="mt-2">
              {getRenderElement(item)}
            </div>
          ))}
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
