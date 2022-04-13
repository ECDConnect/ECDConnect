/* This example requires Tailwind CSS v2.0+ */
import { useMutation } from '@apollo/client';
import { DocumentInput, UpdateDocument } from '@ecdlink/graphql';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { DocumentDto, WorkflowStatusDto } from '@ecdlink/core';
import { documentSchema, initialDocumentValues } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';

/* eslint-disable-next-line */
export interface DocumentPanelProps {
  item: DocumentDto;
  workflowStatus: WorkflowStatusDto[];
  closeDialog: (value: boolean) => void;
}

export default function DocumentPanel(props: DocumentPanelProps) {
  const { setNotification } = useNotifications();
  const [update] = useMutation(UpdateDocument);

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(documentSchema),
    defaultValues: initialDocumentValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  useEffect(() => {
    if (props.item) {
      setValue('name', props.item.name, {
        shouldValidate: true,
      });
      setValue('workflowStatusId', props.item.workflowStatusId, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const onSubmit = async () => {
    if (isValid) {
      const formValues = getValues();
      const inputModel: DocumentInput = {
        Id: props.item?.id,
        UserId: props.item.userId,
        DocumentTypeId:
          props.item && props.item.documentTypeId
            ? props.item.documentTypeId
            : 0,
        Name: formValues.name,
        Reference: props.item.reference,
        WorkflowStatusId: formValues.workflowStatusId,
        IsActive: true,
      };

      await update({
        variables: {
          id: props.item?.id,
          input: { ...inputModel },
        },
      })
        .then((response) => {
          setNotification({
            title: 'Successfully Updated Document!',
            variant: NOTIFICATION.SUCCESS,
          });
          emitCloseDialog(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="pt-8">
          <div className="grid grid-cols-2">
            <span className="text-lg leading-6 font-medium text-gray-900"></span>
            <div className="flex justify-end">
              <button
                onClick={() => emitCloseDialog(false)}
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-uiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <FormField
                label={'Name'}
                nameProp={'name'}
                register={register}
                error={errors.name?.message}
              />
            </div>

            <div className="sm:col-span-6">
              <FormSelectorField
                label="Workflow Status"
                nameProp={'workflowStatusId'}
                register={register}
                options={
                  props.workflowStatus &&
                  props.workflowStatus.map((x: WorkflowStatusDto) => {
                    return { key: x.id, value: x.description };
                  })
                }
                error={errors.workflowStatusId?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
