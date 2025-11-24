import { useMutation, useQuery } from '@apollo/client';
import {
  AddUsersToRole,
  CoachInput,
  CreateCoach,
  CreateUser,
  RoleList,
  UserModelInput,
  SiteAddressInput,
  SendInviteToApplication,
  CreateSiteAddress,
  GetAllPortalCoaches,
} from '@ecdlink/graphql';
import * as yup from 'yup';
import {
  NOTIFICATION,
  useNotifications,
  RoleDto,
  coachSchema,
  initialCoachValues,
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  siteAddressSchema,
  initialSiteAddressValues,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import UserDetailsForm from '../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../components/users';
import { newGuid } from '../../../../../utils/uuid.utils';
import {
  ActionModal,
  Alert,
  Dialog,
  DialogPosition,
  Divider,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  Typography,
} from '@ecdlink/ui';
import { idTypeEnum } from '../../../../view-user/view-user.types';
import { useTenant } from '../../../../../hooks/useTenant';
import { XIcon } from '@heroicons/react/solid';

export default function CoachPanelCreate(
  props: Readonly<UserPanelCreateProps>
) {
  const { setNotification } = useNotifications();
  const tenant = useTenant();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);

  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });

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

  const { data: coachData } = useQuery(GetAllPortalCoaches, {
    variables: coachQueryVariables,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (roleData?.roles) {
      addUserRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData]);

  const [createUser] = useMutation(CreateUser);
  const [createCoach] = useMutation(CreateCoach);
  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [addRolesToUser] = useMutation(AddUsersToRole);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const [userAlreadyExits, setUserAlreadyExits] = useState(false);

  const [selectedUserRoles, setSelectedUserRoles] = useState<RoleDto[]>([]);

  const [isLoading, setIsLoading] = useState(false);
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
    control,
    clearErrors,
  } = useForm({
    resolver: yupResolver(localUserSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });

  const {
    errors: userDetailFormErrors,
    isValid: isUserDetailValid,
    isDirty: userDetailsIsDirty,
  } = userDetailFormState;

  // PASSWORD FORMS
  const { getValues: passwordGetValues } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onBlur',
  });

  // COACH FORMS
  const { formState: coachFormState, getValues: coachGetValues } = useForm({
    resolver: yupResolver(coachSchema),
    defaultValues: { ...initialCoachValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { isValid: isCoachValid, isDirty } = coachFormState;

  // SITE ADDRESS FORMS
  const { getValues: siteAddressGetValues } = useForm({
    resolver: yupResolver(siteAddressSchema),
    defaultValues: { ...initialSiteAddressValues, sendInvite: false },
    mode: 'onBlur',
  });

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
      genderId: userDetailForm.genderId?.length
        ? userDetailForm.genderId
        : null,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      contactPreference: userDetailForm.contactPreference,
      phoneNumber: userDetailForm.phoneNumber,
      email: userDetailForm.email,
      password: passwordForm.password,
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

      if (returnSiteAddress?.data) {
        setNotification({
          title: 'Successfully Created Address!',
          variant: NOTIFICATION.SUCCESS,
        });

        siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
      }
    }

    await saveCoach(userId, siteAddressId);
  };

  const saveCoach = async (userId: string, siteAddressId?: string) => {
    const coachForm = coachGetValues();
    const coachInputModel: CoachInput = {
      Id: userId, // this must be the same as the userId
      UserId: userId,
      AreaOfOperation: coachForm.areaOfOperation,
      SecondaryAreaOfOperation: coachForm.secondaryAreaOfOperation,
      StartDate: coachForm.startDate,
      IsActive: true,
      SiteAddressId: siteAddressId,
    };

    await createCoach({
      variables: {
        input: { ...coachInputModel },
      },
    });

    setNotification({
      title: 'Successfully Created Coach!',
      variant: NOTIFICATION.SUCCESS,
    });

    await sendInviteToApplication({
      variables: {
        userId: userId,
        inviteToPortal: false,
      },
    });

    setNotification({
      title: 'Successfully Sent Coach Invite!',
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
      (role: RoleDto) => role.systemName === RoleSystemNameEnum.Coach
    );

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setSelectedUserRoles(copy);
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    if (!isCoachValid) isValid = false;
    return !!isValid;
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
        <div className="rounded-lg border-b border-gray-200 bg-white px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              {tenant.modules.coachRoleName} details
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
            setUserAlreadyExits={setUserAlreadyExits}
            practitioners={coachData?.allPortalCoaches}
            typeofUser={tenant.modules.coachRoleName}
          />
        </div>

        {/* <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Coach Detail
            </h3>
          </div> */}

        {/* <CoachForm
            formKey={`createCoach-${new Date().getTime()}`}
            register={coachRegister}
            errors={coachFormErrors}
          /> */}

        {/* <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
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
        </div> */}
        {/* 
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
