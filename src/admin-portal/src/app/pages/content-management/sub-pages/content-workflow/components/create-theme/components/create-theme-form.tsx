import { useEffect, useState } from 'react';
import DynamicSelector from '../../../../../../../components/dynamic-selector/dynamic-selector';
import DynamicStaticSelector from '../../../../../../../components/dynamic-static-selector/dynamic-static-selector';
import FormColorField from '../../../../../../../components/form-color-field/form-color-field';
import FormFileInput from '../../../../../../../components/form-file-input/form-file-input';
import Editor from '../../../../../../../components/form-markdown-editor/form-markdown-editor';
import {
  DynamicFormTemplate,
  FieldType,
  FormTemplateField,
} from '../../../../../content-management-models';
import { CombinedDatePickers } from '../../../../../../../components/combined-date-pickers';
import ThemeContentSelector from '../../../../../../../components/theme-content-form/theme-content-form';
import {
  Alert,
  ActionModal,
  DialogPosition,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
} from '@ecdlink/ui';
import { useDialog } from '@ecdlink/core';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { useWatch } from 'react-hook-form';

const acceptedFormats = ['svg', 'png', 'PNG', 'jpg', 'JPG', 'jpeg'];

export interface CreateThemeFormProps {
  template: DynamicFormTemplate;
  handleform: any;
  setValue: any;
  defaultLanguageId: string;
  acceptedFileFormats?: string[];
  setFilteredThemeDays?: (item: any[]) => void;
  allowedFileSize?: number;
  formType?: string;
  getValues?: any;
}

const contentWrapper = '';
const shareContentOptions = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
];

const CreateThemeForm: React.FC<CreateThemeFormProps> = ({
  template,
  handleform,
  setValue,
  defaultLanguageId,
  acceptedFileFormats,
  setFilteredThemeDays,
  allowedFileSize,
  formType,
  getValues,
}) => {
  const { register, control, errors } = handleform;

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };

  const initialValues = getValues();
  const watchFields = useWatch({ control });

  const [hasUnsharedContent, setHasUnsharedContent] = useState(false);

  const dialog = useDialog();

  const renderDialog = () => {
    let title = 'Sharing content with other organisations';
    let detailText = `If you select 'Yes', the content and all translations  of this content will be shared with other organisations. Any edits you make to this content in the future will also be shared.
    After publishing, you will be able to change your response from 'No' to 'Yes' at any point, but once you select 'Yes' and publish, you cannot stop sharing the content.`;

    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            customIcon={
              <InformationCircleIcon className="text-infoMain mb-4 w-9" />
            }
            title={title}
            detailText={detailText}
            buttonClass="rounded-2xl"
            actionButtons={[
              {
                colour: 'secondary',
                text: 'Close',
                textColour: 'secondary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  const [fields, setFields] = useState<any>();

  useEffect(() => {
    if (template && watchFields) {
      const fields = renderFields(template.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, watchFields]);

  const renderFields = (fields: FormTemplateField[]) => {
    const isEdit = fields.some((f) => !!f.contentValue);

    return fields.map((field) => {
      const { type, title, propName, required, validation } = field;

      register(propName, { required: required });

      switch (type) {
        case FieldType.Text:
          if (propName === 'shareContent') {
            if (
              field?.contentValue?.value === 'true' ||
              field?.contentValue?.value === 'yes'
            ) {
              return null;
            }
            return (
              <div key={propName} className={contentWrapper}>
                {isEdit && !hasUnsharedContent ? (
                  <Alert
                    className="mt-2 mb-2 rounded-md"
                    message={`Editing this version will share all translations of this content.`}
                    type="warning"
                  />
                ) : hasUnsharedContent ? (
                  <Alert
                    title="You cant share this theme! Activities highlighted above are not shared with other organisations."
                    className="mt-2 mb-4 rounded-md"
                    list={[
                      'To share the theme, share the activities highlighted.',
                      'You can always save the theme now and share it later.',
                    ]}
                    type="warning"
                  />
                ) : (
                  <div className="flex"></div>
                )}
                <div className="flex">
                  <Typography
                    type={'body'}
                    weight={'bold'}
                    color={'textMid'}
                    text={field?.title}
                  />
                  <div className="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div className="justify-stretch flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        className="bg-secondary hover:bg-uiLight focus:outline-none focus:ring-secondary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                        onClick={() => renderDialog()}
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>
                <Typography
                  type={'body'}
                  color={'textMid'}
                  text={`If you select 'Yes', then any future edits made & all translations of this activity can be shared with other organisations.`}
                />
                <div
                  className={`bg-uiBg gap-2 sm:col-span-12 ${
                    hasUnsharedContent && 'pointer-events-none opacity-50'
                  }`}
                >
                  <ButtonGroup
                    options={shareContentOptions}
                    onOptionSelected={(value: string | string[]) => {
                      onStateChange(propName, value);
                    }}
                    color="tertiary"
                    type={ButtonGroupTypes.Button}
                    className={'mr-2 w-full rounded-2xl'}
                    multiple={false}
                  />
                </div>
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              <div className="sm:col-span-12">
                <FormInput
                  label={'Title *'}
                  textInputType="input"
                  visible={true}
                  nameProp={propName}
                  subLabel="Give your theme a name no longer than 20 characters"
                  maxCharacters={20}
                  maxLength={20}
                  isAdminPortalField={true}
                  register={register}
                  value={initialValues[propName]}
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

                {/* <FormInput
                  label={''}
                  nameProp={propName}
                  register={register}
                  maxCharacters={20}
                  maxLength={20}
                  onChange={(e) => {
                    onStateChange(propName, e.target.value);
                  }}
                  error={
                    required.value &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? 'This field is required'
                      : errors[propName]?.message
                  }
                /> */}
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
              {propName === 'imageUrl' && isEdit && (
                <Alert
                  className="mt-2 mb-4 rounded-md"
                  message={`Editing the image here will update the image for all translations of this page.`}
                  type="warning"
                />
              )}
              <div className="sm:col-span-12">
                <FormFileInput
                  acceptedFormats={acceptedFileFormats || acceptedFormats}
                  label={propName === 'themeLogo' ? title : title + ' *'}
                  subLabel={propName === 'themeLogo' && 'Optional'}
                  nameProp={propName}
                  contentUrl={
                    field.contentValue ? field.contentValue.value : undefined
                  }
                  returnFullUrl={true}
                  setValue={setValue}
                  allowedFileSize={allowedFileSize}
                  isThemeFormFile={propName === 'themeLogo' ? false : true}
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
                <ThemeContentSelector
                  title={field.title}
                  isReview={false}
                  contentValue={field.contentValue}
                  languageId={defaultLanguageId}
                  optionDefinition={field.optionDefinition}
                  setSelectedItems={(value) => onStateChange(propName, value)}
                  setFilteredThemeDays={setFilteredThemeDays}
                  setHasUnsharedContent={setHasUnsharedContent}
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
                  contentValue={field.contentValue.value}
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

export default CreateThemeForm;
