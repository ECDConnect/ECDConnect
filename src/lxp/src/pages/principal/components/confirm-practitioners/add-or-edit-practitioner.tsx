import {
  FormInput,
  Button,
  Typography,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
} from '@ecdlink/ui';
import { PractitionerDto, UserDto } from '@ecdlink/core';
import { useEffect, useState } from 'react';
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
import { RegisterPractitioner } from '../../setup-principal/setup-principal.types';

type UserWithPractitionerData = UserDto & {
  practitionerObjectData?: PractitionerDto;
};

export const AddOrEditPractitioner = ({
  onSubmit,
  formData,
}: {
  onSubmit: (data: RegisterPractitioner) => void;
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

  const { preferId, idNumber, passport } = useWatch({
    control,
  });

  useEffect(() => {
    let validPassportOrIdNumber = false;
    if (idNumber) {
      setIsValidPractitioner(undefined);
      validPassportOrIdNumber = SA_ID_REGEX.test(idNumber);
    }

    if (passport) {
      setIsValidPractitioner(undefined);
      validPassportOrIdNumber = SA_PASSPORT_REGEX.test(passport);
    }

    if (validPassportOrIdNumber) {
      getPractitionerDetailsByIdNumber().then((p) => {
        setIsValidPractitioner(!!p?.idNumber);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idNumber, passport]);

  const getPractitionerDetailsByIdNumber = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (userAuth && idNumber) {
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(idNumber);
    }
    return _practitioner;
  };

  const handleReset = () => {
    reset(initialAddPractitionerValues);
    setIsValidPractitioner(undefined);
  };

  const handleSubmit = async () => {
    const { firstName, idNumber, passport, surname } = getValues();

    const practitionerUserDetails: UserWithPractitionerData =
      await getPractitionerDetailsByIdNumber();

    onSubmit({
      id: practitionerUserDetails?.practitionerObjectData?.id ?? '',
      userId: practitionerUserDetails.id ?? '',
      idNumber: idNumber || passport,
      firstName: firstName,
      surname: surname,
      passport: '',
      preferId: !!idNumber,
      isRegistered: Boolean(
        practitionerUserDetails.practitionerObjectData?.isRegistered
      ),
    });
  };

  return (
    <div className="wrapper-with-sticky-button">
      <div className="flex flex-col gap-4 mt-4">
        <div>
          {preferId && (
            <FormInput<AddPractitionerModel>
              label={'ID number'}
              visible={true}
              nameProp={'idNumber'}
              register={register}
              error={errors['idNumber']}
              placeholder={'E.g. 7601010338089'}
            />
          )}
          <div>
            {!preferId && (
              <FormInput<AddPractitionerModel>
                label={'Passport number'}
                visible={true}
                nameProp={'passport'}
                error={errors['passport']}
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
          onClick={handleSubmit}
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
