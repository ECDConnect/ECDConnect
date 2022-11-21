import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
} from '@ecdlink/ui';

import {
  EditPregnantContactInformationProps,
  yesNoOptions,
} from '@/pages/mom/components/contact-information/contact-information.types';

import {
  pregnantContactInformationModelSchema,
  PregnantContactInformationModel,
} from '@/schemas/pregnant/pregnant-contact-information';

export const ContactInformation: React.FC<
  EditPregnantContactInformationProps
> = ({ onSubmit, details }) => {
  const {
    getValues: getMomContactInformationFormValues,
    // formState: momContactInformationFormState,
    // setValue: setMomContactInformationFormValue,
    register: consentFormRegister,
    control: momContactInformationControl,
    // reset: resetMomContactInformationFormValue,
  } = useForm<PregnantContactInformationModel>({
    resolver: yupResolver(pregnantContactInformationModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    // defaultValues: playgroup,
  });

  const { isValid } = useFormState({ control: momContactInformationControl });

  const [hasWhatsapp, setHasWhatsapp] = useState<boolean | boolean[]>();

  return (
    <div className="h-screen h-full w-screen w-full px-4">
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
        className="z-50 w-11/12 pt-2"
      />
      <FormInput<PregnantContactInformationModel>
        type={'number'}
        className="my-4"
        nameProp={'cellphone'}
        label={'Cellphone number'}
        register={consentFormRegister}
        placeholder={'e.g 012 345 6789'}
      />
      <Typography
        type="h4"
        color={'textMid'}
        className="z-50 w-11/12 py-2"
        text={`Does ${details?.name} use this cellphone number for WhatsApp?`}
      />
      <ButtonGroup<boolean>
        color="secondary"
        options={yesNoOptions}
        className={'mt-2 w-full'}
        type={ButtonGroupTypes.Button}
        onOptionSelected={(value: boolean | boolean[]) => setHasWhatsapp(value)}
      />
      {hasWhatsapp === false && (
        <FormInput<PregnantContactInformationModel>
          placeholder={'e.g 012 345 6789'}
          className="mt-4"
          type={'number'}
          nameProp={'whatsapp'}
          register={consentFormRegister}
          label="What cellphone number does Lethabo use for WhatsApp?"
        />
      )}
      <div className="flex h-full w-full align-bottom">
        <div className={'mt-10 flex justify-center align-bottom'}>
          <Button
            text={`Next`}
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            disabled={!isValid}
            iconPosition={'start'}
            icon={'ArrowCircleRightIcon'}
            className={
              'absolute left-0 right-0 bottom-10 m-auto mt-2 max-h-10 w-11/12'
            }
            onClick={() => onSubmit(getMomContactInformationFormValues())}
          />
        </div>
      </div>
    </div>
  );
};
