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
import { useEffect, useState } from 'react';

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
  const checkUrl = urlRegex.test(getValues()?.appUrl);
  const defaultUrl = `${getValues()?.catchyName.replace(/\s/g, '-')}-connect`;
  const { appUrl } = useWatch({ control });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hyphenRegex = /^-|-$/;

  useEffect(() => {
    if (getValues().catchyName) {
      setValue('appUrl', defaultUrl);
    }
  }, [defaultUrl, getValues, setValue]);

  useEffect(() => {
    if (urlError || !appUrl) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [appUrl, setDisableButton, urlError]);

  useEffect(() => {
    if (hyphenRegex.test(getValues()?.appUrl)) {
      setUrlError(
        'Oops! The URL cannot end with a hyphen. Please update the URL.'
      );
    }
    if (!checkUrl) {
      setUrlError('Only hyphens are allowed as special characters!');
    }
  }, [checkUrl, getValues, hyphenRegex]);

  //TODO: Add check url name integration
  // console.log(/^[aA-zZ0-9-]+$/g.test(getValues()?.appUrl));

  // const [checkUrlQuery, { data: urlCheck, loading: checkUrlLoading }] =
  //   useLazyQuery(verifyUrl, {
  //     variables: {
  //       applicationName: '',
  //     },
  //     fetchPolicy: 'network-only',
  //   });

  // console.log({ urlCheck });

  // const handleCheckUrl = useCallback(() => {
  //   checkUrlQuery({
  //     variables: {
  //       applicationName: getValues().appUrl,
  //     },
  //   });
  // }, [checkUrlQuery, getValues]);

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
          nameProp={'appUrl'}
          register={register}
          error={urlError as unknown as FieldError}
          placeholder={'MyApp'}
          className="w-4/12"
          isAdminPortalField={true}
          maxCharacters={30}
          maxLength={30}
          value={getValues()?.appUrl}
          onChange={(e) => {
            setUrlError('');
            setValue('appUrl', e?.target?.value?.replace(/[^a-zA-Z0-9-]/g, ''));
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
      <Button
        className={'mt-6 rounded-xl px-2'}
        type="outlined"
        color="tertiary"
        onClick={() => {}}
        icon="SearchIcon"
        textColor="tertiary"
        text="Check if available"
      ></Button>
    </div>
  );
};
