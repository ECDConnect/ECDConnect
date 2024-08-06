import { Alert, Button, FormInput, Typography } from '@ecdlink/ui';
import { LinkIcon } from '@heroicons/react/solid';
import {
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';
import { useCallback, useEffect, useState } from 'react';
import { ValidateNewTenant } from '../../../../../services/auth.service';
import { Config } from '@ecdlink/core';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setDisableButton?: (item: boolean) => void;
  getValues?: UseFormGetValues<SetupOrgModel>;
  control?: any;
}

export const Step2: React.FC<StepProps> = ({
  register,
  errors,
  setDisableButton,
  getValues,
  setValue,
  control,
}) => {
  const [urlError, setUrlError] = useState('');
  const urlRegex = /^[a-zA-Z0-9-]*$/;
  const checkUrl = urlRegex.test(getValues()?.applicationUrl);
  const defaultUrl = `${getValues()
    ?.applicationName?.toLocaleLowerCase()
    .replace(/\s/g, '-')}-connect`;
  const { applicationUrl } = useWatch({ control });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hyphenRegex = /^-|-$/;
  const [isURLAvailable, setIsURLAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleCheckUrl();
  }, []);

  useEffect(() => {
    if (getValues()?.applicationName && !getValues()?.applicationUrl) {
      setValue('applicationUrl', defaultUrl);
    }
  }, [defaultUrl, getValues, setValue]);

  useEffect(() => {
    if (urlError || !applicationUrl) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [applicationUrl, setDisableButton, urlError]);

  useEffect(() => {
    if (hyphenRegex.test(getValues()?.applicationUrl)) {
      setUrlError(
        'Oops! The URL cannot end with a hyphen. Please update the URL.'
      );
    }
    if (!checkUrl) {
      setUrlError('Only hyphens are allowed as special characters!');
    }
  }, [checkUrl, getValues, hyphenRegex]);

  const handleCheckUrl = useCallback(async () => {
    setIsLoading(true);
    const isValidURL = await ValidateNewTenant(
      Config.authApi,
      getValues()?.applicationUrl
    );

    if (isValidURL === false) {
      setUrlError('Sorry this name is taken! Please try a different name.');
    } else {
      setIsURLAvailable(true);
      setDisableButton(false);
    }
    setIsLoading(false);
  }, [getValues, setDisableButton]);

  return (
    <div>
      <div className="mt-12 mb-2 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <LinkIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Choose an app URL`}
          className="mb-2"
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`This is the link your AppName users will go to when using the app. Once you've finished the setup process, we'll reach out to you to finalise the URL.`}
      />
      <Alert
        className="my-6 rounded-md"
        title={`We've added a suggestion to get you started!`}
        type="info"
      />
      <div className="flex gap-0.5">
        <FormInput<SetupOrgModel>
          label={'App url *'}
          subLabel="The URL must be unique"
          visible={true}
          nameProp={'applicationUrl'}
          register={register}
          error={urlError as unknown as FieldError}
          placeholder={'MyApp'}
          className="w-4/12"
          isAdminPortalField={true}
          maxCharacters={30}
          maxLength={30}
          value={applicationUrl}
          onChange={(e) => {
            setUrlError('');
            setIsURLAvailable(false);
            setDisableButton(true);
            setValue(
              'applicationUrl',
              e?.target?.value?.replace(/[^a-zA-Z0-9-]/g, '')
            );
          }}
        />
        <Typography
          type="body"
          color="textMid"
          text={`.ecdconnect.co.za`}
          className="mt-16"
        />
      </div>
      {urlError && <Typography type="help" color="errorMain" text={urlError} />}
      {isURLAvailable && (
        <Alert
          title={`${applicationUrl}  is available!`}
          type={'success'}
          className="my-4"
        />
      )}
      <Button
        className={'mt-6 rounded-xl px-2'}
        type="outlined"
        color="tertiary"
        onClick={() => handleCheckUrl()}
        icon="SearchIcon"
        textColor="tertiary"
        text="Check if available"
        disabled={isLoading}
        isLoading={isLoading}
      ></Button>
    </div>
  );
};
