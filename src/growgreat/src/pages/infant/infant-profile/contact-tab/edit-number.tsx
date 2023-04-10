import { useWindowSize } from '@reach/window-size';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/store';
import { CaregiverDto, InfantDto, useDialog } from '@ecdlink/core/lib';
import {
  MothertContactInformationModel,
  motherContactInformationModelSchema,
} from '@/schemas/infant/mother-contact-information';
import {
  MotherContactInformationProps,
  yesNoOptions,
} from '../../components/mother-contact-information/mother-contact-information.types';
import { getInfantById } from '@/store/infant/infant.selectors';
import { infantActions, infantThunkActions } from '@/store/infant';

const HEADER_HEIGHT = 122;

export const ChildContactNumber: React.FC<
  MotherContactInformationProps
> = () => {
  const location = useLocation();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const [, , , childId] = location.pathname.split('/');
  const child = useSelector((state: RootState) =>
    getInfantById(state, childId)
  );

  const cellphone = child?.caregiver?.phoneNumber
    ? child?.caregiver?.phoneNumber.replace('+27', '0')
    : '';
  const whatsapp = child?.caregiver?.whatsAppNumber
    ? child?.caregiver?.whatsAppNumber.replace('+27', '0')
    : '';

  const _defaultValues = {
    cellphone: cellphone,
    whatsapp: whatsapp,
    details: {
      id: child?.caregiver?.id,
    },
  };

  const {
    getValues: getMomContactInformationFormValues,
    register: consentFormRegister,
    control: momContactInformationControl,
  } = useForm<MothertContactInformationModel>({
    resolver: yupResolver(motherContactInformationModelSchema),
    mode: 'onChange',
    defaultValues: _defaultValues,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({ control: momContactInformationControl });
  const [hasWhatsapp, setHasWhatsapp] = useState<any>(cellphone === whatsapp);
  const { height } = useWindowSize();

  const saveMotherContactInformation = () => {
    let whatsAppNumber = getMomContactInformationFormValues().cellphone;
    if (!hasWhatsapp) {
      whatsAppNumber = getMomContactInformationFormValues().whatsapp;
    }

    const caregiverInputModel: CaregiverDto = {
      firstName: child?.caregiver?.firstName || '',
      surname: child?.caregiver?.surname || '',
      phoneNumber: getMomContactInformationFormValues().cellphone || '',
      whatsAppNumber: whatsAppNumber,
      relation: child?.caregiver?.relation,
      siteAddress: child?.caregiver?.siteAddress,
    };

    const infantInputModel: InfantDto = {
      caregiver: caregiverInputModel,
      gender: child?.gender,
      id: child?.id,
      insertedDate: child?.insertedDate,
      lengthAtBirth: child?.lengthAtBirth,
      nextVisitDate: child?.nextVisitDate,
      statusInfo: child?.statusInfo,
      user: child?.user,
      weightAtBirth: child?.weightAtBirth,
      dateOfBirth: child?.user?.dateOfBirth,
      caregiverId: child?.caregiver?.id,
    };

    appDispatch(infantActions.updateInfant(infantInputModel));
    appDispatch(
      infantThunkActions.updateInfantCaregiverContactDetails({
        infant: infantInputModel,
        id: childId,
      })
    ).unwrap();
    showSuccessMessage();
  };

  const showSuccessMessage = useCallback(
    () =>
      dialog({
        position: DialogPosition.Middle,
        color: 'bg-transparent',
        render(onSubmit, onClose) {
          return (
            <Card
              shadowSize={'lg'}
              borderRaduis={'3xl'}
              className="flex flex-col items-center justify-center px-4 py-6"
            >
              <Typography
                type="h3"
                weight="bold"
                className="mt-4"
                lineHeight="snug"
                text={'Contact numbers saved!'}
              />
              <div className={'mt-4 flex w-full justify-center'}>
                <Button
                  text={`Close`}
                  icon={'XIcon'}
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  className={'max-h-10 w-full'}
                  iconPosition={'start'}
                  onClick={() => {
                    history.goBack();
                    onClose();
                  }}
                />
              </div>
            </Card>
          );
        },
      }),
    [dialog, history]
  );

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
          text={`${child?.caregiver?.firstName}`}
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
          <FormInput<MothertContactInformationModel>
            label={'Cellphone number'}
            register={consentFormRegister}
            nameProp={'cellphone'}
            placeholder={'e.g 012 345 6789'}
            type={'number'}
            className="mt-4"
          ></FormInput>
          <div className="mt-4">
            <Typography
              type="h4"
              color={'textMid'}
              text={`Does ${child?.caregiver?.firstName} use this cellphone number for WhatsApp?`}
              className="z-50 w-11/12 pt-2"
            />
            <div className="mt-2">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                selectedOptions={hasWhatsapp}
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
              <FormInput<MothertContactInformationModel>
                label={`What cellphone number does ${child?.caregiver?.firstName} use for WhatsApp?`}
                register={consentFormRegister}
                nameProp={'whatsapp'}
                placeholder={'e.g 012 345 6789'}
                type={'number'}
                className="mt-4"
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
              saveMotherContactInformation();
            }}
            disabled={!isValid}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
