import {
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ChatIcon } from '@heroicons/react/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';

interface StepProps {
  setValue: UseFormSetValue<SetupOrgModel>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<SetupOrgModel>;
  setDisableButton?: (item: boolean) => void;
  control?: any;
}

const optionsButtonGroup = [
  { text: 'BulkSMS', value: 'BulkSMS' },
  { text: 'iTouch', value: 'iTouch' },
  { text: 'SMSPortal', value: 'SMSPortal' },
];

export const SmsProviders = {
  BulkSMS: 'BulkSMS',
  iTouch: 'iTouch',
  SMSPortal: 'SMSPortal',
};

export const Step5: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  getValues,
  setDisableButton,
  control,
}) => {
  const [smsProviderName, setSmsProvider] = useState('');

  const {
    tokenId,
    tokenSecret,
    tokenBasicAuth,
    tokenUserName,
    tokenPassword,
    apiKey,
    apiSecret,
    smsProvider,
  } = useWatch({
    control,
  });

  useEffect(() => {
    if (getValues()?.smsProvider) {
      setSmsProvider(getValues()?.smsProvider);
    }
  }, [getValues]);

  useEffect(() => {
    if (!smsProviderName) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    if (smsProvider === SmsProviders.BulkSMS) {
      if (!tokenId || !tokenSecret || !tokenBasicAuth) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }

    if (smsProvider === SmsProviders.iTouch) {
      if (!tokenUserName || !tokenPassword) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }

    if (smsProvider === SmsProviders.SMSPortal) {
      if (!apiKey || !apiSecret) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    }
  }, [
    apiKey,
    apiSecret,
    setDisableButton,
    smsProvider,
    smsProviderName,
    tokenBasicAuth,
    tokenId,
    tokenPassword,
    tokenSecret,
    tokenUserName,
  ]);

  const renderSmsFields = useMemo(() => {
    if (smsProviderName === SmsProviders.BulkSMS) {
      return (
        <div className="flex w-full flex-col gap-6">
          <FormInput<SetupOrgModel>
            label={'BulkSMS - Token ID *'}
            visible={true}
            nameProp={'tokenId'}
            register={register}
            error={errors['tokenId']}
            placeholder={'Token ID'}
            className="w-full"
            isAdminPortalField={true}
            value={tokenId}
          />
          <FormInput<SetupOrgModel>
            label={'BulkSMS - Token Secret *'}
            visible={true}
            nameProp={'tokenSecret'}
            register={register}
            error={errors['tokenSecret']}
            placeholder={'Token Secret'}
            className="w-full"
            isAdminPortalField={true}
            value={tokenSecret}
          />
          <FormInput<SetupOrgModel>
            label={'BulkSMS - Token Basic Auth *'}
            visible={true}
            nameProp={'tokenBasicAuth'}
            register={register}
            error={errors['tokenBasicAuth']}
            placeholder={'Token Basic Auth'}
            className="w-full"
            isAdminPortalField={true}
            value={tokenBasicAuth}
          />
        </div>
      );
    }
    if (smsProviderName === SmsProviders.iTouch) {
      return (
        <div className="flex w-full flex-col gap-6">
          <FormInput<SetupOrgModel>
            label={'iTouch - Username *'}
            visible={true}
            nameProp={'tokenUserName'}
            register={register}
            error={errors['tokenUserName']}
            placeholder={'Username'}
            className="w-full"
            isAdminPortalField={true}
            value={tokenUserName}
          />
          <FormInput<SetupOrgModel>
            label={'iTouch - Password *'}
            visible={true}
            nameProp={'tokenPassword'}
            register={register}
            error={errors['tokenPassword']}
            placeholder={'Password'}
            className="w-full"
            isAdminPortalField={true}
            value={tokenPassword}
          />
        </div>
      );
    }
    if (smsProviderName === SmsProviders.SMSPortal) {
      return (
        <div className="flex w-full flex-col gap-6">
          <FormInput<SetupOrgModel>
            label={'SMSPortal - API Key *'}
            visible={true}
            nameProp={'apiKey'}
            register={register}
            error={errors['apiKey']}
            placeholder={'API Key'}
            className="w-full"
            isAdminPortalField={true}
            value={apiKey}
          />
          <FormInput<SetupOrgModel>
            label={'SMSPortal - API Secret *'}
            visible={true}
            nameProp={'apiSecret'}
            register={register}
            error={errors['apiSecret']}
            placeholder={'API Secret'}
            className="w-full"
            isAdminPortalField={true}
            value={apiSecret}
          />
        </div>
      );
    }
  }, [
    apiKey,
    apiSecret,
    errors,
    register,
    smsProviderName,
    tokenBasicAuth,
    tokenId,
    tokenPassword,
    tokenSecret,
    tokenUserName,
  ]);

  const handleChangeSmsProvider = useCallback(
    (value: string) => {
      setValue('smsProvider', value);
      setSmsProvider(value as string);
      setValue('tokenId', '');
      setValue('tokenSecret', '');
      setValue('tokenBasicAuth', '');
      setValue('tokenUserName', '');
      setValue('tokenPassword', '');
      setValue('apiKey', '');
      setValue('apiSecret', '');
    },
    [setValue]
  );

  return (
    <div>
      <div className="mt-12 mb-2 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <ChatIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Add your SMS provider details`}
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`You will need to have an account (with credit!) with one of the bulk SMS service providers below so that unique welcome invitations can be sent via SMS to users in your network.`}
      />
      <div className="my-8">
        <Typography
          type="body"
          text={`Which SMS provider have you set up for OrgName? *`}
          className="mb-1"
        />
        <div>
          <ButtonGroup<string>
            color="tertiary"
            textColor="tertiary"
            notSelectedColor="tertiaryAccent2"
            type={ButtonGroupTypes.Button}
            options={optionsButtonGroup}
            onOptionSelected={(value) => {
              handleChangeSmsProvider(value as string);
            }}
            selectedOptions={smsProviderName}
          />
        </div>
      </div>
      <div>{renderSmsFields}</div>
    </div>
  );
};
