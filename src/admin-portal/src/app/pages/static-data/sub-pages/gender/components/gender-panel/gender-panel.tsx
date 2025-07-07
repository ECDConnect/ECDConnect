/* This example requires Tailwind CSS v2.0+ */
import { useMutation } from '@apollo/client';
import { CreateGender, GenderInput, UpdateGender } from '@ecdlink/graphql';
import {
  GenderDto,
  genderSchema,
  initialGenderValues,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '../../../../../../components/form-field/form-field';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

/* eslint-disable-next-line */
export interface GenderProps {
  item?: GenderDto;
  closeDialog: (value: boolean) => void;
}

export default function GenderPanel(props: GenderProps) {
  const { setNotification } = useNotifications();
  const [isEdit, setEdit] = useState(props.item ? true : false);
  const [create] = useMutation(CreateGender);
  const [update] = useMutation(UpdateGender);

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(genderSchema),
    defaultValues: initialGenderValues,
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
      const inputModel: GenderInput = {
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
                title: 'Successfully Created Gender!',
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
              title: 'Successfully Updated Gender!',
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
