import {
  FormInput,
  Button,
  Typography,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
} from '@ecdlink/ui';
import { LoginModel } from '@/schemas/auth/login/login';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { Practitioner } from '@/../../../packages/graphql/lib';
import { UserDto } from '@/../../../packages/core/lib';

export const AddOrEditPractitioner = ({
  onSubmit,
  formData,
}: {
  onSubmit: (data: AddPractitionerModel) => void;
  formData?: AddPractitionerModel;
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const {
    register,
    control,
    formState: { errors, isValid },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(addPractitionerSchema),
    defaultValues: Boolean(formData) ? formData : initialAddPractitionerValues,
    mode: 'onChange',
  });

  const [isValidPractitioner, setIsValidPractitioner] = useState<boolean>();

  const { preferId, id, passport } = useWatch({
    control,
  });

  useEffect(() => {
    let validPassportOrIdNumber = false;
    if (id) {
      setIsValidPractitioner(undefined);
      validPassportOrIdNumber = SA_ID_REGEX.test(id);
    }

    if (passport) {
      setIsValidPractitioner(undefined);
      validPassportOrIdNumber = SA_PASSPORT_REGEX.test(passport);
    }

    if (validPassportOrIdNumber) {
      validatePractitionerDetails().then((p) => {
        console.log(p);
        setIsValidPractitioner(!!p?.idNumber);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, passport]);

  const validatePractitionerDetails = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (userAuth && id) {
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(id);
    }
    return _practitioner;
  };

  const handleReset = () => {
    reset({
      firstName: '',
      id: '',
      passport: '',
      preferId: true,
      surname: '',
    });
    setIsValidPractitioner(undefined);
  };
  return (
    <div className="wrapper-with-sticky-button">
      <div className="flex flex-col gap-4 mt-4">
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
        {isValidPractitioner === false && (
          <div className="mb-8">
            <Alert
              type={'error'}
              title={'We do not have this practitioner on record.'}
              list={[
                'Check if the ID you entered is correct.',
                'Make sure the practitioner is a SmartStarter.',
                'If you have entered the correct information, contact the call centre or tap Skip to solve the problem later.',
              ]}
              button={
                <Button
                  text="Contact call centre"
                  icon="PhoneIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                />
              }
            />
          </div>
        )}
      </div>
      <div className="self-end -mb-4">
        <Button
          size="normal"
          className="w-full mb-4"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={!isValid || isValidPractitioner === false}
          onClick={() => onSubmit(getValues())}
        />
        {isValidPractitioner === false && (
          <Button
            size="normal"
            className="w-full mb-4"
            type="outlined"
            color="primary"
            text="Skip"
            textColor="primary"
            icon="ArrowCircleRightIcon"
            onClick={handleReset}
          />
        )}
      </div>
    </div>
  );
};
