import { useWindowSize } from '@reach/window-size';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { getMotherById } from '@/store/mother/mother.selectors';
import {
  EditPregnantContactInformationProps,
  yesNoOptions,
} from '../../components/contact-information/contact-information.types';
import { useForm, useFormState } from 'react-hook-form';
import {
  PregnantContactInformationModel,
  pregnantContactInformationModelSchema,
} from '@/schemas/pregnant/pregnant-contact-information';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

const HEADER_HEIGHT = 122;

export const MotherContactNumber: React.FC<
  EditPregnantContactInformationProps
> = ({ onSubmit, details }) => {
  const {
    getValues: getMomContactInformationFormValues,
    register: consentFormRegister,
    control: momContactInformationControl,
  } = useForm<PregnantContactInformationModel>({
    resolver: yupResolver(pregnantContactInformationModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const location = useLocation();
  const [, , , motherId] = location.pathname.split('/');
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );
  const { isValid } = useFormState({ control: momContactInformationControl });
  const [hasWhatsapp, setHasWhatsapp] = useState<any>(null);
  const { height } = useWindowSize();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Edit phone number"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div
        className="flex flex-col p-4 "
        style={{ height: height - HEADER_HEIGHT }}
      >
        <Typography
          type="h2"
          color={'textDark'}
          text={`${mother?.user?.firstName}`}
          className="z-50 pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Contact information'}
          className="z-50 w-11/12 pt-2"
        />
        <div className="flex w-11/12 justify-center text-red-400">
          <Divider dividerType="dashed" />
        </div>
        <div>
          <FormInput<PregnantContactInformationModel>
            label={'Cellphone number'}
            register={consentFormRegister}
            nameProp={'cellphone'}
            placeholder={'e.g 012 345 6789'}
            type={'number'}
            value={'333333333333333'}
            className="mt-4"
          ></FormInput>
          <div className="mt-4">
            <Typography
              type="h4"
              color={'textMid'}
              text={`Does ${mother?.user?.firstName} use this cellphone number for WhatsApp?`}
              className="z-50 w-11/12 pt-2"
            />
            <div className="mt-2">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                onOptionSelected={(value: boolean | boolean[]) =>
                  setHasWhatsapp(value)
                }
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'mt-2 w-full'}
              />
            </div>
          </div>
          {hasWhatsapp === false && (
            <>
              <FormInput<PregnantContactInformationModel>
                label={`What cellphone number does ${mother?.user?.firstName} use for WhatsApp?`}
                register={consentFormRegister}
                nameProp={'whatsapp'}
                placeholder={'e.g 012 345 6789'}
                type={'number'}
                className="mt-4"
                value={'23452352353'}
              ></FormInput>
            </>
          )}
        </div>
        <div className="flex h-full items-end">
          <Button
            type={'filled'}
            color={'primary'}
            className={'mt-2 w-full'}
            textColor={'white'}
            text={`Save`}
            icon={'SaveIcon'}
            iconPosition={'start'}
            onClick={() => {
              onSubmit(getMomContactInformationFormValues());
            }}
            disabled={!isValid}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
