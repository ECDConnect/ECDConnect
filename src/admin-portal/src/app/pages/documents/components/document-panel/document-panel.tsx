/* This example requires Tailwind CSS v2.0+ */
import { useMutation } from '@apollo/client';
import { DocumentInput, FileTypeEnum, UpdateDocument } from '@ecdlink/graphql';
import {
  NOTIFICATION,
  useNotifications,
  DocumentDto,
  WorkflowStatusDto,
  documentSchema,
  initialDocumentValues,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
import { Typography } from '@ecdlink/ui';

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

  console.log(props.item);

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
            <span className="text-lg font-medium leading-6 text-gray-900"></span>
            <div className="flex justify-end">
              <button
                onClick={() => emitCloseDialog(false)}
                type="button"
                className="focus:outline-none focus:ring-primary rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-uiLight focus:outline-none focus:ring-primary ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
          <div className="flex w-8/12 items-center justify-items-start gap-1">
            <Typography
              type={'body'}
              hover={true}
              text={'Document type:'}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              hover={true}
              text={FileTypeEnum?.[props.item?.documentType?.name].replace(
                /_/g,
                ' '
              )}
              color={'textDark'}
            />
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
          <img src={props?.item?.reference} alt="" className="h-8/12 w-full" />
        </div>
      </div>
    </form>
  );
}
