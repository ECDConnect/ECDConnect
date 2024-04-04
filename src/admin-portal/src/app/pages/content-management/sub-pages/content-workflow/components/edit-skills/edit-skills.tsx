import { gql, useMutation, useQuery } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
  ContentTypeEnum,
  ContentTypeFieldDto,
  ContentValueDto,
  NOTIFICATION,
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
import { Alert, DialogPosition } from '@ecdlink/ui';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import EditSkillsForm from './components/edit-skills-form/edit-skills-form';
import { ContentTypes } from '../../../../../../constants/content-management';
import { UpdateSubCategorySkills } from '@ecdlink/graphql';

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
  setSelectedLanguageId?: (item: string) => void;
}

export default function EditSkills({
  content,
  selectedLanguageId,
  defaultLanguageId,
  contentValues,
  optionDefinitions,
  contentType,
  cancelEdit,
  savedContent,
  cancelCompare,
  setSelectedLanguageId,
}: ContentViewProps) {
  const [acceptedFileFormats, setAcceptedFileFormats] = useState<any>();
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(true);
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

  const deleteMutationName = `delete${contentType?.name}`;
  const deleteMutation = gql` 
    mutation ${deleteMutationName} ($id: String!, $localeId: String!) {
      ${deleteMutationName} (id: $id, localeId: $localeId) 
      }
  `;

  const subcategoriesQuery = gql`
    query GetAllProgressTrackingSubCategory($localeId: String) {
      GetAllProgressTrackingSubCategory(localeId: $localeId) {
        id
        skills {
          id
          __typename
        }
        imageUrl
        imageHexColor
        description
        name
        __typename
      }
    }
  `;

  const dialog = useDialog();

  const [deleteContent, { loading: isLoadingDeleteContent }] =
    useMutation(deleteMutation);

  const deleteAndRefresh = async (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
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
            cancelEdit();
            onCancel();
          }}
        />
      ),
    });
  };

  const {
    data: subcategoriesContentData,
    // refetch: refetchSubcategoriesContent,
    // loading: loadingSubCategoriesContent,
  } = useQuery(subcategoriesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: selectedLanguageId,
    },
  });

  const subCategories =
    subcategoriesContentData?.GetAllProgressTrackingSubCategory;

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [changedCategory, setChangedCategory] = useState([]);

  useEffect(() => {
    if (changedCategory) {
      if (changedCategory?.length > 0) {
        setDisableButton(false);
        for (let cat of changedCategory) {
          if (cat?.subCategories?.length > 0) {
            for (let subCat of cat?.subCategories) {
              if (subCat?.skills.length > 0) {
                // find all empty skills and compare to total skills for sub cat
                const emptySkills = subCat?.skills.filter(
                  (x) => x.id === '' && x.name === ''
                );
                if (emptySkills.length === subCat?.skills.length) {
                  setDisableButton(true);
                }
              }
            }
          }
        }
      }
    }
  }, [changedCategory]);

  const disbleButtonStyles = `bg-secondary ${
    disableButton ? 'opacity-25' : ''
  } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`;

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

  useEffect(() => {
    if (contentType) {
      if (contentType.name === ContentTypes.COACHING_CIRCLE_TOPICS) {
        setAcceptedFileFormats(['pdf']);
      } else if (contentType.name === ContentTypes.PROGRESS_TRACKING_SKILL) {
        setShowDeleteButton(false);
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

    if (!content?.id) {
      return null;
    } else {
      if (changedCategory?.length > 0) {
        const uniqueSubCats = [];
        for (let cat of changedCategory) {
          if (cat?.subCategories?.length > 0) {
            for (let subCat of cat?.subCategories) {
              if (
                uniqueSubCats.findIndex(
                  (item) => item.subCatId === subCat.id
                ) === -1
              ) {
                uniqueSubCats.push({
                  subCatId: subCat.id,
                  name: subCat.name,
                  skills: [],
                });
              }
            }
          }
        }

        for (let cat of changedCategory) {
          if (cat?.subCategories?.length > 0) {
            for (let subCat of cat?.subCategories) {
              let catObject = uniqueSubCats.find(
                (item) => item.subCatId === subCat.id
              );
              if (catObject) {
                if (subCat?.skills.length > 0) {
                  for (let skill of subCat?.skills) {
                    if (skill?.name !== '') {
                      catObject.skills.push({
                        id: skill?.id.toString(),
                        name: skill?.name,
                        level:
                          skill?.level?.[0]?.id === ''
                            ? cat.level.toString()
                            : skill?.level?.[0]?.id.toString(),
                        contentTypeId: ContentTypeEnum.ProgressTrackingSkill,
                      });
                    }
                  }
                }
              }
            }
          }
        }

        await updateSubCategorySkills({
          variables: {
            subCategories: uniqueSubCats,
            localeId: selectedLanguageId,
          },
        });
      }
    }

    setNotification({
      title: 'Changes published',
      variant: NOTIFICATION.SUCCESS,
    });

    savedContent();
    setLoading(false);
    cancelEdit();
  };

  const [updateSubCategorySkills] = useMutation(UpdateSubCategorySkills);

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
                  camelCaseToSentanceCase(content?.name ?? content?.type)}{' '}
                category
              </h3>
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
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`Note that any changes made below are not made to SmartLink. If you make any major edits below, discuss them with the SmartLink team.`}
                type="warning"
              />
            )}
            <EditSkillsForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
              selectedLanguageId={selectedLanguageId}
              acceptedFileFormats={acceptedFileFormats}
              contentId={content?.id}
              setChangedCategory={setChangedCategory}
              changedCategory={changedCategory}
              setSelectedLanguageId={setSelectedLanguageId}
              formType={formType}
              cancelEdit={cancelEdit}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className={disbleButtonStyles}
              disabled={disableButton}
            >
              <SaveIcon width="22px" className="mr-2" />
              Save & publish
            </button>
            {content?.id && showDeleteButton && (
              <button
                onClick={deleteAndRefresh}
                className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
              >
                <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
                Delete {content?.name}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
