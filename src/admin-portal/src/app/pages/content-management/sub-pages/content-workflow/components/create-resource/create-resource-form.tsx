import { useEffect, useState } from 'react';
import Editor from '../../../../../../components/form-markdown-editor/form-markdown-editor';
import {
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
  ResourcesTitles,
} from '../../../../content-management-models';
import {
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  CoreRadioGroup,
  Alert,
} from '@ecdlink/ui';
import { useWatch } from 'react-hook-form';
import { LanguageId } from '../../../../../../constants/language';

export interface CreateResourceFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  selectedLanguageId: string;
  defaultLanguageId: string;
  formType?: string;
  choosedSectionTitle: string;
  getValues?: any;
  urlRegex: any;
}

const contentWrapper = '';
const dataFreeOptions = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
];

export const classroomOptions = [
  { id: 0, label: 'Activities', value: 'Activities' },
  { id: 1, label: 'Stories', value: 'Stories' },
  { id: 2, label: 'Teaching tips', value: 'Teaching tips' },
  { id: 3, label: 'Other', value: 'Other' },
];

export const businessOptions = [
  { id: 0, label: 'Finances', value: 'Finances' },
  {
    id: 1,
    label: 'Marketing, recruitment & communication',
    value: 'Marketing, recruitment & communication',
  },
  {
    id: 2,
    label: 'Safety, hygiene & nutrition',
    value: 'Safety, hygiene & nutrition',
  },
  { id: 3, label: 'Other', value: 'Other' },
];

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  selectedLanguageId,
  choosedSectionTitle,
  getValues,
  urlRegex,
}) => {
  const { register, control, errors } = handleform;
  const formValues = getValues();
  const [selectedResourceType, setSelectedResourceType] = useState<string>();

  const [fields, setFields] = useState<any>();
  const showEditableFields = selectedLanguageId === LanguageId.enZa;
  const watchFields = useWatch({ control });

  const initialValues = getValues();

  useEffect(() => {
    if (template && watchFields) {
      const fields = renderFields(template?.fields, showEditableFields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, watchFields]);

  // const renderFields = useCallback((fields: FormTemplateField[], showEditableFields: boolean) => {
  const renderFields = (
    fields: FormTemplateField[],
    showEditableFields: boolean
  ) => {
    return fields.map((field) => {
      const isEdit = fields.some((f) => !!f.contentValue);
      const { type, title, propName, required } = field;
      register(propName, { required: required });

      switch (type) {
        case FieldType.Text:
          if (propName === 'dataFree') {
            return (
              <div key={propName} className={contentWrapper}>
                {showEditableFields ? (
                  <>
                    <div className="flex">
                      <Typography
                        type={'body'}
                        weight={'bold'}
                        color={'textMid'}
                        text={field?.title + ` *`}
                      />
                    </div>
                    <Typography
                      type={'body'}
                      color={'textMid'}
                      text={`If accessing this link requires data, please select "No".`}
                    />

                    {isEdit && (
                      <Alert
                        className="mt-2 mb-2 rounded-md"
                        message={`Editing this response will update this data free response for all translations of this page`}
                        type="warning"
                      />
                    )}
                    <ButtonGroup<string>
                      color="tertiary"
                      textColor="tertiary"
                      notSelectedColor="tertiaryAccent2"
                      type={ButtonGroupTypes.Button}
                      options={dataFreeOptions}
                      onOptionSelected={(value) => {
                        setValue(propName, value);
                      }}
                      selectedOptions={
                        field.contentValue
                          ? field.contentValue.value
                          : undefined
                      }
                    />
                    {required.value &&
                      initialValues?.hasOwnProperty(propName) &&
                      !initialValues[propName] && (
                        <Typography
                          type="help"
                          color="errorMain"
                          text={`Select data free option`}
                        />
                      )}
                  </>
                ) : (
                  <div key={propName} className={contentWrapper}></div>
                )}
              </div>
            );
          }
          if (propName === 'resourceType') {
            return (
              <div key={propName} className={contentWrapper}>
                {showEditableFields ? (
                  <>
                    <div className="flex">
                      <Typography
                        type={'body'}
                        weight={'bold'}
                        color={'textMid'}
                        text={field?.title + ` *`}
                      />
                    </div>
                    {isEdit && (
                      <Alert
                        className="mt-2 mb-2 rounded-md"
                        message={`Editing this resource type here will update the resource type for all translations of this page`}
                        type="warning"
                      />
                    )}
                    <fieldset className="flex flex-col gap-1">
                      {choosedSectionTitle ===
                        ResourcesTitles.ClassroomResources && (
                        <CoreRadioGroup
                          options={classroomOptions.map((x) => ({
                            id: x.id,
                            label: x.label,
                            value: x.value,
                          }))}
                          currentValue={
                            field.contentValue
                              ? field.contentValue.value
                              : selectedResourceType
                          }
                          colour={'quatenary'}
                          selectedOptionBackgroundColor="uiBg"
                          onChange={(val: string) => {
                            setSelectedResourceType(val);
                            setValue(propName, val);
                          }}
                        />
                      )}
                      {choosedSectionTitle ===
                        ResourcesTitles.BusinessResources && (
                        <CoreRadioGroup
                          options={businessOptions.map((x) => ({
                            id: x.id,
                            label: x.label,
                            value: x.value,
                          }))}
                          currentValue={
                            field.contentValue
                              ? field.contentValue.value
                              : selectedResourceType
                          }
                          colour={'quatenary'}
                          selectedOptionBackgroundColor="uiBg"
                          onChange={(val: string) => {
                            setSelectedResourceType(val);
                            setValue(propName, val);
                          }}
                        />
                      )}
                    </fieldset>
                    {required.value &&
                      initialValues?.hasOwnProperty(propName) &&
                      !initialValues[propName] && (
                        <Typography
                          type="help"
                          color="errorMain"
                          text={`Select resource type`}
                        />
                      )}
                  </>
                ) : (
                  <div key={propName} className={contentWrapper}></div>
                )}
              </div>
            );
          }
          if (propName === 'title') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  label={'Title *'}
                  textInputType="input"
                  visible={true}
                  nameProp={propName}
                  placeholder="Give the resource a short title"
                  subLabel="Character limit: 40 characters."
                  maxCharacters={40}
                  maxLength={40}
                  isAdminPortalField={true}
                  register={register}
                  value={formValues[propName]}
                  error={
                    required.value &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? 'This field is required'
                      : errors[propName]?.message
                  }
                  onChange={(data) => {
                    setValue(propName, data.target.value);
                  }}
                />
              </div>
            );
          }
          if (propName === 'shortDescription') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  nameProp={propName}
                  label={`Short description *`}
                  placeholder="Add short description"
                  subLabel="Character limit: 50 characters."
                  maxCharacters={50}
                  maxLength={50}
                  register={register}
                  value={formValues[propName]}
                  error={
                    required.value &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? 'This field is required'
                      : errors[propName]?.message
                  }
                  onChange={(data) => setValue(propName, data.target.value)}
                />
              </div>
            );
          }
          if (propName === 'link') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  nameProp={propName}
                  label={`Link *`}
                  placeholder="Add link"
                  subLabel="Before adding a link, please test it to make sure it works."
                  value={formValues[propName]}
                  register={register}
                  error={
                    required.value &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? 'This field is required'
                      : errors[propName]?.message
                  }
                  onChange={(e) => {
                    setValue(propName, e.target.value);
                  }}
                />

                {formValues[propName] !== '' &&
                  !urlRegex.test(formValues[propName]) && (
                    <Typography
                      type="help"
                      color="errorMain"
                      text={`Invalid URL`}
                    />
                  )}
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="mb-2">
                <Typography
                  type={'body'}
                  weight={'bold'}
                  color={'textDark'}
                  text={`${title}`}
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
                  onStateChange={(data) => setValue(propName, data)}
                  subLabel={`How will this resource help practitioners? `}
                />
              </div>
              {required.value &&
                initialValues?.hasOwnProperty(propName) &&
                !initialValues[propName] && (
                  <Typography
                    type="help"
                    color="errorMain"
                    text={`Add description`}
                  />
                )}
            </div>
          );
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

export default CreateResourceForm;
