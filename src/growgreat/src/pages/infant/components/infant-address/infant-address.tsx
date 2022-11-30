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
import { useState } from 'react';
import {
  InfantAddressProps,
  useMapOrAddressOptions,
} from './infant-address.types';
import {
  InfantAddressModel,
  infantAddressModelSchema,
} from '@/schemas/infant/infant-address';

export const InfantAddress: React.FC<InfantAddressProps> = ({
  onSubmit,
  details,
  infantDetails,
}) => {
  const {
    // watch,
    getValues: getInfantAddressFormValues,
    // formState: pregnantAddressFormState,
    // setValue: setPregnantAddressFormValue,
    register: infantAddressFormRegister,
    // reset: resetPregnantAddressFormValue,
    control: infantContactInformationControl,
  } = useForm<InfantAddressModel>({
    resolver: yupResolver(infantAddressModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({
    control: infantContactInformationControl,
  });

  const [useMap, setUseMap] = useState(false);
  //   const handleConsentAccept = () => {
  //     setConsentFormValue('hasConsent', !accept);
  //   };

  return (
    <>
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
          text={'Address'}
          className="z-50 w-11/12 pt-2"
        />
      </div>
      <div>
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={`Add ${details?.name} name address`}
            className="z-50 w-11/12 pt-2"
          />
          <div className="mt-2">
            <ButtonGroup<boolean>
              options={useMapOrAddressOptions}
              onOptionSelected={(value: boolean | boolean[]) =>
                setUseMap(value as boolean)
              }
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'mt-2 w-full'}
              selectedOptions={useMap}
            />
          </div>
        </div>
        <div className={'mt-4 px-4'}>
          <Alert
            type={'info'}
            // title="Each child is unique!"
            message={`If you are at ${infantDetails?.firstName}'s house now, you can use your phone's GPS to save the address.`}
          />
        </div>
        {useMap === false && (
          <>
            <FormInput<InfantAddressModel>
              label={'Add address'}
              register={infantAddressFormRegister}
              nameProp={'address'}
              placeholder={'e.g 012 345 6789'}
              type={'text'}
              className="mt-4"
              textInputType="textarea"
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
          text={`Save`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getInfantAddressFormValues());
          }}
          disabled={!isValid}
        />
      </div>
    </>
  );
};
