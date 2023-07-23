import React from 'react';
import { useQuery } from '@apollo/client';
import { GenderDto, UserDto } from '@ecdlink/core';
import { GenderList } from '@ecdlink/graphql';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
export interface UserDetailsFormProps {
  formKey: string;
  user?: UserDto;
  errors: any;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: any;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  formKey,
  user,
  errors,
  register,
  setValue,
  control,
}) => {
  useEffect(() => {
    if (user) {
      setValue('email', user.email, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-0">
        <div className="grid grid-cols-1 ">
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'First name *'}
              nameProp={'firstName'}
              register={register}
              error={errors.firstName?.message}
              placeholder="First name"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Surname *'}
              nameProp={'surname'}
              register={register}
              error={errors.surname?.message}
              placeholder="Surname/family name"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Work email address *'}
              nameProp={'email'}
              register={register}
              error={errors.email?.message}
              placeholder="e.g name@email.com"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Id number / passport *'}
              nameProp={'idNumber'}
              register={register}
              error={errors.idNumber?.message}
              placeholder="e.g 6201014800088"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserDetailsForm;
