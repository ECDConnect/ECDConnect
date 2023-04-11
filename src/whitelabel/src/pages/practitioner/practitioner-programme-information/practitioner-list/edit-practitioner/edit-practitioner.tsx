import { FormInput, Button, BannerWrapper } from '@ecdlink/ui';
import { PractitionerDto } from '@ecdlink/core';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditPractitionerProps } from './edit-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  EditPractitionerModel,
  editPractitionerSchema,
  initialEditPractitionerValues,
} from '@/schemas/practitioner/edit-practitioner';
import { useAppDispatch } from '@store';
import { practitionerThunkActions } from '@/store/practitioner';
import { useHistory } from 'react-router-dom';

export const EditPractitioner: React.FC<EditPractitionerProps> = ({
  setEditiPractitionerVisible,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const {
    register: practitionerInfoFormRegister,
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
      <div className="w-12/12 wrapper-with-sticky-button px-4">
        <div className="flex w-full justify-center">
          <div className="flex flex-wrap justify-center">
            <div className="mt-4 flex w-full flex-col justify-center gap-4">
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
            <div className="-mb-4 w-full self-end">
              <Button
                size="normal"
                className="mb-4 w-full"
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
                className="mb-4 w-full"
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
