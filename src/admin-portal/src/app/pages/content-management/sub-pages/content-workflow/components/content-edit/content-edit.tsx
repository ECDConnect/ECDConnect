import { gql, useMutation } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeEnum,
  ContentTypeFieldDto,
  ContentValueDto,
  LanguageDto,
  NOTIFICATION,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import DynamicForm from '../../../../components/dynamic-form/dynamic-form';
import {
  ActivitiesTitles,
  ContentManagementView,
  DynamicFormTemplate,
  FormTemplateField,
  TemplateTypenames,
} from '../../../../content-management-models';
import { Alert, DialogPosition, Typography } from '@ecdlink/ui';
import {
  BookOpenIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import {
  CoachingCircleText,
  ContentTypes,
} from '../../../../../../constants/content-management';
import {
  BulkUpdateConsentImages,
  bulkUpdateCoachingCircleTopicDates,
} from '@ecdlink/graphql';
import { format } from 'date-fns';

export interface ContentViewProps {
  content: any;
  selectedLanguageId: string;
  defaultLanguageId: string;
  contentValues: ContentValueDto[];
  optionDefinitions: ContentDefinitionModelDto[];
  contentType: ContentTypeDto;
  savedContent: () => void;
  cancelEdit?: () => void;
  cancelCompare?: () => void;
  choosedSectionTitle?: string;
  setSearchValue?: (item: string) => void;
  contentView?: ContentManagementView;
  postNatalType?: ContentTypeDto;
  selectedTab?: number;
  languages: LanguageDto[];
}

export interface RequirementProps {
  value: boolean;
  message: string;
}

export default function ContentEdit({
  content,
  selectedLanguageId,
  defaultLanguageId,
  contentValues,
  optionDefinitions,
  contentType,
  cancelEdit,
  savedContent,
  cancelCompare,
  choosedSectionTitle,
  setSearchValue,
  contentView,
  postNatalType,
  selectedTab,
  languages,
}: ContentViewProps) {
  const [acceptedFileFormats, setAcceptedFileFormats] = useState<any>();
  const [allowedFileSize, setAllowedFileSize] = useState(13631488); // 13 MB
  const [requiredMessage, setRequiredMessage] = useState(
    'This field is required'
  );
  const { setNotification } = useNotifications();
  const { register, formState, setValue, handleSubmit, control, getValues } =
    useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
    control: control,
  };

  const { type: formType } = useWatch({ control });

  const mutationName = `update${contentType?.name}`;

  const creationMutationName = `create${contentType?.name}`;

  const updateMutation = gql` 
    mutation ${mutationName} ($id: String!, $input: ${contentType?.name}Input!, $localeId: String!) {
      ${mutationName} (id: $id, input: $input, localeId: $localeId) {
        id
      } 
    }
  `;

  const deleteMutationName = `delete${contentType?.name}`;
  const deleteMutation = gql` 
    mutation ${deleteMutationName} ($id: String!, $localeId: String!) {
      ${deleteMutationName} (id: $id, localeId: $localeId) 
      }
  `;

  const createMutation = gql` 
  mutation ${creationMutationName} ($input: ${contentType.name}Input!, $localeId: String!) {
    ${creationMutationName} (input: $input, localeId: $localeId) 
    }
  `;

  const [saveCoachCircleDates] = useMutation(
    bulkUpdateCoachingCircleTopicDates
  );

  const [saveConsentImages] = useMutation(BulkUpdateConsentImages);

  const [updateContent] = useMutation(updateMutation);
  const [createContent] = useMutation(createMutation);

  const dialog = useDialog();

  const [deleteContent, { loading: isLoadingDeleteContent }] =
    useMutation(deleteMutation);

  const deleteAndRefresh = async (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Are you sure you want to delete this content?"
          message={`You will not be able to recover this content if you delete it now. This will change what practitioners see on the app and might change items they have edited previously.`}
          onCancel={onCancel}
          btnText={['Delete', 'Keep editing']}
          isLoading={isLoadingDeleteContent}
          onSubmit={() => {
            onSubmit();
            deleteContent({
              variables: {
                id: content.id.toString(),
                localeId: selectedLanguageId?.toString(),
              },
            })
              .then(() => {
                cancelEdit();
                setNotification({
                  title: 'Content deleted',
                  variant: NOTIFICATION.SUCCESS,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      ),
    });
  };

  const cancelDialog = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <AlertModal
          title="Discard unsaved changes?"
          btnText={['Discard changes', 'Keep editing']}
          message={` If you leave now, you will lose all of your changes.`}
          onCancel={onCancel}
          onSubmit={() => {
            setSearchValue('');
            cancelEdit();
            onCancel();
          }}
        />
      ),
    });
  };

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues = getValues();
  const [smallLargeGroupsSkills, setSmallLargeGroupsSkills] = useState([]);
  const [dangerSignsDisableInputs, setDangerSignsDisableInputs] =
    useState(false);
  const selectedLanguage = languages?.find(
    (item) => item?.id === selectedLanguageId
  );

  const disableButton =
    choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities
      ? template?.fields
          ?.filter((x) => x?.propName !== 'subType')
          .filter(
            (item) =>
              item?.isRequired &&
              initialValues?.hasOwnProperty(item?.propName) &&
              !initialValues[item?.propName]
          )
      : choosedSectionTitle === ActivitiesTitles.StoryActivities
      ? template?.fields
          ?.filter((x) => x?.propName !== 'subCategories')
          .filter(
            (item) =>
              item?.isRequired &&
              initialValues?.hasOwnProperty(item?.propName) &&
              !initialValues[item?.propName]
          )
      : template?.fields?.filter(
          (item) =>
            item?.isRequired &&
            initialValues?.hasOwnProperty(item?.propName) &&
            !initialValues[item?.propName]
        );
  const disbleButtonStyles =
    choosedSectionTitle === ActivitiesTitles.SmallLargeGroupActivities
      ? `bg-secondary ${
          disableButton?.length > 0 || smallLargeGroupsSkills?.length < 2
            ? 'opacity-25'
            : ''
        } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`
      : `bg-secondary ${
          disableButton?.length > 0 ? 'opacity-25' : ''
        } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`;

  useEffect(() => {
    if (selectedTab === 2 || selectedTab === 3) {
      const t: DynamicFormTemplate = {
        title: `${postNatalType?.name} Form`,
        fields: [],
      };

      const copy: ContentTypeFieldDto[] = Object.assign(
        [],
        postNatalType?.fields
      );

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((item: ContentTypeFieldDto) => {
        if (item.displayPage) {
          const renderedField = getRenderField(item);

          if (renderedField) t.fields.push(renderedField);
        }
      });

      setTemplate(t);

      return;
    }

    if (contentType && contentValues && selectedLanguageId) {
      const t: DynamicFormTemplate = {
        title: `${contentType?.name} Form`,
        fields: [],
      };

      const copy: ContentTypeFieldDto[] = Object.assign(
        [],
        contentType?.fields
      );

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((item: ContentTypeFieldDto) => {
        if (item.displayPage) {
          const renderedField = getRenderField(item);

          if (renderedField) t.fields.push(renderedField);
        }
      });

      setTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, contentValues, selectedLanguageId]);

  useEffect(() => {
    if (contentType) {
      if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
        setAcceptedFileFormats(['pdf']);
        setAllowedFileSize(5242880);
        setRequiredMessage('');
      }
    }
  }, [contentType]);

  const getRenderField = (
    field: ContentTypeFieldDto
  ): FormTemplateField | undefined => {
    const item = contentValues.find(
      (x) =>
        x.contentTypeField.fieldName === field.fieldName &&
        x.localeId === selectedLanguageId
    );

    const optionDefinition = optionDefinitions.find(
      (x) => x.contentName === field?.dataLinkName
    );

    const returnField: FormTemplateField = {
      propName: field?.fieldName ?? '',
      type: field?.fieldType.dataType ?? '',
      title: camelCaseToSentanceCase(field?.displayName ?? ''),
      required: {
        value: false,
        message: '',
      },
      contentValue: item,
      optionDefinition: optionDefinition,
      selectedLanguageId: selectedLanguageId,
      dataLinkName: field.dataLinkName,
      isRequired: field?.isRequired,
      subHeading: getSubHeading(field),
      fieldAlert: getFieldAlert(field),
    };

    if (item && item.localeId === selectedLanguageId) {
      setValue(returnField.propName, item.value);
    } else {
      setValue(returnField.propName, undefined);
    }
    return returnField;
  };

  const getSubHeading = (field: ContentTypeFieldDto) => {
    if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
      if (field.fieldName === CoachingCircleText.START_DATE) {
        return CoachingCircleText.START_DATE_SUB_HEADING;
      }
      if (field.fieldName === CoachingCircleText.END_DATE) {
        return CoachingCircleText.END_DATE_SUB_HEADING;
      }
    }
    return '';
  };

  const getFieldAlert = (field: ContentTypeFieldDto) => {
    if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
      if (field.fieldName === CoachingCircleText.START_DATE) {
        return CoachingCircleText.START_DATE_ALERT;
      }
      if (field.fieldName === CoachingCircleText.END_DATE) {
        return CoachingCircleText.END_DATE_ALERT;
      }
    }
    return '';
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    const model = { ...values };

    // make sure that we work with a date, we send a string to ensure correct dates
    Object.keys(model).forEach((key) => {
      if (model[key] instanceof Date) {
        model[key] = format(model[key], 'yyyy-MM-dd') + 'T00:00:00.000Z';
      }
    });

    if (!content?.id && !content?.childId) {
      await createContent({
        variables: {
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      }).catch(() => {
        setLoading(false);
      });
    } else {
      await updateContent({
        variables: {
          id: content?.id?.toString() || content?.childId?.toString(),
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      }).catch((err) => {
        setLoading(false);
      });

      // the requirement is that when you save the dates for a coaching circle, you need to update all other languages with same dates.
      if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
        await saveCoachCircleDates({
          variables: {
            contentId: +content.id,
            contentTypeId: +contentType.id,
            localeId: selectedLanguageId.toString(),
            startDate: model[CoachingCircleText.START_DATE],
            endDate:
              model[CoachingCircleText.END_DATE] === ''
                ? null
                : model[CoachingCircleText.END_DATE],
          },
        }).catch((error) => {
          console.log(error);
        });
      }

      // if there is an image, we need to copy the image to the other languages
      if (
        contentType.name === ContentTypes.CONSENT ||
        contentType?.name === ContentTypes.INFO_PAGES
      ) {
        if ('image' in model && model.image !== undefined) {
          await saveConsentImages({
            variables: {
              contentId: +content.id,
              contentTypeId: +contentType.id,
              localeId: selectedLanguageId.toString(),
              imageUrl: model.image,
            },
          }).catch((error) => {
            console.log(error);
          });
        }
      }
    }

    setNotification({
      title: 'Changes published',
      variant: NOTIFICATION.SUCCESS,
    });

    savedContent();

    setLoading(false);

    if (cancelEdit) {
      cancelEdit();
    }
  };

  useEffect(() => {
    if (
      template?.title === TemplateTypenames.DanngerSigns &&
      template?.fields?.[0]?.selectedLanguageId === defaultLanguageId
    ) {
      setDangerSignsDisableInputs(true);
    }
  }, [defaultLanguageId, template?.fields, template?.title]);

  if (
    contentType &&
    contentValues &&
    template &&
    !loading &&
    !isLoadingDeleteContent
  ) {
    return (
      <div className="flex flex-col rounded-md ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                {cancelEdit &&
                  content?.__typename !== 'DangerSign' &&
                  camelCaseToSentanceCase(
                    content?.name ??
                      content?.type ??
                      content?.title ??
                      content?.section
                  )}
                {cancelEdit &&
                  content?.__typename === 'DangerSign' &&
                  camelCaseToSentanceCase(content?.section || '')}
              </h3>
              {(selectedTab === 2 || selectedTab === 3) && (
                <>
                  <div className="flex items-center gap-2">
                    <Typography
                      className="truncate"
                      type="h4"
                      weight="bold"
                      color="textMid"
                      text={'Section:'}
                    />
                    <Typography
                      type="h4"
                      color="textMid"
                      text={content?.section}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography
                      className="truncate"
                      type="h4"
                      weight="bold"
                      color="textMid"
                      text={'Type:'}
                    />
                    <Typography
                      type="h4"
                      color="textMid"
                      text={content?.childType}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {!!cancelCompare && (
                <button
                  type="button"
                  onClick={cancelCompare}
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Compare Languages
                  <BookOpenIcon width="20px" className="pl-1" />
                </button>
              )}

              {!!cancelEdit && (
                <button
                  onClick={cancelDialog}
                  type="button"
                  className="bg-errorBg text-tertiary hover:bg-tertiary ml-2 inline-flex items-center rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm hover:text-white"
                >
                  Cancel
                  <XIcon width="22px" className="pl-1" />
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-white px-12 pt-6 pb-8">
            {contentType?.name === ContentTypes.CONSENT ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            ) : contentType?.name === ContentTypes.INFO_PAGES ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            ) : null}

            {Number(postNatalType?.id) === ContentTypeEnum?.NatalVideo && (
              <Alert
                className="mt-2 mb-2 rounded-md"
                title="Make sure you do the following:"
                list={[
                  `Upload the correct language version (${selectedLanguage?.description})`,
                  `Restrict the video size to standard smartphone resolution (300dpi) and make sure videos are 360px wide, 640px high at 15 frames per second. If the video is too large users will not be able to load the page.`,
                ]}
                type="warning"
              />
            )}

            {dangerSignsDisableInputs && (
              <Alert
                className={'mt-5 mb-3'}
                title="You cannot edit the English version."
                message={
                  'To add or edit a translation, please choose a different language tab above.'
                }
                type={'warning'}
              />
            )}

            {!dangerSignsDisableInputs && (
              <DynamicForm
                template={template}
                handleform={handleform}
                setValue={setValue}
                defaultLanguageId={defaultLanguageId}
                acceptedFileFormats={acceptedFileFormats}
                allowedFileSize={allowedFileSize}
                formType={formType}
                choosedSectionTitle={choosedSectionTitle}
                getValues={getValues}
                requiredMessage={requiredMessage}
                useWatch={useWatch}
                contentView={contentView}
                setSmallLargeGroupsSkills={setSmallLargeGroupsSkills}
              />
            )}
          </div>

          {!dangerSignsDisableInputs && (
            <div className="flex flex-row">
              <button
                type="submit"
                className={disbleButtonStyles}
                disabled={
                  choosedSectionTitle ===
                  ActivitiesTitles.SmallLargeGroupActivities
                    ? disableButton?.length > 0 &&
                      smallLargeGroupsSkills?.length < 2
                    : disableButton?.length > 0
                }
              >
                <SaveIcon width="22px" className="mr-2" />
                Save & publish
              </button>
              {content?.id &&
                content?.__typename !== ContentTypes.PROGRESS_TRACKING_SKILL &&
                content?.__typename !== ContentTypes.MORE_INFORMATION &&
                content?.__typename !== ContentTypes.CONSENT &&
                content?.__typename !== ContentTypes.DANGERSIGN && (
                  <button
                    onClick={deleteAndRefresh}
                    className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
                  >
                    <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
                    Delete {content?.name}
                  </button>
                )}
            </div>
          )}
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
