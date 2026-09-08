import {
  Button,
  Typography,
  Colours,
  GoogleMapGeoCodeResponse,
  GoogleMapGeoCodeAddressComponentType,
  MapCoordinates,
} from '@ecdlink/ui';
import { useCallback, useState, useMemo } from 'react';
import { SiteAddressDto } from '@ecdlink/core';
import { staticDataSelectors } from '@/store/static-data';
import { useSelector } from 'react-redux';
import { CustomGoogleMap } from '../google-map';

// Format the address based on its components
export const formatAddress = (address: SiteAddressDto) => {
  if (!address?.addressLine1) {
    return '';
  }
  const parts = [address.addressLine1];
  if (address.addressLine2) parts.push(address.addressLine2);
  if (address.addressLine3) parts.push(address.addressLine3);
  if (address.province) parts.push(address.province.description);
  return parts.join(', ');
};

// Search every geocode result; results[0] is not always street-level.
const getAddressComponent = (
  result: GoogleMapGeoCodeResponse,
  type: GoogleMapGeoCodeAddressComponentType
) => {
  for (const geocodeResult of result.results) {
    const component = geocodeResult.address_components.find((item) =>
      item.types.includes(type)
    );
    if (component) {
      return component;
    }
  }
  return undefined;
};

const emptyAddress: SiteAddressDto = {
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  municipality: '',
  provinceId: null,
  province: null,
  postalCode: '',
  latitude: '',
  longitude: '',
};

interface AddressMapProps {
  componentHeight: number;
  buttonColor?: Colours;
  address: SiteAddressDto;
  onClose: () => void;
  onSubmit: (address: SiteAddressDto) => void;
}

export const AddressMap: React.FC<AddressMapProps> = ({
  componentHeight,
  buttonColor,
  address: propAddress,
  onClose,
  onSubmit,
}) => {
  // State to hold the address being edited
  const [address, setAddress] = useState<SiteAddressDto>(
    propAddress || emptyAddress
  );

  // Derived rather than stored, so it can never fall out of step with the pin.
  const formattedAddress = useMemo(() => formatAddress(address), [address]);

  const provinces = useSelector(staticDataSelectors.getProvinces);

  // Save the address and close the dialog
  const onClickSaveAddress = useCallback(() => {
    onSubmit && onSubmit(address); // Submit the address
    onClose && onClose(); // Close the map
  }, [onClose, onSubmit, address]);

  // Handle cancel action (close the map without saving)
  const onClickCancel = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  // Handle map data change when the pin is moved or the map first locates
  const onChangeMapData = useCallback(
    (mapData?: GoogleMapGeoCodeResponse, coordinates?: MapCoordinates) => {
      if (!mapData || mapData.status !== 'OK' || !mapData.results?.length) {
        return;
      }

      const province = getAddressComponent(
        mapData,
        'administrative_area_level_1'
      )?.long_name;
      const matchedProvince = province
        ? provinces.find(
            (p) => p.description.toLowerCase() === province.toLowerCase()
          )
        : null;
      const streetNumber =
        getAddressComponent(mapData, 'street_number')?.short_name || '';
      const route = getAddressComponent(mapData, 'route')?.short_name || '';
      // Prefer where the pin actually sits over the address the geocoder
      // snapped it to.
      const latitude =
        coordinates?.latitude ?? mapData.results[0].geometry.location.lat;
      const longitude =
        coordinates?.longitude ?? mapData.results[0].geometry.location.lng;

      setAddress((prevAddress) => {
        const updatedAddress: SiteAddressDto = {
          ...prevAddress,
          addressLine1:
            `${streetNumber} ${route}`.trim() ||
            mapData.results[0]?.formatted_address ||
            '',
          addressLine2:
            getAddressComponent(mapData, 'sublocality')?.short_name || '',
          addressLine3:
            getAddressComponent(mapData, 'locality')?.short_name || '',
          municipality:
            getAddressComponent(mapData, 'administrative_area_level_2')
              ?.short_name || '',
          provinceId: matchedProvince ? matchedProvince.id : null,
          province: !matchedProvince
            ? null
            : {
                id: matchedProvince.id || '',
                enumId: matchedProvince.id || '',
                description: matchedProvince.description || '',
              },
          postalCode:
            getAddressComponent(mapData, 'postal_code')?.short_name || '',
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        };

        return JSON.stringify(prevAddress) === JSON.stringify(updatedAddress)
          ? prevAddress
          : updatedAddress;
      });
    },
    [provinces]
  );

  return (
    <div>
      <CustomGoogleMap
        height={window.screen.height - componentHeight}
        longitude={
          !propAddress?.longitude
            ? undefined
            : parseFloat(propAddress.longitude)
        }
        latitude={
          !propAddress?.latitude ? undefined : parseFloat(propAddress.latitude)
        }
        onChangeMapData={onChangeMapData}
      />
      <div className="absolute bottom-0 min-h-64 w-full flex-1 rounded-t-2xl bg-white px-5">
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
            color={buttonColor || 'quatenary'}
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
            color={buttonColor || 'quatenary'}
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
