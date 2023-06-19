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
      console.log(user.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { dateOfBirth } = useWatch({
    control: control,
  });

  return (
    <>
      <form key={formKey} className="space-y-8 divide-y divide-gray-200">

      </form>
    </>
  );
};

export default UserDetailsForm;
