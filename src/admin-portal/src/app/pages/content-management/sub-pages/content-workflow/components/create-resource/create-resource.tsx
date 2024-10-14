import { gql, useLazyQuery, useMutation } from '@apollo/client';
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
  ResourcesTitles,
} from '../../../../content-management-models';
import { DialogPosition, StatusChip } from '@ecdlink/ui';
import {
  BookOpenIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import CreateResourceForm from './create-resource-form';
import { GetResources, UpdateResourceTypesAndDataFree } from '@ecdlink/graphql';
import { LanguageId } from '../../../../../../constants/language';

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
  choosedSectionTitle: string;
}

export default function CreateResource({
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
}: ContentViewProps) {
  const { setNotification } = useNotifications();
  const { register, formState, setValue, control, getValues } = useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
    control: control,
  };

  const { type: formType } = useWatch({ control });

  const urlRegex =
    /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

  const updateMutationName = `update${contentType?.name}`;
  const creationMutationName = `create${contentType?.name}`;
  const deleteMutationName = `delete${contentType?.name}`;

  const updateMutation = gql` 
    mutation ${updateMutationName} ($id: String!, $input: ${contentType?.name}Input!, $localeId: String!) {
      ${updateMutationName} (id: $id, input: $input, localeId: $localeId) {
        id
      } 
    }
  `;

  const createMutation = gql` 
  mutation ${creationMutationName} ($input: ${contentType.name}Input!, $localeId: String!) {
    ${creationMutationName} (input: $input, localeId: $localeId) 
    }
`;

  const deleteMutation = gql` 
    mutation ${deleteMutationName} ($id: String!, $localeId: String!) {
      ${deleteMutationName} (id: $id, localeId: $localeId) 
      }
  `;

  const [updateContent] = useMutation(updateMutation);
  const [createContent] = useMutation(createMutation);
  const [deleteContent, { loading: isLoadingDeleteContent }] =
    useMutation(deleteMutation);
  const [saveResouceTypesAndDataFree] = useMutation(
    UpdateResourceTypesAndDataFree
  );

  const dialog = useDialog();
  const formValues = getValues();

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

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);

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
    };

    if (item && item.localeId === selectedLanguageId) {
      setValue(returnField.propName, item.value);
    } else {
      setValue(returnField.propName, undefined);
    }
    return returnField;
  };

  const onSubmit = async () => {
    setLoading(true);
    const model = { ...formValues };

    model.sectionType =
      choosedSectionTitle === ResourcesTitles.ClassroomResources
        ? 'classroom'
        : 'business';

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

      if (selectedLanguageId === LanguageId.enZa) {
        await saveResouceTypesAndDataFree({
          variables: {
            contentId: +content.id,
            contentTypeId: +contentType.id,
            localeId: selectedLanguageId.toString(),
            resourceType: model.resourceType,
            dataFree: model.dataFree,
          },
        });
      }
    }

    setNotification({
      title: 'Successfully Updated Content!',
      variant: NOTIFICATION.SUCCESS,
    });

    savedContent();
    setLoading(false);
    if (cancelEdit) {
      cancelEdit();
    }
  };

  const disableForm =
    selectedLanguageId === LanguageId.enZa
      ? !formValues?.resourceType ||
        !formValues?.title ||
        !formValues?.shortDescription ||
        !formValues?.longDescription ||
        !formValues?.link ||
        !urlRegex.test(formValues?.link) ||
        !formValues?.dataFree
      : !formValues?.title ||
        !formValues?.shortDescription ||
        !formValues?.longDescription ||
        !formValues?.link ||
        !urlRegex.test(formValues?.link);

  const disbleButtonStyles = `bg-secondary ${
    disableForm ? 'opacity-25' : ''
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
        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4"> */}
        <div className="ml-4 mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2 mb-4">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              {cancelEdit &&
                camelCaseToSentanceCase(
                  choosedSectionTitle === ResourcesTitles.ClassroomResources
                    ? 'Classroom resource'
                    : 'Business resource'
                )}
            </h3>
            <StatusChip
              className="w-20"
              borderColour="primary"
              backgroundColour="primary"
              textColour="white"
              text={content?.numberLikes.toString() + ` likes`}
            />
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
        <div className="w-full rounded-xl bg-white p-12 px-12 pt-6 pb-8">
          <CreateResourceForm
            key={choosedSectionTitle}
            template={template}
            handleform={handleform}
            setValue={setValue}
            defaultLanguageId={defaultLanguageId}
            selectedLanguageId={selectedLanguageId}
            choosedSectionTitle={choosedSectionTitle}
            formType={formType}
            getValues={getValues}
            urlRegex={urlRegex}
          />
        </div>

        <div className="flex flex-row">
          <button
            type="submit"
            disabled={disableForm}
            className={disbleButtonStyles}
            onClick={onSubmit}
          >
            <SaveIcon width="22px" className="mr-2" />
            Save & publish
          </button>

          {content?.id && (
            <button
              onClick={deleteAndRefresh}
              className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-2xl border-2 bg-transparent  px-14 py-2.5 text-sm font-medium shadow-sm hover:text-white focus:ring-2 focus:ring-offset-2"
            >
              <TrashIcon color="tertiary" className="mr-2 h-6 w-6" />
              Delete {content?.name}
            </button>
          )}
        </div>
        {/* </form> */}
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
