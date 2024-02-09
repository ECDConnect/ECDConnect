import { useEffect, memo, useState, useCallback } from 'react';
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
} from '@/pages/mom/components/pregnant-address/pregnant-address.types';
import {
  pregnantAddressModelSchema,
  PregnantAddressModel,
} from '@/schemas/pregnant/pregnant-address';
import { CustomGoogleMap, Address } from '@/components/google-map/google-map';

const MARGIN = 16;
const COMPONENT_HEIGHT = 280;

const getInfo = (address: Address[] | undefined, type: string) =>
  address?.find((item) =>
    item?.types.find((currentType) => currentType.includes(type))
  )?.short_name;

const PregnantAddressView: React.FC<PregnantAddressProps> = ({
  onSubmit,
  details,
}) => {
  const {
    getValues: getPregnantAddressFormValues,
    // formState: pregnantAddressFormState,
    setValue: setPregnantAddressFormValue,
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
  const [isMapTab, setIsMapTab] = useState<boolean | undefined>();
  const [isMapView, setIsMapView] = useState(false);
  const [address, setAddress] = useState<Address[]>();
  const [formattedAddress, setFormattedAddress] = useState('');

  const onToggleMapView = () => setIsMapView((prevState) => !prevState);

  const saveAddress = () => {
    // TODO: add integration
    setPregnantAddressFormValue('address', formattedAddress);
    onToggleMapView();
  };

  const getAddress = useCallback(() => {
    const number = getInfo(address, 'street_number');
    const street = getInfo(address, 'route');
    const city = getInfo(address, 'administrative_area_level_2');

    setFormattedAddress(
      `${number ? number : ''} ${street ? street + ', ' : ''}${
        city ? city : ''
      }`
    );
  }, [address]);

  useEffect(() => getAddress(), [getAddress]);

  if (isMapView) {
    return (
      <div
        className="h-full"
        style={{ marginLeft: -MARGIN, marginRight: -MARGIN }}
      >
        <CustomGoogleMap
          height={window.screen.height - COMPONENT_HEIGHT}
          onChange={setAddress}
        />
        <div className="min-h-64 absolute bottom-0 z-50 w-full flex-1 rounded-t-2xl bg-white px-5">
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
            text={formattedAddress}
            className="my-5"
          />
          <div className="mb-5 flex flex-col gap-3">
            <Button
              type="filled"
              color="primary"
              className={'max-h-10 w-full'}
              icon={'SaveIcon'}
              onClick={saveAddress}
            >
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
              icon={'XCircleIcon'}
              onClick={onToggleMapView}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
              selectedOptions={isMapTab}
              className={'mt-2 w-full'}
              type={ButtonGroupTypes.Button}
              options={useMapOrAddressOptions}
              onOptionSelected={(value: boolean | boolean[]) =>
                setIsMapTab(value as boolean)
              }
            />
          </div>
        )}
      </div>
      <Alert
        type={'info'}
        message={`If you are at ${details?.name}'s house now, you can use your phone's GPS to save the address.`}
        className={'mt-4'}
      />
      {isMapTab && (
        <FormInput<PregnantAddressModel>
          label={'Add address'}
          register={pregnantAddressFormRegister}
          nameProp={'address'}
          placeholder={'Tap to add'}
          type={'text'}
          className="mt-4"
          onClick={onToggleMapView}
          suffixIcon={'LocationMarkerIcon'}
          sufficIconColor={'primary'}
        />
      )}

      {isMapTab === false && (
        <FormInput<PregnantAddressModel>
          label={'Add address'}
          register={pregnantAddressFormRegister}
          nameProp={'address'}
          placeholder={'e.g 16 Mackenzie St., Johannesburg'}
          type={'text'}
          className="mt-4"
          textInputType="textarea"
        />
      )}
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'mt-4 w-full'}
          textColor={'white'}
          text={'Next'}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => onSubmit(getPregnantAddressFormValues())}
          disabled={!isValid}
        />
      </div>
    </>
  );
};

export const PregnantAddress = memo(PregnantAddressView);
