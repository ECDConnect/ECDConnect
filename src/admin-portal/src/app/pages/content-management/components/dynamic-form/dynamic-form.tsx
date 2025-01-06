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
} from '../../content-management-models';
import {
  Alert,
  ActionModal,
  DialogPosition,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
} from '@ecdlink/ui';
import { CombinedDatePickers } from '../../../../components/combined-date-pickers';
import {
  ActivityTypes,
  ContentForms,
  ContentTypes,
} from '../../../../constants/content-management';
import Editor from '../../../../components/form-markdown-editor/form-markdown-editor';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { ContentTypeDto, useDialog } from '@ecdlink/core';

const acceptedFormats = ['svg', 'png', 'jpg', 'jpeg'];
const acceptedVideoFormats = ['mp4'];
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
  id?: string;
  contentType?: ContentTypeDto;
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
  id,
  contentType,
}) => {
  const { register, control, errors } = handleform;

  const dialog = useDialog();
  const isEdit = template && template.fields.some((f) => !!f.contentValue);
  const isEnglish =
    template?.fields?.[0]?.selectedLanguageId === defaultLanguageId;

  const onStateChange = (name: string, state: any) => {
    setValue(name, state);
  };
  const initialValues = getValues();

  const smallLargeGroupOptions = [
    { text: 'Small group', value: 'Small group' },
    { text: 'Large group', value: 'Large group' },
  ];

  const shareContentOptions = [
    { text: 'Yes', value: 'true' },
    { text: 'No', value: 'false' },
  ];

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

  const isSmallLargeGroup =
    choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities;
  const [disableActivitiesInputs, setDisableActivitiesInputs] = useState(false);

  useEffect(() => {
    if (
      choosedSectionTitle === ActivitiesTitles.StoryActivities &&
      initialValues?.hasOwnProperty('type') &&
      !initialValues['type']
    ) {
      setValue('type', 'Story time');
    }
  }, [choosedSectionTitle, initialValues, setValue]);

  const [fields, setFields] = useState<any>();

  const watchFields = useWatch({ control });

  useEffect(() => {
    if (template && watchFields) {
      if (contentType.name === ContentTypes.ACTIVITY) {
        if (choosedSectionTitle !== ActivityTypes.STORY_ACTIVITIES) {
          const copyTemplate = Object.assign([], template);
          template.fields = copyTemplate?.fields
            .map((item: any) => ({
              ...item,
              title:
                item.propName === 'type'
                  ? 'Activity type'
                  : item.propName === 'description'
                  ? 'Steps (what do I do?)'
                  : item.propName === 'notes'
                  ? 'Notes'
                  : item.title,
              propOrder:
                item.propName === 'type'
                  ? 0
                  : item.propName === 'image'
                  ? 1
                  : item.propName === 'subCategories'
                  ? 2
                  : item.propName === 'name'
                  ? 3
                  : item.propName === 'materials'
                  ? 4
                  : item.propName === 'description'
                  ? 5
                  : item.propName === 'notes'
                  ? 6
                  : item.propName === 'themes'
                  ? 7
                  : item.propName === 'shareContent'
                  ? 8
                  : 9,
            }))
            .sort(function (a, b) {
              return a.propOrder - b.propOrder;
            });
        }
      }
      const fields = renderFields(template?.fields);
      setFields(fields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, watchFields]);

  const setStoriesGeneralInputsValues = useCallback(() => {
    onStateChange('type', contentView?.content?.['type']);
    onStateChange('image', contentView?.content?.['image']);
    onStateChange('shareContent', contentView?.content?.['shareContent']);
    onStateChange(
      'subCategories',
      contentView?.content?.['subCategories']
        ?.map((item) => item?.id)
        ?.toString()
    );
    onStateChange(
      'themes',
      contentView?.content?.['themes']?.map((item) => item?.id)?.toString()
    );

    if (!isEnglish) {
      setDisableActivitiesInputs(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentView?.content, isEnglish]);

  const setContentInputValues = useCallback(() => {
    onStateChange('image', contentView?.content?.['image']);
    setDisableActivitiesInputs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentView?.content]);

  useEffect(() => {
    if (contentType.name === ContentTypes.ACTIVITY && contentView?.content) {
      setStoriesGeneralInputsValues();
    }
  }, [contentView?.content, setStoriesGeneralInputsValues, contentType.name]);

  useEffect(() => {
    if (
      template.title === ContentForms.CONSENT_FORM &&
      template?.fields?.[0]?.selectedLanguageId !== defaultLanguageId &&
      contentView?.content
    ) {
      setStoriesGeneralInputsValues();
    }
  }, [
    contentView?.content,
    defaultLanguageId,
    setContentInputValues,
    setStoriesGeneralInputsValues,
    template?.fields,
    template.title,
  ]);

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

      let placeHolder = '';
      let subLabel = '';
      if (contentType.name === ContentTypes.ACTIVITY) {
        if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
          if (propName === 'name') {
            placeHolder = 'Give the activity a title';
          } else if (propName === 'materials') {
            placeHolder = 'Add materials...';
            subLabel =
              'List all materials the practitioner will need, sperated by a comma';
          } else if (propName === 'description') {
            placeHolder = 'Add instructions...';
          } else if (propName === 'notes') {
            placeHolder = 'Add tips...';
            subLabel = 'Optional';
          } else if (propName === 'subType') {
            subLabel = 'Which story types go with this activity?';
          } else if (propName === 'themes') {
            subLabel = 'Optional';
          }
        } else {
          if (propName === 'name') {
            placeHolder = 'Give the activity a title';
          } else if (propName === 'materials') {
            placeHolder = 'Add materials...';
            subLabel =
              'List all materials the practitioner will need, sperated by a comma';
          } else if (propName === 'description') {
            placeHolder = 'Add steps...';
          } else if (propName === 'notes') {
            placeHolder = 'Add notes...';
          } else if (propName === 'themes') {
            subLabel = 'Optional';
          }
        }
      }

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
          if (propName === 'shareContent') {
            if (
              disableActivitiesInputs ||
              field?.contentValue?.value === 'yes' ||
              field?.contentValue?.value === 'true'
            ) {
              return null;
            }

            return (
              <div key={propName} className={contentWrapper}>
                {isEdit && (
                  <Alert
                    className="mt-2 mb-2 rounded-md"
                    message={`Editing this version will share all translations of this content.`}
                    type="warning"
                  />
                )}
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
                    type={'small'}
                    color={'textMid'}
                    text={`If you select 'Yes', then any future edits made & all translations of this activity can be shared with other organisations.`}
                  />
                  <div className={`bg-uiBg gap-2 sm:col-span-12`}>
                    <ButtonGroup
                      options={shareContentOptions}
                      onOptionSelected={(value: string | string[]) => {
                        onStateChange(propName, value);
                      }}
                      selectedOptions={field?.contentValue?.value}
                      color="tertiary"
                      notSelectedColor="tertiaryAccent2"
                      type={ButtonGroupTypes.Button}
                      className={'mr-2 w-full rounded-2xl'}
                      multiple={false}
                    />
                  </div>
                </div>
              </div>
            );
          }
          if (
            propName === 'type' &&
            isSmallLargeGroup &&
            template?.title === ContentForms.ACTIVITY_FROM
          ) {
            if (isEdit || disableActivitiesInputs) {
              return null;
            }

            return (
              <div key={propName} className={contentWrapper}>
                <label
                  htmlFor={propName}
                  className="mb-1 block text-lg font-medium text-gray-800"
                >
                  {field?.title}
                </label>
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
            template?.title === ContentForms.ACTIVITY_FROM &&
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
                    subLabel={subLabel}
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
                  subLabel={subLabel}
                  nameProp={propName}
                  register={register}
                  error={
                    isRequired &&
                    initialValues?.hasOwnProperty(propName) &&
                    !initialValues[propName]
                      ? requiredMessage
                      : ''
                  }
                  placeholder={placeHolder}
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
                  subLabel={subLabel}
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
              {choosedSectionTitle === ActivitiesTitles.StoryActivities &&
                propName === 'notes' && (
                  <Divider dividerType="dotted" className="mt-4" />
                )}
            </div>
          );
        case FieldType.Image:
          if (choosedSectionTitle === ActivitiesTitles.StoryActivities) {
            return null;
          }
          if (propName === 'image') {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  {!isEnglish && (
                    <Alert
                      className="mt-2 mb-4 rounded-md"
                      message={`To edit this field, go to the English version.`}
                      type="warning"
                    />
                  )}

                  {isEnglish && (
                    <Alert
                      className="mt-2 mb-4 rounded-md"
                      message={`Editing the image here will update the image for all translations of this page.`}
                      type="warning"
                    />
                  )}

                  <div className={`${!isEnglish ? 'opacity-25' : ''}`}>
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
              </div>
            );
          }
          return (
            <div key={propName} className={contentWrapper}>
              bb
              <Alert
                className="mt-2 mb-4 rounded-md"
                message={`Editing the image here will update the image for all translations of this page.`}
                type="warning"
              />
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
          if (propName === 'subCategories' || propName === 'themes') {
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
                const valueFormattedToArray =
                  initialValues[propName]?.split(',');
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
                        subLabel={subLabel}
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
                      subLabel={subLabel}
                      title={field.title}
                      isReview={false}
                      contentValue={field.contentValue}
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
                    subLabel={subLabel}
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
          } else {
            return (
              <div key={propName} className={contentWrapper}>
                <div className="sm:col-span-12">
                  <DynamicSelector
                    subLabel={subLabel}
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
