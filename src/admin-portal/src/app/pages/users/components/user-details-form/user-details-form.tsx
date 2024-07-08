import React, { useState } from 'react';
import { UserDto } from '@ecdlink/core';
import { useEffect } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import { Button, FormInput, Typography } from '@ecdlink/ui';
import { idTypeEnum } from '../../../view-user/view-user.types';

export interface UserDetailsFormProps {
  formKey: string;
  user?: UserDto;
  errors: any;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: any;
  watch?: any;
  trigger?: any;
  useWatch?: any;
  isCoachForm?: boolean;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  formKey,
  user,
  errors,
  register,
  setValue,
  control,
  watch,
  trigger,
  useWatch,
  isCoachForm,
}) => {
  useEffect(() => {
    if (user) {
      setValue('email', user.email, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const identification = watch('idNumber');
  const [idType, setIdType] = useState<string>('idNumber');
  const [identificationInUse, setIdentificationInUse] = useState<string>();
  const isIdentificationInUse =
    !!identificationInUse && identificationInUse === identification;

  const { firstName, surname, phoneNumber, idNumber } = useWatch({
    control,
  });

  return (
    <form key={formKey}>
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
          {!isCoachForm && (
            <div className="my-4 sm:col-span-3">
              <FormField
                label={'Work email address *'}
                nameProp={'email'}
                register={register}
                error={errors.email?.message}
                placeholder="e.g name@email.com"
              />
            </div>
          )}
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Cellphone number *'}
              nameProp={'phoneNumber'}
              register={register}
              error={errors?.phoneNumber?.message}
              placeholder="eg. 0650025055"
              type="number"
            />
          </div>
          {/* <div className="my-4 sm:col-span-3">
            <FormField
              label={'Id number / passport *'}
              nameProp={'idNumber'}
              register={register}
              error={errors.idNumber?.message}
              placeholder="e.g 6201014800088"
            />
          </div> */}
          <div className="my-4 sm:col-span-3">
            <Typography
              text={'Which kind of identification do you have for the CHW? *'}
              type={'body'}
              color={'textMid'}
            />
            <div className=" mb-4 flex flex-row">
              <Button
                className={'mt-3 mr-1 w-full rounded-md '}
                type={'filled'}
                color={idType === 'idNumber' ? 'tertiary' : 'errorBg'}
                onClick={() => setIdType('idNumber')}
              >
                <Typography
                  type="help"
                  color={idType === 'idNumber' ? 'white' : 'tertiary'}
                  text="ID Number"
                ></Typography>
              </Button>

              <Button
                className={'mt-3 mr-1 w-full rounded-md '}
                type={'filled'}
                color={idType === 'idNumber' ? 'errorBg' : 'tertiary'}
                onClick={() => setIdType('Passport')}
              >
                <Typography
                  type="help"
                  color={idType === 'Passport' ? 'white' : 'tertiary'}
                  text="Passport"
                ></Typography>
              </Button>
            </div>
            <FormInput
              label={idType === 'idNumber' ? 'ID number *' : 'Passport *'}
              nameProp={'idNumber'}
              register={register}
              error={
                isIdentificationInUse
                  ? `A user already exists with this ${
                      idType === idTypeEnum.idNumber ? 'ID' : 'passport'
                    } number.`
                  : errors.idNumber?.message
              }
              placeholder={
                idType === 'idNumber' ? 'e.g 6201014800088' : 'e.g EN000666'
              }
              value={idNumber}
              isAdminPortalInput={true}
              color="white"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserDetailsForm;
