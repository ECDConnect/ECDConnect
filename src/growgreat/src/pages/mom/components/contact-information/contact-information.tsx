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
  EditPregnantContactInformationProps,
  yesNoOptions,
} from './contact-information.types';
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
    // reset: resetMomContactInformationFormValue,
    control: momContactInformationControl,
  } = useForm<PregnantContactInformationModel>({
    resolver: yupResolver(pregnantContactInformationModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({ control: momContactInformationControl });

  const [hasWhatsapp, setHasWhatsapp] = useState<any>(null);

  return (
    <div className="h-screen ">
      <div>
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
          className="z-50 pt-2 w-11/12"
        />
      </div>
      <div className="flex justify-center w-11/12 text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div>
        <FormInput<PregnantContactInformationModel>
          label={'Cellphone number'}
          register={consentFormRegister}
          nameProp={'cellphone'}
          placeholder={'e.g 012 345 6789'}
          type={'number'}
          className="mt-4"
        ></FormInput>
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={'Does Lethabo use this cellphone number for WhatsApp?'}
            className="z-50 pt-2 w-11/12"
          />
          <div className="mt-2">
            <ButtonGroup<boolean>
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) =>
                setHasWhatsapp(value)
              }
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full mt-2'}
            />
          </div>
        </div>
        {hasWhatsapp === false && (
          <>
            <FormInput<PregnantContactInformationModel>
              label={'What cellphone number does Lethabo use for WhatsApp?'}
              register={consentFormRegister}
              nameProp={'whatsapp'}
              placeholder={'e.g 012 345 6789'}
              type={'number'}
              className="mt-4"
            ></FormInput>
          </>
        )}
      </div>
      <div className="flex w-full h-full align-bottom">
        <div className={'mt-10 w-11/12 flex justify-center align-bottom'}>
          <Button
            type={'filled'}
            color={'primary'}
            className={'mt-2 ml-6 w-11/12 max-h-10 absolute bottom-10'}
            textColor={'white'}
            text={`Next`}
            icon={'ArrowCircleRightIcon'}
            iconPosition={'start'}
            onClick={() => {
              onSubmit(getMomContactInformationFormValues());
            }}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
};
