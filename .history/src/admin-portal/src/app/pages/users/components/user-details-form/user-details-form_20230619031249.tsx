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

        <div className="space-y-0">

          <div className="grid grid-cols-1 ">
            <div className="my-4 sm:col-span-3">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    * Fields are required
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      label={'First name *'}
                      nameProp={'firstName'}
                      register={register}
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Surname *'}
                      nameProp={'surname'}
                      register={register}
                      error={errors.surname?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Email address'}
                      nameProp={'email'}
                      register={register}
                      error={errors.email?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'ID number / Passport number *'}
                      nameProp={'idNumber'}
                      register={register}
                      error={errors.idNumber?.message}
                    />
                  </div>
                  {/* <div className="sm:col-span-3">
                    <FormSelectorField
                      label="Sex *"
                      nameProp={'genderId'}
                      register={register}
                      options={
                        data &&
                        data.GetAllGender &&
                        data.GetAllGender.map((x: GenderDto) => {
                          return { key: x.id, value: x.description };
                        })
                      }
                      error={errors.programTypeId?.message}
                    />
                  </div> */}
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Phone number *'}
                      nameProp={'phoneNumber'}
                      register={register}
                      error={errors.phoneNumber?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Contact Preference *'}
                      nameProp={'contactPreference'}
                      register={register}
                      disabled
                      error={errors.contactPreference?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Date Of Birth *
                    </label>
                    <DatePicker
                      placeholderText={'Please select a date'}
                      className="mt-1 w-full border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary shadow-sm"
                      selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
                      onChange={(date: Date) =>
                        setValue('dateOfBirth', date ? date.toISOString() : '')
                      }
                      maxDate={new Date()}
                      dateFormat="EEE, dd MMM yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={80}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Is South African Citizen'}
                      nameProp={'isSouthAfricanCitizen'}
                      type="checkbox"
                      register={register}
                      error={errors.isSouthAfricanCitizen?.message}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <FormField
                      label={'Verified By Home Affairs'}
                      nameProp={'verifiedByHomeAffairs'}
                      type="checkbox"
                      register={register}
                      error={errors.verifiedByHomeAffairs?.message}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
          </div>
      </form>
    </>
  );
};

export default UserDetailsForm;
