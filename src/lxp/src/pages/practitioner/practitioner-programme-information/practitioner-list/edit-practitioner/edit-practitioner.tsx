import { FormInput, Button, BannerWrapper } from '@ecdlink/ui';
import { PractitionerDto, UserDto } from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PractitionerService } from '@/services/PractitionerService';
import { EditPractitionerProps } from './edit-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditPractitionerModel,
  editPractitionerSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-practitioner';
import { useAppDispatch } from '@store';
import {
  practitionerActions,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useHistory, useLocation } from 'react-router-dom';

export const EditPractitioner: React.FC<EditPractitionerProps> = ({
  setEditiPractitionerVisible,
}) => {
  const [practitionerInfo, setPractitionerInfo] = useState({});
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const {
    getValues: getPractitionerInfoFormValues,
    formState: practitionerInfoFormState,
    setValue: setPractitionerInfoFormValue,
    register: practitionerInfoFormRegister,
    reset: resetPractitionerFormValue,
    control: practitionerInfoFormControl,
  } = useForm({
    resolver: yupResolver(editPractitionerSchema),
    defaultValues: initialEditPractitionerValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { firstName, surname } = useWatch({
    control: practitionerInfoFormControl,
  });

  const handleChangePractitionerInfo = () => {
    const editPractitionerModel: PractitionerDto = {
      user: {
        firstName: firstName ?? '',
        surname: surname ?? '',
      },
    };

    appDispatch(
      practitionerThunkActions.updatePractitionerById({
        id: 'c87a3c8a-e247-4899-a757-6e5be5657206',
        input: editPractitionerModel,
      })
    );
    setEditiPractitionerVisible(false);
    // appDispatch(practitionerThunkActions.updatePractitionerById())
  };

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
        onBack={() => history.goBack()}
      ></BannerWrapper>
      <div className="w-12/12 px-4 wrapper-with-sticky-button">
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap justify-center">
            <div className="flex flex-col justify-center gap-4 mt-4 w-full">
              <FormInput<EditPractitionerModel>
                label={'First name'}
                visible={true}
                nameProp={'firstName'}
                placeholder="First Name"
                className="w-full"
                register={practitionerInfoFormRegister}
              />
              <FormInput<EditPractitionerModel>
                label={'Surname'}
                placeholder="Surname/Family name"
                visible={true}
                nameProp={'surname'}
                className="w-full"
                register={practitionerInfoFormRegister}
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
                onClick={() => {
                  handleChangePractitionerInfo();
                  setEditiPractitionerVisible(false);
                }}
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
