import { gql, useMutation } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeEnum,
  ContentTypeFieldDto,
  ContentValueDto,
  NOTIFICATION,
  StoryBookPartDto,
  StoryBookQuestionDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import {
  DynamicFormTemplate,
  FormTemplateField,
} from '../../../../content-management-models';
import { ActionModal, Alert, DialogPosition } from '@ecdlink/ui';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import CreateStoryForm from './components/create-story-form';
import { LanguageId } from '../../../../../../constants/language';
import {
  BulkUpdateStoryBookThemes,
  UpdateStoryBookAndParts,
} from '@ecdlink/graphql';

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
}

export enum StoryBookTypes {
  storyBook = 'Story book',
  readAloud = 'Read aloud',
  other = 'Other',
}

export default function CreateStory({
  content,
  selectedLanguageId,
  defaultLanguageId,
  contentValues,
  optionDefinitions,
  contentType,
  cancelEdit,
  savedContent,
  cancelCompare,
}: ContentViewProps) {
  const { setNotification } = useNotifications();
  const { register, formState, setValue, handleSubmit, control, getValues } =
    useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
    control: control,
  };
  const initialValues = getValues();

  const { type: formType } = useWatch({ control });

  const mutationName = `update${contentType?.name}`;
  const createMutationName = `create${contentType?.name}`;

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
  mutation createStoryBook ($input: ${contentType.name}Input!, $localeId: String!) {
    ${createMutationName} (input: $input, localeId: $localeId) 
    }
