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
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import DynamicForm from '../../../../components/dynamic-form/dynamic-form';
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
  const { register, formState, setValue, handleSubmit } = useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
  };

  const mutationName = `update${contentType?.name}`;

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

  const createStoryBookPartQuestion = gql`
    mutation createStoryBookPartQuestion(
      $input: StoryBookPartQuestionInput!
      $localeId: String!
    ) {
      createStoryBookPartQuestion(input: $input, localeId: $localeId)
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

  const [updateStoryBookPartContent, { loading: isLoadingUpdateContent }] =
    useMutation(updateStoryBookPart);

  const [createStoryBookPartContent, { loading: isLoadingCreateContent }] =
    useMutation(createStoryBookPart);

  const [deleteStoryBookPartContent, { loading: isLoadingDeleteStoryContent }] =
    useMutation(deleteStoryBookPart);

  const [
    updateStoryBookPartQuestionContent,
    { loading: isLoadingUpdateQuestionContent },
  ] = useMutation(updateStoryBookPartQuestion);

  const [
    createStoryBookPartQuestionContent,
    { loading: isLoadingCreateQuestionContent },
  ] = useMutation(createStoryBookPartQuestion);

  const [
    deleteStoryBookPartQuestionContent,
    { loading: isLoadingDeleteStoryQuestionContent },
  ] = useMutation(deleteStoryBookPartQuestion);

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

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredStoryBookParts, setFilteredStoryBookParts] =
    useState<StoryBookPartDto[]>();
  const [filteredStoryBookPartsQuestions, setFilteredStoryBookPartsQuestions] =
    useState<StoryBookQuestionDto[]>();
  console.log({ filteredStoryBookPartsQuestions });
  console.log({ filteredStoryBookParts });
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

    var newCurrentStorybookParts = {};
    var createdBookPartId: any = {};

    console.log({ filteredStoryBookPartsQuestions });
    console.log({ filteredStoryBookParts });

    filteredStoryBookParts?.map(async (item: StoryBookPartDto, idx: number) => {
      if (item?.id && item?.partText === '') {
        deleteStoryBookPartContent({
          variables: {
            id: item?.id.toString(),
            localeId: selectedLanguageId.toString(),
          },
        })
          .then((response: any) => {
            console.log(response);
            if (response) {
              // refetch();
              // onCancel();
              setNotification({
                title: `Changes saved`,
                variant: NOTIFICATION.SUCCESS,
              });
              const currentStorybookParts = values?.storyBookParts || '';
              let currentStorybookPartsArray =
                currentStorybookParts?.split(',');
              currentStorybookPartsArray?.filter(
                (currentItem) => currentItem?.id !== item?.id
              );
              const newData = currentStorybookPartsArray?.join(',');
              newCurrentStorybookParts = newData;
              const model = {
                ...values,
                storyBookParts: newCurrentStorybookParts,
              };
              updateContent({
                variables: {
                  id: content.id.toString(),
                  input: { ...model },
                  localeId: selectedLanguageId.toString(),
                },
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
        setLoading(false);
        return;
      } else if (!item?.id && item?.partText !== '') {
        await createStoryBookPartContent({
          variables: {
            input: {
              name: item?.name,
              part: item?.part.toString(),
              partText: item?.partText,
              storyBookPartQuestions: '',
            },
            localeId: selectedLanguageId.toString(),
          },
        })
          .then((response) => {
            if (response.data && response.data) {
              setNotification({
                title: `Changes saved`,
                variant: NOTIFICATION.SUCCESS,
              });

              if (filteredStoryBookPartsQuestions?.length > 0) {
                filteredStoryBookPartsQuestions?.map(
                  async (questionContent) => {
                    if (
                      !questionContent?.id &&
                      questionContent?.question !== ''
                    ) {
                      const hasQuestionsChanges =
                        filteredStoryBookPartsQuestions?.find(
                          (question) => question?.idx === idx
                        );
                      if (hasQuestionsChanges) {
                        if (
                          !hasQuestionsChanges?.id &&
                          hasQuestionsChanges.question !== ''
                        ) {
                          await createStoryBookPartQuestionContent({
                            variables: {
                              input: {
                                name: hasQuestionsChanges?.name,
                                question: hasQuestionsChanges?.question,
                              },
                              localeId: selectedLanguageId.toString(),
                            },
                          })
                            .then(async (response) => {
                              setNotification({
                                title: `Changes saved!`,
                                variant: NOTIFICATION.SUCCESS,
                              });
                              //   onCancel();
                              // create the redirect to the main list
                              console.log('1', createdBookPartId);
                              await updateStoryBookPartContent({
                                variables: {
                                  id: response?.data?.createStoryBookParts?.toString(),
                                  input: {
                                    name: item?.name,
                                    part: item?.part.toString(),
                                    partText: item?.partText,
                                    storyBookPartQuestions:
                                      response?.data?.createStoryBookPartQuestion?.toString(),
                                  },
                                  localeId: selectedLanguageId.toString(),
                                },
                              })
                                .then((response) => {
                                  setNotification({
                                    title: `Changes saved!`,
                                    variant: NOTIFICATION.SUCCESS,
                                  });
                                  //   onCancel();
                                  // create the redirect to the main list
                                  const currentStorybookParts =
                                    values?.storyBookParts || '';
                                  let currentStorybookPartsArray =
                                    currentStorybookParts?.split(',');
                                  currentStorybookPartsArray?.push(
                                    response?.data?.createStoryBookParts
                                  );
                                  const newData =
                                    currentStorybookPartsArray?.join(',');
                                  newCurrentStorybookParts = newData;

                                  const model = {
                                    ...values,
                                    storyBookParts: newCurrentStorybookParts,
                                  };

                                  updateContent({
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
                                  setLoading(false);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                              setLoading(false);
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        }
                      }
                    }
                  }
                );
              }

              // createdBookPartId = response?.data
              // setEdit(true);

              savedContent();
              cancelEdit();
              setLoading(false);
              return;
            }
            // savedContent();
            //   onCancel();
            // create the redirect to the main list
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (filteredStoryBookPartsQuestions?.length > 0) {
        const hasQuestionsChanges = filteredStoryBookPartsQuestions?.find(
          (question) => question?.idx === idx
        );
        if (hasQuestionsChanges) {
          if (!hasQuestionsChanges?.id && hasQuestionsChanges.question !== '') {
            await createStoryBookPartQuestionContent({
              variables: {
                input: {
                  name: hasQuestionsChanges?.name,
                  question: hasQuestionsChanges?.question,
                },
                localeId: selectedLanguageId.toString(),
              },
            }).then(async (response) => {
              setNotification({
                title: `Changes saved!`,
                variant: NOTIFICATION.SUCCESS,
              });
              await updateStoryBookPartContent({
                variables: {
                  id: createdBookPartId?.createStoryBookParts?.toString(),
                  input: {
                    name: item?.name,
                    part: item?.part.toString(),
                    partText: item?.partText,
                    storyBookPartQuestions:
                      response?.data?.createStoryBookPartQuestion?.toString(),
                  },
                  localeId: selectedLanguageId.toString(),
                },
              })
                .then((response) => {
                  setNotification({
                    title: `Changes saved!`,
                    variant: NOTIFICATION.SUCCESS,
                  });
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
            return;
          }
        }
        //                } else {
        //                  await createStoryBookPartQuestionContent({
        //           variables: {
        //             input: {
        //               name: hasQuestionsChanges?.name,
        //               question: hasQuestionsChanges?.question,
        //             },
        //             localeId: selectedLanguageId.toString()
        //           }
        //         })
        //         .then(async (response) => {
        //           setNotification({
        //             title: `Changes saved!`,
        //             variant: NOTIFICATION.SUCCESS,
        //           });
        //         //   onCancel();
        //           // create the redirect to the main list
        //           await updateStoryBookPartContent({
        //             variables: {
        //               id: item?.id.toString(),
        //               input: {
        //                 name: item?.name,
        //                 part: item?.part.toString(),
        //                 partText: item?.partText,
        //                 storyBookPartQuestions: response?.data?.createStoryBookPartQuestion?.toString()
        //                },
        //               localeId: selectedLanguageId.toString()
        //             },
        //           })
        //             .then((response) => {
        //               setNotification({
        //                 title: `Changes saved!`,
        //                 variant: NOTIFICATION.SUCCESS,
        //               });
        //             //   onCancel();
        //               // create the redirect to the main list
        //               setLoading(false);
        //             })
        //             .catch((error) => {
        //               console.log(error);
        //             });
        //           setLoading(false);
        //         })
        //         .catch((error) => {
        //           console.log(error);
        //         });
        //                }
        //               }
        //             }
        //           })
        //           console.log('return')
        //           return
        //       }
        // } else {
        //   if(String(item?.id) !== '') {
        //     console.log('item?.id) !== ')
        //     const hasQuestionsChanges = filteredStoryBookPartsQuestions?.find(question => question?.idx === idx)
        //     if(hasQuestionsChanges) {
        //       console.log('hasQuestionsChanges 2')
        //      if(hasQuestionsChanges?.id && hasQuestionsChanges.question !== '') {
        //       console.log('hasQuestionsChanges?.id 3')
        //       await updateStoryBookPartQuestionContent({
        //         variables: {
        //           id: hasQuestionsChanges?.id.toString(),
        //           input: {
        //             name: hasQuestionsChanges?.name,
        //             question: hasQuestionsChanges?.question,
        //           },
        //           localeId: selectedLanguageId.toString()
        //         }
        //       })
        //       .then(async (response) => {
        //         setNotification({
        //           title: `Changes saved!`,
        //           variant: NOTIFICATION.SUCCESS,
        //         });
        //       //   onCancel();
        //         // create the redirect to the main list
        //         await updateStoryBookPartContent({
        //           variables: {
        //             id: item?.id.toString(),
        //             input: {
        //               name: item?.name,
        //               part: item?.part.toString(),
        //               partText: item?.partText,
        //               storyBookPartQuestions: response?.data?.createStoryBookPartQuestion?.toString()
        //              },
        //             localeId: selectedLanguageId.toString()
        //           },
        //         })
        //           .then((response) => {
        //             setNotification({
        //               title: `Changes saved!`,
        //               variant: NOTIFICATION.SUCCESS,
        //             });
        //           //   onCancel();
        //             // create the redirect to the main list
        //             setLoading(false);
        //           })
        //           .catch((error) => {
        //             console.log(error);
        //           });
        //         setLoading(false);
        //       })
        //       .catch((error) => {
        //         console.log(error);
        //       });
        //      }
        //     }
        //     else if(!item?.id && item?.partText !== '') {
        //       const hasQuestionsChanges = filteredStoryBookPartsQuestions?.find(question => question?.idx === idx)
        //       if(hasQuestionsChanges) {
        //         console.log('else if(!item?.id && item?.partText !==')
        //        if(hasQuestionsChanges?.id && hasQuestionsChanges.question !== '') {
        //         console.log('entrou 33')
        //         await createStoryBookPartQuestionContent({
        //           variables: {
        //             input: {
        //               name: hasQuestionsChanges?.name,
        //               question: hasQuestionsChanges?.question,
        //             },
        //             localeId: selectedLanguageId.toString()
        //           }
        //         })
        //         .then(async (response) => {
        //           setNotification({
        //             title: `Changes saved!`,
        //             variant: NOTIFICATION.SUCCESS,
        //           });
        //         //   onCancel();
        //           // create the redirect to the main list
        //           await updateStoryBookPartContent({
        //             variables: {
        //               id: item?.id.toString(),
        //               input: {
        //                 name: item?.name,
        //                 part: item?.part.toString(),
        //                 partText: item?.partText,
        //                 storyBookPartQuestions: response?.data?.createStoryBookPartQuestion?.toString()
        //                },
        //               localeId: selectedLanguageId.toString()
        //             },
        //           })
        //             .then((response) => {
        //               setNotification({
        //                 title: `Changes saved!`,
        //                 variant: NOTIFICATION.SUCCESS,
        //               });
        //             //   onCancel();
        //               // create the redirect to the main list
        //               setLoading(false);
        //             })
        //             .catch((error) => {
        //               console.log(error);
        //             });
        //           setLoading(false);
        //         })
        //         .catch((error) => {
        //           console.log(error);
        //         });
        //        }
        //     }
        //   }

        // if(filteredStoryBookPartsQuestions?.length > 0) {
        //   const hasQuestionsChanges = filteredStoryBookPartsQuestions?.find(question => question?.idx === idx)
        //   if(hasQuestionsChanges) {
        //     if(!hasQuestionsChanges?.id && hasQuestionsChanges.question !== '') {
        //       await createStoryBookPartQuestionContent({
        //         variables: {
        //           input: {
        //             name: hasQuestionsChanges?.name,
        //             question: hasQuestionsChanges?.question,
        //           },
        //           localeId: selectedLanguageId.toString()
        //         }
        //       })
        //       .then(async (response) => {
        //         setNotification({
        //           title: `Changes saved!`,
        //           variant: NOTIFICATION.SUCCESS,
        //         });
        //         console.log({response})
        //         await updateStoryBookPartContent({
        //           variables: {
        //             id: createdBookPartId?.createStoryBookParts?.toString(),
        //             input: {
        //               name: item?.name,
        //               part: item?.part.toString(),
        //               partText: item?.partText,
        //               storyBookPartQuestions: response?.data?.createStoryBookPartQuestion?.toString()
        //              },
        //             localeId: selectedLanguageId.toString()
        //           },
        //         })
        //           .then((response) => {
        //             setNotification({
        //               title: `Changes saved!`,
        //               variant: NOTIFICATION.SUCCESS,
        //             });
        //         setLoading(false);
        //       })
        //       .catch((error) => {
        //         console.log(error);
        //       });
        //       })
        //     return
        //     }
        //     if(hasQuestionsChanges?.id && hasQuestionsChanges.question !== '') {
        //       await updateStoryBookPartQuestionContent({
        //         variables: {
        //           id: hasQuestionsChanges?.id?.toString(),
        //           input: {
        //             name: hasQuestionsChanges?.name,
        //             question: hasQuestionsChanges?.question,
        //           },
        //           localeId: selectedLanguageId.toString()
        //         }
        //       })
        //       .then(async (response) => {
        //         setNotification({
        //           title: `Changes saved!`,
        //           variant: NOTIFICATION.SUCCESS,
        //         });
        //         console.log({response})
        //         await updateStoryBookPartContent({
        //           variables: {
        //             id: createdBookPartId?.createStoryBookParts?.toString(),
        //             input: {
        //               name: item?.name,
        //               part: item?.part.toString(),
        //               partText: item?.partText,
        //               storyBookPartQuestions: response?.data?.createStoryBookPartQuestion?.toString()
        //              },
        //             localeId: selectedLanguageId.toString()
        //           },
        //         })
        //           .then((response) => {
        //             setNotification({
        //               title: `Changes saved!`,
        //               variant: NOTIFICATION.SUCCESS,
        //             });
        //         setLoading(false);
        //       })
        //       .catch((error) => {
        //         console.log(error);
        //       });
        //       })
        //     return
        //     }
        // }
        // }

        await updateStoryBookPartContent({
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
        })
          .then((response) => {
            setNotification({
              title: `Changes saved!`,
              variant: NOTIFICATION.SUCCESS,
            });
            // onCancel();
            // create the redirect to the main list
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });

        const model = { ...values, storyBookParts: newCurrentStorybookParts };
        //     console.log({model})
        //     await updateContent({
        //       variables: {
        //         id: content.id.toString(),
        //         input: { ...model },
        //         localeId: selectedLanguageId.toString(),
        //       },
        //     }).catch(() => {
        //       setLoading(false);
        //     });

        // setNotification({
        //   title: 'Successfully Updated Content!',
        //   variant: NOTIFICATION.SUCCESS,
        // });

        savedContent();

        setLoading(false);
      }
    });
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
                {cancelEdit &&
                  camelCaseToSentanceCase(content?.name ?? content?.type)}
              </h3> */}
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Story
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <Typography type={'h3'} text={'Type:'} color={'textDark'} />
                <div>{content?.type}</div>
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
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className="bg-secondary hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              <SaveIcon width="22px" className="mr-2" />
              Save & publish
            </button>

            <button
              onClick={deleteAndRefresh}
              className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
            >
              <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
              Delete {content.name}
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
