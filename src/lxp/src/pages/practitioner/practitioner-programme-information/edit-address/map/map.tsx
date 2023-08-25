import { Button, Typography, CustomGoogleMap, Address } from '@ecdlink/ui';
import { useEffect, useCallback, useState } from 'react';

interface AddressMapProps {
  onClose: () => void;
  onSubmit: (address: string) => void;
}
const COMPONENT_HEIGHT = 150;

const getInfo = (address: Address[] | undefined, type: string) =>
  address?.find((item) =>
    item?.types.find((currentType) => currentType.includes(type))
  )?.short_name;

export const AddressMap: React.FC<AddressMapProps> = ({
  onClose,
  onSubmit,
}) => {
  const [address, setAddress] = useState<Address[]>();
  const [formattedAddress, setFormattedAddress] = useState('');

  const saveAddress = () => {
    onSubmit(formattedAddress);
    onClose();
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

  return (
    <div>
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
