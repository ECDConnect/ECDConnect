import {
  FormInput,
  Button,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  BannerWrapper,
} from '@ecdlink/ui';
import { MutationAddPractitionerToPrincipalArgs } from '@ecdlink/graphql';
import { useHistory } from 'react-router-dom';
import { UserDto } from '@ecdlink/core';
import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { RegisterPractitioner } from '../../setup-principal/setup-principal.types';
import ROUTES from '@/routes/routes';
import {
  AddPractitinerInitialState,
  AddNewPractitionerModel,
} from './add-practitioner.types';
import { userSelectors } from '@store/user';
import { SearchIcon } from '@heroicons/react/solid';

export const AddPractitioner = ({
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
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(addPractitionerSchema),
    defaultValues: Boolean(formData) ? formData : initialAddPractitionerValues,
    mode: 'onChange',
  });
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const [isValidPractitioner, setIsValidPractitioner] = useState<boolean>();
  const [isPrincipal, setIsPrincipal] = useState<boolean>(false);
  const [isPractitionerRegistered, setIsPractitionerRegistered] =
    useState<boolean>();
  const [newPractitioner, setNewPractitioner] =
    useState<AddNewPractitionerModel>(AddPractitinerInitialState);
  const userData = useSelector(userSelectors.getUser);
  const [addNote, setAddNote] = useState();

  const { preferId, idNumber, passport } = useWatch({
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
        if (
          p?.appUser?.practitionerObjectData?.isRegistered === false ||
          p?.appUser?.practitionerObjectData?.isRegistered === null
        ) {
          setIsPractitionerRegistered(false);
        }
        if (p?.appUser?.practitionerObjectData?.isRegistered === true) {
          setIsPractitionerRegistered(true);
        }
        setIsValidPractitioner(!!p?.appUser?.idNumber);
        setNewPractitioner({
          firstName: p?.appUser?.firstName,
          surname: p?.appUser?.surname,
          idNumber: p?.appUser?.idNumber,
          userId: p?.appUser?.id,
        });
      });
    }
  };

  useEffect(() => {
    if (isValidPractitioner && newPractitioner) {
      setValue('firstName', newPractitioner.firstName || '', {
        shouldValidate: true,
      });
      setValue('surname', newPractitioner.surname || '', {
        shouldValidate: true,
      });
    }
  }, [isValidPractitioner, newPractitioner, setValue]);

  const handleReset = () => {
    reset(initialAddPractitionerValues);
    setIsValidPractitioner(undefined);
  };

  const onSubmitAddPractitioner = async () => {
    const input: MutationAddPractitionerToPrincipalArgs = {
      userId: userData?.id,
      idNumber: idNumber,
      firstName: newPractitioner?.firstName,
      lastName: newPractitioner?.surname,
    };
    await new PractitionerService(
      userAuth?.auth_token!
    ).AddPractitionerToPrincipal(input);

    history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 1 });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Add practitioner'}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div className="wrapper-with-sticky-button">
        <div className="flex w-full flex-wrap justify-center">
          <div className="mt-4 flex w-11/12 flex-col gap-4">
            <div>
              {preferId && (
                <div className="mt-4 flex items-center justify-between">
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
                      'round bg-primary border-primary mt-4 mr-2 inline-flex cursor-pointer items-center rounded-full border-2 p-2'
                    }
                    onClick={handleSearch}
                  >
                    <SearchIcon className={'w-4 cursor-pointer text-white'} />
                  </div>
                </div>
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
                      onClick={() => callForHelp()}
                    />
                  }
                />
              </div>
            )}
            {isValidPractitioner === true && !isPrincipal && (
              <div className="mb-8">
                <Alert type={'success'} title={'Practitioner found!'} />
              </div>
            )}
            {!addNote &&
              isPractitionerRegistered !== undefined &&
              !isPrincipal && (
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
          <div className="-mb-4 mt-4 w-11/12 self-end">
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="primary"
              text="Save"
              textColor="white"
              icon="SaveIcon"
              disabled={
                !isValid ||
                isValidPractitioner === false ||
                addNote ||
                isPrincipal
              }
              onClick={onSubmitAddPractitioner}
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
      </div>
    </div>
  );
};
