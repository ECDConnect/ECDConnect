import {
  Typography,
  FormInput,
  Button,
  Alert,
  LoadingSpinner,
  CheckboxGroup,
  SA_CELL_REGEX,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { UserDto } from '@ecdlink/core';
import { useState, useEffect, useCallback } from 'react';
import { FieldError, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import {
  ConfirmPractitionersSteps,
  RegisterPractitioner,
} from '../../setup-principal/setup-principal.types';
import {
  ClipboardCheckIcon,
  PresentationChartLineIcon,
  AcademicCapIcon,
  UserAddIcon,
} from '@heroicons/react/solid';
import {
  AddPractitinerInitialState,
  AddNewPractitionerModel,
  PermissionsNames,
} from '../add-practitioner/add-practitioner.types';
import { useTenant } from '@/hooks/useTenant';
import { staticDataSelectors } from '@/store/static-data';
import PermissionsService from '@/services/PermissionsService/PermissionsService';
import { UpdateUserPermissionInputModelInput } from '@ecdlink/graphql';
import { StackListItems } from './confirm-practitioners';
import { HelpForm } from '@/components/help-form/help-form';
import { userSelectors } from '@/store/user';
import { classroomsActions, classroomsSelectors } from '@/store/classroom';
import { useTenantModules } from '@/hooks/useTenantModules';
import { useAppDispatch } from '@/store';

export const AddOrEditPractitioner = ({
  onSubmit,
  formData,
  listItems,
  setListItems,
  setConfirmPractitionerPage,
  handleAddOrEditAnotherPractitionerSubmit,
}: {
  onSubmit: (data: RegisterPractitioner) => void;
  formData?: AddPractitionerModel;
  listItems?: StackListItems[];
  setListItems?: (item: StackListItems[]) => void;
  setConfirmPractitionerPage?: (item: ConfirmPractitionersSteps) => void;
  handleAddOrEditAnotherPractitionerSubmit: (
    data: RegisterPractitioner
  ) => void;
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const isOpenAccess = tenant?.isOpenAccess;
  const isWhiteLabel = tenant?.isWhiteLabel;

  const {
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<AddPractitionerModel>({
    resolver: yupResolver(addPractitionerSchema),
    defaultValues: Boolean(formData) ? formData : initialAddPractitionerValues,
    mode: 'onChange',
  });

  const appDispatch = useAppDispatch();

  const [isValidPractitioner, setIsValidPractitioner] = useState<boolean>();
  const [isPractitionerRegistered, setIsPractitionerRegistered] =
    useState<boolean>();
  const user = useSelector(userSelectors.getUser);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  const [isPrincipal, setIsPrincipal] = useState<boolean>(false);
  const [newPractitioner, setNewPractitioner] =
    useState<AddNewPractitionerModel>(AddPractitinerInitialState);
  const [addNote, setAddNote] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();
  const permissions = useSelector(staticDataSelectors.getPermissions);
  const premissionsFilteredByTenantModules = permissions
    ?.filter((item) =>
      !attendanceEnabled && isWhiteLabel
        ? item?.name !== 'take_attendance'
        : item
    )
    ?.filter((item2) =>
      !progressEnabled && isWhiteLabel
        ? item2?.name !== 'create_progress_reports'
        : item2
    )
    ?.filter((item3) =>
      !classroomActivitiesEnabled && isWhiteLabel
        ? item3?.name !== 'plan_classroom_activities'
        : item3
    );

  const [practitionerPhoneNumber, setPractitionerPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [openHelp, setOpenHelp] = useState(false);
  const [isOwnUserId, setisOwnUserId] = useState(false);
  const [permissionsAdded, setPermissionsAdded] = useState<string[]>([]);

  const { preferId, idNumber, passport } = useWatch({
    control,
  });
  const editUserIndex = listItems?.findIndex(
    (item) => item?.idNumber === idNumber
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [searched, setSearched] = useState(false);

  const getPractitionerDetailsByIdNumber = useCallback(async () => {
    // Check if the practitioner exists
    let _practitioner: UserDto = {} as UserDto;

    if (idNumber === user?.idNumber || passport === user?.idNumber) {
      setisOwnUserId(true);
      return;
    }

    if (userAuth && idNumber) {
      setIsLoading(true);
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(idNumber);
      setIsLoading(false);
    }
    if (userAuth && passport) {
      setIsLoading(true);
      _practitioner = await new PractitionerService(
        userAuth.auth_token
      ).getPractitionerByIdNumber(passport);
      setIsLoading(false);
    }
    return _practitioner;
  }, [idNumber, passport, user?.idNumber, userAuth]);

  const handleSearch = () => {
    let validPassportOrIdNumber = true;

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
          username: p?.appUser?.userName,
          userPermissions: p?.appUser?.userPermissions,
        });
        setSearched(true);
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

  const handleSubmit = useCallback(async () => {
    if (practitionerPhoneNumber) {
      let validPhoneNumber = true;
      validPhoneNumber = SA_CELL_REGEX.test(practitionerPhoneNumber);

      if (!validPhoneNumber) {
        setError('Phone number is not valid');
        setIsLoading(false);
        return;
      } else {
        setError('');
      }
    }
    setIsLoadingSubmit(true);
    const { firstName, idNumber, passport, surname } = getValues();

    const practitionerUserDetails: any =
      await getPractitionerDetailsByIdNumber();

    if (practitionerUserDetails && !formData?.phoneNumber) {
      const updatePermissionInput: UpdateUserPermissionInputModelInput = {
        userId: practitionerUserDetails?.appUser?.id,
        permissionIds: permissionsAdded,
      };
      // add practitioner to state - updating the permissions on the last step
      await appDispatch(
        classroomsActions.createClassroomPractitioner(updatePermissionInput)
      );

      // await new PermissionsService(userAuth?.auth_token!).UpdateUserPermission(
      //   updatePermissionInput
      // );
    }

    if (practitionerPhoneNumber) {
      onSubmit({
        id: '',
        userId: '',
        idNumber: '',
        firstName: '',
        surname: '',
        passport: '',
        preferId: !!idNumber,
        isRegistered: Boolean(
          practitionerUserDetails?.appUser?.practitionerObjectData?.isRegistered
        ),
        phoneNumber: practitionerPhoneNumber ? practitionerPhoneNumber : '',
      });

      setIsLoadingSubmit(false);
      return;
    }

    onSubmit({
      id: practitionerUserDetails?.appUser?.practitionerObjectData?.id ?? '',
      userId: practitionerUserDetails?.appUser?.id ?? '',
      idNumber: idNumber || passport,
      firstName:
        newPractitioner?.firstName ||
        firstName ||
        newPractitioner?.username ||
        '',
      surname: newPractitioner?.surname || surname,
      passport: passport,
      preferId: !!idNumber,
      isRegistered: Boolean(
        practitionerUserDetails?.appUser?.practitionerObjectData?.isRegistered
      ),
      phoneNumber: practitionerPhoneNumber ? practitionerPhoneNumber : '',
    });

    setIsLoadingSubmit(false);
  }, [
    getPractitionerDetailsByIdNumber,
    getValues,
    newPractitioner?.firstName,
    newPractitioner?.surname,
    newPractitioner?.username,
    onSubmit,
    permissionsAdded,
    practitionerPhoneNumber,
    userAuth?.auth_token,
  ]);

  const handleSubmitAnotherPractitioner = useCallback(async () => {
    if (practitionerPhoneNumber) {
      let validPhoneNumber = true;
      validPhoneNumber = SA_CELL_REGEX.test(practitionerPhoneNumber);

      if (!validPhoneNumber) {
        setError('Phone number is not valid');
        setIsLoading(false);
        return;
      } else {
        setError('');
      }
    }
    setIsLoadingSubmit(true);
    const { firstName, idNumber, passport, surname } = getValues();

    const practitionerUserDetails: any =
      await getPractitionerDetailsByIdNumber();

    if (practitionerUserDetails && !formData?.phoneNumber) {
      const updatePermissionInput: UpdateUserPermissionInputModelInput = {
        userId: practitionerUserDetails?.appUser?.id,
        permissionIds: permissionsAdded,
      };
      // add practitioner to state - updating the permissions on the last step
      await appDispatch(
        classroomsActions.createClassroomPractitioner(updatePermissionInput)
      );

      // await new PermissionsService(userAuth?.auth_token!).UpdateUserPermission(
      //   updatePermissionInput
      // );
    }

    handleAddOrEditAnotherPractitionerSubmit({
      id: practitionerUserDetails?.appUser?.practitionerObjectData?.id ?? '',
      userId: practitionerUserDetails?.appUser?.id ?? '',
      idNumber: idNumber || passport,
      firstName:
        newPractitioner?.firstName ||
        firstName ||
        newPractitioner?.username ||
        '',
      surname: newPractitioner?.surname || surname,
      passport: passport,
      preferId: !!idNumber,
      isRegistered: Boolean(
        practitionerUserDetails?.appUser?.practitionerObjectData?.isRegistered
      ),
      phoneNumber: practitionerPhoneNumber ? practitionerPhoneNumber : '',
    });

    setIsLoadingSubmit(false);
    handleReset();
  }, [
    formData?.phoneNumber,
    getPractitionerDetailsByIdNumber,
    getValues,
    handleAddOrEditAnotherPractitionerSubmit,
    handleReset,
    newPractitioner?.firstName,
    newPractitioner?.surname,
    newPractitioner?.username,
    permissionsAdded,
    practitionerPhoneNumber,
    userAuth?.auth_token,
  ]);

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

  const handleRemoveuser = () => {
    const filteredPractitioners = listItems?.filter(
      (item) => item?.idNumber !== idNumber
    );
    setListItems && setListItems(filteredPractitioners as StackListItems[]);

    setConfirmPractitionerPage &&
      setConfirmPractitionerPage(
        ConfirmPractitionersSteps.CONFIRM_PRACTITIONERS
      );
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  useEffect(() => {
    if (idNumber || passport || formData?.phoneNumber) {
      setIsEdit(true);
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (isEdit && formData?.phoneNumber) {
      setPractitionerPhoneNumber(formData?.phoneNumber);
    }
  }, [isEdit]);

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
    <div className="wrapper-with-sticky-button">
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <Typography
            type={'h2'}
            text={
              isEdit
                ? `Practitioner ${editUserIndex! + 1}`
                : `Practitioner ${listItems && listItems?.length + 1}`
            }
            color={'textDark'}
          />
        </div>
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
                disabled={isEdit}
                onKeyDown={() => {
                  setSearched(false);
                  setisOwnUserId(false);
                }}
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
                  disabled={isEdit}
                  onKeyDown={() => {
                    setSearched(false);
                    setisOwnUserId(false);
                  }}
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
                textColor="secondary"
                type="outlined"
                color="secondary"
                size="small"
                background={'transparent'}
                text="Enter passport number instead"
                onClick={() => setValue('preferId', false)}
              />
            )}
          </div>
          {!isEdit && !isLoading && (idNumber || passport) && !searched && (
            <div>
              <Button
                size="normal"
                className="my-4 w-full"
                type="filled"
                color="quatenary"
                text="Search for practitioner"
                textColor="white"
                icon="SearchIcon"
                onClick={handleSearch}
                disabled={!idNumber && !passport}
              />
              {isValidPractitioner === undefined && (
                <Alert
                  className="mt-2 mb-2 rounded-md"
                  title={`Fill in the ID number & tap the search button to find out if the practitioner is already using ${appName}.`}
                  type="info"
                />
              )}
            </div>
          )}
          {isLoading && (
            <LoadingSpinner
              size="medium"
              spinnerColor="quatenary"
              backgroundColor="uiLight"
              className="my-8"
            />
          )}
        </div>
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
        {isValidPractitioner === false &&
          isOpenAccess &&
          !isOwnUserId &&
          searched && (
            <>
              <div className="mb-1">
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

        {isOwnUserId && (
          <>
            <div className="mb-8">
              <Alert
                type={'error'}
                title={`Oops! You’ve entered your own ID number. Please enter the ID number of a practitioner in your programme instead.`}
              />
            </div>
          </>
        )}

        {isValidPractitioner === false && !isOpenAccess && !isOwnUserId && (
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
        {isValidPractitioner === true && !addNote && !isPrincipal && (
          <div className="mb-2">
            <Alert
              type={'success'}
              title={'Practitioner found!'}
              list={
                isPractitionerRegistered
                  ? []
                  : [
                      `Encourage ${newPractitioner?.firstName} to register for the app as soon as possible!`,
                    ]
              }
            />
          </div>
        )}
        {isValidPractitioner === true && !addNote && (
          <div>
            <Typography type={'h3'} text={`First name`} color={'textMid'} />
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
                checked={permissionsAdded?.some((option) => option === item.id)}
                value={item.id}
                onChange={(event) => {
                  updateArray(event, item?.id!);
                }}
                icon={renderPermissionIcon(item?.name)}
                className="mb-2"
                isIconFullWidth
                checkboxColor="primary"
              />
            ))}
        </div>
      </div>
      <div className="-mb-4 self-end">
        {isValidPractitioner === true && !isEdit && (
          <Button
            size="normal"
            className="mb-12 w-full"
            type="outlined"
            color="quatenary"
            text="Add another practitioner"
            textColor="quatenary"
            icon="UserAddIcon"
            onClick={handleSubmitAnotherPractitioner}
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
          className="mb-4 w-full"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={
            (!idNumber && !passport && !practitionerPhoneNumber) ||
            (isValidPractitioner === false && !practitionerPhoneNumber) ||
            addNote ||
            isPrincipal
          }
          isLoading={isLoadingSubmit}
          onClick={handleSubmit}
        />
        {isEdit && (
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="quatenary"
            text="Delete practitioner"
            textColor="quatenary"
            icon="TrashIcon"
            onClick={handleRemoveuser}
          />
        )}
      </div>
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
