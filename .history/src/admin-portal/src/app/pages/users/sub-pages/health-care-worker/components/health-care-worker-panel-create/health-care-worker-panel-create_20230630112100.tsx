import { useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialHealthCareWorkerValues,
  initialSiteAddressValues,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  RoleDto,
  siteAddressSchema,
  useNotifications,
  userSchema,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  CreateHealthCareWorker,
  CreateSiteAddress,
  CreateUser,
  HealthCareWorkerModelInput,
  RoleList,
  SendInviteToApplication,
  SiteAddressInput,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import HealthCareWorkerForm from '../../../../components/health-care-worker-form/health-care-worker-form';
import PasswordForm from '../../../../components/password-form/password-form';
import SiteAddressForm from '../../../../components/site-address-form/site-address-form';
import UserDetailsForm from '../../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../../components/users';
import { Button, Typography } from '@ecdlink/ui';
import { SaveIcon } from '@heroicons/react/solid';
import FormField from '../../../../../../components/form-field/form-field';

export default function HealthCareWorkerPanelCreate(
  props: UserPanelCreateProps
) {
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

  const [createUser] = useMutation(CreateHealthCareWorker);
  const [createHealthCareWorker] = useMutation(CreateHealthCareWorker);
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

  // HEALTH CARE WORKER FORMS
  const {
    register: healthCareWorkerRegister,
    formState: healthCareWorkerFormState,
    getValues: healthCareWorkerGetValues,
  } = useForm({
    defaultValues: { ...initialHealthCareWorkerValues, sendInvite: false },
    mode: 'onBlur',
  });
  const {
    errors: healthCareWorkerFormErrors,
    isValid: isHealthCareWorkerValid,
  } = healthCareWorkerFormState;

  // SITE ADDRESS FORMS
  const { register: siteAddressRegister, getValues: siteAddressGetValues } =
    useForm({
      resolver: yupResolver(siteAddressSchema),
      defaultValues: { ...initialSiteAddressValues, sendInvite: false },
      mode: 'onBlur',
    });
  const { errors: siteAddressFormErrors } = healthCareWorkerFormState;

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();

    const userInputModel: UserModelInput = {
      id: newGuid(),
      isSouthAfricanCitizen: null,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: null,
      dateOfBirth: null,
      genderId: null,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      contactPreference: userDetailForm.contactPreference,
      phoneNumber: userDetailForm.phoneNumber,
      email: userDetailForm.email,
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

    await saveHealthCareWorker(userId, siteAddressId);
  };

  const saveHealthCareWorker = async (
    userId: string,
    siteAddressId?: string
  ) => {
    const healthCareWorkerForm = healthCareWorkerGetValues();
    const healthCareWorkeModel: HealthCareWorkerModelInput = {
      userId: userId,
      teamLeadId: healthCareWorkerForm.teamLeadId || null,
      languageId: healthCareWorkerForm.languageId || null,
      isRegistered: false,
    };

    await createHealthCareWorker({
      variables: {
        input: { ...healthCareWorkeModel },
      },
    });

    setNotification({
      title: 'Successfully Created Health Care Worker!',
      variant: NOTIFICATION.SUCCESS,
    });

    if (healthCareWorkerForm.sendInvite) {
      await sendInviteToApplication({
        variables: {
          userId: userId,
        },
      });

      setNotification({
        title: 'Successfully Sent Health Care Worker Invite!',
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
      //TODO: Keeping this patern but the name should not be hard coded
      (role: RoleDto) => role.name === 'Health Care Worker'
    );

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setUserRoles(copy);
  };

  const getIsValid = () => {
    console.log(userDetailFormErrors);
    let isValid = isUserDetailValid;
    console.log(healthCareWorkerFormErrors, isValid);

    if (!isHealthCareWorkerValid) isValid = false;
    return isValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className=" border-b border-dashed border-gray-200 px-4 py-5">
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
          <FormField
            label={'Email *'}
            nameProp={'email'}
            register={userDetailRegister}
            error={userDetailFormErrors.email?.message}
          />
        </div>

        <div className=" mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Health Care Worker Details
            </h3>
          </div>

          <HealthCareWorkerForm
            formKey={`createhealthcareworker-${new Date().getTime()}`}
            register={healthCareWorkerRegister}
            errors={healthCareWorkerFormErrors}
          />
        </div>

      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
      <Button
        className="mt-3 mr-6 w-full rounded"
        type="filled"
        color="secondary"
        // disabled={!getIsValid()}
        onClick={onSave}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography
          type="help"
          color="white"
          text="Save"
        ></Typography>
      </Button>
    </article>
  );
}
