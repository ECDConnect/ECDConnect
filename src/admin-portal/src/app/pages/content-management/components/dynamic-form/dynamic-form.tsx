import { useCallback, useEffect, useState } from 'react';
import DynamicSelector from '../../../../components/dynamic-selector/dynamic-selector';
import DynamicStaticSelector from '../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormColorField from '../../../../components/form-color-field/form-color-field';
import FormField from '../../../../components/form-field/form-field';
import FormFileInput from '../../../../components/form-file-input/form-file-input';
import Editor from '../../../../components/form-markdown-editor/form-markdown-editor';
import {
  ActivitiesTitles,
  ContentManagementView,
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../content-management-models';
import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { CombinedDatePickers } from '../../../../components/combined-date-pickers';

const acceptedFormats = ['svg', 'png', 'PNG', 'jpg', 'JPG', 'jpeg'];

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
  requiredMessage?: string;
  useWatch?: any;
  contentView?: ContentManagementView;
  setSmallLargeGroupsSkills?: (item: {}[]) => void;
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
  requiredMessage,
  useWatch,
  contentView,
  setSmallLargeGroupsSkills,
}) => {
  const { register, control, errors } = handleform;

  const smallLargeGroupOptions = [
    { text: 'Small group', value: 'Small group' },
    { text: 'Large group', value: 'Large group' },
  ];

  const isSmallLargeGroup =
    choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities;
  const [disableActivitiesInputs, setDisableActivitiesInputs] = useState(false);

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };
  const initialValues = getValues();

  const [fields, setFields] = useState<any>();

  useEffect(() => {
    if (
      choosedSectionTitle === ActivitiesTitles.StoryActivities &&
      initialValues?.hasOwnProperty('type') &&
      !initialValues['type']
    ) {
      setValue('type', 'Story time');
    }
  }, [choosedSectionTitle, initialValues, setValue]);

  const watchFields = useWatch({ control });

  useEffect(() => {
    if (template && watchFields) {
      const fields = renderFields(template?.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, watchFields]);

  const setStoriesGeneralInputsValues = useCallback(() => {
    onStateChange('type', contentView?.content?.['type']);
    onStateChange('image', contentView?.content?.['image']);
    onStateChange(
      'subCategories',
      contentView?.content?.['subCategories']
        ?.map((item) => item?.id)
        ?.toString()
    );
    setDisableActivitiesInputs(true);
  }, [contentView?.content]);

  useEffect(() => {
    if (
      isSmallLargeGroup &&
      template?.fields?.[0]?.selectedLanguageId !== defaultLanguageId &&
      contentView?.content
    ) {
      setStoriesGeneralInputsValues();
    }
  }, [
    defaultLanguageId,
    isSmallLargeGroup,
    template?.fields,
    contentView?.content,
  ]);

  useEffect(() => {
    onStateChange(
      'subCategories',
      contentView?.content?.['subCategories']
        ?.map((item) => item?.id)
        ?.toString()
    );
  }, []);

  const renderFields = (fields: FormTemplateField[]) => {
    return fields?.map((field) => {
      const {
        type,
        title,
        propName,
        required,
        validation,
        isRequired,
        subHeading,
        fieldAlert,
      } = field;

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
            template?.title === 'Activity Form'
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <label
                  htmlFor={propName}
                  className="mb-1 block text-lg font-medium text-gray-800"
                >
                  {field?.title}
                </label>
                {disableActivitiesInputs && (
                  <Alert
                    className="mt-2 mb-4 rounded-md"
                    message={`To edit this field, go to the English version.`}
                    type="warning"
                  />
                )}
                <div
                  className={`bg-uiBg sm:col-span-12 ${
                    disableActivitiesInputs
                      ? 'pointer-events-none opacity-25'
                      : ''
                  }`}
                >
                  <ButtonGroup
                    options={smallLargeGroupOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    color="tertiary"
                    selectedOptions={
                      field.contentValue
                        ? field.contentValue.value
                        : contentView?.content?.[propName]
                    }
                    type={ButtonGroupTypes.Button}
                    className={'w-full rounded-2xl'}
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
                    title={isRequired ? field.title + ' *' : field.title}
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
        case FieldType.Image:
          if (
            propName === 'image' &&
            isSmallLargeGroup &&
            template?.title === 'Activity Form'
          ) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  {disableActivitiesInputs && (
                    <Alert
                      className="mt-2 mb-4 rounded-md"
                      message={`To edit this field, go to the English version.`}
                      type="warning"
                    />
                  )}
                  <div
                    className={`${disableActivitiesInputs ? 'opacity-25' : ''}`}
                  ></div>
                  <FormFileInput
                    acceptedFormats={acceptedFileFormats || acceptedFormats}
                    label={isRequired ? title + ' *' : title}
                    nameProp={propName}
                    contentUrl={
                      field.contentValue
                        ? field.contentValue.value
                        : initialValues?.[propName]
                    }
                    returnFullUrl={true}
                    setValue={setValue}
                    allowedFileSize={allowedFileSize}
                    disabled={disableActivitiesInputs}
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
          }
          return (
            <div key={propName} className={contentWrapper}>
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
                  allowedFileSize={allowedFileSize}
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
        case FieldType.Link: {
          const englishCatValues = contentView?.content?.[propName]
            ?.map((item) => item?.id)
            .toString();
          let subCategoriesValue = template?.fields.find(
            (item) => item?.propName === propName
          );
          subCategoriesValue = {
            ...subCategoriesValue,
            contentValue: {
              localeId: defaultLanguageId,
              value: englishCatValues,
              contentTypeFieldId: '1',
              contentTypeField: {
                fieldTypeId: '1',
                displayMainTable: true,
                displayName: 'GT - Skills',
                displayPage: 1,
                fieldName: 'subCategories',
                fieldOrder: 6,
                isRequired: true,
                isActive: true,
                dataLinkName: '',
                fieldType: {
                  name: 'fieldType',
                  description: '',
                  dataType: '',
                  assemblyDataType: '',
                  graphQLDataType: '',
                },
              },
            },
          };

          if (title === 'G T -  Skills' || title === 'Skills') {
            if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
              return null;
            }

            if (contentView?.content && disableActivitiesInputs) {
              const valueFormattedToArray = initialValues[propName]?.split(',');
              setSmallLargeGroupsSkills(valueFormattedToArray);
              return (
                <div key={propName} className={contentWrapper}>
                  {disableActivitiesInputs && (
                    <Alert
                      className="mt-2 mb-4 rounded-md"
                      message={`To edit this field, go to the English version.`}
                      type="warning"
                    />
                  )}
                  <div
                    className={`sm:col-span-12 ${
                      disableActivitiesInputs
                        ? 'pointer-events-none opacity-25'
                        : ''
                    }`}
                  >
                    <DynamicSelector
                      title={isRequired ? field.title + ' *' : field.title}
                      isReview={false}
                      contentValue={
                        field.contentValue || subCategoriesValue?.contentValue
                      }
                      languageId={defaultLanguageId}
                      optionDefinition={field.optionDefinition}
                      setSelectedItems={(value) =>
                        onStateChange(propName, value)
                      }
                      isSkillType={true}
                    />
                  </div>
                  {((isRequired &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]) ||
                    valueFormattedToArray?.length < 2) && (
                    <Typography
                      type="help"
                      color="errorMain"
                      text={requiredMessage}
                    />
                  )}
                </div>
              );
            }
            const skills = initialValues[propName];
            const skillsArray = skills?.split(',');
            setSmallLargeGroupsSkills(skillsArray);
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
                {((isRequired &&
                  initialValues?.hasOwnProperty(propName) &&
                  !initialValues[propName]) ||
                  skillsArray?.length < 2) && (
                  <Typography
                    type="help"
                    color="errorMain"
                    text={requiredMessage}
                  />
                )}
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <DynamicSelector
                  title={isRequired ? field.title + ' *' : field.title}
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
                  title={isRequired ? field.title + ' *' : field.title}
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
        }
        case FieldType.DatePicker: {
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <CombinedDatePickers
                  contentValue={
                    field.contentValue ? field.contentValue.value : ''
                  }
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  control={control}
                  error={errors[propName]?.message}
                  required={required}
                  validation={validation}
                  subHeading={subHeading}
                  fieldAlert={fieldAlert}
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
