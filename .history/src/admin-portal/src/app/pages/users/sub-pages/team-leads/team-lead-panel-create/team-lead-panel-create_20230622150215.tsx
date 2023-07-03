import { useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialSiteAddressValues,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  RoleDto,
  siteAddressSchema,
  useNotifications,
  userSchema,
  initialTeamLeadValues,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  CreateSiteAddress,
  CreateTeamLead,
  CreateUser,
  RoleList,
  SiteAddressInput,
  TeamLeadModelInput,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../../utils/uuid.utils';
import PasswordForm from '../../../components/password-form/password-form';
import SiteAddressForm from '../../../components/site-address-form/site-address-form';
import TeamLeadForm from '../../../components/team-lead-form/team-lead-form';
import UserDetailsForm from '../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../components/users';
import { Button, Typography } from '@ecdlink/ui';
import { SaveIcon } from '@heroicons/react/solid';

export default function TeamLeadPanelCreate(props: UserPanelCreateProps) {
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
  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [createTeamLead] = useMutation(CreateTeamLead);
  const [addRolesToUser] = useMutation(AddUsersToRole);

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

  // TEAM LEAD FORMS
  const {
    register: teamLeadRegister,
    formState: teamLeadFormState,
    getValues: teamLeadGetValues,
  } = useForm({
    defaultValues: { ...initialTeamLeadValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: teamLeadFormErrors, isValid: isTeamLeadValid } =
    teamLeadFormState;

  // SITE ADDRESS FORMS
  const { register: siteAddressRegister, getValues: siteAddressGetValues } =
    useForm({
      resolver: yupResolver(siteAddressSchema),
      defaultValues: { ...initialSiteAddressValues, sendInvite: false },
      mode: 'onBlur',
    });
  const { errors: siteAddressFormErrors } = teamLeadFormState;

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

    await saveTeamLead(userId, siteAddressId);
  };

  const saveTeamLead = async (userId: string, siteAddressId?: string) => {
    const teamLeadForm = teamLeadGetValues();
    const teamLeadModel: TeamLeadModelInput = {
      userId: userId,
      clinicId: teamLeadForm.clinicId || null,
      jobTitle: teamLeadForm.jobTitle,
    };

    await createTeamLead({
      variables: {
        input: { ...teamLeadModel },
      },
    });

    setNotification({
      title: 'Successfully Created Team Lead!',
      variant: NOTIFICATION.SUCCESS,
    });
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
    console.log(teamLeadFormErrors);
    let isValid = isUserDetailValid;
    if (!isTeamLeadValid) isValid = false;
    return isValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="b px-4 py-5">
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

        <div className="mt-5 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Team Lead Detail
            </h3>
          </div>

          <TeamLeadForm
            formKey={`createTeamLead-${new Date().getTime()}`}
            register={teamLeadRegister}
            errors={teamLeadFormErrors}
          />
        </div>

        <div className=" mt-5 r-4 py-5">
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


      </>
    );
  };

  return (
    <article>
      <UserPanelSave disabled={!getIsValid()} onSave={onSave} />

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
