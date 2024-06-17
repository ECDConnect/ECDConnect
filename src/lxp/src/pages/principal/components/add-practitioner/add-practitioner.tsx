import {
  FormInput,
  Button,
  Alert,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  BannerWrapper,
  Typography,
  SA_CELL_REGEX,
  CheckboxGroup,
  LoadingSpinner,
} from '@ecdlink/ui';
import { MutationAddPractitionerToPrincipalArgs } from '@ecdlink/graphql';
import { useHistory } from 'react-router-dom';
import { UserDto, useSnackbar } from '@ecdlink/core';
import { useState, useEffect } from 'react';
import { FieldError, useForm, useWatch } from 'react-hook-form';
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
import { SearchIcon, UserIcon } from '@heroicons/react/solid';
import { classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { practitionerThunkActions } from '@/store/practitioner';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { useTenant } from '@/hooks/useTenant';
import { staticDataSelectors } from '@/store/static-data';

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
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();
  const history = useHistory();
  const user = useSelector(userSelectors.getUser);
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const [isValidPractitioner, setIsValidPractitioner] = useState<boolean>();
  const [isPrincipal, setIsPrincipal] = useState<boolean>(false);
  const [isPractitionerRegistered, setIsPractitionerRegistered] =
    useState<boolean>();
  const [newPractitioner, setNewPractitioner] =
    useState<AddNewPractitionerModel>(AddPractitinerInitialState);
  const userData = useSelector(userSelectors.getUser);
  const [addNote, setAddNote] = useState();
  const [practitionerPhoneNumber, setPractitionerPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const permissions = useSelector(staticDataSelectors.getPermissions);
  const [permissionsAdded, setPermissionsAdded] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState(false);

  const { preferId, idNumber, passport } = useWatch({
    control,
  });
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;

  const getPractitionerDetailsByIdNumber = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (userAuth && idNumber) {
      setIsloading(true);
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(idNumber);
      setIsloading(false);
    }

    if (userAuth && passport) {
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(passport);
    }

    return _practitioner;
  };

  const handleSearch = () => {
    setIsloading(true);
    let validPassportOrIdNumber = true;
    if (idNumber) {
      setIsValidPractitioner(undefined);
      if (!isOpenAccess) {
        validPassportOrIdNumber = SA_ID_REGEX.test(idNumber);
      }
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
        setIsValidPractitioner(
          !!p?.appUser?.idNumber || !!p?.appUser?.userName
        );
        setNewPractitioner({
          firstName: p?.appUser?.firstName || p?.appUser?.userName,
          surname: p?.appUser?.surname,
          idNumber: p?.appUser?.idNumber,
          userId: p?.appUser?.id,
          userPermissions: p?.appUser?.userPermissions,
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
    if (practitionerPhoneNumber) {
      let validPhoneNumber = true;
      validPhoneNumber = SA_CELL_REGEX.test(practitionerPhoneNumber);

      if (!validPhoneNumber) {
        setError('Phone number is not valid');
        return;
      } else {
        setIsloading(true);
        const principalInvite = await new PractitionerService(
          userAuth?.auth_token!
        )
          .sendPractitionerInviteToPreschool(
            practitionerPhoneNumber,
            classroom?.preschoolCode!,
            user?.id!
          )
          .catch((error) => {
            console.log(error);
            showMessage({
              message: 'User with phone number already exists',
              type: 'error',
            });
            setIsloading(false);
            return;
          });
        showMessage({
          message: 'User invited',
          type: 'success',
        });
        setError('');
        history.goBack();
        setIsloading(false);
        return;
      }
    }
    setIsloading(true);
    const input: MutationAddPractitionerToPrincipalArgs = {
      userId: userData?.id,
      idNumber: idNumber,
      firstName: newPractitioner?.firstName,
      lastName: newPractitioner?.surname,
    };
    await new PractitionerService(
      userAuth?.auth_token!
    ).AddPractitionerToPrincipal(input);
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();

    setIsloading(false);
    history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: TabsItems.CLASSES });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  useEffect(() => {
    if (
      newPractitioner?.userPermissions?.some((item) => item?.isActive === true)
    ) {
      const userPermissions = newPractitioner?.userPermissions
        ?.filter((item) => item?.isActive === true)
        .map((perm) => perm?.permissionId!);
      if (userPermissions) {
        setPermissionsAdded(userPermissions);
      }
    }
  }, [newPractitioner?.userPermissions]);

  function updateArray(checkbox: any, id: string) {
    if (checkbox.checked) {
      setPermissionsAdded([...permissionsAdded, id]);
    } else {
      const filteredPermissions = permissionsAdded?.filter(
        (item) => item !== id
      );
      setPermissionsAdded(filteredPermissions);
    }
  }

  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Add practitioner'}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <div className="wrapper-with-sticky-button">
          <div className="flex w-full flex-wrap justify-center">
            <div className="mt-4 flex w-11/12 flex-col gap-4">
              <div>
                {preferId && !isOpenAccess && (
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
                {preferId && isOpenAccess && (
                  <div className="mt-4 flex items-center justify-between">
                    <FormInput<AddPractitionerModel>
                      label={'Practitioner username'}
                      visible={true}
                      nameProp={'idNumber'}
                      register={register}
                      placeholder={'e.g. Nothando_123'}
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
                        <SearchIcon
                          className={'w-4 cursor-pointer text-white'}
                        />
                      </div>
                    </div>
                  )}
                  {!preferId && !isOpenAccess && (
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
                  {preferId && !isOpenAccess && (
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
              {isValidPractitioner === false && (
                <>
                  <div className="mb-8">
                    <Alert
                      type={'warning'}
                      title={
                        'Oh dear! It looks like your practitioner has not joined AppName yet.'
                      }
                      list={[
                        'Enter their cellphone number below to send them an invitation.',
                      ]}
                    />
                  </div>

                  <FormInput
                    label={`Cellphone number`}
                    placeholder={'e.g 0123456789'}
                    type={'number'}
                    onChange={(e) => {
                      setPractitionerPhoneNumber(e?.target?.value);
                      setError('');
                    }}
                    value={practitionerPhoneNumber}
                    error={error as unknown as FieldError}
                  ></FormInput>
                  {error && (
                    <Typography
                      type="body"
                      hasMarkup
                      text={error}
                      color="errorMain"
                    />
                  )}
                </>
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
              {isValidPractitioner === true && !addNote && (
                <div>
                  <Typography
                    type={'h3'}
                    text={`First name`}
                    color={'textMid'}
                  />
                  <Typography
                    type={'h4'}
                    text={`${
                      newPractitioner?.firstName || newPractitioner?.username
                    }`}
                    color={'textMid'}
                  />
                  <Typography
                    type={'h2'}
                    text={`What would you like ${
                      newPractitioner?.firstName || newPractitioner?.username
                    } to do on ${appName}?`}
                    color={'textDark'}
                    className="mt-6"
                  />
                  <Typography
                    type={'body'}
                    text={`You can edit this in future by going to the Classroom then Practitioners tab.}`}
                    color={'textMid'}
                  />
                </div>
              )}

              {isValidPractitioner === true &&
                !addNote &&
                permissions.map((item, index) => (
                  <CheckboxGroup
                    id={item.id}
                    key={item.id}
                    title={item?.normalizedName}
                    checked={permissionsAdded?.some(
                      (option) => option === item.id
                    )}
                    value={item.id}
                    onChange={(event) => {
                      updateArray(event, item?.id!);
                    }}
                    className="mb-1"
                    icon={
                      <UserIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
                    }
                    isIconFullWidth
                    checkboxColor="primary"
                  />
                ))}
            </div>
            {isLoading && (
              <LoadingSpinner
                size="medium"
                spinnerColor={'quatenary'}
                backgroundColor={'uiLight'}
                className="my-8 w-full"
              />
            )}
            <div className="-mb-4 mt-4 h-full w-11/12 self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="quatenary"
                text="Save"
                textColor="white"
                icon="SaveIcon"
                disabled={
                  (!idNumber && !passport && !practitionerPhoneNumber) ||
                  (isValidPractitioner === false && !practitionerPhoneNumber) ||
                  isValidPractitioner === undefined ||
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
                  color="quatenary"
                  text="Skip"
                  textColor="quatenary"
                  icon="ArrowCircleRightIcon"
                  onClick={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
