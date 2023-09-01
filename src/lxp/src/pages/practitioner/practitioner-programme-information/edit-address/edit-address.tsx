import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ClassroomDto, PractitionerDto, SiteAddressDto } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { AddressMap } from './map/map';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { newGuid } from '@utils/common/uuid.utils';

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
  const [editedAddress, setEditedAddress] = useState(
    classroom?.siteAddress?.addressLine1 || ''
  );
  const appDispatch = useAppDispatch();

  const changeSmartSpaceCheckAddress = async () => {
    const classroomCopy = { ...classroom };
    const siteAddressId = classroomCopy.siteAddressId || newGuid();

    const siteAddress: SiteAddressDto = {
      id: siteAddressId,
      addressLine1: editedAddress || '',
    };
    classroomCopy.siteAddress = siteAddress;
    classroomCopy.siteAddressId = siteAddressId;

    if (classroomCopy.siteAddress) {
      appDispatch(
        classroomsActions.updateClassroomSiteAddress(
          classroomCopy as ClassroomDto
        )
      );
      await appDispatch(classroomsThunkActions.upsertClassroomSiteAddress({}));
    }
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
            value={editedAddress}
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
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          // disabled={!editedAddress}
          onClick={() => {
            changeSmartSpaceCheckAddress();
            setShowEditAddress(false);
          }}
        />
      </div>
      <Dialog visible={showMap} position={DialogPosition.Bottom} stretch>
        <AddressMap
          onClose={handleCloseMap}
          onSubmit={(address) => {
            console.log(address);
            setEditedAddress(address);
            changeSmartSpaceCheckAddress();
          }}
        />
      </Dialog>
    </div>
  );
};
