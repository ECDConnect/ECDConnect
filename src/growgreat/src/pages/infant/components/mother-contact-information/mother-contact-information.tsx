import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  // Divider,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
import { useState } from 'react';
import {
  MotherContactInformationProps,
  yesNoOptions,
} from './mother-contact-information.types';
import {
  MothertContactInformationModel,
  motherContactInformationModelSchema,
} from '@/schemas/infant/mother-contact-information';
export const MotherContactInformation: React.FC<
  MotherContactInformationProps
> = ({ onSubmit, details }) => {
  const {
    getValues: getMotherContactInformationFormValues,
    // formState: motherContactInformationFormState,
    // setValue: setMotherContactInformationFormValue,
    register: motherFormRegister,
    // reset: resetMomContactInformationFormValue,
    control: motherContactInformationControl,
  } = useForm<MothertContactInformationModel>({
    resolver: yupResolver(motherContactInformationModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({
    control: motherContactInformationControl,
  });

  const [hasWhatsapp, setHasWhatsapp] = useState<any>(null);

  return (
    <div className="h-screen w-screen justify-center px-5">
      <Typography
        type="h2"
        color={'textDark'}
        text={`${details?.name}`}
        className="z-50 pt-6"
      />
      <Typography
        type="h4"
        color={'textMid'}
        text={'Contact information'}
        className="z-50"
      />

      <FormInput<MothertContactInformationModel>
        label={'Cellphone number'}
        register={motherFormRegister}
        nameProp={'cellphone'}
        placeholder={'e.g 012 345 6789'}
        type={'number'}
        className="mt-4"
      />
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={`Does ${details?.name} use this cellphone number for WhatsApp?`}
          className="z-50 w-11/12 pt-2"
        />
        <div className="mt-3">
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={(value: boolean | boolean[]) =>
              setHasWhatsapp(value)
            }
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'mt-2 w-full'}
          />
        </div>
      </div>
      {hasWhatsapp === false && (
        <FormInput<MothertContactInformationModel>
          label={`What cellphone number does ${details?.name} use for WhatsApp?`}
          register={motherFormRegister}
          nameProp={'whatsapp'}
          placeholder={'e.g 012 345 6789'}
          type={'number'}
          className="mt-4"
        />
      )}
      <div className={'mt-10 flex h-full w-full justify-center align-bottom'}>
        <Button
          text={`Next`}
          type={'filled'}
          color={'primary'}
          textColor={'white'}
          disabled={!isValid}
          iconPosition={'start'}
          icon={'ArrowCircleRightIcon'}
          className={'absolute bottom-10 mt-2 max-h-10 w-11/12'}
          onClick={() => onSubmit(getMotherContactInformationFormValues())}
        />
      </div>
    </div>
  );
};
