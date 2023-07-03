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
import FormField from '../../../../../components/form-field/form-field';

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
    register,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    control,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });
  const { errors, isValid } =
    userDetailFormState;


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
        await saveTeamLead(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const saveTeamLead = async (userId: string) => {
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



  const getComponent = () => {
    return (
      <>
        <div className="b px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              User Detail
            </h3>
          </div>

          <div className="my-4 sm:col-span-3">
            <FormField
              label={'First name *'}
              nameProp={'firstName'}
              register={register}
              error={errors.firstName?.message}
              placeholder="First name"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Surname *'}
              nameProp={'surname'}
              register={register}
              error={errors.surname?.message}
              placeholder="Surname/family name"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Work email address *'}
              nameProp={'email'}
              register={register}
              error={errors.email?.message}
              placeholder="e.g name@email.com"
            />
          </div>
          <div className="my-4 sm:col-span-3">
            <FormField
              label={'Id number / passport *'}
              nameProp={'idNumber'}
              register={register}
              error={errors.idNumber?.message}
              placeholder="e.g 6201014800088"
            />
          </div>
        </div>

        <div className=" px-4 py-5">
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
        disabled={!isValid}
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
