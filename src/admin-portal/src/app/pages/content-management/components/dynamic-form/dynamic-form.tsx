import { useEffect, useState } from 'react';
import DynamicSelector from '../../../../components/dynamic-selector/dynamic-selector';
import DynamicStaticSelector from '../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormColorField from '../../../../components/form-color-field/form-color-field';
import FormField from '../../../../components/form-field/form-field';
import FormFileInput from '../../../../components/form-file-input/form-file-input';
import Editor from '../../../../components/form-markdown-editor/form-markdown-editor';
import { videoExtensions } from '../../../../utils/constants';
import {
  ActivitiesTitles,
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../content-management-models';
import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { CombinedDatePickers } from '../../../../components/combined-date-pickers';

const acceptedFormats = [
  'svg',
  'png',
  'PNG',
  'jpg',
  'JPG',
  'jpeg',
  ...videoExtensions,
];

export interface DynamicFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  acceptedFileFormats?: string[];
  allowedFileSize?: number;
  formType?: string;
  choosedSectionTitle?: string;
  getValues?: any;
}

const contentWrapper = '';

const DynamicForm: React.FC<DynamicFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  acceptedFileFormats,
  allowedFileSize,
  formType,
  choosedSectionTitle,
  getValues,
}) => {
  const { register, control, errors } = handleform;

  const storyBookTypeOptions = [
    { text: 'Story book', value: 'Story book' },
    { text: 'Read aloud', value: 'Read aloud' },
    { text: 'other', value: 'Other' },
  ];

  const smallLargeGroupOptions = [
    { text: 'Small group', value: 'Small group' },
    { text: 'Large group', value: 'Large group' },
  ];

  const isSmallLargeGroup =
    choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities;

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };
  const initialValues = getValues();

  const [fields, setFields] = useState<any>();
  const requiredMessage = 'This field is required';

  useEffect(() => {
    if (
      choosedSectionTitle === ActivitiesTitles.StoryActivities &&
      initialValues?.hasOwnProperty('type') &&
      !initialValues['type']
    ) {
      setValue('type', 'Story time');
    }
  }, [choosedSectionTitle, initialValues, setValue]);

  useEffect(() => {
    if (template) {
      const fields = renderFields(template.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const renderFields = (fields: FormTemplateField[]) => {
    return fields.map((field) => {
      const { type, title, propName, required, validation, isRequired } = field;

      register(propName, { required: required });

      switch (type) {
        case FieldType.Text:
          if (propName === 'subType' && isSmallLargeGroup) {
            return null;
          }
          if (
            propName === 'type' &&
            choosedSectionTitle === ActivitiesTitles.StoryActivities
          ) {
            return null;
          }
          if (
            propName === 'type' &&
            isSmallLargeGroup &&
            template?.title === 'Activity Form' &&
            template?.fields?.find((item) => item?.propName === 'name')
              ?.contentValue === undefined
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="bg-uiBg sm:col-span-12">
                  <ButtonGroup
                    options={smallLargeGroupOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    color="tertiary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                    multiple={false}
                  />
                </div>
              </div>
            );
          }
          if (
            propName === 'type' &&
            template?.title === 'Activity Form' &&
            template?.fields?.find((item) => item?.propName === 'name')
              ?.contentValue !== undefined
          ) {
            return null;
          }
          if (
            propName === 'subType' &&
            choosedSectionTitle === ActivitiesTitles.StoryActivities
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <DynamicSelector
                    title={required.value ? field.title + ' *' : field.title}
                    isReview={false}
                    contentValue={field.contentValue}
                    languageId={defaultLanguageId}
                    optionDefinition={field.optionDefinition}
                    setSelectedItems={(value) => onStateChange(propName, value)}
                    isSkillType={true}
                    choosedSectionTitle={choosedSectionTitle}
                  />
                </div>
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <FormField
                  label={required.value ? title + ' *' : title}
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
        case FieldType.Markdown:
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <Editor
                  label={required.value ? title + ' *' : title}
                  currentValue={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  onStateChange={(data) => onStateChange(propName, data)}
                />
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
            </div>
          );
        case FieldType.Image:
          return (
            <div key={propName} className={contentWrapper}>
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`Editing the file here will update the file for all translations of this page.`}
                type="warning"
              />
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedFileFormats || acceptedFormats}
                  label={required.value ? title + ' *' : title}
                  nameProp={propName}
                  contentUrl={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  returnFullUrl={true}
                  setValue={setValue}
                  allowedFileSize={allowedFileSize}
                />
              </div>
            </div>
          );
        case FieldType.Link: {
          if (title === 'G T -  Skills' || title === 'Skills') {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <DynamicSelector
                    title={required.value ? field.title + ' *' : field.title}
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
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <DynamicSelector
                  title={required.value ? field.title + ' *' : field.title}
                  isReview={false}
                  contentValue={field.contentValue}
                  languageId={defaultLanguageId}
                  optionDefinition={field.optionDefinition}
                  setSelectedItems={(value) => onStateChange(propName, value)}
                />
              </div>
            </div>
          );
        }
        case FieldType.StaticLink: {
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <DynamicStaticSelector
                  title={required.value ? field.title + ' *' : field.title}
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
                  label={required.value ? title + ' *' : title}
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
                  contentValue={
                    field.contentValue ? field.contentValue.value : ''
                  }
                  label={required.value ? title + ' *' : title}
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

export default DynamicForm;
