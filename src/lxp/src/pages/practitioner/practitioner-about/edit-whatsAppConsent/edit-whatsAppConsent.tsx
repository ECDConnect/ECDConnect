import {
  FormInput,
  Button,
  BannerWrapper,
  Typography,
  ButtonGroupTypes,
  ButtonGroup,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  PractitionerAboutModel,
  initialPractitionerAboutValues,
} from '@/schemas/practitioner/practitioner-about';
import { useAppDispatch } from '@store';
import { userActions, userThunkActions } from '@store/user';
import { cloneDeep } from 'lodash';
import { UserDto } from '@/../../../packages/core/lib';
import { useState } from 'react';

export interface EditWhatsAppConsentProps {
  setEditWhatsAppConsent?: any;
  user?: UserDto;
}

export const EditWhatsAppConsent: React.FC<EditWhatsAppConsentProps> = ({
  setEditWhatsAppConsent,
  user,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const [whatsAppConsent, setWhatsAppConsent] = useState<boolean>(
    user?.whatsAppConsent || false
  );

  const yesNoOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const { control: practitionerInfoControl } = useForm<PractitionerAboutModel>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { errors } = useFormState({ control: practitionerInfoControl });

  const saveWhatsAppConsent = (consent: boolean) => {
    const copy = cloneDeep(user);
    if (copy) {
      copy.whatsAppConsent = consent;

      appDispatch(userActions.updateUser(copy));
      if (isOnline) {
        appDispatch(userThunkActions.updateUser(copy));
      }
    }
  };

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      title={'Stay in touch'}
      displayOffline={!isOnline}
      onBack={() => setEditWhatsAppConsent(false)}
      onClose={() => setEditWhatsAppConsent(false)}
    >
      <div className="flex h-full w-full flex-col bg-white p-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full">
            <Typography
              type="h2"
              text="Stay in touch"
              color={'textDark'}
              className="mt-4 w-11/12"
            />
          </div>
          <div className="mt-2 flex w-full flex-col justify-center gap-4">
            <ButtonGroup
              options={yesNoOptions}
              onOptionSelected={(value: boolean | boolean[]) => {
                setWhatsAppConsent(value as boolean);
              }}
              selectedOptions={whatsAppConsent}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'my-4 w-full'}
              multiple={false}
            />
          </div>
        </div>

        <Button
          size="normal"
          className="mt-auto w-full"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={
            !!Object.keys(errors).length || whatsAppConsent === undefined
          }
          onClick={() => {
            if (whatsAppConsent !== undefined) {
              saveWhatsAppConsent(whatsAppConsent);
            }
            setEditWhatsAppConsent(false);
          }}
        />
      </div>
    </BannerWrapper>
  );
};
