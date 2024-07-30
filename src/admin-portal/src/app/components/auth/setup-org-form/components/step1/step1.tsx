import { FormInput, Typography } from '@ecdlink/ui';
import { OfficeBuildingIcon } from '@heroicons/react/solid';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export const Step1: React.FC<StepProps> = ({ setValue, register, errors }) => {
  return (
    <div>
      <div className="my-12 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <OfficeBuildingIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Great, let's get started! Please add a few details about your organisation.`}
        />
      </div>
      <div className="flex w-full flex-col gap-6">
        <FormInput<SetupOrgModel>
          label={'Organisation name *'}
          visible={true}
          nameProp={'orgName'}
          register={register}
          error={errors['orgName']}
          placeholder={'Organisation name'}
          className="w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={'Rename the app *'}
          subLabel={`Optional. Enter a catchy name for your app. This name will be seen by all your app users, including principals and practitioners.`}
          visible={true}
          nameProp={'catchyName'}
          register={register}
          error={errors['idField']}
          placeholder={'ECD Connect'}
          className="w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={
            'Which email address can your users send support requests to? *'
          }
          subLabel={`You can update this email address on the admin portal at any time.`}
          visible={true}
          nameProp={'orgEmail'}
          register={register}
          error={errors['orgEmail']}
          placeholder={'ECD Connect'}
          className="w-full"
          isAdminPortalField={true}
        />
      </div>
    </div>
  );
};
