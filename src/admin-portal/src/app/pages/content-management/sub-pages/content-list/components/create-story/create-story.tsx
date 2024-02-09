import { gql, useMutation } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
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
import { Alert, DialogPosition, Typography } from '@ecdlink/ui';
import {
  BookOpenIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import CreateStoryForm from './components/create-story-form';

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

  const updateStoryBookPart = gql`
    mutation updateStoryBookParts(
      $id: String!
      $input: StoryBookPartsInput!
      $localeId: String!
    ) {
      updateStoryBookParts(id: $id, input: $input, localeId: $localeId) {
        id
      }
    }
  `;

  const createStoryBookPart = gql`
    mutation createStoryBookParts(
      $input: StoryBookPartsInput!
      $localeId: String!
    ) {
      createStoryBookParts(input: $input, localeId: $localeId)
    }
  `;

  const deleteStoryBookPart = gql`
    mutation deleteStoryBookParts($id: String!, $localeId: String!) {
      deleteStoryBookParts(id: $id, localeId: $localeId)
    }
  `;

  const createStoryBookPartQuestion = gql`
    mutation createStoryBookPartQuestion(
      $input: StoryBookPartQuestionInput!
      $localeId: String!
    ) {
      createStoryBookPartQuestion(input: $input, localeId: $localeId)
    }
  `;

  const updateStoryBookPartQuestion = gql`
    mutation updateStoryBookPartQuestion(
      $id: String!
      $input: StoryBookPartQuestionInput!
      $localeId: String!
    ) {
      updateStoryBookPartQuestion(id: $id, input: $input, localeId: $localeId) {
        id
      }
    }
  `;

  const deleteStoryBookPartQuestion = gql`
    mutation deleteStoryBookPartQuestion($id: String!, $localeId: String!) {
      deleteStoryBookPartQuestion(id: $id, localeId: $localeId)
    }
  `;

  const dialog = useDialog();

  const [deleteContent, { loading: isLoadingDeleteContent }] =
    useMutation(deleteMutation);

  const [updateStoryBookPartContent] = useMutation(updateStoryBookPart);

  const [createStoryBookPartContent] = useMutation(createStoryBookPart);

  const [deleteStoryBookPartContent] = useMutation(deleteStoryBookPart);

  const [createStoryBookPartQuestionContent] = useMutation(
    createStoryBookPartQuestion
  );

  const [updateStoryBookPartQuestionContent] = useMutation(
    updateStoryBookPartQuestion
  );

  const [deleteStoryBookPartQuestionContent] = useMutation(
    deleteStoryBookPartQuestion
  );

  const [storybookPartsIds, setStorybookPartsIds] = useState([]);

  const deleteAndRefresh = async (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Are you sure you want to delete this content?"
          message={` You will not be able to recover this content if you delete it now.`}
          onCancel={onCancel}
          btnText={['Yes, Delete Content', 'Keep editing']}
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
                  title: 'Successfully Deleted Content!',
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

  const [updateContent] = useMutation(updateMutation);
  const [crateContent] = useMutation(createMutation);

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredStoryBookParts, setFilteredStoryBookParts] =
    useState<StoryBookPartDto[]>();
  const [filteredStoryBookPartsQuestions, setFilteredStoryBookPartsQuestions] =
    useState<StoryBookQuestionDto[]>();
  const [requiredMessage, setRequiredMessage] = useState(
    'This field is required'
  );
  const [authorsAuthorization, setAuthorsAuthorization] = useState(false);
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

    let newCurrentStorybookPartsIds = [];
    var createdBookPartId: any = {};
    let newStoryBook = '';

    const model = { ...values };
    if (!content?.id) {
      const createResponse = await crateContent({
        variables: {
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      });
      setLoading(false);
      newStoryBook = createResponse?.data?.createStoryBook;
      savedContent();
      cancelEdit();
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
      setLoading(false);
      savedContent();
      cancelEdit();
    }

    for (let item of filteredStoryBookParts) {
      if (!item?.id && item?.partText === '') {
        return;
      }

      if (item?.id && item?.partText !== '') {
        const updateStoryBookPartResponse = await updateStoryBookPartContent({
          variables: {
            id: item?.id.toString(),
            input: {
              name: item?.name,
              part: item?.part.toString(),
              partText: item?.partText,
              storyBookPartQuestions:
                item?.storyBookPartQuestions?.[0]?.id.toString(),
            },
            localeId: selectedLanguageId.toString(),
          },
        });
        if (updateStoryBookPartResponse) {
          setNotification({
            title: `Changes saved!`,
            variant: NOTIFICATION.SUCCESS,
          });
          setLoading(false);

          if (filteredStoryBookPartsQuestions?.length > 0) {
            const indexHasChanges = filteredStoryBookPartsQuestions?.find(
              (quest) => {
                return quest?.idx === item?.idx;
              }
            );
            if (indexHasChanges) {
              if (indexHasChanges?.id && indexHasChanges?.question === '') {
                const deleteQuestionResponse =
                  await deleteStoryBookPartQuestionContent({
                    variables: {
                      id: indexHasChanges?.id.toString(),
                      localeId: selectedLanguageId.toString(),
                    },
                  });

                if (deleteQuestionResponse) {
                  setNotification({
                    title: 'Successfully Updated Content!',
                    variant: NOTIFICATION.SUCCESS,
                  });
                }
              }
            }
            if (indexHasChanges?.question) {
              if (!indexHasChanges?.id && indexHasChanges?.question !== '') {
                const createQuestionResponse =
                  await createStoryBookPartQuestionContent({
                    variables: {
                      input: {
                        name: indexHasChanges?.question,
                        question: indexHasChanges?.question,
                      },
                      localeId: selectedLanguageId.toString(),
                    },
                  });

                if (createQuestionResponse) {
                  await updateStoryBookPartContent({
                    variables: {
                      id: item?.id.toString(),
                      input: {
                        name: item?.name,
                        part: item?.part.toString(),
                        partText: item?.partText,
                        storyBookPartQuestions:
                          createQuestionResponse.data?.createStoryBookPartQuestion?.toString(),
                      },
                      localeId: selectedLanguageId.toString(),
                    },
                  });
                }
              }

              if (indexHasChanges?.id && indexHasChanges?.question !== '') {
                const createQuestionResponse =
                  await updateStoryBookPartQuestionContent({
                    variables: {
                      id: indexHasChanges?.id.toString(),
                      input: {
                        name: indexHasChanges?.question,
                        question: indexHasChanges?.question,
                      },
                      localeId: selectedLanguageId.toString(),
                    },
                  });
              }
            }
          }
        }

        const model = { ...values };

        await updateContent({
          variables: {
            id: content.id.toString(),
            input: { ...model },
            localeId: selectedLanguageId.toString(),
          },
        }).catch(() => {
          setLoading(false);
        });

        setNotification({
          title: 'Successfully Updated Content!',
          variant: NOTIFICATION.SUCCESS,
        });

        savedContent();

        setLoading(false);
      }

      if (item?.id && item?.partText === '') {
        const response = deleteStoryBookPartContent({
          variables: {
            id: item?.id.toString(),
            localeId: selectedLanguageId.toString(),
          },
        });

        if (response) {
          setNotification({
            title: `Changes saved`,
            variant: NOTIFICATION.SUCCESS,
          });
          const currentStorybookParts = values?.storyBookParts || '';
          let currentStorybookPartsArray = currentStorybookParts?.split(',');
          const filteredcurrentStorybookPartsArray =
            currentStorybookPartsArray?.filter((currentItem) => {
              return Number(currentItem) !== item?.id;
            });
          const newData = filteredcurrentStorybookPartsArray?.join(',');
          const model = {
            ...values,
            storyBookParts: newData,
          };
          updateContent({
            variables: {
              id: content.id.toString(),
              input: { ...model },
              localeId: selectedLanguageId.toString(),
            },
          });
        }
        setLoading(false);

        savedContent();
        cancelEdit();
        return;
      }
      if (!item?.id && item?.partText !== '') {
        const createBookPartresponse = await createStoryBookPartContent({
          variables: {
            input: {
              name: item?.name,
              part: item?.part.toString(),
              partText: item?.partText,
              storyBookPartQuestions: '',
            },
            localeId: selectedLanguageId.toString(),
          },
        });

        if (createBookPartresponse && createBookPartresponse.data) {
          setNotification({
            title: `Changes saved`,
            variant: NOTIFICATION.SUCCESS,
          });

          if (filteredStoryBookPartsQuestions?.length > 0) {
            const indexHasChanges = filteredStoryBookPartsQuestions?.find(
              (quest) => {
                return quest?.idx === item?.idx;
              }
            );
            if (indexHasChanges?.question) {
              if (!indexHasChanges?.id && indexHasChanges?.question !== '') {
                const createQuestionResponse =
                  await createStoryBookPartQuestionContent({
                    variables: {
                      input: {
                        name: indexHasChanges?.question,
                        question: indexHasChanges?.question,
                      },
                      localeId: selectedLanguageId.toString(),
                    },
                  });

                if (createBookPartresponse) {
                  await updateStoryBookPartContent({
                    variables: {
                      id: createBookPartresponse.data?.createStoryBookParts?.toString(),
                      input: {
                        name: item?.name,
                        part: item?.part.toString(),
                        partText: item?.partText,
                        storyBookPartQuestions:
                          createQuestionResponse.data?.createStoryBookPartQuestion?.toString(),
                      },
                      localeId: selectedLanguageId.toString(),
                    },
                  });
                }
                if (indexHasChanges?.id && indexHasChanges?.question !== '') {
                  const createQuestionResponse =
                    await updateStoryBookPartQuestionContent({
                      variables: {
                        id: indexHasChanges?.id,
                        input: {
                          name: indexHasChanges?.question,
                          question: indexHasChanges?.question,
                        },
                        localeId: selectedLanguageId.toString(),
                      },
                    });
                }
              }
            }
          }

          createdBookPartId =
            createBookPartresponse?.data?.createStoryBookParts;
          setStorybookPartsIds([...storybookPartsIds, createdBookPartId]);
          newCurrentStorybookPartsIds = [
            ...newCurrentStorybookPartsIds,
            createdBookPartId,
          ];
          const currentStorybookParts = values?.storyBookParts || '';
          let currentStorybookPartsArray = currentStorybookParts?.split(',');
          currentStorybookPartsArray?.push(createdBookPartId);
        }

        const newModel = {
          ...model,
          storyBookParts:
            model?.storyBookParts +
            ',' +
            newCurrentStorybookPartsIds.toString(),
        };

        await updateContent({
          variables: {
            id: content?.id ? content?.id?.toString() : newStoryBook,
            input: { ...newModel },
            localeId: selectedLanguageId.toString(),
          },
        });
        setLoading(false);

        savedContent();
        cancelEdit();
      }
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
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`Note that any changes made below are not made to SmartLink. If you make any major edits below, discuss them with the SmartLink team.`}
                type="warning"
              />
            )}

            <CreateStoryForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
              setFilteredStoryBookParts={setFilteredStoryBookParts}
              setFilteredStoryBookPartsQuestions={
                setFilteredStoryBookPartsQuestions
              }
              formType={formType}
              getValues={getValues}
              useWatch={useWatch}
              requiredMessage={requiredMessage}
              setAuthorsAuthorization={setAuthorsAuthorization}
              authorsAuthorization={authorsAuthorization}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className={`bg-secondary ${
                disableButton?.length > 0 ||
                !authorsAuthorization ||
                (storyBookAndReadAloudRequiredPart &&
                  filledStoryParts?.length < 1)
                  ? 'opacity-25'
                  : ''
              } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
              disabled={
                disableButton?.length > 0 ||
                !authorsAuthorization ||
                (storyBookAndReadAloudRequiredPart &&
                  filledStoryParts?.length < 1)
              }
            >
              <SaveIcon width="22px" className="mr-2" />
              Save & publish
            </button>

            <button
              onClick={deleteAndRefresh}
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
