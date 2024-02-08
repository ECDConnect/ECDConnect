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
import { CombinedDatePickers } from '../../../../../../../components/combined-date-pickers';
import CategoryContentForm from '../../../../../../../components/category-content-form/category-content-form';

const acceptedFormats = [
  'svg',
  'png',
  'PNG',
  'jpg',
  'JPG',
  'jpeg',
  ...videoExtensions,
];

export interface CategoryFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  acceptedFileFormats?: string[];
  setFilteredSubcategories?: (item: any[]) => void;
  allowedFileSize?: number;
  content?: any;
  getValues?: any;
  useWatch?: any;
  formType?: string;
}

const contentWrapper = '';

const CategoryForm: React.FC<CategoryFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  acceptedFileFormats,
  setFilteredSubcategories,
  allowedFileSize,
  content,
  getValues,
  useWatch,
  formType,
}) => {
  const { register, control, errors } = handleform;

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };

  const initialValues = getValues();

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
    return fields.map((field) => {
      const { type, title, propName, required, validation } = field;

      register(propName, { required: required });

      switch (type) {
        case FieldType.Text:
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <FormField
                  label={title + ` *`}
                  nameProp={propName}
                  register={register}
                  error={errors[propName]?.message}
                  required={required}
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
                  label={title}
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
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedFileFormats || acceptedFormats}
                  label={title}
                  nameProp={propName}
                  contentUrl={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  returnFullUrl={true}
                  setValue={setValue}
                  allowedFileSize={allowedFileSize}
                  isSubcategoryInput={true}
                  isIconInput={true}
                />
              </div>
            </div>
          );
        case FieldType.Link: {
          if (propName === 'subCategories') {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <CategoryContentForm
                    title={field.title}
                    isReview={false}
                    contentValue={field.contentValue}
                    languageId={defaultLanguageId}
                    optionDefinition={field.optionDefinition}
                    setSelectedItems={(value) => onStateChange(propName, value)}
                    acceptedFileFormats={acceptedFileFormats}
                    setFilteredSubcategories={setFilteredSubcategories}
                    content={content}
                  />
                </div>
              </div>
            );
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
                  label={title}
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
                  label={title}
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

export default CategoryForm;
