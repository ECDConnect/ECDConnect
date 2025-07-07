import { Typography } from '@ecdlink/ui';
import { ColorSwatchIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import FormColorField from '../../../../form-color-field/form-color-field';
import { useEffect, useState } from 'react';
import { lightenColor } from '../../../../../utils/color-utils/color-utils';
import { SetupOrgModel } from '../../../../../schemas/setup-org';

interface StepProps {
  setValue: UseFormSetValue<SetupOrgModel>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  control?: any;
  setDisableButton?: (item: boolean) => void;
}

export const Step4: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  getValues,
  control,
  setDisableButton,
}) => {
  const { primaryColor, secondaryColor, tertiaryColor } = useWatch({ control });
  const [primaryColourError, setPrimaryColourError] = useState('');
  const [secondaryColourError, setSecondaryColourError] = useState('');
  const [tertiaryColourError, setTertiaryColourError] = useState('');
  const hexRegex = /^#[0-9A-F]{6}$/i;
  const errorMessage = 'Only hex values are accept';
  const primaryColourIsValid = hexRegex?.test(primaryColor);
  const primaryColourStartsWithHash = primaryColor?.startsWith('#');
  const secondaryColourIsValid = hexRegex?.test(secondaryColor);
  const secondaryColourStartsWithHash = secondaryColor?.startsWith('#');
  const tertiaryColourIsValid = hexRegex?.test(tertiaryColor);
  const tertiaryColourStartsWithHash = tertiaryColor?.startsWith('#');

  let primaryLighter50 = lightenColor(primaryColor, 50); // 50% lighter
  let primaryLighter20 = lightenColor(primaryColor, 20); // 25% lighter
  let secondaryLighter50 = lightenColor(secondaryColor, 50); // 50% lighter
  let secondaryLighter20 = lightenColor(secondaryColor, 20); // 25% lighter
  let tertiaryLighter50 = lightenColor(tertiaryColor, 50); // 50% lighter
  let tertiaryLighter20 = lightenColor(tertiaryColor, 20); // 25% lighter

  useEffect(() => {
    if (primaryColor) {
      setValue('primaryAccent1', primaryLighter20);
      setValue('primaryAccent2', primaryLighter50);
    }
  }, [primaryColor, primaryLighter20, primaryLighter50, setValue]);
  useEffect(() => {
    if (secondaryColor) {
      setValue('secondaryAccent1', secondaryLighter20);
      setValue('secondaryAccent2', secondaryLighter50);
    }
  }, [secondaryColor, secondaryLighter20, secondaryLighter50, setValue]);

  useEffect(() => {
    if (tertiaryColor) {
      setValue('primaryAccent1', tertiaryLighter20);
      setValue('primaryAccent2', tertiaryLighter50);
    }
  }, [setValue, tertiaryColor, tertiaryLighter20, tertiaryLighter50]);

  useEffect(() => {
    if (primaryColourIsValid && primaryColourStartsWithHash) {
      setPrimaryColourError('');
    } else {
      setPrimaryColourError(errorMessage);
    }
  }, [primaryColourIsValid, primaryColourStartsWithHash]);
  useEffect(() => {
    if (secondaryColourIsValid && secondaryColourStartsWithHash) {
      setSecondaryColourError('');
    } else {
      setSecondaryColourError(errorMessage);
    }
  }, [secondaryColourIsValid, secondaryColourStartsWithHash]);

  useEffect(() => {
    if (tertiaryColourIsValid && tertiaryColourStartsWithHash) {
      setTertiaryColourError('');
    } else {
      setTertiaryColourError(errorMessage);
    }
  }, [tertiaryColourIsValid, tertiaryColourStartsWithHash]);

  useEffect(() => {
    if (primaryColourError || secondaryColourError || tertiaryColourError) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [
    primaryColourError,
    secondaryColourError,
    setDisableButton,
    tertiaryColourError,
  ]);

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
            error={primaryColourError}
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
            error={secondaryColourError}
            isAdminPortalField={true}
          />
        </div>
        <div className="mb-72">
          <Typography type="help" color="textMid" text={`Tertiary`} />
          <FormColorField
            setValue={setValue}
            currentColor={getValues()?.tertiaryColor ?? ''}
            label={''}
            nameProp={'tertiaryColor'}
            register={register}
            error={tertiaryColourError}
            isAdminPortalField={true}
          />
        </div>
      </div>
      {/* <Typography
        type="h4"
        color="textMid"
        text={`Here's an example of what these colours will look like in the app:`}
        className="mt-8"
      />
      <div className="bg-adminPortalBg my-4 flex w-full items-center justify-center rounded-2xl">
        <img src={AppExample} alt="app example" className="h-2/12 w-48" />
      </div> */}
    </div>
  );
};
