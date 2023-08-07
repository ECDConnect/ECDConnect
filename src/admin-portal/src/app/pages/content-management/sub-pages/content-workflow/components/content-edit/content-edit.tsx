import { gql, useMutation } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  ContentValueDto,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import DynamicForm from '../../../../components/dynamic-form/dynamic-form';
import {
  DynamicFormTemplate,
  FormTemplateField,
} from '../../../../content-management-models';
import { Alert, classNames } from '@ecdlink/ui';
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  SaveAsIcon,
  XIcon,
} from '@heroicons/react/solid';

export interface ContentViewProps {
  content: any;
  selectedLanguageId: string;
  defaultLanguageId: string;
  contentValues: ContentValueDto[];
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  savedContent: () => void;
  cancelEdit?: () => void;
  cancelCompare?: () => void;
}

export default function ContentEdit({
  content,
  selectedLanguageId,
  defaultLanguageId,
  contentValues,
  optionDefinitions,
  contentType,
  cancelEdit,
  savedContent,
  cancelCompare,
}: ContentViewProps) {
  const { setNotification } = useNotifications();
  const { register, formState, setValue, handleSubmit } = useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
  };

  const mutationName = `update${contentType.name}`;

  const updateMutation = gql` 
    mutation ${mutationName} ($id: String!, $input: ${contentType.name}Input!, $localeId: String!) {
      ${mutationName} (id: $id, input: $input, localeId: $localeId) {
        id
      } 
    }
  `;

  const [updateContent] = useMutation(updateMutation);

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contentType && contentValues && selectedLanguageId) {
      const t: DynamicFormTemplate = {
        title: `${contentType.name} Form`,
        fields: [],
      };

      const copy: ContentTypeFieldDto[] = Object.assign([], contentType.fields);

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((item: ContentTypeFieldDto) => {
        const renderedField = getRenderField(item);

        if (renderedField) t.fields.push(renderedField);
      });

      setTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, contentValues, selectedLanguageId]);

  const getRenderField = (
    field: ContentTypeFieldDto
  ): FormTemplateField | undefined => {
    const item = contentValues.find(
      (x) =>
        x.contentTypeField.fieldName === field.fieldName &&
        x.localeId === selectedLanguageId
    );

    const optionDefinition = optionDefinitions.find(
      (x) => x.contentName === field?.dataLinkName
    );

    const returnField: FormTemplateField = {
      propName: field?.fieldName ?? '',
      type: field?.fieldType.dataType ?? '',
      title: camelCaseToSentanceCase(field?.fieldName ?? ''),
      required: {
        value: false,
        message: '',
      },
      contentValue: item,
      optionDefinition: optionDefinition,
      selectedLanguageId: selectedLanguageId,
      dataLinkName: field.dataLinkName,
    };

    if (item && item.localeId === selectedLanguageId) {
      setValue(returnField.propName, item.value);
    } else {
      setValue(returnField.propName, undefined);
    }
    return returnField;
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    const model = { ...values };

    await updateContent({
      variables: {
        id: content.id.toString(),
        input: { ...model },
        localeId: selectedLanguageId.toString(),
      },
    }).catch(() => {
      setLoading(false);
    });

    setNotification({
      title: 'Successfully Updated Content!',
      variant: NOTIFICATION.SUCCESS,
    });

    savedContent();

    setLoading(false);
  };

  if (contentType && contentValues && template && !loading) {
    return (
      <div className="flex flex-col rounded-md ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {cancelEdit && camelCaseToSentanceCase(contentType.name ?? '')}
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {cancelCompare && (
                <button
                  type="button"
                  onClick={cancelCompare}
                  className=" bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Compare Languages
                  <DocumentDuplicateIcon width="20px" className="pl-1" />
                </button>
              )}

              {cancelEdit && (
                <button
                  onClick={cancelEdit}
                  type="button"
                  className="bg-errorBg text-tertiary hover:bg-tertiary ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm hover:text-white"
                >
                  Cancel
                  <XIcon width="22px" className="pl-1" />
                </button>
              )}
            </div>
          </div>
          <div className="px-12 pt-6 bg-white rounded-xl pb-8">
            {contentType.name === 'Consent' &&
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            )}
            <DynamicForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
            />
          </div>
          <button
            type="submit"
            className="bg-secondary hover:bg-uiMid focus:outline-none ml-4 inline-flex items-center rounded-md border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
          >
            Save & publish
            <SaveAsIcon width="22px" className="pl-1" />
          </button>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
