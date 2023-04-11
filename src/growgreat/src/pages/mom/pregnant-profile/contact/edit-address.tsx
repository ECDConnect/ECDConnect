import {
  Alert,
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { getMotherById } from '@/store/mother/mother.selectors';
import {
  PregnantAddressProps,
  useMapOrAddressOptions,
} from '../../components/pregnant-address/pregnant-address.types';
import { CustomGoogleMap, Address } from '@/components/google-map/google-map';
import { useForm, useFormState } from 'react-hook-form';
import { memo, useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  PregnantAddressModel,
  pregnantAddressModelSchema,
} from '@/schemas/pregnant/pregnant-address';
import { useAppDispatch } from '@/store';
import { motherActions, motherThunkActions } from '@/store/mother';
import {
  MotherDto,
  SiteAddressDto,
  UserDto,
  useDialog,
} from '@ecdlink/core/lib';

const MARGIN = 16;
const COMPONENT_HEIGHT = 280;

const getInfo = (address: Address[] | undefined, type: string) =>
  address?.find((item) =>
    item?.types.find((currentType) => currentType.includes(type))
  )?.short_name;

const MotherContactAddressView: React.FC<PregnantAddressProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [, , , motherId] = location.pathname.split('/');
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const _defaultValues = {
    address: mother?.siteAddress?.addressLine1,
    addressLine1: mother?.siteAddress?.addressLine1,
    details: {
      id: mother?.user?.id,
    },
  };

  const {
    getValues: getPregnantAddressFormValues,
    setValue: setPregnantAddressFormValue,
    register: pregnantAddressFormRegister,
    control: momContactInformationControl,
  } = useForm<PregnantAddressModel>({
    resolver: yupResolver(pregnantAddressModelSchema),
    mode: 'onBlur',
    defaultValues: _defaultValues,
    reValidateMode: 'onChange',
  });

  const dialog = useDialog();
  const { isValid } = useFormState({ control: momContactInformationControl });
  const [isMapTab, setIsMapTab] = useState<boolean | undefined>(false);
  const [isMapView, setIsMapView] = useState(false);
  const [address, setAddress] = useState<Address[]>();
  const [formattedAddress, setFormattedAddress] = useState('');

  const onToggleMapView = () => setIsMapView((prevState) => !prevState);
  const saveAddress = () => {
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

  const saveMotherAddress = () => {
    const siteAddressDto: SiteAddressDto = {
      id: mother?.siteAddress?.id,
      addressLine1: getPregnantAddressFormValues().address || '',
    };

    const userModel: UserDto = {
      id: mother?.user?.id,
      phoneNumber: mother?.user?.phoneNumber,
      firstName: mother?.user?.firstName,
      surname: mother?.user?.surname,
    };

    const motherInputModel: MotherDto = {
      age: mother?.age,
      expectedDateOfDelivery: mother?.expectedDateOfDelivery,
      insertedDate: mother?.insertedDate,
      nextVisitDate: mother?.nextVisitDate,
      siteAddress: siteAddressDto,
      statusInfo: mother?.statusInfo,
      isActive: mother?.isActive,
      user: userModel,
      whatsAppNumber: mother?.whatsAppNumber,
    };

    appDispatch(motherActions.updateMother(motherInputModel));
    appDispatch(
      motherThunkActions.updateMotherAddress({
        mother: motherInputModel,
        id: motherId,
      })
    ).unwrap();
    showSuccessMessage();
  };

  const showSuccessMessage = useCallback(
    () =>
      dialog({
        position: DialogPosition.Middle,
        color: 'bg-transparent',
        render(onSubmit, onClose) {
          return (
            <Card
              shadowSize={'lg'}
              borderRaduis={'3xl'}
              className="flex flex-col items-center justify-center px-4 py-6"
            >
              <Typography
                type="h3"
                weight="bold"
                className="mt-4"
                lineHeight="snug"
                text={'Address saved!'}
              />
              <div className={'mt-4 flex w-full justify-center'}>
                <Button
                  text={`Close`}
                  icon={'XIcon'}
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  className={'max-h-10 w-full'}
                  iconPosition={'start'}
                  onClick={() => {
                    history.goBack();
                    onClose();
                  }}
                />
              </div>
            </Card>
          );
        },
      }),
    [dialog, history]
  );

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
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Edit address"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <Typography
        type="h2"
        color={'textDark'}
        text={`${mother?.user?.firstName}`}
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
          text={`Add ${mother?.user?.firstName}'s address`}
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
        message={`If you are at ${mother?.user?.firstName}'s house now, you can use your phone's GPS to save the address.`}
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
      <div className="flex items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'mt-2 w-full'}
          textColor={'white'}
          text={'Save'}
          icon={'SaveIcon'}
          iconPosition={'start'}
          disabled={!isValid}
          onClick={() => saveMotherAddress()}
        />
      </div>
    </BannerWrapper>
  );
};
export const MotherContactAddress = memo(MotherContactAddressView);
