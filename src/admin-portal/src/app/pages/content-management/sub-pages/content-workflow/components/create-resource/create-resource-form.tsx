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
  Radio,
  FormInput,
} from '@ecdlink/ui';

export interface CreateResourceFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  formType?: string;
  choosedSectionTitle: string;
}

const contentWrapper = '';
const dataFreeOptions = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
];

export const classroomOptions = [
  'Activities',
  'Stories',
  'Teaching tips',
  'Other',
];

export const businessOptions = [
  'Financial',
  'Administration & policies',
  'DBE registration',
  'Other',
];

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  choosedSectionTitle,
}) => {
  const { register, control, errors } = handleform;
  const [resourceType, setResourceType] = useState('');

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
      const { type, title, propName, required, validation } = field;

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
                <ButtonGroup<string>
                  color="tertiary"
                  textColor="tertiary"
                  notSelectedColor="tertiaryAccent2"
                  type={ButtonGroupTypes.Button}
                  options={dataFreeOptions}
                  onOptionSelected={(value) => {
                    onStateChange(propName, value);
                  }}
                  // selectedOptions={'true'}
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
                <fieldset className="flex flex-col gap-1">
                  {choosedSectionTitle === ResourcesTitles.ClassroomResources &&
                    classroomOptions?.map((item) => (
                      <Radio
                        variant="slim"
                        key={item}
                        description={item}
                        value={item}
                        // checked={resourceType === item}
                        onChange={(data) => onStateChange(propName, data)}
                      />
                    ))}
                  {choosedSectionTitle === ResourcesTitles.BusinessResources &&
                    businessOptions?.map((item) => (
                      <Radio
                        variant="slim"
                        key={item}
                        description={item}
                        value={item}
                        // checked={resourceType === item}
                        onChange={(data) => onStateChange(propName, data)}
                      />
                    ))}
                </fieldset>
              </div>
            );
          }
          if (propName === 'title') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  name={propName}
                  label={`Title *`}
                  placeholder="Give the resource a short title"
                  subLabel="Character limit: 40 characters."
                  maxCharacters={40}
                  maxLength={40}
                  register={register}
                  error={errors[propName]?.message}
                  value={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  onChange={(data) => onStateChange(propName, data)}
                />
              </div>
            );
          }
          if (propName === 'shortDescription') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  name={propName}
                  label={`Short description *`}
                  placeholder="Add short description"
                  subLabel="Character limit: 50 characters."
                  maxCharacters={50}
                  maxLength={50}
                  register={register}
                  error={errors[propName]?.message}
                  value={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  onChange={(data) => onStateChange(propName, data)}
                />
              </div>
            );
          }
          if (propName === 'link') {
            return (
              <div key={propName} className={contentWrapper}>
                <FormInput
                  name={propName}
                  label={`Link *`}
                  placeholder="Add link"
                  subLabel="Before adding a link, please test it to make sure it works."
                  value={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  register={register}
                  error={errors[propName]?.message}
                  onChange={(data) => onStateChange(propName, data)}
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
                  currentValue={
                    field.contentValue ? field.contentValue.value : undefined
                  }
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
