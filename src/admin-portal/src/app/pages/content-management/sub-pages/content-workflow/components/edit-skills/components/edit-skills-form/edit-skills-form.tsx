import { useEffect, useState } from 'react';
import DynamicSelector from '../../../../../../../../components/dynamic-selector/dynamic-selector';
import {
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../../../../../content-management-models';
import EditSkillsContentForm from '../edit-skills-content-form/edit-skills-content-form';

export interface EditSkillsFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  selectedLanguageId: string;
  acceptedFileFormats?: string[];
  contentId?: number;
  setChangedCategory?: (item: any[]) => void;
  changedCategory?: any[];
  setSelectedLanguageId?: (item: string) => void;
  formType?: string;
  cancelEdit?: () => void;
}

const contentWrapper = '';

const EditSkillsForm: React.FC<EditSkillsFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  selectedLanguageId,
  acceptedFileFormats,
  contentId,
  setChangedCategory,
  changedCategory,
  setSelectedLanguageId,
  formType,
  cancelEdit,
}) => {
  const { register } = handleform;

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

  const renderFields = (fields: FormTemplateField[]) => {
    return fields.map((field) => {
      const { type, title, propName, required } = field;

      register(propName, { required: required });

      switch (type) {
        case FieldType.Link: {
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
                <EditSkillsContentForm
                  title={field.title}
                  isReview={false}
                  contentValue={field.contentValue}
                  languageId={defaultLanguageId}
                  selectedLanguageId={selectedLanguageId}
                  optionDefinition={field.optionDefinition}
                  setSelectedItems={(value) => onStateChange(propName, value)}
                  contentId={contentId}
                  setChangedCategory={setChangedCategory}
                  changedCategory={changedCategory}
                  template={template}
                  setSelectedLanguageId={setSelectedLanguageId}
                  cancelEdit={cancelEdit}
                />
              </div>
            </div>
          );
        }
        default:
          return null;
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
      {fields}
    </div>
  );
};

export default EditSkillsForm;
