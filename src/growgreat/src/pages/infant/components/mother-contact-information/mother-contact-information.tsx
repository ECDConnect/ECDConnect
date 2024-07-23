import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
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
    setValue: setMotherContactInformationFormValue,
    register: motherFormRegister,
    control: momContactInformationControl,
  } = useForm<MothertContactInformationModel>({
    resolver: yupResolver(motherContactInformationModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { errors, isValid } = useFormState({
    control: momContactInformationControl,
  });

  const [hasWhatsapp, setHasWhatsapp] = useState<any>(null);

  return (
    <>
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={`${details?.name}`}
          className="pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Contact information'}
          className="w-11/12 pt-2"
        />
      </div>
      <div className="flex w-11/12 justify-center text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div>
        <FormInput<MothertContactInformationModel>
          label={'Cellphone number'}
          register={motherFormRegister}
          nameProp={'cellphone'}
          placeholder={'e.g 012 345 6789'}
          type={'number'}
          className="mt-4"
          error={!!errors.cellphone ? errors.cellphone : undefined}
        ></FormInput>
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={`Does ${details?.name} use this cellphone number for WhatsApp?`}
            className="w-11/12 pt-2"
          />
          <div className="mt-2">
            <ButtonGroup<boolean>
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) => {
                setHasWhatsapp(value);
                setMotherContactInformationFormValue('whatsapp', '');
              }}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'mt-2 w-full'}
            />
          </div>
        </div>
        {hasWhatsapp === false && (
          <>
            <FormInput<MothertContactInformationModel>
              label={`What cellphone number does ${details?.name} use for WhatsApp?`}
              register={motherFormRegister}
              nameProp={'whatsapp'}
              placeholder={'e.g 012 345 6789'}
              type={'number'}
              className="mt-4"
              error={!!errors.whatsapp ? errors.whatsapp : undefined}
            ></FormInput>
          </>
        )}
      </div>
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'mt-4 w-full'}
          textColor={'white'}
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getMotherContactInformationFormValues());
          }}
          disabled={!isValid}
        />
      </div>
    </>
  );
};
