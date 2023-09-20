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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ContentLoader } from '../../../../../../components/content-loader/content-loader';
import DynamicForm from '../../../../components/dynamic-form/dynamic-form';
import {
  DynamicFormTemplate,
  FormTemplateField,
} from '../../../../content-management-models';
import {
  Alert,
  Button,
  DialogPosition,
  Typography,
  classNames,
} from '@ecdlink/ui';
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  SaveAsIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';

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
}: ContentViewProps) {
  const { setNotification } = useNotifications();
  const { register, formState, setValue, handleSubmit } = useForm();
  const { errors } = formState;
  const handleform = {
    register: register,
    errors: errors,
  };

  const mutationName = `update${contentType.name}`;

  const updateMutation = gql` 
    mutation ${mutationName} ($id: String!, $input: ${contentType.name}Input!, $localeId: String!) {
      ${mutationName} (id: $id, input: $input, localeId: $localeId) {
        id
      } 
    }
  `;

  const deleteMutationName = `delete${contentType.name}`;
  const deleteMutation = gql` 
    mutation ${deleteMutationName} ($id: String!, $localeId: String!) {
      ${deleteMutationName} (id: $id, localeId: $localeId) 
      }
  `;

  const dialog = useDialog();

  const [deleteContent] = useMutation(deleteMutation);

  const deleteAndRefresh = async (item: any) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Are you sure you want to delete this content?"
          message={` You will not be able to recover this content if you delete it now.`}
          onCancel={onCancel}
          btnText={['Yes, Delete Content', 'Keep editing']}
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
      render: (onSubmit: any, onCancel: any) => (
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

  useEffect(() => {
    if (contentType && contentValues && selectedLanguageId) {
      const t: DynamicFormTemplate = {
        title: `${contentType.name} Form`,
        fields: [],
      };

      const copy: ContentTypeFieldDto[] = Object.assign([], contentType.fields);

      const orderedList = copy?.sort(function (a, b) {
        return a.fieldOrder - b.fieldOrder;
      });

      orderedList.forEach((item: ContentTypeFieldDto) => {
        const renderedField = getRenderField(item);

        if (renderedField) t.fields.push(renderedField);
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
      title: camelCaseToSentanceCase(field?.fieldName ?? ''),
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
  };

  if (contentType && contentValues && template && !loading) {
    return (
      <div className="flex flex-col rounded-md ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                {cancelEdit &&
                  camelCaseToSentanceCase(content.name ?? content.type)}
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              {cancelCompare && (
                <button
                  type="button"
                  onClick={cancelCompare}
                  className=" bg-secondary hover:bg-uiMid focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                >
                  Compare Languages
                  <DocumentDuplicateIcon width="20px" className="pl-1" />
                </button>
              )}

              {cancelEdit && (
                <button
                  onClick={cancelDialog}
                  type="button"
                  className="bg-errorBg text-tertiary hover:bg-tertiary ml-2 inline-flex items-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium shadow-sm hover:text-white"
                >
                  Cancel
                  <XIcon width="22px" className="pl-1" />
                </button>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-white px-12 pt-6 pb-8">
            {contentType.name === 'Consent' ? (
              <Alert
                className="mt-2 mb-2 rounded-md"
                message={`You cannot edit the ECD Connect consent. You can add on or edit your organisation’s consent text below.`}
                type="info"
              />
            ) : contentType.name === 'Info Pages' ? (
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

            <DynamicForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              className="bg-secondary hover:bg-uiMid focus:outline-none mt-3 ml-4 inline-flex items-center rounded-md border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              Save & publish
              <SaveAsIcon width="22px" className="pl-1" />
            </button>

            <button
              onClick={deleteAndRefresh}
              className="hover:bg-tertiary border-tertiary focus:outline-none text-tertiary mt-3 ml-4 inline-flex items-center rounded-md border-2  bg-transparent px-14 py-2.5 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              Delete {content.name}
              <TrashIcon color="tertiary" className="mr-2 h-6 w-6">
                {' '}
              </TrashIcon>
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
