import { useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialPractitionerValues,
  initialSiteAddressValues,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  practitionerSchema,
  RoleDto,
  RoleSystemNameEnum,
  siteAddressSchema,
  useNotifications,
  userSchema,
} from '@ecdlink/core';
import * as yup from 'yup';
import {
  AddUsersToRole,
  CreatePractitioner,
  CreateSiteAddress,
  CreateUser,
  PractitionerInput,
  RoleList,
  SendInviteToApplication,
  SiteAddressInput,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import PasswordForm from '../../../../components/password-form/password-form';
import PractitionerForm from '../../../../components/practitioner-form/practitioner-form';
import SiteAddressForm from '../../../../components/site-address-form/site-address-form';
import UserDetailsForm from '../../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../../components/users';
import { XIcon } from '@heroicons/react/solid';
import {
  ActionModal,
  Alert,
  Dialog,
  DialogPosition,
  Divider,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import { idTypeEnum } from '../../../../../view-user/view-user.types';
import { useTenant } from '../../../../../../hooks/useTenant';

export default function PractitionerPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const tenant = useTenant();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };
  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (roleData && roleData.roles) {
      addUserRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData]);

  const [createUser] = useMutation(CreateUser);
  const [createPractitioner] = useMutation(CreatePractitioner);
  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [addRolesToUser] = useMutation(AddUsersToRole);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const [userAlreadyExits, setUserAlreadyExits] = useState(false);
  const isCoachRoleEnabled = tenant?.modules?.coachRoleEnabled;

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);
  const [idType, setIdType] = useState<string>('idNumber');

  const localUserSchema = yup.object().shape({
    firstName: yup.string().required('First name is Required'),
    surname: yup.string().required('Surname is Required'),
    email: yup.string().email('Invalid email'),
    phoneNumber: yup
      .string()
      .matches(SA_CELL_REGEX, 'Phone number is not valid')
      .required('Cellphone number is required'),
    idNumber:
      idType === idTypeEnum.idNumber
        ? yup
            .string()
            .matches(SA_ID_REGEX, 'Id number is not valid')
            .required('ID Number is Required')
        : yup.string().required('ID Number is Required'),
  });

  // FORMS
  // USER FORM DETAILS
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    clearErrors,
    control,
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(localUserSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });
  // const { firstName, surname, phoneNumber, idNumber } = useWatch({ control });
  const {
    errors: userDetailFormErrors,
    isValid: isUserDetailValid,
    isDirty: userDetailsIsDirty,
  } = userDetailFormState;
  // PASSWORD FORMS
  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onBlur',
  });
  const { errors: passwordFormErrors } = passwordFormState;
  // PRACTITIONER FORMS
  const {
    register: practitionerRegister,
    formState: practitionerFormState,
    getValues: practitionerGetValues,
    setValue: practitionerSetValue,
  } = useForm({
    resolver: yupResolver(practitionerSchema),
    defaultValues: { ...initialPractitionerValues, sendInvite: false },
    mode: 'onBlur',
  });
  const {
    errors: practitionerFormErrors,
    isValid: isPractitionerValid,
    isDirty,
  } = practitionerFormState;

  const coachQueryVariables = useMemo(
    () => ({
      search: '',
      connectUsageSearch: [],
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    }),
    []
  );

  // SITE ADDRESS FORMS
  const { register: siteAddressRegister, getValues: siteAddressGetValues } =
    useForm({
      resolver: yupResolver(siteAddressSchema),
      defaultValues: { ...initialSiteAddressValues, sendInvite: false },
      mode: 'onBlur',
    });
  const { errors: siteAddressFormErrors } = practitionerFormState;
  const [isLoading, setIsLoading] = useState(false);

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();
    const passwordForm = passwordGetValues();
    setIsLoading(true);
    const userInputModel: UserModelInput = {
      id: newGuid(),
      isSouthAfricanCitizen: userDetailForm.isSouthAfricanCitizen,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: userDetailForm.verifiedByHomeAffairs,
      dateOfBirth: userDetailForm.dateOfBirth,
      genderId:
        userDetailForm.genderId && userDetailForm.genderId.length
          ? userDetailForm.genderId
          : null,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      contactPreference: userDetailForm.contactPreference,
      phoneNumber: userDetailForm.phoneNumber,
      email: userDetailForm.email,
      password:
        passwordForm.password && passwordForm.password.length > 0
          ? passwordForm.password
          : null,
    };

    await createUser({
      variables: {
        input: { ...userInputModel },
      },
    })
      .then(async (response) => {
        setNotification({
          title: 'Successfully Created User!',
          variant: NOTIFICATION.SUCCESS,
        });

        const userId = response.data.addUser.id;
        await saveSiteAddress(userId);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const saveSiteAddress = async (userId: string) => {
    const form = siteAddressGetValues();
    const siteAddressInputModel: SiteAddressInput = {
      Id: undefined,
      Name: form.name ?? '',
      AddressLine1: form.addressLine1 ?? '',
      AddressLine2: form.addressLine2 ?? '',
      AddressLine3: form.addressLine3 ?? '',
      PostalCode: form.postalCode ?? '',
      ProvinceId: form.provinceId ?? '',
      Ward: form.ward ?? '',
      IsActive: true,
    };

    let siteAddressId = null;

    if (form.provinceId) {
      const returnSiteAddress = await createSiteAddress({
        variables: {
          input: { ...siteAddressInputModel },
        },
      });

      if (returnSiteAddress && returnSiteAddress.data) {
        setNotification({
          title: 'Successfully Created Address!',
          variant: NOTIFICATION.SUCCESS,
        });

        siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
      }
    }

    await savePractitioner(userId, siteAddressId);
  };

  const savePractitioner = async (userId: string, siteAddressId?: string) => {
    const practitionerForm = practitionerGetValues();
    const practInputModel: PractitionerInput = {
      Id: undefined,
      UserId: userId,
      SiteAddressId: siteAddressId,
      AttendanceRegisterLink: practitionerForm.attendanceRegisterLink,
      ConsentForPhoto: practitionerForm.consentForPhoto,
      ParentFees: practitionerForm.parentFees && +practitionerForm.parentFees,
      LanguageUsedInGroups: practitionerForm.languageUsedInGroups,
      StartDate: practitionerForm.startDate,
      IsActive: true,
      IsPrincipal: practitionerForm.isPrincipal,
      CoachHierarchy:
        practitionerForm.coachHierarchy !== ''
          ? practitionerForm.coachHierarchy
          : null,
      PrincipalHierarchy:
        practitionerForm.principalHierarchy !== ''
          ? practitionerForm.principalHierarchy
          : null,
      Progress: 0,
      ProgressWalkthroughComplete: false,
    };

    await createPractitioner({
      variables: {
        input: { ...practInputModel },
      },
    });

    await saveRoles(userId, practitionerForm.isPrincipal);

    setNotification({
      title: 'Successfully Created Practitioner!',
      variant: NOTIFICATION.SUCCESS,
    });

    await sendInviteToApplication({
      variables: {
        userId: userId,
        inviteToPortal: false,
      },
    });

    setNotification({
      title: 'Successfully Sent Practitioner Invite!',
      variant: NOTIFICATION.SUCCESS,
    });
  };

  const saveRoles = async (userId: string, isPrincipal: boolean) => {
    const rolesToAdd: string[] = [];
    let principalRole = 'Principal';
    selectedUserRoles.forEach((x) => {
      rolesToAdd.push(isPrincipal ? principalRole : x.name);
    });

    await addRolesToUser({
      variables: {
        userId: userId,
        roleNames: rolesToAdd,
      },
    })
      .then((response: any) => {
        setNotification({
          title: 'Successfully Added roles to User!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addUserRole = () => {
    const role = roleData.roles.find(
      (role: RoleDto) => role.systemName === RoleSystemNameEnum.Practitioner
    );

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setUserRoles(copy);
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    // if (!isPractitionerValid) isValid = false;
    return isValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        {(isDirty || userDetailsIsDirty) && (
          <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
            <button
              className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
              onClick={() => setDisplayFormIsDirty(true)}
            >
              <span className="sr-only">Close panel</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
        <div className=" rounded-lg">
          <div className="pb-2">
            <h3 className="text-Primary text-lg font-medium leading-6">
              Practitioner Details
            </h3>
            <Typography color={'textMid'} type="help" text={'Step 1 of 1'} />
            <Divider dividerType="dashed" className="py-6" />
          </div>

          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
            setIdType={setIdType}
            idType={idType}
            clearErrors={clearErrors}
            watch={watch}
            coachQueryVariables={coachQueryVariables}
            practitioners={props?.practitioners}
            setUserAlreadyExits={setUserAlreadyExits}
          />
        </div>

        {isCoachRoleEnabled && (
          <div className="rounded-lg bg-white py-2">
            <PractitionerForm
              formKey={`createPractitioner-${new Date().getTime()}`}
              register={practitionerRegister}
              errors={practitionerFormErrors}
              coachQueryVariables={coachQueryVariables}
              practitionerGetValues={practitionerGetValues}
              practitionerSetValue={practitionerSetValue}
            />
          </div>
        )}

        {/* <div className=" mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Address Detail
            </h3>
          </div>
          <SiteAddressForm
            formKey={`createSiteAddress-${new Date().getTime()}`}
            register={siteAddressRegister}
            errors={siteAddressFormErrors}
          />
        </div> */}

        {/* <div className=" mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Password
            </h3>
          </div>

          <PasswordForm
            formKey={`createPassword-${new Date().getTime()}`}
            isEdit={false}
            register={passwordRegister}
            errors={passwordFormErrors}
          />
        </div> */}
        <Dialog
          className={'mb-16 px-4'}
          stretch
          visible={displayFormIsDirty}
          position={DialogPosition.Middle}
        >
          <ActionModal
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Discard unsaved changes?`}
            detailText={'If you leave now, you will lose all of your changes.'}
            actionButtons={[
              {
                text: 'Keep editing',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => setDisplayFormIsDirty(false),
                leadingIcon: 'PencilIcon',
              },
              {
                text: 'Discard changes',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => {
                  emitCloseDialog(false);
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        </Dialog>
      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
      <Alert
        className="mt-2 mb-2 rounded-md"
        title={`An invitation will be sent to the new user when you click save.`}
        type="info"
      />
      <UserPanelSave
        disabled={!getIsValid() || userAlreadyExits}
        onSave={onSave}
        isLoading={isLoading}
      />
    </article>
  );
}
