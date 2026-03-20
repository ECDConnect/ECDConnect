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
import { useSnackbar } from '@ecdlink/core';

export interface EditNameProps {
  setEditName?: any;
  user?: UserDto;
}

const editNameModelSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is Required'),
  surname: Yup.string().required('Surname is Required'),
});

export const EditName: React.FC<EditNameProps> = ({ setEditName, user }) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
        whatsapp: user?.whatsappNumber || '',
        synced: isOnline,
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
    resolver: yupResolver(editNameModelSchema),
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
      copy.synced = isOnline;
      appDispatch(userActions.updateUser(copy));

      if (isOnline) {
        appDispatch(userThunkActions.updateUser(copy));
      }
      showMessage({ message: 'Name updated!' });
    }
  };

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      title={'Edit name'}
      displayOffline={!isOnline}
      onBack={() => setEditName(false)}
      onClose={() => setEditName(false)}
    >
      <div className="w-12/12 wrapper-with-sticky-button px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <Typography
              type="h2"
              text="Name"
              color={'textDark'}
              className="mt-4 w-11/12"
            />
          </div>
          <div className="mt-2 flex w-full flex-col justify-center gap-4">
            <FormInput<PractitionerAboutModel>
              label={''}
              visible={true}
              nameProp={'name'}
              className="w-full"
              register={practitionerInfoFormRegister}
              error={!!errors.name ? errors.name : undefined}
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
                setEditName(false);
              }}
            />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};
