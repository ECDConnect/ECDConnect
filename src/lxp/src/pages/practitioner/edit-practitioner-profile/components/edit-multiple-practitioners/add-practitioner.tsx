import { FormInput, Button, Typography } from '@ecdlink/ui';
import { LoginModel } from '@/schemas/auth/login/login';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';

export const AddOrRenamePractitioner = ({
  onSubmit,
  formData,
}: {
  onSubmit: (data: AddPractitionerModel) => void;
  formData?: AddPractitionerModel;
}) => {
  const {
    register,
    control,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(addPractitionerSchema),
    defaultValues: Boolean(formData) ? formData : initialAddPractitionerValues,
    mode: 'onChange',
  });

  const { preferId } = useWatch({
    control,
  });

  return (
    <div className="pt-4">
      <div className="flex flex-col gap-4">
        <div>
          {preferId && (
            <FormInput<AddPractitionerModel>
              label={'ID number'}
              visible={true}
              nameProp={'id'}
              register={register}
              error={errors['id']}
              placeholder={'E.g. 7601010338089'}
            />
          )}
          <div>
            {!preferId && (
              <FormInput<AddPractitionerModel>
                label={'Passport number'}
                visible={true}
                nameProp={'id'}
                error={errors['id']}
                register={register}
              />
            )}
            {!preferId && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="primary"
                background={'transparent'}
                size="small"
                text="Enter ID number instead"
                onClick={() => setValue('preferId', true)}
              />
            )}
            {preferId && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="primary"
                size="small"
                background={'transparent'}
                text="Enter passport number instead"
                onClick={() => setValue('preferId', false)}
              />
            )}
          </div>
        </div>

        <FormInput<AddPractitionerModel>
          label={'First name'}
          visible={true}
          nameProp={'firstName'}
          placeholder="First Name"
          error={errors['firstName']}
          register={register}
        />
        <FormInput<AddPractitionerModel>
          label={'Surname'}
          placeholder="Surname/Family name"
          visible={true}
          nameProp={'surname'}
          error={errors['surname']}
          register={register}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 max-h-20 bg-white">
        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={!isValid}
          onClick={() => onSubmit(getValues())}
        />
      </div>
    </div>
  );
};
