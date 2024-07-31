import { Typography } from '@ecdlink/ui';
import { ColorSwatchIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import FormColorField from '../../../../form-color-field/form-color-field';
import AppExample from '../../../../../../assets/app_example.png';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
}

export const Step4: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  getValues,
}) => {
  return (
    <div>
      <div className="mt-12 mb-2 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <ColorSwatchIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Add your organisation’s colours`}
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`Choose your organisation's primary, secondary, and tertiary colours. You will be able to update these on the admin portal in future.`}
      />
      <div className="mt-8 grid grid-cols-3 gap-8">
        <div>
          <Typography type="help" color="textMid" text={`Primary`} />
          <FormColorField
            setValue={setValue}
            currentColor={getValues()?.primaryColor ?? ''}
            label={''}
            nameProp={'primaryColor'}
            register={register}
            error={''}
            isAdminPortalField={true}
          />
        </div>
        <div>
          <Typography type="help" color="textMid" text={`Secondary`} />
          <FormColorField
            setValue={setValue}
            currentColor={getValues()?.secondaryColor ?? ''}
            label={''}
            nameProp={'secondaryColor'}
            register={register}
            error={''}
            isAdminPortalField={true}
          />
        </div>
        <div>
          <Typography type="help" color="textMid" text={`Tertiary`} />
          <FormColorField
            setValue={setValue}
            currentColor={getValues()?.tertiaryColor ?? ''}
            label={''}
            nameProp={'tertiaryColor'}
            register={register}
            error={''}
            isAdminPortalField={true}
          />
        </div>
      </div>
      <Typography
        type="h4"
        color="textMid"
        text={`Here’s an example of what these colours will look like in the app:`}
        className="mt-8"
      />
      <div className="bg-adminPortalBg my-4 flex w-full items-center justify-center rounded-2xl">
        <img src={AppExample} alt="app example" className="h-2/12 w-48" />
      </div>
    </div>
  );
};
