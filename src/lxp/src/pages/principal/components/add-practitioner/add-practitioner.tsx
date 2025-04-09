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
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import {
  MutationAddPractitionerToPrincipalArgs,
  UpdateUserPermissionInputModelInput,
} from '@ecdlink/graphql';
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
  PermissionsNames,
} from './add-practitioner.types';
import { userSelectors } from '@store/user';
import {
  UserAddIcon,
  ClipboardCheckIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/solid';
import { classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { practitionerThunkActions } from '@/store/practitioner';
import { useTenant } from '@/hooks/useTenant';
import { staticDataSelectors } from '@/store/static-data';
import { HelpForm } from '@/components/help-form/help-form';
import PermissionsService from '@/services/PermissionsService/PermissionsService';
import { useTenantModules } from '@/hooks/useTenantModules';

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
    formState: { errors },
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
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;
  const isWhiteLabel = tenant?.isWhiteLabel;

  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();
  const permissions = useSelector(staticDataSelectors.getPermissions);

  const premissionsFilteredByTenantModules = permissions
    ?.filter((item) =>
      !attendanceEnabled && isWhiteLabel
        ? item?.name !== PermissionsNames?.take_attendance
        : item
    )
    ?.filter((item2) =>
      !progressEnabled && isWhiteLabel
        ? item2?.name !== PermissionsNames?.create_progress_reports
        : item2
    )
    ?.filter((item3) =>
      !classroomActivitiesEnabled && isWhiteLabel
        ? item3?.name !== PermissionsNames?.plan_classroom_actitivies
        : item3
    );

  const [permissionsAdded, setPermissionsAdded] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [isOwnUserId, setisOwnUserId] = useState(false);

  const { preferId, idNumber, passport } = useWatch({
    control,
  });

  const getPractitionerDetailsByIdNumber = async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (idNumber === user?.idNumber || passport === user?.idNumber) {
      setisOwnUserId(true);
      return;
    }

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
        if (p?.isRegistered === false || p?.isRegistered === null) {
          setIsPractitionerRegistered(false);
        }
        if (p?.isRegistered === true) {
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
        setSearched(true);
        setIsloading(false);
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

  const onSubmitAddPractitioner = async (isAddAnotherPractitioner: boolean) => {
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
            classroom?.name!,
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
      idNumber: idNumber || passport,
      firstName: newPractitioner?.firstName,
      lastName: newPractitioner?.surname,
      preschoolCode: '',
    };

    const updatePermissionInput: UpdateUserPermissionInputModelInput = {
      userId: newPractitioner?.userId,
      permissionIds: permissionsAdded,
    };
    // also set the progress for this newly assigned user to 0
    await new PractitionerService(
      userAuth?.auth_token!
    ).UpdatePractitionerProgress(newPractitioner?.userId!, 0);

    const updatePermissions = await new PermissionsService(
      userAuth?.auth_token!
    ).UpdateUserPermission(updatePermissionInput);
    await new PractitionerService(
      userAuth?.auth_token!
    ).AddPractitionerToPrincipal(input);
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();

    setIsloading(false);
    if (isAddAnotherPractitioner) {
      reset(initialAddPractitionerValues);
      setIsValidPractitioner(undefined);
      return;
    }
    history.push(ROUTES.PRACTITIONER.PROGRAMME_INFORMATION);
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

  const renderPermissionIcon = (name: string) => {
    switch (name) {
      case PermissionsNames.take_attendance:
        return (
          <ClipboardCheckIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      case PermissionsNames.create_progress_reports:
        return (
          <PresentationChartLineIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      case PermissionsNames.plan_classroom_actitivies:
        return (
          <AcademicCapIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
      default:
        return (
          <UserAddIcon className="bg-quatenary full ml-2 h-10 w-12 rounded-full py-2 text-white" />
        );
    }
  };

  const renderPermissionName = (name: string) => {
    switch (name) {
      case PermissionsNames.take_attendance:
        return 'Take attendance for their class(es)';
      case PermissionsNames.create_progress_reports:
        return 'Create progress reports to share with caregivers';
      case PermissionsNames.plan_classroom_actitivies:
        return 'Plan their own classroom activities';
      default:
        return `Add, edit, or remove children from ${classroom?.name}`;
    }
  };

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
                      onKeyDown={() => setSearched(false)}
                    />
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
                        onKeyDown={() => setSearched(false)}
                      />
                    </div>
                  )}
                  {!preferId && (
                    <Button
                      className={'mt-3 mb-2'}
                      type="outlined"
                      color="secondary"
                      textColor="secondary"
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
                      color="secondary"
                      size="small"
                      background={'transparent'}
                      textColor="secondary"
                      text="Enter passport number instead"
                      onClick={() => setValue('preferId', false)}
                    />
                  )}
                </div>
              </div>
              {!isLoading && (idNumber || passport) && !searched && (
                <Button
                  size="normal"
                  className="mb-4 w-full"
                  type="filled"
                  color="quatenary"
                  text="Search for practitioner"
                  textColor="white"
                  icon="SearchIcon"
                  onClick={handleSearch}
                  disabled={!idNumber && !passport}
                />
              )}
              {(addNote || isPrincipal) && (
                <div>
                  <Alert
                    type={'error'}
                    title={`You cannot add this practitioner -  they are already linked to a different preschool.`}
                    list={[
                      'Make sure you have entered the correct ID number above.',
                      'Ask the practitioner to update their preschool information.',
                    ]}
                  />
                </div>
              )}
              {isValidPractitioner === false && isOpenAccess && (
                <>
                  <div className="mb-8">
                    <Alert
                      type={'warning'}
                      title={`Oh dear! It looks like your practitioner has not joined ${appName} yet.`}
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

              {isValidPractitioner === false &&
                !isOpenAccess &&
                !isOwnUserId && (
                  <>
                    <div className="mb-8">
                      <Alert
                        type={'error'}
                        title={`Oops, practitioner not found! Only ${appName} practitioners can be added.`}
                        list={[
                          `Check the practitioner ID and try again. Only ${appName} practitioners can be added.`,
                          `You can add a different practitioner or exit.`,
                        ]}
                        button={
                          <Button
                            text="Get help"
                            icon="ClipboardListIcon"
                            type={'filled'}
                            color={'quatenary'}
                            textColor={'white'}
                            onClick={() => setOpenHelp(true)}
                          />
                        }
                      />
                    </div>
                  </>
                )}
              {isValidPractitioner === true && !isPrincipal && !addNote && (
                <div className="mb-8">
                  <Alert
                    type={'success'}
                    title={'Practitioner found!'}
                    list={
                      isPractitionerRegistered
                        ? []
                        : [
                            `Encourage ${
                              newPractitioner?.firstName ||
                              newPractitioner?.username
                            } to register for the app as soon as possible!`,
                          ]
                    }
                  />
                </div>
              )}
              {/* {!addNote &&
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
                )} */}
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
                    text={`You can edit this in future by going to the Business then Staff tab.`}
                    color={'textMid'}
                  />
                </div>
              )}
              <div>
                {isValidPractitioner === true &&
                  !addNote &&
                  premissionsFilteredByTenantModules.map((item, index) => (
                    <CheckboxGroup
                      id={item.id}
                      key={item.id}
                      title={renderPermissionName(item?.name)}
                      checked={permissionsAdded?.some(
                        (option) => option === item.id
                      )}
                      value={item.id}
                      onChange={(event) => {
                        updateArray(event, item?.id!);
                      }}
                      className="mb-1"
                      icon={renderPermissionIcon(item?.name)}
                      isIconFullWidth
                      checkboxColor="primary"
                    />
                  ))}
              </div>
            </div>
            {isLoading && (
              <LoadingSpinner
                size="medium"
                spinnerColor={'quatenary'}
                backgroundColor={'uiLight'}
                className="my-8 w-full"
              />
            )}
            <div className="-mb-4 mt-4 w-11/12 self-end">
              {isValidPractitioner === true && (
                <Button
                  size="normal"
                  className="mb-12 w-full"
                  type="outlined"
                  color="quatenary"
                  text="Add another practitioner"
                  textColor="quatenary"
                  icon="UserAddIcon"
                  onClick={() => onSubmitAddPractitioner(true)}
                  disabled={
                    (!idNumber && !passport && !practitionerPhoneNumber) ||
                    isValidPractitioner === undefined ||
                    addNote ||
                    isPrincipal
                  }
                />
              )}
              <Button
                size="normal"
                className="mb-12 w-full"
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
                onClick={() => onSubmitAddPractitioner(false)}
              />
            </div>
          </div>
        </div>
      </BannerWrapper>
      <Dialog
        visible={openHelp}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <HelpForm closeAction={setOpenHelp} />
      </Dialog>
    </div>
  );
};
