import { useMutation, useQuery } from '@apollo/client';
import {
  initialHealthCareWorkerValues,
  initialSiteAddressValues,
  initialUserDetailsValues,
  NOTIFICATION,
  RoleDto,
  siteAddressSchema,
  useNotifications,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  CreateHealthCareWorker,
  CreateSiteAddress,
  CreateUser,
  HealthCareWorkerInput,
  RoleList,
  SendInviteToApplication,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import HealthCareWorkerForm from '../../../../components/health-care-worker-form/health-care-worker-form';
import { UserPanelCreateProps } from '../../../../components/users';
import {
  Button,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import { SaveIcon } from '@heroicons/react/solid';
import FormField from '../../../../../../components/form-field/form-field';
import * as yup from 'yup';

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is Required'),
  surname: yup.string().required('Surname is Required'),
  email: yup.string().email('Invalid email'),
  idNumber: yup
    .string()
    .test('idNumber', 'ID number or passport is not valid', function (value) {
      const { passport } = this.parent;
      const isIdValid = SA_ID_REGEX.test(value);
      const isPassportValid = SA_PASSPORT_REGEX.test(value);

      if (!isIdValid && !isPassportValid) {
        return false;
      }

      if (passport && isIdValid) {
        return false;
      }

      return true;
    })
    .required('ID number or passport is required'),
});

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
  const [createHealthCareWorker, { loading }] = useMutation(
    CreateHealthCareWorker
  );
  const [addRolesToUser] = useMutation(AddUsersToRole);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);
  const [idType, setIdType] = useState<string>('idNumber');

  // FORMS
  // USER FORM DETAILS
  const { register, formState, getValues, handleSubmit } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const { errors, isValid } = formState;

  // COMMUNITY HEALTH WORKER FORMS
  const {
    register: healthCareWorkerRegister,
    formState: healthCareWorkerFormState,
    getValues: healthCareWorkerGetValues,
  } = useForm({
    defaultValues: { ...initialHealthCareWorkerValues },
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

    console.log(userDetailForm);

    const userInputModel: UserModelInput = {
      id: newGuid(),
      isSouthAfricanCitizen: null,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: null,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      phoneNumber: userDetailForm.phoneNumber,
      contactPreference: 'sms',
    };

    await createUser({
      variables: {
        input: { ...userInputModel },
      },
    }).then(async (response) => {
      const userId = response.data.addUser.id;
      if (userId) {
        await saveHealthCareWorker(userId);
        await saveRoles(userId);
      }
    });
  };

  const saveHealthCareWorker = async (userId: string) => {
    // comment this out to ensure FE builds for BE - revert changes
    // const healthCareWorkerForm = healthCareWorkerGetValues();
    // const healthCareWorkModel: HealthCareWorkerInput = {
    //   UserId: userId,
    //   teamLeadId: healthCareWorkerForm?.teamLeadId,
    //   languageId: null,
    //   isRegistered: false,
    // };
    // await createHealthCareWorker({
    //   variables: {
    //     input: { ...healthCareWorkModel },
    //   },
    // })
    //   .then(() => {
    //     setNotification({
    //       title: 'Successfully Created CHW!',
    //       variant: NOTIFICATION.SUCCESS,
    //     });
    //   })
    //   .catch((err) => {
    //     setNotification({
    //       title: 'Failed to Create CHW!',
    //       variant: NOTIFICATION.ERROR,
    //     });
    //   });
    // if (userId) {
    //   await sendInviteToApplication({
    //     variables: {
    //       userId: userId,
    //       inviteToPortal: false,
    //     },
    //   }).catch((err) => [
    //     setNotification({
    //       title: 'Failed to send CHW Invite!',
    //       variant: NOTIFICATION.SUCCESS,
    //     }),
    //   ]);
    //   setNotification({
    //     title: 'Successfully Sent CHW Invite!',
    //     variant: NOTIFICATION.SUCCESS,
    //   });
    // }
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = ['Community Health Worker'];

    await addRolesToUser({
      variables: {
        userId: userId,
        roleNames: rolesToAdd,
      },
    });
  };

  const addUserRole = () => {
    const role = roleData.roles.find(
      //TODO: Keeping this patern but the name should not be hard coded
      (role: RoleDto) => role.name === 'Community Health Worker'
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
        <div className="pb-2">
          <h1 className="text-uiMidDark text-xl font-medium leading-6">
            Create Community Health Worker
          </h1>
          <p className="text-md pb-2 text-gray-500">Step 1 of 1</p>
        </div>
        <div className=" border-t border-dashed border-gray-500 px-4 py-5 ">
          <form className="space-y-6 divide-y divide-gray-200">
            <div className="space-y-0">
              <div className="grid grid-cols-1 ">
                <div className="my-0 sm:col-span-3">
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
                    label={'Cellphone number *'}
                    nameProp={'phoneNumber'}
                    register={register}
                    error={errors.phoneNumber?.message}
                    placeholder="eg. 0650025055"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <HealthCareWorkerForm
                    formKey={`createhealthcareworker-${new Date().getTime()}`}
                    register={healthCareWorkerRegister}
                    errors={healthCareWorkerFormErrors}
                  />
                </div>

                <div className="my-4 sm:col-span-3">
                  <div className=" mb-4 flex flex-row">
                    <Button
                      className={'mt-3 mr-1 w-full rounded-md '}
                      type={idType === 'idNumber' ? 'filled' : 'outlined'}
                      color="tertiary"
                      onClick={() => setIdType('idNumber')}
                    >
                      <Typography
                        type="help"
                        color={idType === 'idNumber' ? 'white' : 'tertiary'}
                        text="Id Number"
                      ></Typography>
                    </Button>

                    <Button
                      className="mt-3 w-full rounded-md"
                      type={idType === 'Passport' ? 'filled' : 'outlined'}
                      color="tertiary"
                      onClick={() => setIdType('Passport')}
                    >
                      <Typography
                        type="help"
                        color={idType === 'Passport' ? 'white' : 'tertiary'}
                        text="Passport"
                      ></Typography>
                    </Button>
                  </div>
                  <FormField
                    label={idType === 'idNumber' ? 'Id number *' : 'Passport *'}
                    nameProp={'idNumber'}
                    register={register}
                    error={errors.idNumber?.message}
                    placeholder={
                      idType === 'idNumber'
                        ? 'e.g 6201014800088'
                        : 'e.g EN000666'
                    }
                  />
                </div>
              </div>
            </div>
          </form>
          <div></div>
        </div>

        <div className="  rounded-lg border-b border-gray-200 px-4 pb-6"></div>
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
        isLoading={loading}
        onClick={handleSubmit(onSave)}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
