import {
  FormInput,
  Button,
  BannerWrapper,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { useEffect, useLayoutEffect, useState } from 'react';
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
import { userActions, userThunkActions } from '@/store/user';
import {
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from '@/store/healthCareWorker';
import { useSelector } from 'react-redux';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';
import { UserActions } from '@/store/user/user.actions';
import { useSnackbar } from '@ecdlink/core';

export const EditCellPhoneNumber: React.FC<EditCellPhoneNUmberProps> = ({
  setEditiCellPhoneNumber,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const [isWhatsappNumber, setIsWhatsappNumber] = useState<boolean>();

  const hcw = useSelector(healthCareWorkerSelectors.getHealthCareWorker);

  const { showMessage } = useSnackbar();

  const {
    isLoading: isLoadingContactInfo,
    wasLoading: wasLoadingContactInfo,
    isRejected: isRejectedContactInfo,
    error: errorContactInfo,
  } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE
  );
  const {
    isLoading: isUpdatingUser,
    wasLoading: wasUpdatingUser,
    isRejected: isRejectedUpdateUser,
    error: errorUpdateUser,
  } = useThunkFetchCall('user', UserActions.UPDATE_USER);

  const isLoading = isLoadingContactInfo || isUpdatingUser;
  const wasLoading = wasLoadingContactInfo || wasUpdatingUser;
  const isRejected = isRejectedContactInfo || isRejectedUpdateUser;
  const error = errorContactInfo || errorUpdateUser;

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error,
          type: 'error',
        });
      } else {
        setEditiCellPhoneNumber(false);
      }
    }
  }, [
    error,
    isLoading,
    isRejected,
    setEditiCellPhoneNumber,
    showMessage,
    wasLoading,
  ]);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: EditCellphoneModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
        whatsapp: user?.whatsappNumber || '',
        shareContactInfo: hcw?.shareContactInfo ?? undefined,
      };
      return tempPractitioner;
    } else {
      return initialEditPractitionerValues;
    }
  };

  const {
    getValues: getPractitionerInfoFormValues,
    setValue: setPractitionerInfoFormValue,
    register: practitionerInfoFormRegister,
    control: practitionerInfoFormControl,
    formState: practitionerInfoFormState,
  } = useForm({
    resolver: yupResolver(editCelphoneNumberSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const { errors } = practitionerInfoFormState;

  const { shareContactInfo } = useWatch({
    control: practitionerInfoFormControl,
  });

  const practitionerForm = getPractitionerInfoFormValues();

  const hasCellphone = !!practitionerForm?.cellphone;
  const hasValidShareContactInfo = typeof shareContactInfo === 'boolean';
  const hasCellphoneError = !!errors?.cellphone;
  const hasWhatsappError = isWhatsappNumber === false && !!errors?.whatsapp;

  const isDisabled =
    isLoading ||
    !hasCellphone ||
    !hasValidShareContactInfo ||
    hasCellphoneError ||
    hasWhatsappError;

  const savePractitionerUserData = async () => {
    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email;
      if (isWhatsappNumber !== undefined) {
        copy.whatsappNumber = isWhatsappNumber
          ? practitionerForm.cellphone
          : practitionerForm?.whatsapp;
      }

      appDispatch(userActions.updateUser(copy));
      const promises = [
        appDispatch(userThunkActions.updateUser(copy)),
        appDispatch(
          healthCareWorkerThunkActions.updateHealthCareWorkerWelcomeMessage({
            healthCareWorkerId: hcw?.id!,
            welcomeMessage: hcw?.welcomeMessage || '',
            shareContactInfo: shareContactInfo as boolean,
          })
        ),
      ];

      await Promise.all(promises);
    }

    if (!isOnline) {
      setEditiCellPhoneNumber(false);
    }
  };

  useLayoutEffect(() => {
    if (isWhatsappNumber === undefined && user?.whatsappNumber) {
      setIsWhatsappNumber(
        user?.phoneNumber?.includes(user?.whatsappNumber || '')
      );
    }
  }, [isWhatsappNumber, user?.phoneNumber, user?.whatsappNumber]);

  return (
    <BannerWrapper
      size="normal"
      renderBorder
      showBackground={false}
      color="primary"
      title="Edit cellphone number"
      displayOffline={!isOnline}
      onBack={() => setEditiCellPhoneNumber(false)}
      className="flex flex-col p-4 pt-6"
    >
      <Typography
        type="h2"
        text="Cellphone number"
        color="textDark"
        className="mb-4"
      />
      <FormInput<EditCellphoneModel>
        label="Cellphone number"
        visible
        nameProp="cellphone"
        placeholder="073 527 9059"
        className="mb-4"
        register={practitionerInfoFormRegister}
        error={errors?.cellphone}
      />
      <Typography
        type="h4"
        color="textDark"
        text="Do you use this cellphone number for WhatsApp?"
      />
      <Typography type="help" color="textMid" text="Optional" />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        selectedOptions={isWhatsappNumber}
        onOptionSelected={(value: boolean | boolean[]) => {
          setIsWhatsappNumber(value as boolean);
        }}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4 mt-2"
      />
      {isWhatsappNumber === false && (
        <FormInput<EditCellphoneModel>
          label="What phone number do you use for WhatsApp?"
          hint="Optional. Leave blank if you do not use WhatsApp."
          placeholder="073 527 9059"
          visible
          nameProp="whatsapp"
          className="mb-4"
          register={practitionerInfoFormRegister}
          error={errors?.whatsapp}
        />
      )}
      <Typography
        type="h4"
        color="textDark"
        text="Would you like to share your phone & WhatsApp number with your team?"
      />
      <ButtonGroup<boolean>
        options={yesNoOptions}
        selectedOptions={shareContactInfo}
        onOptionSelected={(value: boolean | boolean[]) => {
          setPractitionerInfoFormValue('shareContactInfo', value as boolean);
        }}
        color="secondary"
        type={ButtonGroupTypes.Button}
        className="mb-4 mt-2"
      />
      <div className="mt-auto">
        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          isLoading={isLoading}
          disabled={isDisabled}
          onClick={savePractitionerUserData}
        />
      </div>
    </BannerWrapper>
  );
};
