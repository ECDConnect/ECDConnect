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
import {
  EditCellPhoneNUmberProps,
  yesNoOptions,
} from './edit-cellphone-number.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditCellphoneModel,
  editCelphoneNumberSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-cellphone-number';
import { useAppDispatch } from '@store';
import { useHistory } from 'react-router-dom';
import { userActions, userThunkActions } from '@store/user';

export const EditCellPhoneNumber: React.FC<EditCellPhoneNUmberProps> = ({
  setEditiCellPhoneNumber,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [isWhatsappNumber, setIsWhatsappNumber] = useState(true);

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
    getValues: getPractitionerInfoFormValues,
    register: practitionerInfoFormRegister,
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
    const practitionerForm = getPractitionerInfoFormValues();
    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email;
      if (whatsapp) {
        copy.whatsappNumber = practitionerForm?.whatsapp;
      }

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
        title={'Edit cellphone number'}
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
                text="Cellphone number"
                color={'textDark'}
                className="mt-4 w-11/12"
              />
            </div>
            <div className="mt-2 flex w-full flex-col justify-center gap-4">
              <FormInput<EditCellphoneModel>
                label={'Cellphone number'}
                visible={true}
                nameProp={'cellphone'}
                placeholder="073 527 9059"
                className="w-full"
                register={practitionerInfoFormRegister}
              />
              <div className="mt-4 w-11/12">
                <Typography
                  type="h4"
                  color={'textMid'}
                  text={'Do you use this cellphone number for WhatsApp?'}
                  className="z-50 w-11/12 pt-2"
                />
              </div>
              <div>
                <ButtonGroup<boolean>
                  options={yesNoOptions}
                  onOptionSelected={(value: boolean | boolean[]) => {
                    setIsWhatsappNumber(value as boolean);
                  }}
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  className={'w-full'}
                  // selectedOptions={multipleChildren}
                />
              </div>
              {!isWhatsappNumber && (
                <FormInput<EditCellphoneModel>
                  label={'What phone number do you use for WhatsApp?'}
                  hint={'Optional. Leave blank if you do not use WhatsApp.'}
                  placeholder="073 527 9059"
                  visible={true}
                  nameProp={'whatsapp'}
                  className="w-full"
                  register={practitionerInfoFormRegister}
                />
              )}
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
                  setEditiCellPhoneNumber(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
