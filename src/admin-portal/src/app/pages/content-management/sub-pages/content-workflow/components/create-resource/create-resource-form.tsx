import { useEffect, useState, useCallback } from 'react';
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

export interface CreateResourceFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  formType?: string;
  choosedSectionTitle: string;
  getValues?: any;
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
  { id: 0, label: 'Financial', value: 'Financial' },
  {
    id: 1,
    label: 'Administration & policies',
    value: 'Administration & policies',
  },
  { id: 2, label: 'DBE registration', value: 'DBE registration' },
  { id: 3, label: 'Other', value: 'Other' },
];

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  choosedSectionTitle,
  getValues,
}) => {
  const { register, control, errors } = handleform;
  const formValues = getValues();
  const [selectedResourceType, setSelectedResourceType] = useState<string>();

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };

  const [fields, setFields] = useState<any>();

  useEffect(() => {
    if (template) {
      const fields = renderFields(template.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const renderFields = useCallback((fields: FormTemplateField[]) => {
    const isEdit = fields.some((f) => !!f.contentValue);
    return fields.map((field) => {
      const { type, title, propName, required, validation, isRequired } = field;
      register(propName, { required: required });
      switch (type) {
        case FieldType.Text:
          if (propName === 'dataFree') {
            return (
              <div key={propName} className={contentWrapper}>
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
                    onStateChange(propName, value);
                  }}
                  selectedOptions={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                />
              </div>
            );
          }
          if (propName === 'resourceType') {
            return (
              <div key={propName} className={contentWrapper}>
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
                        onStateChange(propName, val);
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
                        onStateChange(propName, val);
                      }}
                    />
                  )}
                </fieldset>
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
                  register={register}
                  value={formValues[propName]}
                  error={errors[propName]?.message}
                  onChange={(data) =>
                    onStateChange(propName, data.target.value)
                  }
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
                  error={errors[propName]?.message}
                  value={formValues[propName]}
                  onChange={(data) =>
                    onStateChange(propName, data.target.value)
                  }
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
                  error={errors[propName]?.message}
                  onChange={(data) =>
                    onStateChange(propName, data.target.value)
                  }
                />
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
                  label={title + ` *`}
                  subLabel={`How will this resource help practitioners? `}
                  currentValue={formValues[propName]}
                  onStateChange={(data) => onStateChange(propName, data)}
                />
              </div>
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
  }, []);

  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
      {fields}
    </div>
  );
};

export default CreateResourceForm;
