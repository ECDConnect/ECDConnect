import {
  Button,
  Typography,
  CustomGoogleMap,
  GoogleMapGeoCodeAddressType,
  GoogleMapGeoCodeResponse,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';

interface Step7MapProps {
  onClose: () => void;
  onSubmit: (address: string) => void;
}
const COMPONENT_HEIGHT = 280;

const getInfo = (
  address: GoogleMapGeoCodeAddressType[] | undefined,
  type: string
) =>
  address?.find((item) =>
    item?.types.find((currentType) => currentType.includes(type))
  )?.short_name;

export const Step7Map: React.FC<Step7MapProps> = ({ onClose, onSubmit }) => {
  const [formattedAddress, setFormattedAddress] = useState('');

  const saveAddress = () => {
    onSubmit(formattedAddress);
    onClose();
  };

  const onChangeMapData = useCallback((mapData?: GoogleMapGeoCodeResponse) => {
    if (!mapData?.results?.length) {
      return;
    }

    const components = mapData.results.flatMap(
      (result) => result.address_components
    );
    const number = getInfo(components, 'street_number');
    const street = getInfo(components, 'route');
    const city =
      getInfo(components, 'administrative_area_level_2') ||
      getInfo(components, 'locality');
    const built = `${number ? number : ''} ${street ? street + ', ' : ''}${
      city ? city : ''
    }`.trim();

    setFormattedAddress(built || mapData.results[0].formatted_address || '');
  }, []);

  return (
    <div>
      <CustomGoogleMap
        height={window.screen.height - COMPONENT_HEIGHT}
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
