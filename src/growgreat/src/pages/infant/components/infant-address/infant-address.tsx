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
import { useCallback, useEffect, useState } from 'react';
import {
  InfantAddressProps,
  useMapOrAddressOptions,
} from './infant-address.types';
import {
  InfantAddressModel,
  infantAddressModelSchema,
} from '@/schemas/infant/infant-address';
import { Address, CustomGoogleMap } from '@/components/google-map/google-map';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';

const MARGIN = 16;
const COMPONENT_HEIGHT = 280;

const getInfo = (address: Address[] | undefined, type: string) =>
  address?.find((item) =>
    item?.types.find((currentType) => currentType.includes(type))
  )?.short_name;

export const InfantAddress: React.FC<InfantAddressProps> = ({
  onSubmit,
  details,
  infantDetails,
}) => {
  const {
    // watch,
    getValues: getInfantAddressFormValues,
    // formState: pregnantAddressFormState,
    setValue: setInfantAddressFormValue,
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

  const [isMapTab, setIsMapTab] = useState<boolean | undefined>();
  const [isMapView, setIsMapView] = useState(false);
  const [address, setAddress] = useState<Address[]>();
  const [formattedAddress, setFormattedAddress] = useState('');

  const { isLoading } = useThunkFetchCall('infants', InfantActions.ADD_INFANTS);
  const { isLoading: isLoadingInfantCount } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_COUNT_FOR_MONTH
  );
  const { isLoading: isLoadingUpdateInfantCaregiver } = useThunkFetchCall(
    'infants',
    InfantActions.UPDATE_INFANT_CAREGIVER
  );
  const { isLoading: isLoadingEventRecord } = useThunkFetchCall(
    'eventRecord',
    EventRecordActions.ADD_EVENT_RECORD
  );

  const onToggleMapView = () => setIsMapView((prevState) => !prevState);

  const saveAddress = () => {
    setInfantAddressFormValue('address', formattedAddress);
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
        <div className="min-h-64 absolute bottom-0 w-full flex-1 rounded-t-2xl bg-white px-5">
          <Typography
            type="h2"
            color={'textDark'}
            text={`Is this address/location correct?`}
            className="pt-6"
          />
          <Typography
            type="h4"
            color={'textMid'}
            text={'Move the pin to change address'}
            className="w-11/12 pt-2"
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
          text={'Address'}
          className="w-11/12 pt-2"
        />
      </div>
      <div>
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={`Add ${details?.name} name address`}
            className="w-11/12 pt-2"
          />
          <div className="mt-2">
            <ButtonGroup<boolean>
              options={useMapOrAddressOptions}
              onOptionSelected={(value: boolean | boolean[]) =>
                setIsMapTab(value as boolean)
              }
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'mt-2 w-full'}
              selectedOptions={isMapTab}
            />
          </div>
        </div>
        <Alert
          type={'info'}
          className="mt-4"
          message={`If you are at ${infantDetails?.firstName}'s house now, you can use your phone's GPS to save the address.`}
        />
        {isMapTab && (
          <FormInput<InfantAddressModel>
            label={'Add address'}
            register={infantAddressFormRegister}
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
          <FormInput<InfantAddressModel>
            label={'Add address'}
            register={infantAddressFormRegister}
            nameProp={'address'}
            placeholder={'Add address'}
            type={'text'}
            className="mt-4"
            textInputType="textarea"
          ></FormInput>
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
          isLoading={
            isLoading ||
            isLoadingInfantCount ||
            isLoadingUpdateInfantCaregiver ||
            isLoadingEventRecord
          }
          disabled={
            !isValid ||
            isLoading ||
            isLoadingInfantCount ||
            isLoadingUpdateInfantCaregiver ||
            isLoadingEventRecord
          }
        />
      </div>
    </>
  );
};
