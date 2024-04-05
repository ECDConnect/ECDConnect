import { useCallback, useEffect, useState } from 'react';
import DynamicSelector from '../../../../components/dynamic-selector/dynamic-selector';
import DynamicStaticSelector from '../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormColorField from '../../../../components/form-color-field/form-color-field';
import FormField from '../../../../components/form-field/form-field';
import FormFileInput from '../../../../components/form-file-input/form-file-input';
import {
  ActivitiesTitles,
  ContentManagementView,
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
  TemplateTypenames,
} from '../../content-management-models';
import { Alert, Typography } from '@ecdlink/ui';
import { CombinedDatePickers } from '../../../../components/combined-date-pickers';
import { ContentForms } from '../../../../constants/content-management';
import Editor from '../../../../components/form-markdown-editor/form-markdown-editor';

const acceptedFormats = ['svg', 'png', 'PNG', 'jpg', 'JPG', 'jpeg'];
const acceptedVideoFormats = ['mp4', 'mov'];
const allowedVideoFileSize = 13631488;

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

  const [disableInputs, setDisableInputs] = useState(false);

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

  const setDangerSignsInputsValues = useCallback(() => {
    onStateChange('section', contentView?.content?.['section']);
    setDisableInputs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentView?.content]);

  const setContentInputValues = useCallback(() => {
    onStateChange('image', contentView?.content?.['image']);
    setDisableInputs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentView?.content]);

  useEffect(() => {
    if (
      template?.title === TemplateTypenames.DanngerSigns &&
      template?.fields?.[0]?.selectedLanguageId !== defaultLanguageId &&
      contentView?.content
    ) {
      setDangerSignsInputsValues();
    }
  }, [
    defaultLanguageId,
    template?.fields,
    contentView?.content,
    setDangerSignsInputsValues,
    template?.title,
  ]);

  useEffect(() => {
    if (
      template.title === ContentForms.CONSENT_FORM &&
      template?.fields?.[0]?.selectedLanguageId !== defaultLanguageId &&
      contentView?.content
    ) {
      setContentInputValues();
    }
  }, [
    contentView?.content,
    defaultLanguageId,
    setContentInputValues,
    template?.fields,
    template.title,
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
          return (
            <div key={propName} className={contentWrapper}>
              {propName === 'pollyTipText' && (
                <div className="mb-4">
                  <Typography type="h4" color="textDark" text={'Polley tip'} />
                  <Typography type="body" color="textLight" text={'Optional'} />
                </div>
              )}
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
          if (disableInputs) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <Editor
                    label={
                      isRequired
                        ? `${title} "${contentView?.content?.[
                            propName
                          ]?.replace(/<[^>]*>?/gm, '')}" *`
                        : title
                    }
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
                  subLabel={
                    isRequired
                      ? 'You must add at least one content section.'
                      : 'Optional'
                  }
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
          if (propName === 'image' && disableInputs) {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <Alert
                    className="mt-2 mb-4 rounded-md"
                    message={`To edit this field, go to the English version.`}
                    type="warning"
                  />
                  <div className={`${disableInputs ? 'opacity-25' : ''}`}></div>
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
                    disabled={disableInputs}
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
        case FieldType.video: {
          return (
            <div key={propName} className={contentWrapper}>
              <Typography type="h4" color="textDark" text={'Upload video'} />
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedVideoFormats}
                  label={isRequired ? title + ' *' : title}
                  nameProp={propName}
                  contentUrl={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  returnFullUrl={true}
                  setValue={setValue}
                  allowedFileSize={allowedVideoFileSize}
                  isImage={false}
                  isVideoInput={true}
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
        case FieldType.Link: {
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
