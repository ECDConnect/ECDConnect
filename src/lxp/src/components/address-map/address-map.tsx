import {
  Button,
  Typography,
  CustomGoogleMap,
  Colours,
  GoogleMapGeoCodeResponse,
  GoogleMapGeoCodeAddressComponentType,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { SiteAddressDto } from '@ecdlink/core';
import { staticDataSelectors } from '@/store/static-data';
import { useSelector } from 'react-redux';

interface AddressMapProps {
  componentHeight: number;
  buttonColor?: Colours;
  address: SiteAddressDto;
  onClose: () => void;
  onSubmit: (address: SiteAddressDto) => void;
}

export const formatAddress = (address: SiteAddressDto) => {
  if (address.addressLine1 === '') {
    return '';
  }
  const parts = [address.addressLine1];
  if (!!address.addressLine2) parts.push(address.addressLine2);
  if (!!address.addressLine3) parts.push(address.addressLine3);
  //if (!!address.municipality) parts.push(address.municipality);
  if (!!address.province) parts.push(address.province.description);
  return parts.join(', ');
};

const getAddressComponent = (
  result: GoogleMapGeoCodeResponse,
  type: GoogleMapGeoCodeAddressComponentType
): string => {
  const address_components = result.results[0].address_components;
  const short_name = address_components.find((item) =>
    item.types.find((currentType) => currentType.includes(type))
  )?.short_name;
  return short_name || '';
};

export const AddressMap: React.FC<AddressMapProps> = (props) => {
  const [address, setAddress] = useState<SiteAddressDto>({ ...props.address });
  const [formattedAddress, setFormattedAddress] = useState<string>('');

  const provinces = useSelector(staticDataSelectors.getProvinces);

  const onClickSaveAddress = useCallback(() => {
    props.onSubmit(address);
    props.onClose();
  }, [props.onClose, props.onSubmit, address]);

  const onClickCancel = useCallback(() => {
    props.onClose();
  }, [props.onClose]);

  const onChangeMapData = (mapData?: GoogleMapGeoCodeResponse) => {
    if (mapData && mapData.results.length > 0 && mapData.status == 'OK') {
      const province = getAddressComponent(
        mapData,
        'administrative_area_level_1'
      );
      const provinceId =
        (!!province
          ? provinces.find(
              (p) => p.description.toLowerCase() === province.toLowerCase()
            )?.id
          : null) || null;

      const updatedAddress: SiteAddressDto = {
        ...address,
        addressLine1: `${getAddressComponent(
          mapData,
          'street_number'
        )} ${getAddressComponent(mapData, 'route')}`,
        addressLine2: getAddressComponent(mapData, 'sublocality'),
        addressLine3: getAddressComponent(mapData, 'locality'),
        municipality: getAddressComponent(
          mapData,
          'administrative_area_level_2'
        ),
        provinceId: provinceId,
        province: !provinceId
          ? null
          : {
              id: provinceId,
              enumId: provinceId,
              description: province,
            },
        postalCode: getAddressComponent(mapData, 'postal_code'),
      };
      if (JSON.stringify(address) !== JSON.stringify(updatedAddress)) {
        setAddress(updatedAddress);
        setFormattedAddress(formatAddress(updatedAddress));
      }
    }
  };

  return (
    <div>
      <CustomGoogleMap
        height={window.screen.height - props.componentHeight}
        onChangeMapData={onChangeMapData}
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
            color={props.buttonColor || 'quatenary'}
            className={'max-h-10 w-full'}
            icon={'SaveIcon'}
            onClick={onClickSaveAddress}
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
            color={props.buttonColor || 'quatenary'}
            className={'max-h-10 w-full'}
            icon={'XCircleIcon'}
            onClick={onClickCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
