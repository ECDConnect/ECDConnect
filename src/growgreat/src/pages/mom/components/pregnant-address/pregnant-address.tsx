import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Typography,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
import {
  PregnantAddressProps,
  useMapOrAddressOptions,
} from './pregnant-address.types';
import {
  pregnantAddressModelSchema,
  PregnantAddressModel,
} from '@/schemas/pregnant/pregnant-address';

export const PregnantAddress: React.FC<PregnantAddressProps> = ({
  onSubmit,
  details,
}) => {
  const {
    // watch,
    getValues: getPregnantAddressFormValues,
    // formState: pregnantAddressFormState,
    // setValue: setPregnantAddressFormValue,
    register: pregnantAddressFormRegister,
    // reset: resetPregnantAddressFormValue,
    control: momContactInformationControl,
  } = useForm<PregnantAddressModel>({
    resolver: yupResolver(pregnantAddressModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({ control: momContactInformationControl });

  const [useMap, setUseMap] = useState(false);
  //   const handleConsentAccept = () => {
  //     setConsentFormValue('hasConsent', !accept);
  //   };

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
        text={'Address'}
        className="z-50 w-11/12 pt-2"
      />
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={`Add ${details?.name}'s address`}
          className="z-50 w-11/12 pt-2"
        />
        <div className="mt-2">
          <ButtonGroup<boolean>
            color="secondary"
            selectedOptions={useMap}
            className={'mt-2 w-full'}
            type={ButtonGroupTypes.Button}
            options={useMapOrAddressOptions}
            onOptionSelected={(value: boolean | boolean[]) =>
              setUseMap(value as boolean)
            }
          />
        </div>
      </div>

      <Alert
        type={'info'}
        className="mt-4 flex w-full flex-col justify-center"
        // title="Each child is unique!"
        message={`If you are at ${details?.name}'s house now, you can use your phone's GPS to save the address.`}
      />

      {useMap === false && (
        <FormInput<PregnantAddressModel>
          label={'Add address'}
          register={pregnantAddressFormRegister}
          nameProp={'address'}
          placeholder={'e.g 012 345 6789'}
          type={'text'}
          className="mt-4"
          textInputType="textarea"
        />
      )}
      <div className="flex h-full w-full align-bottom">
        {/* <div className={'mt-10 ml-2 flex w-full justify-center align-bottom'}> */}
        <Button
          type={'filled'}
          color={'primary'}
          className={'absolute bottom-10 m-auto mt-2 max-h-10 w-11/12'}
          textColor={'white'}
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getPregnantAddressFormValues());
          }}
          disabled={!isValid}
        />
        {/* </div> */}
      </div>
    </div>
  );
};
