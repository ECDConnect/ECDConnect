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
  const { data } = useQuery(GenderList, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    if (user) {
      setValue('email', user.email, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-0">
        <div className="border-b border-dashed pb-4">
          <h1 className="py-4 text-2xl text-black">Administrator details</h1>
          <label className="text-md block font-medium text-gray-700">
            Step 1 of 1
          </label>
        </div>
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
        </div>
      </div>
    </form>
  );
};

export default UserDetailsForm;
