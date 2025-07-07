import { useEffect, useState } from 'react';
import DynamicStaticSelector from '../../../../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormField from '../../../../../../../components/form-field/form-field';
import Editor from '../../../../../../../components/form-markdown-editor/form-markdown-editor';
import {
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../../../../content-management-models';
import {
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Divider,
  Typography,
} from '@ecdlink/ui';
import StoryContentForm from '../../../../../../../components/story-content-form/story-content-form';
import { StoryBookPartDto, StoryBookQuestionDto } from '@ecdlink/core';
import { StoryBookTypes } from '../create-story';
import ThemeSelector from '../../../../../../../components/themes/theme-selector';
import ContentLoader from '../../../../../../../components/content-loader/content-loader';

export interface CreateStoryFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  selectedLanguageId: string;
  acceptedFileFormats?: string[];
  setFilteredStoryBookParts?: (item?: StoryBookPartDto[]) => void;
  setFilteredStoryBookPartsQuestions?: (item?: StoryBookQuestionDto[]) => void;
  formType?: StoryBookTypes;
  getValues?: any;
  requiredMessage?: string;
  useWatch?: any;
}

const contentWrapper = '';

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  selectedLanguageId,
  setFilteredStoryBookParts,
  setFilteredStoryBookPartsQuestions,
  formType,
  getValues,
  requiredMessage,
  useWatch,
}) => {
  const { register, control } = handleform;
  const [isLoading, setIsLoading] = useState(true);
  const initialValues = getValues();
  const storyBookTypeOptions = [
    { text: 'Story book', value: 'Story book' },
    { text: 'Read aloud', value: 'Read aloud' },
    { text: 'Other', value: 'Other' },
  ];
  const shareContentOptions = [
    { text: 'Yes', value: 'yes' },
    { text: 'No', value: 'no' },
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
  }, [template, watchFields]);

  const renderFields = (fields: FormTemplateField[]) => {
    return fields.map((field, index) => {
      const isEdit = fields.some((f) => !!f.contentValue);
      const { type, title, propName, required, validation, isRequired } = field;

      register(propName, { required: required });

      let placeHolder = '';
      if (propName === 'name') {
        placeHolder = 'Give your story a title...';
      } else if (propName === 'author') {
        placeHolder = 'Add author';
      } else if (propName === 'illustrator') {
        placeHolder = 'Add illustrator';
      } else if (propName === 'translator') {
        placeHolder = 'Add translator';
      } else if (propName === 'keywords') {
        placeHolder = 'Add key words';
      } else if (propName === 'bookLocation') {
        placeHolder = 'Add text';
      } else if (propName === 'bookLocationLink') {
        placeHolder = 'Add link';
      }

      let subLabel = '';
      if (propName === 'illustrator' || propName === 'translator') {
        subLabel = 'Optional';
      } else if (propName === 'keywords') {
        subLabel = 'Use commas to separate words';
      }

      if (index + 1 === fields.length) {
        setTimeout(function () {
          setIsLoading(false);
        }, 6000);
      }

      const isAuthorizationChecked =
        initialValues?.hasOwnProperty('authorsAuthorization') &&
        initialValues?.authorsAuthorization !== undefined
          ? initialValues?.authorsAuthorization === 'true'
          : false;

      switch (type) {
        case FieldType.Text:
          // Type ---------------------------------
          if (
            propName === 'type' &&
            template?.fields?.find((item) => item?.propName === 'type')
              ?.contentValue === undefined
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <label
                  htmlFor={propName}
                  className="mb-1 block font-bold text-gray-800"
                >
                  {isRequired ? `${field?.title} *` : field?.title}
                </label>
                <div className="bg-uiBg sm:col-span-12">
                  <ButtonGroup
                    options={storyBookTypeOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    selectedOptions={formType}
                    color="tertiary"
                    notSelectedColor="tertiaryAccent2"
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
                <Divider dividerType="dotted" className="mt-2" />
              </div>
            );
          }

          // shareContent ---------------------------------
          if (
            propName === 'shareContent' &&
            (field?.contentValue === undefined ||
              field?.contentValue.value === null ||
              field?.contentValue?.value === 'no' ||
              field?.contentValue?.value === 'false')
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <label
                  htmlFor={propName}
                  className="mb-1 block font-bold text-gray-800"
                >
                  {isRequired ? `${field?.title} *` : field?.title}
                </label>
                <Typography
                  type="small"
                  color="textDark"
                  text={`If you select "Yes", then any future edits made & all translations of this story can be shared with other organisations.`}
                />
                <div className="bg-uiBg sm:col-span-12">
                  <ButtonGroup
                    options={shareContentOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    selectedOptions={formType}
                    color="tertiary"
                    notSelectedColor="tertiaryAccent2"
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
                    placeholder={placeHolder}
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
          if (propName === 'bookLocationLink') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormField
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  placeholder={placeHolder}
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
            );
          }

          // Hide fields when editing
          if (
            propName === 'type' &&
            template?.fields?.find((item) => item?.propName === 'type')
              ?.contentValue !== undefined
          ) {
            return null;
          }

          if (
            propName === 'shareContent' &&
            field?.contentValue !== undefined &&
            (field?.contentValue.value === 'yes' ||
              field?.contentValue.value === 'true')
          ) {
            return null;
          }

          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                {propName !== 'authorsAuthorization' && (
                  <FormField
                    label={isRequired ? title + ' *' : title}
                    subLabel={subLabel}
                    nameProp={propName}
                    placeholder={placeHolder}
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
                )}
              </div>
              {propName === 'authorsAuthorization' && (
                <div>
                  <Typography
                    type="help"
                    color="textDark"
                    weight="bold"
                    text={`Confirm that the author has given you permission to make this story publicly available on the app *`}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      onCheckboxChange={(value) =>
                        onStateChange(propName, value.checked.toString())
                      }
                      checked={isAuthorizationChecked}
                    />
                    <Typography
                      text={`I confirm that the author has given me permission to post this story`}
                      type="help"
                      color={'textMid'}
                    />
                  </div>
                  {!isAuthorizationChecked && (
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
        case FieldType.Link: {
          if (propName === 'storyBookParts') {
            return (
              <div key={propName} className={contentWrapper}>
                <Divider dividerType="dotted" className="mb-2" />
                <div className="sm:col-span-12">
                  <StoryContentForm
                    title={field.title}
                    isReview={false}
                    contentValue={field.contentValue}
                    languageId={selectedLanguageId}
                    optionDefinition={field.optionDefinition}
                    setSelectedItems={(value) => onStateChange(propName, value)}
                    setFilteredStoryBookParts={setFilteredStoryBookParts}
                    setFilteredStoryBookPartsQuestions={
                      setFilteredStoryBookPartsQuestions
                    }
                    formType={formType}
                  />
                </div>
                <Divider dividerType="dotted" className="mb-2" />
              </div>
            );
          }
          // Theme
          if (propName === 'themes') {
            return (
              <div key={field.title} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <ThemeSelector
                    key={field.title}
                    title={isRequired ? field.title + ' *' : field.title}
                    isReview={false}
                    contentValue={field.contentValue}
                    languageId={defaultLanguageId}
                    optionDefinition={field.optionDefinition}
                    setSelectedItems={(value) => onStateChange(propName, value)}
                    choosedSectionTitle={field.title}
                    isEdit={isEdit}
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
        default:
          return (
            <div key={propName}>
              <span>Invalid Field</span>
            </div>
          );
      }
    });
  };

  if (!isLoading) {
    return (
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
        {fields}
      </div>
    );
  } else {
    return <ContentLoader />;
  }
};

export default CreateStoryForm;
