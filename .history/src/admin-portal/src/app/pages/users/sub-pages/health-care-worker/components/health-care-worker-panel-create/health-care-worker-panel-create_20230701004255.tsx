import { useMutation, useQuery } from '@apollo/client';
import {
  initialHealthCareWorkerValues,
  initialSiteAddressValues,
  initialUserDetailsValues,
  NOTIFICATION,
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
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import HealthCareWorkerForm from '../../../../components/health-care-worker-form/health-care-worker-form';
import UserDetailsForm from '../../../../components/user-details-form/user-details-form';
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

  const [createUser] = useMutation(CreateUser);
  const [createHealthCareWorker] = useMutation(CreateHealthCareWorker);
  const [addRolesToUser] = useMutation(AddUsersToRole);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);

  // FORMS
  // USER FORM DETAILS
  const { register, formState, getValues, handleSubmit, setValue } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });
  

  const { errors, isValid } = formState;

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

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  const saveUser = async () => {
    const userDetailForm = getValues();

    const userInputModel: UserModelInput = {
      id: newGuid(),
      isSouthAfricanCitizen: null,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: null,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
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
        await saveHealthCareWorker(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveHealthCareWorker = async (userId: string) => {
    const healthCareWorkerForm = healthCareWorkerGetValues();
    const healthCareWorkModel: HealthCareWorkerModelInput = {
      userId: userId,
      teamLeadId: healthCareWorkerForm.teamLeadId || null,
      languageId: null,
      isRegistered: false,
    };

    await createHealthCareWorker({
      variables: {
        input: { ...healthCareWorkModel },
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

          <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-0">
        <div className="grid grid-cols-1 ">
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
      </div>
    </form>
          <div></div>
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
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
