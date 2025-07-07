import { FormInput, Button, BannerWrapper, Typography } from '@ecdlink/ui';
import * as Yup from 'yup';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  PractitionerAboutModel,
  initialPractitionerAboutValues,
} from '@/schemas/practitioner/practitioner-about';
import { useAppDispatch } from '@store';
import { userActions, userThunkActions } from '@store/user';
import { cloneDeep } from 'lodash';
import { UserDto } from '@/../../../packages/core/lib';

export interface EditEmailProps {
  setEditEmail?: any;
  user?: UserDto;
}

var emailRexExp =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const editEmailModelSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(emailRexExp, 'Email address is not valid'),
});

export const Editpassword: React.FC<EditEmailProps> = ({
  setEditEmail,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
        whatsapp: user?.whatsappNumber || '',
      };
      return tempPractitioner;
    } else {
      return initialPractitionerAboutValues;
    }
  };

  const {
    getValues: getPractitionerInfoFormValues,
    register: practitionerInfoFormRegister,
    control: practitionerInfoControl,
  } = useForm<PractitionerAboutModel>({
    resolver: yupResolver(editEmailModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { errors } = useFormState({ control: practitionerInfoControl });

  const savePractitionerUserData = () => {
    const practitionerForm = getPractitionerInfoFormValues();
    const copy = cloneDeep(user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email!;

      appDispatch(userActions.updateUser(copy));
      appDispatch(userThunkActions.updateUser(copy));
    }
  };

  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        showBackground={false}
        color={'primary'}
        title={'Edit password'}
        backgroundColour={'uiBg'}
        displayOffline={!isOnline}
        onBack={() => setEditEmail(false)}
      ></BannerWrapper>
      <div className="w-12/12 wrapper-with-sticky-button px-4">
        <div className="flex w-full justify-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full">
              <Typography
                type="h2"
                text="Password"
                color={'textDark'}
                className="mt-4 w-11/12"
              />
            </div>
            <div className="mt-2 flex w-full flex-col justify-center gap-4">
              <FormInput<PractitionerAboutModel>
                label={''}
                visible={true}
                nameProp={'email'}
                className="w-full"
                register={practitionerInfoFormRegister}
                error={!!errors.email ? errors.email : undefined}
              />
            </div>
            <div className="mt-4 -mb-4 h-full w-full self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="quatenary"
                text="Save"
                textColor="white"
                icon="SaveIcon"
                disabled={!!Object.keys(errors).length}
                onClick={() => {
                  savePractitionerUserData();
                  setEditEmail(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
