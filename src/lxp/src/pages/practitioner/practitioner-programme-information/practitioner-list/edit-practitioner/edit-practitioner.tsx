import { FormInput, Button, BannerWrapper } from '@ecdlink/ui';
import { PractitionerDto, UserDto } from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddPractitionerModel,
  addPractitionerSchema,
  initialAddPractitionerValues,
} from '@/schemas/practitioner/add-practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { EditPractitionerProps } from './edit-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const EditPractitioner: React.FC<EditPractitionerProps> = ({
  setEditiPractitionerVisible,
}) => {
  const { isOnline } = useOnlineStatus();
  return (
    <div>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        showBackground={false}
        color={'primary'}
        title={'Edit practitioner'}
        backgroundColour={'uiBg'}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div className="w-11/12 wrapper-with-sticky-button">
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap justify-center">
            <div className="flex flex-col justify-center gap-4 mt-4 w-full">
              <FormInput<AddPractitionerModel>
                label={'First name'}
                visible={true}
                nameProp={'firstName'}
                placeholder="First Name"
                className="w-full"
              />
              <FormInput<AddPractitionerModel>
                label={'Surname'}
                placeholder="Surname/Family name"
                visible={true}
                nameProp={'surname'}
                className="w-full"
              />
            </div>
            <div className="self-end -mb-4 w-full">
              <Button
                size="normal"
                className="w-full mb-4"
                type="filled"
                color="primary"
                text="Save"
                textColor="white"
                icon="SaveIcon"
                onClick={() => setEditiPractitionerVisible(false)}
              />
              <Button
                size="normal"
                className="w-full mb-4"
                type="outlined"
                color="primary"
                text="Remove practitioner"
                textColor="primary"
                icon="TrashIcon"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
