import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ClassroomDto,
  PractitionerDto,
  SiteAddressDto,
  ProvinceDto,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { newGuid } from '@utils/common/uuid.utils';
//import { SiteAddressDto } from '@/models/classroom/site-address.dto';
import {
  AddressMap,
  formatAddress,
} from '@/components/address-map/address-map';

interface EditAdressProps {
  setShowEditAddress: (item: boolean) => void;
  practitioner?: PractitionerDto;
}

export const EditAddress: React.FC<EditAdressProps> = ({
  setShowEditAddress,
  practitioner,
}) => {
  const { isOnline } = useOnlineStatus();
  const [showMap, setShowMap] = useState(false);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const [addressChanged, setAddressChanged] = useState<boolean>(false);
  const [address, setAddress] = useState<SiteAddressDto>({
    id: '',
    area: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    latitude: null,
    longitude: null,
    municipality: '',
    name: '',
    postalCode: '',
    province: null,
    provinceId: null,
    ward: '',
  });
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const currentAddress = classroom?.siteAddress;
    if (!!currentAddress) {
      const siteAddress: SiteAddressDto = {
        id: currentAddress.id || '',
        area: currentAddress.area || '',
        addressLine1: currentAddress.addressLine1 || '',
        addressLine2: currentAddress.addressLine2 || '',
        addressLine3: currentAddress.addressLine3 || '',
        latitude: currentAddress.latitude,
        longitude: currentAddress.longitude,
        municipality: currentAddress.municipality,
        name: currentAddress.name || '',
        postalCode: currentAddress.postalCode || '',
        province: currentAddress.province as unknown as ProvinceDto,
        provinceId: currentAddress.provinceId,
        ward: address.ward || '',
      };
      setAddress(siteAddress);
    }
  }, [classroom?.siteAddress]);

  const saveAddressChanges = async () => {
    if (!addressChanged) return;

    const siteAddress: SiteAddressDto = {
      id: address.id || newGuid(),
      area: address.area || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      addressLine3: address.addressLine3 || '',
      latitude: address.latitude,
      longitude: address.longitude,
      municipality: address.municipality,
      name: address.name || '',
      postalCode: address.postalCode || '',
      province: null,
      provinceId: !!address.provinceId ? address.provinceId : null,
      ward: address.ward || '',
    };

    appDispatch(
      classroomsActions.updateClassroomSiteAddress(siteAddress as any)
    );
    await appDispatch(classroomsThunkActions.upsertClassroom({}));
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  return (
    <div>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title={`Edit address`}
        onBack={() => setShowEditAddress(false)}
        className="p-4"
      >
        <Typography type="h2" color="textDark" text={'Programme address'} />
        <div onClick={handleShowMap}>
          <FormInput
            label={'Where is your site located?'}
            nameProp={'programmeAddress'}
            placeholder={'Tap to add address'}
            type={'text'}
            onChange={(e) => {}}
            value={formatAddress(address)}
            disabled={showMap}
            suffixIcon={'LocationMarkerIcon'}
            sufficIconColor="primary"
            suffixIconAction={() => setShowMap(true)}
          />
        </div>
      </BannerWrapper>
      <div className="absolute bottom-0 left-0 right-0 max-h-20 bg-white p-4">
        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          // disabled={!editedAddress}
          onClick={() => {
            saveAddressChanges();
            setShowEditAddress(false);
          }}
        />
      </div>
      <Dialog visible={showMap} position={DialogPosition.Bottom} stretch>
        <AddressMap
          address={address}
          componentHeight={62}
          onClose={handleCloseMap}
          onSubmit={(updatedAddress) => {
            if (JSON.stringify(updatedAddress) != JSON.stringify(address)) {
              setAddress(updatedAddress);
              setAddressChanged(true);
            }
          }}
        />
      </Dialog>
    </div>
  );
};
