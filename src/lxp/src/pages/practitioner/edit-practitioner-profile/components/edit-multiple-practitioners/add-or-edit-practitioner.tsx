import {
  FormInput,
  Button,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
} from '@ecdlink/ui';
import { PractitionerDto, UserDto } from '@ecdlink/core';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchIcon } from '@heroicons/react/solid';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';

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
  const [isPrincipal, setIsPrincipal] = useState<boolean>(false);
  const [isPractitionerRegistered, setIsPractitionerRegistered] =
    useState<boolean>();
  const [addNote, setAddNote] = useState();
  const { preferId, idNumber, passport, firstName } = useWatch({
    control,
  });

  const getPractitionerDetailsByIdNumber = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (userAuth && idNumber) {
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(idNumber);
    }
    if (userAuth && passport) {
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(passport);
    }
    return _practitioner;
  };

  const handleSearch = () => {
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
      getPractitionerDetailsByIdNumber().then((p: any) => {
        setIsPrincipal(p?.appUser?.practitionerObjectData?.isPrincipal);

        if (p?.note !== undefined) {
          setAddNote(p?.note);
        }
        if (p?.isRegistered === false || p?.isRegistered === null) {
          setIsPractitionerRegistered(false);
        }
        if (p?.isRegistered === true) {
          setIsPractitionerRegistered(true);
        }
        setIsValidPractitioner(!!p?.appUser?.idNumber);
      });
    }
  };

  const handleReset = () => {
    reset(initialAddPractitionerValues);
    setIsValidPractitioner(undefined);
  };

  const handleSubmit = async () => {
    const { firstName, idNumber, passport, surname } = getValues();

    const practitionerUserDetails = await getPractitionerDetailsByIdNumber();
    let practitionerDetails = {} as PractitionerDto;
    if (practitionerUserDetails.id && userAuth) {
      practitionerDetails = await new PractitionerService(
        userAuth?.auth_token ?? ''
      ).getPractitionerByUserId(practitionerUserDetails.id);
    }

    onSubmit({
      id: practitionerDetails.id ?? '',
      userId: practitionerUserDetails.id ?? '',
      idNumber: idNumber || passport,
      firstName: firstName,
      surname: surname,
      passport: '',
      preferId: !!idNumber,
    });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  return (
    <div className="wrapper-with-sticky-button">
      <div className="mt-4 flex flex-col gap-4">
        <div>
          {preferId && (
            <>
              <FormInput<AddPractitionerModel>
                label={'Practitioner ID number'}
                visible={true}
                nameProp={'idNumber'}
                register={register}
                error={errors['idNumber']}
                placeholder={'E.g. 7601010338089'}
                className="mr-2 w-full pb-2"
              />
              <div
                className={
                  'round bg-primary border-primary mr-5 inline-flex cursor-pointer items-center rounded-full border-2 p-2'
                }
                onClick={handleSearch}
              >
                <SearchIcon className={'w-6 cursor-pointer text-white'} />
              </div>
            </>
          )}
          <div>
            {!preferId && (
              <div className="mt-4 flex items-center justify-between">
                <FormInput<AddPractitionerModel>
                  label={'Practitioner Passport number'}
                  visible={true}
                  nameProp={'passport'}
                  error={errors['passport']}
                  register={register}
                  className="mr-2 w-full pb-2"
                />
                <div
                  className={
                    'round bg-primary border-primary mt-4 mr-2 inline-flex cursor-pointer items-center rounded-full border-2 p-2'
                  }
                  onClick={handleSearch}
                >
                  <SearchIcon className={'w-4 cursor-pointer text-white'} />
                </div>
              </div>
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
        {(addNote || isPrincipal) && (
          <div>
            <Alert
              type={'error'}
              title={
                isPrincipal
                  ? 'This practitioner is linked to a different SmartStart programme.'
                  : addNote
              }
              list={[
                'Check if the ID you entered is correct.',
                'Make sure the practitioner is still in your programme.',
                'If your practitioner needs help, please contact the SmartStart call centre.',
              ]}
              button={
                <Button
                  text="Contact call centre"
                  icon="PhoneIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  onClick={() => callForHelp()}
                />
              }
            />
          </div>
        )}
        {isValidPractitioner === true && !addNote && (
          <>
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
          </>
        )}
        {isValidPractitioner === false && !isPrincipal && (
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
        {isValidPractitioner === true && !addNote && !isPrincipal && (
          <div className="mb-8">
            <Alert
              type={'success'}
              title={'Practitioner found!'}
              list={
                isPractitionerRegistered
                  ? []
                  : [
                      `Encourage ${firstName} to register for the app as soon as possible!`,
                    ]
              }
            />
          </div>
        )}
        {!addNote && isPractitionerRegistered !== undefined && !isPrincipal && (
          <div>
            <Alert
              type={isPractitionerRegistered ? 'success' : 'error'}
              title={
                isPractitionerRegistered
                  ? 'This practitioner is registered on Funda app.'
                  : 'This practitioner is not registered on Funda App. Ask all of your SmartStart practitioners to register.'
              }
              list={[
                isPractitionerRegistered
                  ? 'Practitioner has been notified.'
                  : 'If your practitioner needs help, please contact the SmartStart call centre.',
              ]}
              button={
                !isPractitionerRegistered ? (
                  <Button
                    text="Contact call centre"
                    icon="PhoneIcon"
                    type={'filled'}
                    color={'primary'}
                    textColor={'white'}
                    onClick={() => callForHelp()}
                  />
                ) : (
                  <></>
                )
              }
            />
          </div>
        )}
      </div>
      <div className="-mb-4 self-end">
        <Button
          size="normal"
          className="mb-4 w-full"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={
            !isValid || isValidPractitioner === false || addNote || isPrincipal
          }
          onClick={handleSubmit}
        />
        {isValidPractitioner === false && (
          <Button
            size="normal"
            className="mb-4 w-full"
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
