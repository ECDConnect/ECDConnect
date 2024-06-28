import {
  FormInput,
  Button,
  BannerWrapper,
  Typography,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditCellPhoneNUmberProps } from './edit-cellphone-number.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditCellphoneModel,
  editCellphoneNumberSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-cellphone-number';
import { useAppDispatch } from '@store';
import { userActions, userThunkActions } from '@store/user';
import { cloneDeep } from 'lodash';
import { VerifyPhoneNumberAuthCode } from '@/components/user-registration/components/verify-phone-number';
import { AuthService } from '@/services/AuthService';

export const EditCellPhoneNumber: React.FC<EditCellPhoneNUmberProps> = ({
  setEditiCellPhoneNumber,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const [isWhatsappNumber, setIsWhatsappNumber] = useState(true);
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: EditCellphoneModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || undefined,
        email: user.email || undefined,
        whatsapp: user.whatsappNumber || undefined,
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
    setValue: setPractitionerInfoFormValues,
    watch,
    clearErrors,
  } = useForm<EditCellphoneModel>({
    resolver: yupResolver(editCellphoneNumberSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { errors } = useFormState({ control: practitionerInfoFormControl });
  const { whatsapp, cellphone } = watch();
  const [oldUserNumber, setOldUserNumber] = useState('');

  useEffect(() => {
    if (user?.phoneNumber) {
      setOldUserNumber(user?.phoneNumber);
    }
  }, []);

  const handleChangePhoneNumber = async () => {
    setIsLoading(true);
    const practitionerForm = getPractitionerInfoFormValues();
    const copy = cloneDeep(user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email!;
      if (isWhatsappNumber) {
        copy.whatsappNumber = undefined;
      } else {
        copy.whatsappNumber = practitionerForm?.whatsapp;
      }

      // await appDispatch(userActions.updateUser(copy));
      // const updatedUser = await appDispatch(userThunkActions.updateUser(copy));
      // setIsLoading(false);

      const resendAuthCode = await new AuthService().SendOAAuthCode(
        user?.userName!,
        practitionerForm.cellphone!
      );

      if (resendAuthCode) {
        setOpenVerifyPhoneNumber(true);
      }
    }
  };

  const saveNewPractitionerUserData = async () => {
    setIsLoading(true);
    const practitionerForm = getPractitionerInfoFormValues();
    const copy = cloneDeep(user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = cellphone;
      copy.email = practitionerForm.email!;
      if (isWhatsappNumber) {
        copy.whatsappNumber = undefined;
      } else {
        copy.whatsappNumber = practitionerForm?.whatsapp;
      }

      await appDispatch(userActions.updateUser(copy));
      await appDispatch(userThunkActions.updateUser(copy));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.phoneNumber) {
      setPractitionerInfoFormValues('cellphone', user?.phoneNumber);
    }
  }, [setPractitionerInfoFormValues, user?.phoneNumber]);

  const handleCloseEditCellphoneNumber = async () => {
    setEditiCellPhoneNumber(false);
  };

  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        showBackground={false}
        color={'primary'}
        title={'Edit Cellphone Number'}
        backgroundColour={'uiBg'}
        displayOffline={!isOnline}
        onBack={handleCloseEditCellphoneNumber}
        onClose={handleCloseEditCellphoneNumber}
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
                nameProp={'cellphone'}
                placeholder="+27735279059"
                className="w-full"
                register={practitionerInfoFormRegister}
                value={cellphone}
                type={'number'}
                error={!!errors.cellphone ? errors.cellphone : undefined}
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
                isLoading={isLoading}
                disabled={
                  !!Object.keys(errors).length ||
                  !cellphone ||
                  cellphone === user?.phoneNumber
                }
                onClick={() => {
                  handleChangePhoneNumber();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        visible={openVerifyPhoneNumber}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <VerifyPhoneNumberAuthCode
          closeAction={setOpenVerifyPhoneNumber}
          username={user?.userName!}
          handleChangePhoneNumber={handleChangePhoneNumber}
          isFromEditCellPhone={true}
          saveNewPractitionerUserData={saveNewPractitionerUserData}
          setEditiCellPhoneNumber={setEditiCellPhoneNumber}
          phoneNumber={cellphone}
        />
      </Dialog>
    </div>
  );
};
