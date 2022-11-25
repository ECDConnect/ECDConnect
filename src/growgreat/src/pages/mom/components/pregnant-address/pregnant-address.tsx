import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  renderIcon,
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
} from '@/pages/mom/components/pregnant-address/pregnant-address.types';
import * as styles from '@/pages/mom/components/pregnant-address/pregnant-address.styles';
import {
  pregnantAddressModelSchema,
  PregnantAddressModel,
} from '@/schemas/pregnant/pregnant-address';
import { CustomGoogleMap } from '@/components/google-map';

export const PregnantAddress: React.FC<PregnantAddressProps> = ({
  onSubmit,
  details,
}) => {
  const {
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
  function saveAddress() {
    console.log('saveAddress', details);
  }
  return (
    <div className="h-screen">
      {!!useMap && (
        <>
          <CustomGoogleMap />
          <div className="flex-1 px-5">
            <Typography
              type="h2"
              color={'textDark'}
              text={`Is this address/location correct?`}
              className="z-50 pt-6"
            />
            <Typography
              type="h4"
              color={'textMid'}
              text={'Move the pin to change address'}
              className="z-50 w-11/12 pt-2"
            />
            <Typography
              type="h4"
              color={'secondary'}
              text={``}
              className="z-50 w-11/12 pt-2"
            />
          </div>
          <div className="flex flex-col gap-3 px-5">
            <Button
              type="filled"
              color="primary"
              className={'max-h-10 w-full'}
              onClick={saveAddress}
            >
              {renderIcon('SaveIcon', styles.buttonIcon)}
              <Typography
                type="help"
                className="mr-2"
                color="white"
                text={'Save'}
              />
            </Button>
            <Button
              type="outlined"
              color="primary"
              className={'max-h-10 w-full'}
              onClick={() => setUseMap(false)}
            >
              {renderIcon('XIcon', styles.buttonIcon)}
              <Typography
                type="help"
                className="mr-2"
                color="primary"
                text={'Cancel'}
              />
            </Button>
          </div>
        </>
      )}
      {!useMap && (
        <div className="px-5">
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
            {'geolocation' in navigator && (
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
            )}
          </div>
          <div className={'mt-4'}>
            <Alert
              type={'info'}
              message={`If you are at ${details?.name}'s house now, you can use your phone's GPS to save the address.`}
            />
          </div>
          <FormInput<PregnantAddressModel>
            label={'Add address'}
            register={pregnantAddressFormRegister}
            nameProp={'address'}
            placeholder={'e.g 012 345 6789'}
            type={'text'}
            className="mt-4"
            textInputType="textarea"
          />
          <div className="flex h-full w-full align-bottom">
            <div
              className={'mt-10 ml-2 flex w-11/12 justify-center align-bottom'}
            >
              <Button
                type={'filled'}
                color={'primary'}
                className={'absolute bottom-10 mt-2 ml-6 max-h-10 w-11/12'}
                textColor={'white'}
                text={'Next'}
                icon={'ArrowCircleRightIcon'}
                iconPosition={'start'}
                onClick={() => onSubmit(getPregnantAddressFormValues())}
                disabled={!isValid}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
