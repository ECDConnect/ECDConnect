/* This example requires Tailwind CSS v2.0+ */
import { useMutation } from '@apollo/client';
import {
  initialSettingValues,
  NOTIFICATION,
  settingSchema,
  SettingsDto,
  useNotifications,
} from '@ecdlink/core';
import {
  CreateSystemSetting,
  SystemSettingInput,
  UpdateSystemSetting,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../../../../../../components/form-field/form-field';

/* eslint-disable-next-line */
export interface GeneralSettingsProps {
  item?: SettingsDto;
  closeDialog: (value: boolean) => void;
}

export default function GeneralSettingsPanel(props: GeneralSettingsProps) {
  const { setNotification } = useNotifications();
  const [isEdit, setEdit] = useState(props.item ? true : false);
  const [create] = useMutation(CreateSystemSetting);
  const [update] = useMutation(UpdateSystemSetting);

  const { register, handleSubmit, getValues, setValue, formState } = useForm({
    resolver: yupResolver(settingSchema),
    defaultValues: initialSettingValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  useEffect(() => {
    if (props.item) {
      setValue('grouping', props.item.grouping, {
        shouldValidate: true,
      });
      setValue('name', props.item.name, {
        shouldValidate: true,
      });
      setValue('value', props.item.value, {
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
      const inputModel: SystemSettingInput = {
        Id: props.item?.id ?? undefined,
        Name: formValues.name,
        Grouping: formValues.grouping,
        Value: formValues.value,
        IsActive: true,
        IsSystemValue: props.item?.isSystemValue,
        FullPath: props.item?.fullPath,
      };

      if (!isEdit) {
        await create({
          variables: {
            input: { ...inputModel },
          },
        })
          .then((response) => {
            if (response.data) {
              setNotification({
                title: 'Successfully Created System setting!',
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
              title: 'Successfully Updated System setting!',
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
                disabled={props.item.isSystemValue}
                label={'Grouping'}
                nameProp={'grouping'}
                register={register}
                error={errors.grouping?.message}
              />
            </div>
            <div className="sm:col-span-6">
              <FormField
                disabled={props.item.isSystemValue}
                label={'Name'}
                nameProp={'name'}
                register={register}
                error={errors.name?.message}
              />
            </div>
            <div className="sm:col-span-6">
              <FormField
                label={'Value'}
                nameProp={'value'}
                register={register}
                error={errors.value?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
