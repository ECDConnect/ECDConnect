import { Alert, Button, FormInput, Typography } from '@ecdlink/ui';
import { LinkIcon } from '@heroicons/react/solid';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export const Step2: React.FC<StepProps> = ({ register, errors }) => {
  return (
    <div>
      <div className="my-12 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <LinkIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Great, let's get started! Please add a few details about your organisation.`}
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
          error={errors['appUrl']}
          placeholder={'MyApp'}
          className="w-4/12"
          isAdminPortalField={true}
        />
        <Typography
          type="body"
          color="textMid"
          text={`.ecdconnect.co.za`}
          className="mt-16"
        />
      </div>
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
