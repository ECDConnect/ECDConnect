import { useEffect, useState } from 'react';
import DynamicSelector from '../../../../../../../components/dynamic-selector/dynamic-selector';
import DynamicStaticSelector from '../../../../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormColorField from '../../../../../../../components/form-color-field/form-color-field';
import FormField from '../../../../../../../components/form-field/form-field';
import FormFileInput from '../../../../../../../components/form-file-input/form-file-input';
import Editor from '../../../../../../../components/form-markdown-editor/form-markdown-editor';
import { videoExtensions } from '../../../../../../../utils/constants';
import {
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../../../../content-management-models';
import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { CombinedDatePickers } from '../../../../../../../components/combined-date-pickers';
import StoryContentForm from '../../../../../../../components/story-content-form/story-content-form';
import { StoryBookPartDto, StoryBookQuestionDto } from '@ecdlink/core';

const acceptedFormats = [
  'svg',
  'png',
  'PNG',
  'jpg',
  'JPG',
  'jpeg',
  ...videoExtensions,
];

export enum StoryBookTypes {
  storyBook = 'Story book',
  readAloud = 'Read aloud',
  other = 'Other',
}

export interface CreateStoryFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  acceptedFileFormats?: string[];
  setFilteredStoryBookParts?: (item?: StoryBookPartDto[]) => void;
  setFilteredStoryBookPartsQuestions?: (item?: StoryBookQuestionDto[]) => void;
  formType?: StoryBookTypes;
  getValues?: any;
  requiredMessage?: string;
  useWatch?: any;
  setAuthorsAuthorization?: (item: boolean) => void;
  authorsAuthorization?: boolean;
}

const contentWrapper = '';

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  acceptedFileFormats,
  setFilteredStoryBookParts,
  setFilteredStoryBookPartsQuestions,
  formType,
  getValues,
  requiredMessage,
  useWatch,
  setAuthorsAuthorization,
  authorsAuthorization,
}) => {
  const { register, control, errors } = handleform;
  const initialValues = getValues();
  const storyBookTypeOptions = [
    { text: 'Story book', value: 'Story book' },
    { text: 'Read aloud', value: 'Read aloud' },
    { text: 'other', value: 'Other' },
  ];

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };

  const [fields, setFields] = useState<any>();
  const watchFields = useWatch({ control });

  useEffect(() => {
    if (template && watchFields) {
      const fields = renderFields(template?.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, watchFields, authorsAuthorization]);

  const renderFields = (fields: FormTemplateField[]) => {
    return fields.map((field) => {
      const { type, title, propName, required, validation, isRequired } = field;

      register(propName, { required: required });

      switch (type) {
        case FieldType.Text:
          if (
            propName === 'type' &&
            template?.fields?.find((item) => item?.propName === 'name')
              ?.contentValue === undefined
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="bg-uiBg sm:col-span-12">
                  <ButtonGroup
                    options={storyBookTypeOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    selectedOptions={formType}
                    color="tertiary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                    multiple={false}
                  />
                </div>
                {isRequired &&
                  initialValues?.hasOwnProperty(propName) &&
                  !initialValues[propName] && (
                    <Typography
                      type="help"
                      color="errorMain"
                      text={requiredMessage}
                    />
                  )}
              </div>
            );
          }
          if (
            propName === 'type' &&
            template?.fields?.find((item) => item?.propName === 'name')
              ?.contentValue !== undefined
          ) {
            return null;
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <FormField
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  register={register}
                  error={
                    isRequired &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? requiredMessage
                      : ''
                  }
                  required={isRequired}
                  validation={validation}
                />
              </div>
              {propName === 'author' && (
                <div className="mt-2">
                  <Typography
                    type="h4"
                    color="textDark"
                    text={`Confirm that the author has given you permission to make this story publicly available on the app *`}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <Checkbox
                      onCheckboxChange={() =>
                        setAuthorsAuthorization(!authorsAuthorization)
                      }
                      checked={authorsAuthorization}
                    />
                    <Typography
                      text={`I confirm that the author has given me permission to post this story`}
                      type="body"
                      color={'textMid'}
                    />
                  </div>
                  {!authorsAuthorization && (
                    <Typography
                      type="help"
                      color="errorMain"
                      text={requiredMessage}
                    />
                  )}
                </div>
              )}
            </div>
          );
        case FieldType.Markdown:
          if (propName === 'bookLocation') {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <div className="mb-2 font-semibold">
                    Where can you find a copy of this story book?
                  </div>
                  <FormField
                    label={isRequired ? title + ' *' : title}
                    nameProp={propName}
                    register={register}
                    error={
                      isRequired &&
                      initialValues?.hasOwnProperty(propName) &&
                      !initialValues[propName]
                        ? requiredMessage
                        : ''
                    }
                    required={isRequired}
                    validation={validation}
                  />
                </div>
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <Editor
                  label={isRequired ? title + ' *' : title}
                  currentValue={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  onStateChange={(data) => onStateChange(propName, data)}
                />
              </div>
            </div>
          );
        case FieldType.Image:
          return (
            <div key={propName} className={contentWrapper}>
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`Editing the image here will update the image for all translations of this page.`}
                type="warning"
              />
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedFileFormats || acceptedFormats}
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  contentUrl={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  returnFullUrl={true}
                  setValue={setValue}
                />
              </div>
            </div>
          );
        case FieldType.Link: {
          if (propName === 'storyBookParts') {
            if (
              formType === StoryBookTypes.storyBook ||
              formType === StoryBookTypes.readAloud
            ) {
              return (
                <div key={propName} className={contentWrapper}>
                  <div className="sm:col-span-12">
                    <StoryContentForm
                      title={field.title}
                      isReview={false}
                      contentValue={field.contentValue}
                      languageId={defaultLanguageId}
                      optionDefinition={field.optionDefinition}
                      setSelectedItems={(value) =>
                        onStateChange(propName, value)
                      }
                      setFilteredStoryBookParts={setFilteredStoryBookParts}
                      setFilteredStoryBookPartsQuestions={
                        setFilteredStoryBookPartsQuestions
                      }
                      formType={formType}
                    />
                  </div>
                </div>
              );
            }
            if (formType === StoryBookTypes.other) {
              return null;
            }
          }
          if (title === 'G T -  Skills' || title === 'Skills') {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <DynamicSelector
                    title={field.title}
                    isReview={false}
                    contentValue={field.contentValue}
                    languageId={defaultLanguageId}
                    optionDefinition={field.optionDefinition}
                    setSelectedItems={(value) => onStateChange(propName, value)}
                    isSkillType={true}
                  />
                </div>
              </div>
            );
          }
          return null;
        }
        case FieldType.StaticLink: {
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <DynamicStaticSelector
                  title={field.title}
                  isReview={false}
                  contentValue={field.contentValue}
                  entityName={field.dataLinkName}
                  setSelectedItems={(value) => onStateChange(propName, value)}
                />
              </div>
            </div>
          );
        }
        case FieldType.ColorPicker: {
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <FormColorField
                  setValue={setValue}
                  currentColor={
                    field.contentValue ? field.contentValue.value : ''
                  }
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  register={register}
                  error={errors[propName]?.message}
                />
              </div>
            </div>
          );
        }
        case FieldType.DatePicker: {
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <CombinedDatePickers
                  contentValue={field.contentValue.value}
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  control={control}
                  error={errors[propName]?.message}
                  required={required}
                  validation={validation}
                />
              </div>
            </div>
          );
        }
        default:
          return (
            <div key={propName}>
              <span>Invalid Field</span>
            </div>
          );
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
      {fields}
    </div>
  );
};

export default CreateStoryForm;
