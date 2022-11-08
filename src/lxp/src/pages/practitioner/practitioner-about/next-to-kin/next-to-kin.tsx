import {
  FormInput,
  Button,
  BannerWrapper,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditCellPhoneNUmberProps } from './next-to-kin.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditCellphoneModel,
  editCelphoneNumberSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-cellphone-number';
import { useAppDispatch } from '@store';
import { useHistory } from 'react-router-dom';
import { userActions, userThunkActions } from '@store/user';

export const NextToKin: React.FC<EditCellPhoneNUmberProps> = ({
  setAddNextToKin,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: EditCellphoneModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
        whatsapp: user?.whatsappNumber || '',
      };
      return tempPractitioner;
    } else {
      return initialEditPractitionerValues;
    }
  };

  const {
    getValues: getNextOfKinInfoFormValues,
    register: nextOfKinInfoFormRegister,
    control: practitionerInfoFormControl,
  } = useForm({
    resolver: yupResolver(editCelphoneNumberSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const { whatsapp } = useWatch({
    control: practitionerInfoFormControl,
  });

  const savePractitionerUserData = () => {
    const practitionerForm = getNextOfKinInfoFormValues();
    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email;
      if (whatsapp) {
        copy.whatsappNumber = practitionerForm?.whatsapp;
      }
      console.log({ copy });
      //   appDispatch(userActions.updateUser(copy));
      //   appDispatch(userThunkActions.updateUser(copy));
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
        onBack={() => history.goBack()}
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
              <FormInput<EditCellphoneModel>
                label={'First name'}
                visible={true}
                nameProp={'cellphone'}
                placeholder="First name"
                className="w-full"
                register={nextOfKinInfoFormRegister}
              />
              <FormInput<EditCellphoneModel>
                label={'Surname'}
                visible={true}
                nameProp={'cellphone'}
                placeholder="Surname/family name"
                className="w-full"
                register={nextOfKinInfoFormRegister}
              />
              <FormInput<EditCellphoneModel>
                label={'Cellphone number'}
                visible={true}
                nameProp={'cellphone'}
                placeholder="e.g 012 345 6789"
                className="w-full"
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
