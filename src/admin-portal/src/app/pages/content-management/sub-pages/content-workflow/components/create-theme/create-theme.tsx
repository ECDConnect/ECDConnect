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
import { DialogPosition } from '@ecdlink/ui';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import AlertModal from '../../../../../../components/dialog-alert/dialog-alert';
import CreateThemeForm from './components/create-theme-form';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

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

export default function CreateTheme({
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

  const createthemeDay = gql`
    mutation createThemeDay($input: ThemeDayInput!, $localeId: String!) {
      createThemeDay(input: $input, localeId: $localeId)
    }
  `;

  const updateThemeDay = gql`
    mutation updateThemeDay(
      $id: String!
      $input: ThemeDayInput!
      $localeId: String!
    ) {
      updateThemeDay(id: $id, input: $input, localeId: $localeId) {
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
  const [createContent] = useMutation(createMutation);
  const [updateThemeDayContent] = useMutation(updateThemeDay);
  const [createThemeDayContent] = useMutation(createthemeDay);

  const [template, setTemplate] = useState<DynamicFormTemplate>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredThemeDays, setFilteredThemeDays] = useState([]);

  const allowedFileSize = 13631488;

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
    let themeDaysIds = [];
    let newThemeId = '';
    setLoading(true);
    const model = { ...values };

    if (!content?.id) {
      const createThemeResponse = await createContent({
        variables: {
          input: { ...model },
          localeId: selectedLanguageId.toString(),
        },
      }).catch(() => {
        setLoading(false);
      });

      if (createThemeResponse) {
        newThemeId = createThemeResponse?.data?.createTheme;
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
    }

    setNotification({
      title: 'Successfully Updated Content!',
      variant: NOTIFICATION.SUCCESS,
    });

    if (filteredThemeDays?.length > 0 && (content?.id || newThemeId)) {
      for (let item of filteredThemeDays) {
        if (
          !item?.id &&
          (item?.smallGroupActivity?.[0]?.id === '' ||
            item?.smallGroupActivity === '')
        ) {
          savedContent();

          setLoading(false);
          return;
        }

        if (
          item?.id &&
          (item?.smallGroupActivity?.[0]?.id !== '' ||
            item?.smallGroupActivity?.id !== '')
        ) {
          const updateThemeDayResponse = await updateThemeDayContent({
            variables: {
              id: item?.id.toString(),
              input: {
                day: item?.day,
                name: item?.name,
                smallGroupActivity:
                  item?.smallGroupActivity?.[0]?.id.toString() ||
                  item?.smallGroupActivity?.toString(),
                largeGroupActivity:
                  item?.largeGroupActivity?.[0]?.id.toString() ||
                  item?.largeGroupActivity?.toString(),
                storyActivity:
                  item?.storyActivity?.[0]?.id.toString() ||
                  item?.storyActivity?.toString(),
                storyBook:
                  item?.storyBook?.[0]?.id.toString() ||
                  item?.storyBook?.toString(),
              },
              localeId: selectedLanguageId.toString(),
            },
          });
          if (updateThemeDayResponse) {
            setNotification({
              title: `Changes saved!`,
              variant: NOTIFICATION.SUCCESS,
            });
          }
        }

        if (
          !item?.id &&
          (item?.smallGroupActivity?.[0]?.id !== '' ||
            item?.smallGroupActivity !== '')
        ) {
          const dayNumber = item?.idx + 1;
          const updateThemeDayResponse = await createThemeDayContent({
            variables: {
              input: {
                day: dayNumber.toString(),
                name: `Day ${dayNumber?.toString()}`,
                smallGroupActivity:
                  item?.smallGroupActivity?.[0]?.id.toString() ||
                  item?.smallGroupActivity?.toString(),
                largeGroupActivity:
                  item?.largeGroupActivity?.[0]?.id.toString() ||
                  item?.largeGroupActivity?.toString(),
                storyActivity:
                  item?.storyActivity?.[0]?.id.toString() ||
                  item?.storyActivity?.toString(),
                storyBook:
                  item?.storyBook?.[0]?.id.toString() ||
                  item?.storyBook?.toString(),
              },
              localeId: selectedLanguageId.toString(),
            },
          });
          if (updateThemeDayResponse) {
            setNotification({
              title: `Changes saved!`,
              variant: NOTIFICATION.SUCCESS,
            });

            themeDaysIds?.push(
              updateThemeDayResponse?.data?.createThemeDay?.toString()
            );
          }

          const newModel = { ...model, themeDays: themeDaysIds?.toString() };

          await updateContent({
            variables: {
              id: content?.id?.toString() || newThemeId,
              input: { ...newModel },
              localeId: selectedLanguageId.toString(),
            },
          }).catch(() => {
            setLoading(false);
          });
        }
      }

      savedContent();
      setLoading(false);
      cancelEdit();
    }

    setLoading(false);
    savedContent();
    setLoading(false);
  };

  const formValues = getValues();
  const totalCompletedDays =
    filteredThemeDays &&
    filteredThemeDays.filter((item) => item !== undefined).length;
  const disableButtonDays =
    totalCompletedDays === 20 &&
    formValues?.name &&
    formValues?.imageUrl &&
    filteredThemeDays &&
    filteredThemeDays.every(
      (item) =>
        item?.smallGroupActivity &&
        item?.largeGroupActivity &&
        item?.storyBook &&
        item?.storyActivity
    );

  const disbleButtonStyles = `bg-secondary ${
    !disableButtonDays ? 'opacity-25' : ''
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="ml-4 mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                {cancelEdit &&
                  camelCaseToSentanceCase(
                    (content?.name ?? content?.type) || 'Add theme'
                  )}
              </h3>

              {content?.shareContent &&
              (content?.shareContent === 'true' ||
                content?.shareContent === 'yes') ? (
                <div className="flex items-center gap-4">
                  <CheckCircleIcon className="text-successMain h-8 w-8" />
                  <h4 className="text-small text-successMain font-semibold leading-6">
                    Shared with other organisations
                  </h4>
                </div>
              ) : (
                (content?.shareContent === '' ||
                  content?.shareContent === 'false' ||
                  content?.shareContent === 'no' ||
                  content?.shareContent === null) && (
                  <div className="flex items-center gap-4">
                    <XCircleIcon className="text-errorMain h-8 w-8" />
                    <h4 className="text-small text-errorMain font-semibold leading-6">
                      Not shared with other organisations
                    </h4>
                  </div>
                )
              )}
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
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
            <CreateThemeForm
              template={template}
              handleform={handleform}
              setValue={setValue}
              defaultLanguageId={defaultLanguageId}
              setFilteredThemeDays={setFilteredThemeDays}
              allowedFileSize={allowedFileSize}
              formType={formType}
              getValues={getValues}
            />
          </div>

          <div className="flex flex-row">
            <button
              type="submit"
              disabled={!disableButtonDays}
              className={disbleButtonStyles}
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
        </form>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}
