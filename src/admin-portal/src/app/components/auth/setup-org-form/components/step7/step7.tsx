import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { ViewGridAddIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';
import { useEffect } from 'react';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  control?: any;
  setDisableButton?: (item: boolean) => void;
}

export const Step7: React.FC<StepProps> = ({
  register,
  setValue,
  errors,
  getValues,
  control,
  setDisableButton,
}) => {
  const {
    superAdmin1FirstName,
    superAdmin1Surname,
    superAdmin1Email,
    superAdmin2FirstName,
    superAdmin2Surname,
    superAdmin2Email,
  } = useWatch({
    control: control,
  });
  const disableButton =
    !superAdmin1FirstName ||
    !superAdmin1Surname ||
    !superAdmin1Email ||
    !superAdmin2FirstName ||
    !superAdmin2Surname ||
    !superAdmin2Email;

  useEffect(() => {
    setDisableButton(disableButton);
  }, [disableButton, setDisableButton]);

  return (
    <div>
      <div className="mt-12 mb-4 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <ViewGridAddIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Which parts of the app would you like to use?`}
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`ECD Connect has been built in a modular way to support a broad range of ECD service providers. You are able to select which app features you want your users to have access to.`}
      />
      <Alert
        className="my-6 rounded-md"
        title={`Choose the super-administrator carefully. You will not be able to change this detail later without writing to us to make a special request, which may incur costs.`}
        type="warning"
      />
      <div className="mt-8">
        <Typography type="h2" color="textDark" text={`Super-administrator 1`} />
        <FormInput<SetupOrgModel>
          label={'Super-administrator first name *'}
          visible={true}
          nameProp={'superAdmin1FirstName'}
          register={register}
          error={errors['superAdmin1FirstName']}
          placeholder={'Add first name'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={'Super-administrator surname *'}
          visible={true}
          nameProp={'superAdmin1Surname'}
          register={register}
          error={errors['superAdmin1Surname']}
          placeholder={'Add surname'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={'Super-administrator email address *'}
          visible={true}
          nameProp={'superAdmin1Email'}
          register={register}
          error={errors['superAdmin1Email']}
          placeholder={'Add email address'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
      </div>
      <div className="mt-8">
        <Typography type="h2" color="textDark" text={`Super-administrator 2`} />
        <FormInput<SetupOrgModel>
          label={'Super-administrator first name *'}
          visible={true}
          nameProp={'superAdmin2FirstName'}
          register={register}
          error={errors['superAdmin2FirstName']}
          placeholder={'Add first name'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={'Super-administrator surname *'}
          visible={true}
          nameProp={'superAdmin2Surname'}
          register={register}
          error={errors['superAdmin2Surname']}
          placeholder={'Add surname'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
        <FormInput<SetupOrgModel>
          label={'Super-administrator email address *'}
          visible={true}
          nameProp={'superAdmin2Email'}
          register={register}
          error={errors['superAdmin2Email']}
          placeholder={'Add email address'}
          className="my-4 w-full"
          isAdminPortalField={true}
        />
      </div>
    </div>
  );
};
