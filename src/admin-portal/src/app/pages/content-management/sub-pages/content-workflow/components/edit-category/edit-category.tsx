import { gql, useMutation } from '@apollo/client';
import {
  camelCaseToSentanceCase,
  ContentDefinitionModelDto,
  ContentTypeDto,
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
import { BookOpenIcon, SaveIcon, XIcon } from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import CategoryForm from './category-form/category-form';
import {
  bulkUpdateProgressTrackingCategoryImages,
  bulkUpdateProgressTrackingSubCategoryImages,
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

export default function EditCategory({
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
  const { type: formType } = useWatch({ control });
  const allowedFileSize = 2631488;

  const [saveCategoryImages] = useMutation(
    bulkUpdateProgressTrackingCategoryImages
  );
  const [saveSubCategoryImages] = useMutation(
    bulkUpdateProgressTrackingSubCategoryImages
  );

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

  const updateSubcategory = gql`
    mutation updateProgressTrackingSubCategory(
      $id: String!
      $input: ProgressTrackingSubCategoryInput!
      $localeId: String!
    ) {
      updateProgressTrackingSubCategory(
        id: $id
        input: $input
        localeId: $localeId
      ) {
        id
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
                  title: 'Content',
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
  const [createContent] = useMutation(createMutation);
  const [updateSubcategoryContent] = useMutation(updateSubcategory);

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

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
        value: field.isRequired,
        message: field.isRequired ? 'Required field' : '',
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
    const model = { ...values };
    if (!content?.id) {
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
          id: content.id.toString(),
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      }).catch(() => {
        setLoading(false);
      });
      // call back-end to update all other language images
      if ('imageUrl' in model) {
        await saveCategoryImages({
          variables: {
            contentId: +content.id,
            contentTypeId: +contentType.id,
            localeId: selectedLanguageId.toString(),
            imageUrl: model['imageUrl'],
          },
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    if (filteredSubcategories?.length > 0) {
      for (let item of filteredSubcategories) {
        if (!item?.id) {
          savedContent();

          setLoading(false);

          setNotification({
            title: 'Changes published',
            variant: NOTIFICATION.SUCCESS,
          });
          return;
        }

        if (
          item?.id &&
          (item?.smallGroupActivity?.[0]?.id !== '' ||
            item?.smallGroupActivity?.id !== '')
        ) {
          let subCategorySkills = item?.skills
            ?.map((skill) => skill?.id)
            ?.toString();

          await updateSubcategoryContent({
            variables: {
              id: item?.id.toString(),
              input: {
                description: item?.description,
                imageUrl: item?.imageUrl,
                imageHexColor: item?.imageHexColor,
                name: item?.name,
                skills: subCategorySkills,
              },
              localeId: selectedLanguageId.toString(),
            },
          });
          // call back-end function to copy images to other languages
          if ('imageUrl' in item) {
            const subCatContentTypeId = optionDefinitions.find(
              (x) => x.contentName === 'ProgressTrackingSubCategory'
            ).identifier;
            await saveSubCategoryImages({
              variables: {
                contentId: +item?.id,
                contentTypeId: +subCatContentTypeId,
                localeId: selectedLanguageId.toString(),
                imageUrl: item?.imageUrl,
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
      cancelEdit();
    }

    savedContent();
    setLoading(false);
    cancelEdit();
  };

  const initialValues = getValues();
  const disableButton = template?.fields?.filter(
    (item) =>
      item?.required.value &&
      initialValues?.hasOwnProperty(item?.propName) &&
      !initialValues[item?.propName]
  );

  const disableButtonSubCats = filteredSubcategories?.filter(
    (item) => item?.name === '' || item?.description === ''
  );

  const disbleButtonStyles = `bg-secondary ${
    disableButton?.length > 0 || disableButtonSubCats.length > 0
      ? 'opacity-25'
      : ''
  } hover:bg-uiMid focus:outline-none mt-3 inline-flex items-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`;

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
                  camelCaseToSentanceCase(content?.name ?? content?.type)}
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
                message={`Note that any changes made below are not made to SmartLink.`}
                list={[
                  'If you make any major edits below, discuss them with the SmartLink team.',
                ]}
                type="warning"
              />
            )}

            <CategoryForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={selectedLanguageId}
              setFilteredSubcategories={setFilteredSubcategories}
              allowedFileSize={allowedFileSize}
              formType={formType}
              content={content}
              getValues={getValues}
              useWatch={useWatch}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className={disbleButtonStyles}
              disabled={
                disableButton?.length > 0 || disableButtonSubCats?.length > 0
              }
            >
              <SaveIcon width="22px" className="mr-2" />
              Save & publish
            </button>

            {/* Let code commented, to allow delete categories if needed. */}
            {/* {content?.id && content?.__typename !== 'ProgressTrackingLevel' && (
              <button
                onClick={deleteAndRefresh}
                className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
              >
                <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
                Delete {content?.name}
              </button>
            )} */}
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
