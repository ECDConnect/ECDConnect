import { gql, useMutation } from '@apollo/client';
import {
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeFieldDto,
  LanguageDto,
  camelCaseToSentanceCase,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicForm from '../../../../components/dynamic-form/dynamic-form';
import {
  DynamicFormTemplate,
  FormTemplateField,
} from '../../../../content-management-models';
import LanguageSelector from '../../../../../../components/language-selector/language-selector';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import { Button } from '@ecdlink/ui';

export interface ContentCreateProps {
  selectedLanguageId: string;
  languages: LanguageDto[];
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  closeDialog: (value: boolean) => void;
  acceptedFileFormats?: string[];
}

export default function ContentCreate({
  selectedLanguageId,
  languages,
  optionDefinitions,
  contentType,
  closeDialog,
  acceptedFileFormats,
}: ContentCreateProps) {
  const [defaultLanguageId, setDefaultLanguageId] = useState<string>();
  const { register, formState, setValue, handleSubmit, control } = useForm();
  const [requiredMessage, setRequiredMessage] = useState(
    'This field is required'
  );
  const { errors } = formState;
  const handleform = {
    control,
    register: register,
    errors: errors,
  };

  useEffect(() => {
    if (languages) {
      const language = languages.find((x) => x.locale === 'en-za');
      if (language) {
        setDefaultLanguageId(language.id);
      }
    }
  }, [languages]);

  const mutationName = `create${contentType.name}`;

  const createMutation = gql` 
    mutation ${mutationName} ($input: ${contentType.name}Input!, $localeId: String!) {
      ${mutationName} (input: $input, localeId: $localeId) 
      }
  `;

  const [createContent, { loading }] = useMutation(createMutation);

  const [template, setTemplate] = useState<DynamicFormTemplate>();

  useEffect(() => {
    if (contentType && contentType.fields && selectedLanguageId) {
      const t: DynamicFormTemplate = {
        title: `${contentType.name} Form`,
        fields: [],
      };

      const copyFields: ContentTypeFieldDto[] = Object.assign(
        [],
        contentType.fields
      );

      copyFields
        ?.sort((a, b) => a.fieldOrder - b.fieldOrder)
        .forEach((field: ContentTypeFieldDto) => {
          t.fields.push(getRenderField(field));
        });

      setTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, selectedLanguageId]);

  const getRenderField = (item: ContentTypeFieldDto): FormTemplateField => {
    const fields = contentType.fields ?? [];
    const field = fields.find((x) => x.fieldName === item.fieldName);

    const optionDefinition = optionDefinitions.find(
      (x) => x.contentName === item.dataLinkName
    );

    const returnField: FormTemplateField = {
      propName: field?.fieldName ?? '',
      type: field?.fieldType.dataType ?? '',
      title: camelCaseToSentanceCase(field?.fieldName ?? ''),
      required: {
        value: false,
        message: '',
      },
      optionDefinition: optionDefinition,
      selectedLanguageId: selectedLanguageId,
      dataLinkName: field?.dataLinkName,
    };

    return returnField;
  };

  const onSubmit = async (values: any) => {
    const model = { ...values };

    await createContent({
      variables: {
        input: { ...model },
        localeId: selectedLanguageId.toString(),
      },
    });

    closeDialog(true);
  };

  if (contentType && template && defaultLanguageId) {
    return (
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 divide-y divide-gray-200"
        >
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <LanguageSelector
                disabled={true}
                languages={languages}
                currentLanguageId={selectedLanguageId}
              />
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <Button
                onClick={() => closeDialog(false)}
                type="filled"
                color="uiMid"
                text="Cancel"
                textColor="white"
                className="bg-uiMid hover:bg-primary focus:outline-none mr-2 inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                disabled={loading}
              />
              <Button
                buttonType="submit"
                className="bg-primary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                type="filled"
                color="primary"
                text="Save"
                textColor="white"
                isLoading={loading}
                disabled={loading}
              />
            </div>
          </div>

          <div className="pt-4 pb-8">
            <DynamicForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
              acceptedFileFormats={acceptedFileFormats}
              requiredMessage={requiredMessage}
            />
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
