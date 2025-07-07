import { FormInput, Button, BannerWrapper, Typography } from '@ecdlink/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditCellPhoneNumberProps } from './next-of-kin.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditNextOfKinModel,
  editNextOfKinSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-next-of-kin';
import { useAppDispatch } from '@store';
import { userActions, userThunkActions } from '@store/user';
import { cloneDeep } from 'lodash';

export const NextOfKin: React.FC<EditCellPhoneNumberProps> = ({
  setAddNextOfKin: setAddNextToKin,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: EditNextOfKinModel = {
        name: user.emergencyContactFirstName || '',
        surname: user.emergencyContactSurname || '',
        cellphone: user.emergencyContactPhoneNumber || '',
      };

      return tempPractitioner;
    } else {
      return initialEditPractitionerValues;
    }
  };

  const {
    getValues: getNextOfKinInfoFormValues,
    register: nextOfKinInfoFormRegister,
    formState: nextOfKinFormState,
  } = useForm({
    resolver: yupResolver(editNextOfKinSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const { isValid, errors } = nextOfKinFormState;

  const savePractitionerUserData = () => {
    const practitionerForm = getNextOfKinInfoFormValues();
    const copy = cloneDeep(user);
    if (copy) {
      copy.emergencyContactFirstName = practitionerForm.name;
      copy.emergencyContactSurname = practitionerForm.surname;
      copy.emergencyContactPhoneNumber = practitionerForm.cellphone;

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
        title={'Add next of kin'}
        backgroundColour={'uiBg'}
        displayOffline={!isOnline}
        onBack={() => setAddNextToKin(false)}
      ></BannerWrapper>
      <div className="w-12/12 wrapper-with-sticky-button px-4">
        <div className="flex w-full justify-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full">
              <Typography
                type="h2"
                text="Next of kin"
                color={'textDark'}
                className="mt-4 w-11/12"
              />
              <Typography
                type="h4"
                text="Add someone who can be contacted in case of an emergency."
                color={'textDark'}
                className="mt-2 w-11/12"
              />
            </div>
            <div className="mt-2 flex w-full flex-col justify-center gap-4">
              <FormInput<EditNextOfKinModel>
                label={'First name'}
                visible={true}
                nameProp={'name'}
                placeholder="First name"
                className="w-full"
                error={errors.name}
                register={nextOfKinInfoFormRegister}
              />
              <FormInput<EditNextOfKinModel>
                label={'Surname'}
                visible={true}
                nameProp={'surname'}
                placeholder="Surname/family name"
                className="w-full"
                register={nextOfKinInfoFormRegister}
              />
              <FormInput<EditNextOfKinModel>
                label={'Cellphone number'}
                visible={true}
                nameProp={'cellphone'}
                placeholder="e.g 012 345 6789"
                className="w-full"
                error={errors.cellphone}
                register={nextOfKinInfoFormRegister}
              />
            </div>
            <div className="mt-4 -mb-4 h-full w-full self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="primary"
                text="Save"
                textColor="white"
                icon="SaveIcon"
                disabled={!isValid}
                onClick={() => {
                  // handleChangePractitionerInfo();
                  savePractitionerUserData();
                  setAddNextToKin(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