`;

  const [saveStorybookThemes] = useMutation(BulkUpdateStoryBookThemes);

  const dialog = useDialog();
  const [deleteContent, { loading: isLoadingDeleteContent }] =
    useMutation(deleteMutation);
  const [updateStoryBookAndParts] = useMutation(UpdateStoryBookAndParts);

  // Get story book default values
  const englishDefaultValues = contentValues.filter(
    (n) =>
      n.contentTypeField.fieldName === 'type' ||
      n.contentTypeField.fieldName === 'author' ||
      n.contentTypeField.fieldName === 'illustrator'
  );

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
                  title: 'Content deleted!',
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
            cancelEdit();
            onCancel();
          }}
        />
      ),
    });
  };

  const cannotDeleteDialog = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          icon={'ExclamationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          actionButtons={[
            {
              text: 'No, cancel',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => onCancel && onCancel(),
              leadingIcon: 'XIcon',
            },
          ]}
          title="You cannot delete this item"
          customDetailText={
            <div className="w-full text-center">
              <div>{`This item is linked to these published theme(s): ${content?.inUseThemeNames}.`}</div>
              <div className="mt-2">{`To delete this item, remove it from the theme(s) first`}</div>
            </div>
          }
        />
      ),
    });
  };

  const [updateContent] = useMutation(updateMutation);
  const [createContent] = useMutation(createMutation);

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredStoryBookParts, setFilteredStoryBookParts] =
    useState<StoryBookPartDto[]>();
  const [filteredStoryBookPartsQuestions, setFilteredStoryBookPartsQuestions] =
    useState<StoryBookQuestionDto[]>();
  const [requiredMessage, setRequiredMessage] = useState(
    'This field is required'
  );
  const storyBookAndReadAloudRequiredPart =
    initialValues?.type === StoryBookTypes.storyBook ||
    initialValues?.type === StoryBookTypes.readAloud;
  const filledStoryParts = filteredStoryBookParts?.filter(
    (item) => item?.partText !== ''
  );
  const disableButton = template?.fields?.filter(
    (item) =>
      item?.isRequired &&
      initialValues?.hasOwnProperty(item?.propName) &&
      !initialValues[item?.propName]
  );
  const isEdit = template && template.fields.some((f) => !!f.contentValue);

  useEffect(() => {
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

      // populate type from english when language is not english
      if (selectedLanguageId !== LanguageId.enZa) {
        const propType = t.fields.find((item) => item.propName === 'type');
        if (propType.contentValue === undefined) {
          const defaultType = englishDefaultValues.find(
            (item) => item.contentTypeField.fieldName === 'type'
          );
          propType.contentValue = defaultType;
          // set the answer for validation
          setValue('type', defaultType.value);
        }
      }

      setTemplate(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, contentValues, selectedLanguageId]);

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
      isRequired: field.isRequired,
    };

    if (item && item.localeId === selectedLanguageId) {
      setValue(returnField.propName, item.value);
    } else {
      setValue(returnField.propName, undefined);
    }
    return returnField;
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    const model = { ...values };
    let newContentId = '';

    if (!content?.id) {
      const newContent = await createContent({
        variables: {
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      });

      if (newContent) {
        newContentId = newContent?.data?.createStoryBook;
      }
    } else {
      await updateContent({
        variables: {
          id: content.id.toString(),
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      }).catch(() => {
        setLoading(false);
      });

      await saveStorybookThemes({
        variables: {
          contentId: +content.id,
          contentTypeId: +contentType.id,
          localeId: selectedLanguageId.toString(),
          themeIds: model.themes,
        },
      }).catch((error) => {
        console.log(error);
      });
    }

    const storyBookParts = [];
    for (let item of filteredStoryBookParts) {
      let mappedQuestion =
        filteredStoryBookPartsQuestions &&
        filteredStoryBookPartsQuestions.find((q) => q.idx === item.idx);
      if (mappedQuestion) {
        storyBookParts.push({
          id: item.id.toString(),
          name: item.name,
          part: item.part,
          partText: item.partText,
          partContentTypeId: ContentTypeEnum.StoryBookParts,
          questionId: mappedQuestion.id.toString(),
          questionName: mappedQuestion.name,
          questionText: mappedQuestion.question,
          questionContentTypeId: ContentTypeEnum.StoryBookPartQuestion,
          questionChange: true,
        });
      } else {
        if (item.name !== '') {
          let qId = '';
          if (item.storyBookPartQuestions.length !== 0) {
            qId = item.storyBookPartQuestions[0].id.toString();
          }
          storyBookParts.push({
            id: item.id.toString(),
            name: item.name,
            part: item.part,
            partText: item.partText,
            partContentTypeId: ContentTypeEnum.StoryBookParts,
            questionId: qId,
            questionName: '',
            questionText: '',
            questionChange: false,
            questionContentTypeId: ContentTypeEnum.StoryBookPartQuestion,
          });
        }
      }
    }

    await updateStoryBookAndParts({
      variables: {
        storyBookParts: storyBookParts,
        storyBookContentId: content === undefined ? +newContentId : content.id,
        localeId: selectedLanguageId,
        currentBookPartsIds: model.storyBookParts ? model.storyBookParts : '',
      },
    });

    setLoading(false);
    savedContent();
    if (cancelEdit) {
      cancelEdit();
    }
    return;
  };

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
              {/* <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Story
              </h3> */}
              <div className="mt-1 flex items-center gap-1">
                {/* <Typography type={'h3'} text={'Add'} color={'textDark'} />
                <div>{content?.type}</div> */}
              </div>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {/* {!!cancelCompare && (
                <button
                  type="button"
                  onClick={cancelCompare}
                  className="bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Compare Languages
                  <BookOpenIcon width="20px" className="pl-1" />
                </button>
              )} */}

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
            {contentType?.name === 'Consent' ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            ) : contentType?.name === 'Info Pages' ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            ) : (
              <></>
            )}

            <CreateStoryForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
              selectedLanguageId={selectedLanguageId}
              setFilteredStoryBookParts={setFilteredStoryBookParts}
              setFilteredStoryBookPartsQuestions={
                setFilteredStoryBookPartsQuestions
              }
              formType={formType}
              getValues={getValues}
              useWatch={useWatch}
              requiredMessage={requiredMessage}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className={`bg-secondary ${
                disableButton?.length > 0 ||
                initialValues.authorsAuthorization !== 'true' ||
                (!isEdit
                  ? storyBookAndReadAloudRequiredPart &&
                    filledStoryParts?.length < 1
                  : content.storyBookParts.length === 0)
                  ? 'opacity-25'
                  : ''
              } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
              disabled={
                disableButton?.length > 0 ||
                initialValues.authorsAuthorization !== 'true' ||
                (!isEdit
                  ? storyBookAndReadAloudRequiredPart &&
                    filledStoryParts?.length < 1
                  : content.storyBookParts.length === 0)
              }
            >
              <SaveIcon width="22px" className="mr-2" />
              Save & publish
            </button>

            <button
              onClick={content?.isInUse ? cannotDeleteDialog : deleteAndRefresh}
              className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
            >
              <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
              Delete {content?.name}
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
