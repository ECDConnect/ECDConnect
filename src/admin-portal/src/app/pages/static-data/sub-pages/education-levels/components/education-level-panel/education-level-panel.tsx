/* This example requires Tailwind CSS v2.0+ */
import { useMutation } from '@apollo/client';
import {
  EducationLevelDto,
  educationLevelSchema,
  initialEducationLevelValues,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import {
  CreateEducation,
  EducationInput,
  UpdateEducation,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../../../../../../components/form-field/form-field';

/* eslint-disable-next-line */
export interface EducationLevelProps {
  item?: EducationLevelDto;
  closeDialog: (value: boolean) => void;
}

export default function EducationLevelPanel(props: EducationLevelProps) {
  const { setNotification } = useNotifications();
  const [isEdit, setEdit] = useState(props.item ? true : false);
  const [create] = useMutation(CreateEducation);
  const [update] = useMutation(UpdateEducation);

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(educationLevelSchema),
    defaultValues: initialEducationLevelValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  useEffect(() => {
    if (props.item) {
      setValue('description', props.item.description, {
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
      const inputModel: EducationInput = {
        Id: props.item?.id ?? undefined,
        Description: formValues.description,
        IsActive: true,
      };

      if (!isEdit) {
        await create({
          variables: {
            input: { ...inputModel },
          },
        })
          .then((response) => {
            if (response.data && response.data) {
              setNotification({
                title: 'Successfully Created Education Level!',
                variant: NOTIFICATION.SUCCESS,
              });

              setEdit(true);
            }
            emitCloseDialog(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await update({
          variables: {
            id: props.item?.id,
            input: { ...inputModel },
          },
        })
          .then((response) => {
            setNotification({
              title: 'Successfully Updated Education Level!',
              variant: NOTIFICATION.SUCCESS,
            });
            emitCloseDialog(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
                {!isEdit ? <span> Save & Continue </span> : <span> Save </span>}
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <FormField
                label={'Description'}
                nameProp={'description'}
                register={register}
                error={errors.description?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
