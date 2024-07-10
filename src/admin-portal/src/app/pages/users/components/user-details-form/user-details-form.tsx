import React, { useMemo, useState } from 'react';
import { PractitionerDto, UserDto } from '@ecdlink/core';
import { useEffect } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import { Button, FormInput, Typography } from '@ecdlink/ui';
import { idTypeEnum } from '../../../view-user/view-user.types';
import { apolloClient } from '../../../../app';
import {
  GetAllPortalCoaches,
  GetAllPortalPractitioners,
  PortalCoachModel,
  PortalUsersHcwModel,
} from '@ecdlink/graphql';
import { useQuery } from '@apollo/client';

export interface UserDetailsFormProps {
  formKey: string;
  user?: UserDto;
  errors: any;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: any;
  setIdType?: (item: string) => void;
  idType?: string;
  clearErrors?: any;
  coachQueryVariables?: any;
  watch?: any;
  practitioners?: PractitionerDto[];
  setUserAlreadyExits?: (item: boolean) => void;
  typeofUser?: string;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  formKey,
  user,
  errors,
  register,
  setValue,
  control,
  setIdType,
  idType,
  clearErrors,
  coachQueryVariables,
  practitioners,
  setUserAlreadyExits,
  typeofUser,
}) => {
  useEffect(() => {
    if (user) {
      setValue('email', user.email, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { allPortalCoaches } =
    apolloClient.readQuery<{ allPortalCoaches?: PortalCoachModel[] }>({
      query: GetAllPortalCoaches,
      variables: coachQueryVariables,
    }) || {};

  const { idNumber } = useWatch({ control });

  const [identificationInUse, setIdentificationInUse] = useState<string>();

  useEffect(() => {
    const hasIdNumber = practitioners?.find(
      (item) => item?.user?.idNumber === idNumber
    );

    if (hasIdNumber) {
      setIdentificationInUse(hasIdNumber?.user?.idNumber);
    } else {
      setIdentificationInUse('');
    }
  }, [practitioners, idNumber]);

  useEffect(() => {
    if (identificationInUse) {
      setUserAlreadyExits(true);
    } else {
      setUserAlreadyExits(false);
    }
  }, [identificationInUse]);

  const isIdentificationInUse =
    !!identificationInUse && identificationInUse === idNumber;

  const identificationExists = () => {
    const practitioner = practitioners?.find(
      (item) => item?.user?.idNumber === idNumber
    );
    if (practitioner) {
      setIdentificationInUse(practitioner?.user?.idNumber);
      return practitioner?.user?.idNumber;
    }
  };

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
          {/* {!isCoachForm && (
            <div className="my-4 sm:col-span-3">
              <FormField
                label={'Work email address *'}
                nameProp={'email'}
                register={register}
                error={errors.email?.message}
                placeholder="e.g name@email.com"
              />
            </div>
          )} */}
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Cellphone number *'}
              nameProp={'phoneNumber'}
              register={register}
              error={errors?.phoneNumber?.message}
              placeholder="eg. 0650025055"
              type="text"
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
              text={`Which kind of identification do you have for the ${
                typeofUser ? typeofUser : 'practitioner'
              }? *`}
              type={'body'}
              color={'textMid'}
            />
            <div className=" mb-4 flex flex-row">
              <Button
                className={'mt-3 mr-1 w-full rounded-md '}
                type={'filled'}
                color={idType === 'idNumber' ? 'tertiary' : 'errorBg'}
                onClick={() => {
                  setIdType('idNumber');
                  clearErrors('idNumber');
                }}
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
                onClick={() => {
                  setIdType('Passport');
                  clearErrors('idNumber');
                }}
              >
                <Typography
                  type="help"
                  color={idType === 'Passport' ? 'white' : 'tertiary'}
                  text="Passport"
                ></Typography>
              </Button>
            </div>
            <FormField
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
              type="text"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserDetailsForm;
