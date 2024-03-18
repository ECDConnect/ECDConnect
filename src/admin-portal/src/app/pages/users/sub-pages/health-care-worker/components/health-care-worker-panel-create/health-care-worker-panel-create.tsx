import { useMutation, useQuery } from '@apollo/client';
import {
  initialUserDetailsValues,
  NOTIFICATION,
  RoleDto,
  useNotifications,
} from '@ecdlink/core';
import {
  AddHealthCareWorkerInputModelInput,
  AddUsersToRole,
  CreateHealthCareWorker,
  CreateUser,
  RoleList,
  SendInviteToApplication,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { newGuid } from '../../../../../../utils/uuid.utils';
import HealthCareWorkerForm from '../../../../components/health-care-worker-form/health-care-worker-form';
import { UserPanelCreateProps } from '../../../../components/users';
import {
  ActionModal,
  Alert,
  Button,
  Dialog,
  DialogPosition,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import { SaveIcon, XIcon } from '@heroicons/react/solid';
import FormField from '../../../../../../components/form-field/form-field';
import * as yup from 'yup';
import { idTypeEnum } from '../../../../../view-user/view-user.types';

export const hcwSchema = yup.object().shape({
  userId: yup.string(),
  clinicId: yup.string().required('Clinic is required'),
});

const hcwInitialvalues: AddHealthCareWorkerInputModelInput = {
  clinicId: '',
  userId: '',
};

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

  const userSchema = yup.object().shape({
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
        : yup
            .string()
            .matches(SA_PASSPORT_REGEX, 'Passport is not valid')
            .required('ID Number is Required'),
  });

  // FORMS
  // USER FORM DETAILS
  const { register, formState, getValues, handleSubmit } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const { errors, isValid, isDirty } = formState;
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      setFormIsDirty(true);
    } else {
      setFormIsDirty(false);
    }
  }, [isDirty]);

  // COMMUNITY HEALTH WORKER FORMS
  const {
    register: healthCareWorkerRegister,
    formState: healthCareWorkerFormState,
    getValues: healthCareWorkerGetValues,
    control: hcwControl,
  } = useForm({
    defaultValues: { ...hcwInitialvalues },
    mode: 'onBlur',
    resolver: yupResolver(hcwSchema),
  });
  const {
    errors: healthCareWorkerFormErrors,
    isValid: isHealthCareWorkerValid,
  } = healthCareWorkerFormState;

  const { clinicId } = useWatch({
    control: hcwControl,
  });

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
    const healthCareWorkModel: AddHealthCareWorkerInputModelInput = {
      userId: userId,
      clinicId: clinicId,
    };

    await createHealthCareWorker({
      variables: {
        input: { ...healthCareWorkModel },
      },
    })
      .then(() => {
        setNotification({
          title: 'Successfully Created CHW!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to Create CHW!',
          variant: NOTIFICATION.ERROR,
        });
      });
    if (userId) {
      await sendInviteToApplication({
        variables: {
          userId: userId,
          inviteToPortal: false,
        },
      }).catch((err) => [
        setNotification({
          title: 'Failed to send CHW Invite!',
          variant: NOTIFICATION.SUCCESS,
        }),
      ]);
      setNotification({
        title: 'Successfully Sent CHW Invite!',
        variant: NOTIFICATION.SUCCESS,
      });
    }
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
          {formIsDirty && (
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
                    clinicId={clinicId}
                  />
                </div>

                <div className="my-4 sm:col-span-3">
                  <Typography
                    text={
                      'Which kind of identification do you have for the CHW? *'
                    }
                    type={'body'}
                    color={'textMid'}
                  />
                  <div className=" mb-4 flex flex-row">
                    <Button
                      className={'mt-3 mr-1 w-full rounded-md '}
                      type={'filled'}
                      color={idType === 'idNumber' ? 'tertiary' : 'errorBg'}
                      onClick={() => setIdType('idNumber')}
                    >
                      <Typography
                        type="help"
                        color={idType === 'idNumber' ? 'white' : 'tertiary'}
                        text="Id Number"
                      ></Typography>
                    </Button>

                    <Button
                      className={'mt-3 mr-1 w-full rounded-md '}
                      type={'filled'}
                      color={idType === 'idNumber' ? 'errorBg' : 'tertiary'}
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
                <Alert
                  className="mt-2 rounded-md"
                  title="An invitation will be sent to the new user when you click save."
                  type="info"
                />
              </div>
            </div>
          </form>
          <Dialog
            className="right-50 absolute w-6/12"
            stretch
            visible={displayFormIsDirty}
            position={DialogPosition.Middle}
          >
            <ActionModal
              icon={'InformationCircleIcon'}
              iconColor="alertMain"
              iconBorderColor="alertBg"
              importantText={`Discard unsaved changes?`}
              detailText={
                'If you leave now, you will lose all of your changes.'
              }
              buttonClass="rounded-2xl"
              actionButtons={[
                {
                  text: 'Keep editing',
                  textColour: 'secondary',
                  colour: 'secondary',
                  type: 'outlined',
                  onClick: () => setDisplayFormIsDirty(false),
                  leadingIcon: 'XIcon',
                },
                {
                  text: 'Discard changes',
                  textColour: 'white',
                  colour: 'secondary',
                  type: 'filled',
                  onClick: () => {
                    props.closeDialog(true);
                  },
                  leadingIcon: 'TrashIcon',
                },
              ]}
            />
          </Dialog>
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
        disabled={!isValid || !clinicId}
        isLoading={loading}
        onClick={handleSubmit(onSave)}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
