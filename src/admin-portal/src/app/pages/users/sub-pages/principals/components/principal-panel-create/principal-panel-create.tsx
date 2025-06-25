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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import PasswordForm from '../../../../components/password-form/password-form';
import PractitionerForm from '../../../../components/practitioner-form/practitioner-form';
import SiteAddressForm from '../../../../components/site-address-form/site-address-form';
import UserDetailsForm from '../../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../../components/users';

export default function PractitionerPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
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

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);

  // FORMS
  // USER FORM DETAILS
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });
  const { errors: userDetailFormErrors, isValid: isUserDetailValid } =
    userDetailFormState;
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
  } = useForm({
    resolver: yupResolver(practitionerSchema),
    defaultValues: { ...initialPractitionerValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: practitionerFormErrors, isValid: isPractitionerValid } =
    practitionerFormState;

  // SITE ADDRESS FORMS
  const { register: siteAddressRegister, getValues: siteAddressGetValues } =
    useForm({
      resolver: yupResolver(siteAddressSchema),
      defaultValues: { ...initialSiteAddressValues, sendInvite: false },
      mode: 'onBlur',
    });
  const { errors: siteAddressFormErrors } = practitionerFormState;

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();
    const passwordForm = passwordGetValues();

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
        await saveRoles(userId);
        await saveSiteAddress(userId);
      })
      .catch((error) => {
        console.log(error);
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
      Progress: 0,
      ProgressWalkthroughComplete: false,
    };

    await createPractitioner({
      variables: {
        input: { ...practInputModel },
      },
    });

    setNotification({
      title: 'Successfully Created Practitioner!',
      variant: NOTIFICATION.SUCCESS,
    });

    if (practitionerForm.sendInvite) {
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
    }
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = [];
    selectedUserRoles.forEach((x) => {
      rolesToAdd.push(x.name);
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
      (role: RoleDto) => role.systemName === RoleSystemNameEnum.Principal
    );

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setUserRoles(copy);
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    if (!isPractitionerValid) isValid = false;
    return isValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              User Detail
            </h3>
          </div>

          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
          />
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Practitioner Detail
            </h3>
          </div>

          <PractitionerForm
            formKey={`createPractitioner-${new Date().getTime()}`}
            register={practitionerRegister}
            errors={practitionerFormErrors}
          />
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
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
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
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
        </div>
      </>
    );
  };

  return (
    <article>
      <UserPanelSave disabled={!getIsValid()} onSave={onSave} />

      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
    </article>
  );
}
