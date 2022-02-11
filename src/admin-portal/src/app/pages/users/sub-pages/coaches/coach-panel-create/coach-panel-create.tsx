import { useMutation, useQuery } from '@apollo/client';
import {
  AddUsersToRole,
  CoachInput,
  CreateCoach,
  CreateUser,
  RoleList,
  UserModelInput,
} from '@ecdlink/graphql';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { RoleDto } from '@ecdlink/core';
import {
  coachSchema,
  initialCoachValues,
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  userSchema,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CoachForm from '../../../components/coach-form/coach-form';
import PasswordForm from '../../../components/password-form/password-form';
import UserDetailsForm from '../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../components/users';
import { newGuid } from '../../../../../utils/uuid.utils';

export default function CoachPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const { data: roleData } = useQuery(RoleList, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    if (roleData && roleData.roles) {
      addUserRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData]);

  const [createUser] = useMutation(CreateUser);
  const [createCoach] = useMutation(CreateCoach);
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
  const { errors: userDetailFormErrors, isValid: isUserDetailValid } = userDetailFormState;
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
  const { errors: passwordFormErrors, isValid: isPasswordValid } = passwordFormState;
  // COACH FORMS
  const {
    register: coachRegister,
    formState: coachFormState,
    getValues: coachGetValues,
  } = useForm({
    resolver: yupResolver(coachSchema),
    defaultValues: initialCoachValues,
    mode: 'onBlur',
  });
  const { errors: coachFormErrors, isValid: isCoachValid } = coachFormState;
  // END FORMS

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
      genderId: userDetailForm.genderId && +userDetailForm.genderId,
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
        await saveCoach(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveCoach = async (userId: string) => {
    const coachForm = coachGetValues();
    const coachInputModel: CoachInput = {
      Id: undefined,
      UserId: userId,
      AreaOfOperation: coachForm.areaOfOperation,
      SecondaryAreaOfOperation: coachForm.secondaryAreaOfOperation,
      StartDate: coachForm.startDate,
      IsActive: true,
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
    const role = roleData.roles.find((role: RoleDto) => role.name === 'Coach');

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setUserRoles(copy);
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    if (!isCoachValid) isValid = false;
    return isValid && isPasswordValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">User Detail</h3>
          </div>

          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
          />
        </div>

        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Coach Detail</h3>
          </div>

          <CoachForm
            formKey={`createCoach-${new Date().getTime()}`}
            register={coachRegister}
            errors={coachFormErrors}
          />
        </div>

        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Password</h3>
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

      <div className="mt-5 max-w-5xl mx-auto">{getComponent()}</div>
    </article>
  );
}
